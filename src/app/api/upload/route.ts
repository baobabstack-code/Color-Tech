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
    const blob = await put(filename, request.body, {
      access: 'public',
    });
    return NextResponse.json(blob);
  } catch (error: any) {
    return NextResponse.json(
      { message: `Failed to upload file: ${error.message}` },
      { status: 500 }
    );
  }
}
