import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (token) {
      // Invalidate the token in the database
      await pool.query(
        'UPDATE user_sessions SET expires_at = NOW() WHERE token = $1',
        [token]
      );
    }

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Server error during logout' }, { status: 500 });
  }
}
