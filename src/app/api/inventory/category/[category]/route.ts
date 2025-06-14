import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';

export async function GET(request: AuthenticatedRequest, { params }: { params: { category: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin', 'staff'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const { category } = params;
    const { page, limit, offset } = getPaginationParams(request);

    let query = `
      SELECT * FROM inventory 
      WHERE category = $1
      ORDER BY name
      LIMIT $2 OFFSET $3
    `;
    const queryParams = [category, limit, offset];

    const inventoryResult = await pool.query(query, queryParams);

    const countQuery = `SELECT COUNT(*) FROM inventory WHERE category = $1`;
    const totalResult = await pool.query(countQuery, [category]);
    const total = parseInt(totalResult.rows[0].count, 10);

    return NextResponse.json({
      inventory: inventoryResult.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error, `Error fetching inventory by category ${params.category}`);
  }
}