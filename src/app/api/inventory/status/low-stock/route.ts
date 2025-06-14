import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin', 'staff'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const { page, limit, offset } = getPaginationParams(request);

    const query = `
      SELECT * FROM inventory 
      WHERE quantity <= reorder_level
      ORDER BY name
      LIMIT $1 OFFSET $2
    `;
    const queryParams = [limit, offset];

    const inventoryResult = await pool.query(query, queryParams);

    const countQuery = `SELECT COUNT(*) FROM inventory WHERE quantity <= reorder_level`;
    const totalResult = await pool.query(countQuery);
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
    return handleApiError(error, 'Error fetching low stock inventory');
  }
}