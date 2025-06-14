import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { handleApiError } from '@/lib/apiAuth';

export async function GET(request: Request) {
  try {
    const categoriesResult = await pool.query(`
      SELECT DISTINCT tags AS category_name
      FROM content
      WHERE content_type = 'faq' AND tags IS NOT NULL AND tags != ''
      ORDER BY category_name
    `);

    // The tags column might store a single tag or a comma-separated string of tags.
    // If it's a comma-separated string, we need to split and flatten.
    const categories = categoriesResult.rows.flatMap(row => 
      typeof row.category_name === 'string' ? row.category_name.split(',').map((tag: string) => tag.trim()) : []
    ).filter((value, index, self) => self.indexOf(value) === index); // Get unique categories

    return NextResponse.json({ categories });
  } catch (error) {
    return handleApiError(error, 'Error fetching FAQ categories');
  }
}
