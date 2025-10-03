import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET() {
    try {
        const sections = await DatabaseService.getAllHomepageSections();
        return NextResponse.json(sections);
    } catch (error) {
        console.error('Error fetching homepage sections:', error);
        console.error('Homepage sections error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        return NextResponse.json(
            {
                message: 'Failed to fetch homepage sections',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sectionKey, title, subtitle, description, isActive } = body;

        if (!sectionKey || !title) {
            return NextResponse.json(
                { message: 'Section key and title are required' },
                { status: 400 }
            );
        }

        // Check if section key already exists
        const existingSection = await DatabaseService.getHomepageSectionByKey(sectionKey);
        if (existingSection) {
            return NextResponse.json(
                { message: 'A section with this key already exists' },
                { status: 400 }
            );
        }

        const section = await DatabaseService.createHomepageSection({
            sectionKey,
            title,
            subtitle,
            description,
            isActive,
        });

        return NextResponse.json(section, { status: 201 });
    } catch (error) {
        console.error('Error creating homepage section:', error);
        return NextResponse.json(
            { message: 'Failed to create homepage section' },
            { status: 500 }
        );
    }
}