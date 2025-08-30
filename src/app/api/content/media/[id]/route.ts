import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        // Determine resource type (image default, or video via query param 'rt=video')
        // Note: NextRequest is not available here because we don't accept it as arg, so we use the global? Instead, pass _request
        const url = new URL((_request as any).url);
        const rt = url.searchParams.get('rt') === 'video' ? 'video' : 'image';
        await cloudinary.uploader.destroy(id, { resource_type: rt as any });
        return NextResponse.json({ ok: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to delete media", details: error?.message },
            { status: 500 }
        );
    }
}


