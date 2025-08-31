import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET() {
    try {
        const sections = await DatabaseService.getHomepageSections();

        // Convert to a key-value object for easier access
        const sectionsMap = sections.reduce((acc, section) => {
            acc[section.sectionKey] = {
                title: section.title,
                subtitle: section.subtitle,
                description: section.description,
            };
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json(sectionsMap);
    } catch (error) {
        console.error('Error fetching homepage sections:', error);
        return NextResponse.json(
            { message: 'Failed to fetch homepage sections' },
            { status: 500 }
        );
    }
}