import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function GET(): Promise<NextResponse> {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const resources = await cloudinary.api.resources({
            type: "upload",
            resource_type: "image",
            prefix: process.env.CLOUDINARY_FOLDER || "colortech",
            max_results: 100,
        });

        const images = (resources.resources || []).map((r: any) => ({
            id: r.public_id,
            url: r.secure_url,
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
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No file provided", details: { expectedField: "file" } },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: process.env.CLOUDINARY_FOLDER || "colortech",
                    public_id: `${Date.now()}-${file.name}`.replace(/\.[^/.]+$/, ""),
                    resource_type: "image",
                    overwrite: true,
                },
                (error, uploadResult) => {
                    if (error) return reject(error);
                    resolve(uploadResult);
                }
            );
            stream.end(buffer);
        });

        return NextResponse.json({ id: result.public_id, url: result.secure_url });
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


