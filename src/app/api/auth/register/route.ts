import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { jwtConfig } from '@/config/jwt';

export async function POST(request: Request) {
  try {
    const { email, password, first_name, last_name, phone } = await request.json();

    // Basic validation
    if (!email || !password || !first_name || !last_name || !phone) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUserResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUserResult = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, first_name, last_name, phone, role, status`,
      [email, hashedPassword, first_name, last_name, phone, 'client', 'active']
    );

    const user = newUserResult.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.getSecret(),
      { expiresIn: jwtConfig.getExpiresIn() } as jwt.SignOptions
    );

    // Record session
    // Note: req.ip and req.headers['user-agent'] are not directly available in Next.js Request object.
    // For now, using placeholders or extracting from headers if possible.
    // For a robust solution, consider using a library or Next.js's built-in capabilities for IP/User-Agent.
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await pool.query(
      `INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent)
       VALUES ($1, $2, NOW() + INTERVAL $3, $4, $5)`,
      [user.id, token, jwtConfig.getExpiresInInterval(), ipAddress, userAgent]
    );

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        status: user.status
      },
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Server error during registration' }, { status: 500 });
  }
}
