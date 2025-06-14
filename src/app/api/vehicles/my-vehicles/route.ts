import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const query = `
      SELECT * FROM vehicles
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    return NextResponse.json({ vehicles: result.rows });
  } catch (error) {
    return handleApiError(error, 'Error fetching user vehicles');
  }
}