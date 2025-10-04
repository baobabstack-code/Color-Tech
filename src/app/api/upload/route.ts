import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'No file to upload.' }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { message: 'BLOB_READ_WRITE_TOKEN is not configured' },
      { status: 500 }
    );
  }

  try {
    const arrayBuffer = await request.arrayBuffer();
    
    // Create a unique filename to prevent conflicts
    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `colortech/${nanoid()}-${filename}`;

    const blob = await put(uniqueFilename, arrayBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      url: blob.url,
      id: blob.pathname,
      filename: uniqueFilename,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        message: `Failed to upload file: ${error.message}`,
        details: {
          nodeEnv: process.env.NODE_ENV,
          provider: 'vercel-blob',
          errorName: error.name,
          errorStack: error.stack
        }
      },
      { status: 500 }
    );
  }
}
