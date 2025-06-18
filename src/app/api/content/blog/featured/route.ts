import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { handleApiError } from '@/lib/apiAuth';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 3;

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ message: 'Invalid limit parameter. Must be a positive integer.' }, { status: 400 });
    }

    const query = `
      SELECT * FROM content
      WHERE content_type = 'blog' AND is_published = TRUE AND is_featured = TRUE
      ORDER BY created_at DESC
      LIMIT $1
    `;
    const featuredPostsResult = await pool.query(query, [limit]);

    return NextResponse.json({ featuredPosts: featuredPostsResult.rows });
  } catch (error) {
    return handleApiError(error, 'Error fetching featured blog posts');
  }
}
