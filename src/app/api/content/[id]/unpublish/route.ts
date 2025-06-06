import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';
import ContentModel from '@/models/Content';

interface ContentParams {
  params: {
    id: string;
  };
}

// PUT /api/content/[id]/unpublish (admin only)
export async function PUT(request: NextRequest, { params }: ContentParams) {
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

    if (!content.is_published) {
      return NextResponse.json({ message: 'Content is already unpublished', content }, { status: 200 });
    }

    const updatedContent = await ContentModel.updatePublishStatus(contentId, false, parseInt(authenticatedUser.id, 10));

    if (!updatedContent) {
      return NextResponse.json({ message: 'Failed to unpublish content' }, { status: 500 });
    }

    // TODO: Add audit logging if required
    // await createAuditLog({ ... });

    return NextResponse.json({ message: 'Content unpublished successfully', content: updatedContent });
  } catch (error) {
    console.error('Error unpublishing content:', error);
    return NextResponse.json({ message: 'Server error while unpublishing content' }, { status: 500 });
  }
}
