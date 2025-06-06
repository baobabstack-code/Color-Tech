import { NextRequest, NextResponse } from 'next/server';
import ContentModel from '@/models/Content'; // Assuming ContentModel.ts is in models/

// GET /api/content/blog/featured
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 3; // Default to 3 if not specified

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ message: 'Invalid limit parameter' }, { status: 400 });
    }

    const featuredPosts = await ContentModel.findFeaturedBlogPosts(limit);

    return NextResponse.json({ featuredPosts });
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return NextResponse.json({ message: 'Server error while fetching featured blog posts' }, { status: 500 });
  }
}
