import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { handleApiError } from '@/lib/apiAuth';

export async function GET(request: Request) {
  try {
    // NOTE: Storing tags as a comma-separated string in a TEXT column is generally an anti-pattern
    // for relational databases. For better normalization, querying, and data integrity,
    // consider redesigning the 'tags' storage (e.g., using a TEXT[] array, JSONB array,
    // or a separate junction table for many-to-many relationships).
    const categoriesResult = await pool.query(`
      SELECT DISTINCT tags AS category_name
      FROM content
      WHERE content_type = 'faq' AND tags IS NOT NULL AND tags != ''
      ORDER BY category_name
    `);

    // The tags column is currently treated as a comma-separated string.
    // We split and flatten to get individual tags, then filter for uniqueness.
    const categories = categoriesResult.rows.flatMap(row =>
      typeof row.category_name === 'string' ? row.category_name.split(',').map((tag: string) => tag.trim()) : []
    ).filter((value, index, self) => self.indexOf(value) === index); // Get unique categories

    return NextResponse.json({ categories });
  } catch (error) {
    return handleApiError(error, 'Error fetching FAQ categories');
  }
}
