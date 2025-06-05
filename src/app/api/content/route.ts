import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Assuming db.ts is in lib
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server'; // Assuming this utility exists
import ContentModel from '@/models/Content'; // Assuming ContentModel.ts is in models/

// Helper for pagination (simplified)
function getPaginationParams(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// GET /api/content
export async function GET(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    const { limit, offset } = getPaginationParams(request);
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || undefined;
    const isPublishedParam = url.searchParams.get('is_published');

    let isPublished: boolean | undefined = undefined;
    if (isPublishedParam === 'true') {
      isPublished = true;
    } else if (isPublishedParam === 'false') {
      isPublished = false;
    }

    let content;
    let totalCount;

    if (authenticatedUser && (authenticatedUser.role === 'admin' || authenticatedUser.role === 'staff')) {
      // Admin/Staff can see all content, filterable by published status
      content = await ContentModel.findAll(limit, offset, type, isPublished);
      totalCount = await ContentModel.countAll(type, isPublished);
    } else {
      // Public users only see published content
      content = await ContentModel.findPublished(limit, offset, type);
      totalCount = await ContentModel.countPublished(type);
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: content,
      pagination: {
        page: offset / limit + 1,
        limit,
        totalItems: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ message: 'Server error while fetching content' }, { status: 500 });
  }
}

interface CreateContentPayload {
  title: string;
  content_type: 'blog' | 'gallery' | 'testimonial' | 'faq' | 'page'; // Added 'page' as a common type
  body: string; // Assuming 'content' from model maps to 'body' in request
  meta_description?: string;
  meta_keywords?: string;
  slug?: string;
  is_published?: boolean;
}

// POST /api/content (admin/staff only)
export async function POST(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser || (authenticatedUser.role !== 'admin' && authenticatedUser.role !== 'staff')) {
      return NextResponse.json({ message: 'Unauthorized: Admin or staff access required' }, { status: 403 });
    }

    const payload = await request.json() as CreateContentPayload;
    const { title, content_type, body, meta_description, meta_keywords, slug, is_published } = payload;

    // Basic validation (Zod would be better here)
    if (!title || !content_type || !body) {
      return NextResponse.json({ message: 'Missing required fields: title, content_type, body' }, { status: 400 });
    }
    const validTypes = ['blog', 'gallery', 'testimonial', 'faq', 'page'];
    if (!validTypes.includes(content_type)) {
        return NextResponse.json({ message: `Invalid content_type. Must be one of: ${validTypes.join(', ')}` }, { status: 400 });
    }


    const contentData = {
      title,
      type: content_type,
      content: body, // Mapping 'body' from request to 'content' in model
      meta_description,
      meta_keywords,
      slug,
      is_published: is_published !== undefined ? is_published : false, // Default to false if not provided
      created_by: parseInt(authenticatedUser.id, 10), // Assuming user ID is numeric
      updated_by: parseInt(authenticatedUser.id, 10),
    };

    const newContent = await ContentModel.create(contentData);

    // TODO: Add audit logging if required
    // await createAuditLog({ ... });

    return NextResponse.json({ message: 'Content created successfully', content: newContent }, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json({ message: 'Server error while creating content' }, { status: 500 });
  }
}
