import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    try {
        const { blobs } = await list();
        const imageRegex = /\.(png|jpe?g|gif|webp|svg|avif)$/i;
        const images = blobs
            .filter((b) => b.url && imageRegex.test(b.pathname))
            .map((b) => ({ id: b.pathname, url: b.url }));
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
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    error: "No file provided",
                    details: {
                        expectedField: "file",
                    },
                },
                { status: 400 }
            );
        }

        const filename = `${Date.now()}-${file.name}`;
        const blob = await put(filename, file, { access: "public" });

        return NextResponse.json({ id: blob.pathname, url: blob.url });
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


