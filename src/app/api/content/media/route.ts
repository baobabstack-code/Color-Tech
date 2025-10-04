import { NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function GET(): Promise<NextResponse> {
    try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return NextResponse.json(
                { error: "BLOB_READ_WRITE_TOKEN is not configured" },
                { status: 500 }
            );
        }

        const { blobs } = await list({
            prefix: 'colortech/',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        const images = blobs.map((blob) => ({
            id: blob.pathname,
            url: blob.url,
            filename: blob.pathname.split('/').pop(),
            size: blob.size,
            uploadedAt: blob.uploadedAt,
        }));
        
        return NextResponse.json(images);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to list media", details: error?.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return NextResponse.json(
                { error: "BLOB_READ_WRITE_TOKEN is not configured" },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No file provided", details: { expectedField: "file" } },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        
        // Create a unique filename to prevent conflicts
        const uniqueFilename = `colortech/${nanoid()}-${file.name}`;

        const blob = await put(uniqueFilename, arrayBuffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return NextResponse.json({ 
            id: blob.pathname, 
            url: blob.url,
            filename: uniqueFilename
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "Failed to upload image",
                details: error?.message,
            },
            { status: 500 }
        );
    }
}


