import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';

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

    const categoriesResult = await pool.query(`
      SELECT DISTINCT category
      FROM inventory
      WHERE category IS NOT NULL AND category != ''
      ORDER BY category
    `);

    const categories = categoriesResult.rows.map(row => row.category);

    return NextResponse.json({ categories });
  } catch (error) {
    return handleApiError(error, 'Error fetching inventory categories');
  }
}