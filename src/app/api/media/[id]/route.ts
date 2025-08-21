import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // id corresponds to pathname (what we returned from list/put)
        await del(id);
        return NextResponse.json({ ok: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to delete media", details: error?.message },
            { status: 500 }
        );
    }
}


