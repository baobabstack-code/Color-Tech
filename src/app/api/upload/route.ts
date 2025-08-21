import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Force redeploy to load environment variables
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'No file to upload.' }, { status: 400 });
  }

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || 'colortech',
          public_id: filename.replace(/\.[^/.]+$/, ''),
          resource_type: 'image',
          overwrite: true,
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          resolve(uploadResult);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    return NextResponse.json({
      url: result.secure_url,
      id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        message: `Failed to upload file: ${error.message}`,
        details: {
          nodeEnv: process.env.NODE_ENV,
          provider: 'cloudinary',
          errorName: error.name,
          errorStack: error.stack
        }
      },
      { status: 500 }
    );
  }
}
