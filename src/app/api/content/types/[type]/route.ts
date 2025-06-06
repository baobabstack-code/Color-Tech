import { NextRequest, NextResponse } from 'next/server';
import ContentModel from '@/models/Content'; // Assuming ContentModel.ts is in models/

// Helper for pagination (can be moved to a shared util if not already)
function getPaginationParams(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// GET /api/content/types/[type]
export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const { type } = params;
    if (!type) {
      return NextResponse.json({ message: 'Content type is required' }, { status: 400 });
    }

    const { limit, offset, page } = getPaginationParams(request);

    const content = await ContentModel.findByType(
      type,
      limit,
      offset,
      true // publishedOnly = true
    );

    const totalCount = await ContentModel.countByType(type, true);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: content,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error(`Error fetching content by type ${params.type}:`, error);
    return NextResponse.json({ message: `Server error while fetching content of type ${params.type}` }, { status: 500 });
  }
}
