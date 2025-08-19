import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Force redeploy to load environment variables
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'No file to upload.' }, { status: 400 });
  }

  try {
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Blob token exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
    
    const blob = await put(filename, request.body, {
      access: 'public',
    });
    
    console.log('Upload successful:', blob);
    return NextResponse.json(blob);
    
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        message: `Failed to upload file: ${error.message}`,
        details: {
          nodeEnv: process.env.NODE_ENV,
          hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
          errorName: error.name,
          errorStack: error.stack
        }
      },
      { status: 500 }
    );
  }
}
