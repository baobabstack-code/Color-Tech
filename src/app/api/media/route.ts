import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save file to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)
    
    try {
      await writeFile(filePath, buffer)
    } catch (error) {
      console.error('Upload error:', error)
      
      let errorMessage = 'Failed to upload file'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: {
            maxFileSize: '5MB',
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
          } 
        },
        { status: 500 }
      )
    }
    
    // Save to database
    const media = await prisma.media.create({
      data: {
        url: `/uploads/${fileName}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }
    })
    
    return NextResponse.json(media)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to save media to database' },
      { status: 500 }
    )
  }
}
