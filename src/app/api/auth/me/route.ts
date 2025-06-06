import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { config } from '@/config';

interface UserPayload {
  id: string;
  role: string;
  // Add other fields if they are in your JWT payload
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: UserPayload;
    try {
      decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT id, email, full_name, phone, role, status, created_at, updated_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
