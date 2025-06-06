import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Assuming db.ts is in lib, though ContentModel abstracts it
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';
import ContentModel from '@/models/Content'; // Assuming ContentModel.ts is in models/

interface ContentParams {
  params: {
    id: string;
  };
}

// GET /api/content/[id]
export async function GET(request: NextRequest, { params }: ContentParams) {
  try {
    const { id } = params;
    const contentId = parseInt(id);

    if (isNaN(contentId)) {
      return NextResponse.json({ message: 'Invalid content ID' }, { status: 400 });
    }

    const content = await ContentModel.findById(contentId);

    if (!content) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    // If content is not published, only admins/staff should see it
    if (!content.is_published) {
      const authenticatedUser = await authenticateRequest(request);
      if (!authenticatedUser || (authenticatedUser.role !== 'admin' && authenticatedUser.role !== 'staff')) {
        return NextResponse.json({ message: 'Content not found or not published' }, { status: 404 });
      }
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    return NextResponse.json({ message: 'Server error while fetching content' }, { status: 500 });
  }
}

interface UpdateContentPayload {
  title?: string;
  content_type?: 'blog' | 'gallery' | 'testimonial' | 'faq' | 'page';
  body?: string;
  meta_description?: string;
  meta_keywords?: string;
  slug?: string;
  is_published?: boolean; // This should ideally be handled by publish/unpublish routes
}

// PUT /api/content/[id] (admin/staff only)
export async function PUT(request: NextRequest, { params }: ContentParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser || (authenticatedUser.role !== 'admin' && authenticatedUser.role !== 'staff')) {
      return NextResponse.json({ message: 'Unauthorized: Admin or staff access required' }, { status: 403 });
    }

    const { id } = params;
    const contentId = parseInt(id);

    if (isNaN(contentId)) {
      return NextResponse.json({ message: 'Invalid content ID' }, { status: 400 });
    }

    const payload = await request.json() as UpdateContentPayload;

    // Prevent direct update of is_published here if using separate publish/unpublish routes
    // However, the original controller allowed it, so we can keep it for now but it's less clean.
    // For consistency with the original, we allow it.
    const { title, content_type, body, meta_description, meta_keywords, slug, is_published } = payload;


    const contentData: Partial<Parameters<typeof ContentModel.update>[1]> = {
        updated_by: parseInt(authenticatedUser.id, 10)
    };

    if (title !== undefined) contentData.title = title;
    if (content_type !== undefined) contentData.type = content_type;
    if (body !== undefined) contentData.content = body; // map body to content
    if (meta_description !== undefined) contentData.meta_description = meta_description;
    if (meta_keywords !== undefined) contentData.meta_keywords = meta_keywords;
    if (slug !== undefined) contentData.slug = slug;
    if (is_published !== undefined) contentData.is_published = is_published;


    if (Object.keys(contentData).length === 1 && contentData.updated_by !== undefined) { // Only updated_by means no actual data change
        const currentContent = await ContentModel.findById(contentId);
        if (!currentContent) {
            return NextResponse.json({ message: 'Content not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'No fields to update or values are the same as current.', content: currentContent });
    }

    const updatedContent = await ContentModel.update(contentId, contentData);

    if (!updatedContent) {
      return NextResponse.json({ message: 'Content not found or update failed' }, { status: 404 });
    }

    // TODO: Add audit logging if required
    // await createAuditLog({ ... });

    return NextResponse.json({ message: 'Content updated successfully', content: updatedContent });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ message: 'Server error while updating content' }, { status: 500 });
  }
}

// DELETE /api/content/[id] (admin only)
export async function DELETE(request: NextRequest, { params }: ContentParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const contentId = parseInt(id);

    if (isNaN(contentId)) {
      return NextResponse.json({ message: 'Invalid content ID' }, { status: 400 });
    }

    const content = await ContentModel.findById(contentId);
    if (!content) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    const deleted = await ContentModel.delete(contentId);

    if (!deleted) {
        return NextResponse.json({ message: 'Failed to delete content' }, { status: 500 });
    }

    // TODO: Add audit logging if required
    // await createAuditLog({ ... });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ message: 'Server error while deleting content' }, { status: 500 });
  }
}
