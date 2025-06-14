import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';

export async function GET(request: Request, { params }: { params: { type: string } }) {
  try {
    const { type } = params;
    const { page, limit, offset } = getPaginationParams(request);

    let query = `
      SELECT * FROM content 
      WHERE content_type = $1 AND is_published = TRUE
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const queryParams = [type, limit, offset];

    const contentResult = await pool.query(query, queryParams);

    const countQuery = `SELECT COUNT(*) FROM content WHERE content_type = $1 AND is_published = TRUE`;
    const totalResult = await pool.query(countQuery, [type]);
    const total = parseInt(totalResult.rows[0].count, 10);

    return NextResponse.json({
      content: contentResult.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error, `Error fetching content by type ${params.type}`);
  }
}
