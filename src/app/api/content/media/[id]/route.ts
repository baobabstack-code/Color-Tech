import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log("Media delete request for ID:", id);
        
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return NextResponse.json(
                { error: "BLOB_READ_WRITE_TOKEN is not configured" },
                { status: 500 }
            );
        }

        // The id should be the full blob URL or pathname
        // If it's just a filename, construct the full URL
        let blobUrl = id;
        if (!id.startsWith('https://')) {
            blobUrl = `https://rystv5mdesdms7cf.public.blob.vercel-storage.com/${id}`;
        }
        
        console.log("Attempting to delete blob:", blobUrl);
        
        await del(blobUrl, {
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        
        console.log("Successfully deleted blob:", blobUrl);
        return NextResponse.json({ ok: true, deleted: blobUrl });
    } catch (error: any) {
        console.error("Failed to delete media:", error);
        return NextResponse.json(
            { 
                error: "Failed to delete media", 
                details: error?.message,
                id: await params.then(p => p.id)
            },
            { status: 500 }
        );
    }
}


