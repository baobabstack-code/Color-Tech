import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import pool from '@/lib/db';
import { jwtConfig } from '@/config/jwt';

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
      decoded = jwt.verify(token, jwtConfig.getSecret()) as UserPayload;
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

export async function PUT(request: Request) {
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
      decoded = jwt.verify(token, jwtConfig.getSecret()) as UserPayload;
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { first_name, last_name, phone, password } = await request.json();

    let updateFields: string[] = [];
    let updateValues: any[] = [];
    let paramIndex = 1;

    if (first_name !== undefined) {
      updateFields.push(`first_name = $${paramIndex++}`);
      updateValues.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push(`last_name = $${paramIndex++}`);
      updateValues.push(last_name);
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramIndex++}`);
      updateValues.push(phone);
    }
    if (password !== undefined && password !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`password = $${paramIndex++}`);
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    updateValues.push(decoded.id); // Add user ID for WHERE clause

    const query = `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, email, first_name, last_name, phone, role, status, created_at, updated_at`;

    const result = await pool.query(query, updateValues);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found or no changes made' }, { status: 404 });
    }

    const updatedUser = result.rows[0];
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Server error during profile update' }, { status: 500 });
  }
}
