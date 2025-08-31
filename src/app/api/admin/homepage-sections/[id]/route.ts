import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);
        const body = await request.json();
        const { title, subtitle, description, isActive } = body;

        if (!title) {
            return NextResponse.json(
                { message: 'Title is required' },
                { status: 400 }
            );
        }

        const section = await DatabaseService.updateHomepageSection(id, {
            title,
            subtitle,
            description,
            isActive,
        });

        return NextResponse.json(section);
    } catch (error) {
        console.error('Error updating homepage section:', error);
        return NextResponse.json(
            { message: 'Failed to update homepage section' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);
        await DatabaseService.deleteHomepageSection(id);
        return NextResponse.json({ message: 'Section deleted successfully' });
    } catch (error) {
        console.error('Error deleting homepage section:', error);
        return NextResponse.json(
            { message: 'Failed to delete homepage section' },
            { status: 500 }
        );
    }
}