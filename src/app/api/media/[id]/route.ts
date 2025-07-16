import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await prisma.media.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }
    
    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'public', media.url)
    await unlink(filePath)
    
    // Delete from database
    await prisma.media.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
