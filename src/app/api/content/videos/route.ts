import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

export async function GET() {
    try {
        const videos = await DatabaseService.getVideos();
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Failed to fetch videos:', error);
        console.error('Videos fetch error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        return NextResponse.json({
            message: 'Failed to fetch videos',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
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
    } catch (error) {
        console.error('Failed to create video:', error);
        console.error('Video creation error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        return NextResponse.json({
            message: 'Failed to create video',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}




