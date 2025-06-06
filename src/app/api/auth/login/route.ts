import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db'; // Assuming db.ts is correctly set up in lib
import { config } from '@/config'; // Assuming config.ts is correctly set up

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password, full_name, phone, role, status FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    // Check if user is active
    if (user.status === 'inactive') {
      return NextResponse.json({ message: 'Account is inactive. Please contact support.' }, { status: 403 });
    }

    // Verify password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error during login' }, { status: 500 });
  }
}
