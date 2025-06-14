import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { handleApiError } from '@/lib/apiAuth';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '3', 10);

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
