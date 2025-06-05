import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db'; // Assuming db.ts is correctly set up in lib
import { config } from '@/config'; // Assuming config.ts is correctly set up

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone, role } = await request.json();

    // Basic validation
    if (!email || !password || !fullName) {
      return NextResponse.json({ message: 'Email, password, and full name are required' }, { status: 400 });
    }

    // Validate role (optional, based on original logic)
    if (role && !['client', 'admin'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role specified. Allowed roles are client or admin.' }, { status: 400 });
    }
    const userRole = role || 'client'; // Default to 'client' if not provided

    // Check if user exists
    const userExistsResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExistsResult.rows.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12); // Using 12 rounds for better security

    // Create user
    const newUserResult = await pool.query(
      `INSERT INTO users (email, password, full_name, phone, role, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, email, full_name, phone, role, status, created_at`,
      [email, hashedPassword, fullName, phone, userRole]
    );

    const newUser = newUserResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Remove password from the returned user object
    const { password: _, ...userToReturn } = newUser;

    return NextResponse.json({
      user: userToReturn,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Server error during registration' }, { status: 500 });
  }
}
