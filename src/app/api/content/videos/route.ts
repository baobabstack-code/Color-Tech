import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

export async function GET() {
    try {
        const videos = await DatabaseService.getVideos();
        return NextResponse.json(videos);
    } catch (e) {
        return NextResponse.json({ message: 'Failed to fetch videos' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.videoUrl) {
            return NextResponse.json({ message: 'videoUrl required' }, { status: 400 });
        }
        const video = await DatabaseService.createVideo({
            title: data.title || 'Untitled',
            description: data.description || null,
            thumbnailUrl: data.thumbnailUrl || null,
            videoUrl: data.videoUrl,
            isPublished: data.isPublished ?? true,
        });
        return NextResponse.json(video, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: 'Failed to create video' }, { status: 500 });
    }
}




