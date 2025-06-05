import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';

export async function GET(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = authenticatedUser.id;

    const result = await pool.query(`
      SELECT r.*, s.name as service_name
      FROM reviews r
      JOIN services s ON r.service_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json({ message: 'Server error while fetching user reviews' }, { status: 500 });
  }
}
