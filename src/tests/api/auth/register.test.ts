import { POST } from '@/app/api/auth/register/route';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { jwtConfig } from '@/config/jwt';
import { createAuditLog } from '@/utils/auditLogger';

describe('POST /api/auth/register', () => {
  const mockRequest = (body: any, headers?: Record<string, string>) => ({
    json: async () => body,
    headers: new Headers(headers),
  }) as Request;

  beforeEach(async () => {
    // Clear the database before each test
    await pool.exec('DELETE FROM user_sessions;');
    await pool.exec('DELETE FROM users;');
    jest.clearAllMocks();
  });

  it('should return 400 if any required field is missing', async () => {
    const incompleteBody = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      // phone is missing
    };
    const req = mockRequest(incompleteBody);
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.message).toBe('All fields are required');
  });

  it('should return 400 if email already exists', async () => {
    // Seed an existing user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.run(
      `INSERT INTO users (email, password, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['existing@example.com', hashedPassword, 'Existing', 'User', '1234567890', 'client', 'active']
    );

    const req = mockRequest({
      email: 'existing@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      phone: '1234567890',
    });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.message).toBe('Email already in use');
  });

  it('should return 201 and new user/token on successful registration', async () => {
    const req = mockRequest({
      email: 'newuser@example.com',
      password: 'newpassword123',
      first_name: 'Jane',
      last_name: 'Doe',
      phone: '0987654321',
    });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.message).toBe('User registered successfully');
    expect(json).toHaveProperty('user');
    expect(json).toHaveProperty('token');

    // Verify user exists in the database
    const userInDb = pool.prepare('SELECT * FROM users WHERE email = ?').get('newuser@example.com');
    expect(userInDb).toBeDefined();
    expect(userInDb.email).toBe('newuser@example.com');
    expect(bcrypt.compareSync('newpassword123', userInDb.password)).toBe(true);

    // Verify session exists
    const sessionInDb = pool.prepare('SELECT * FROM user_sessions WHERE user_id = ?').get(userInDb.id);
    expect(sessionInDb).toBeDefined();
    expect(sessionInDb.token).toBe(json.token);
  });

  it('should handle server errors gracefully', async () => {
    // Temporarily break the database connection to simulate an error
    const originalRun = pool.run;
    pool.run = jest.fn(() => { throw new Error('Simulated database error'); });

    const req = mockRequest({
      email: 'error@example.com',
      password: 'password123',
      first_name: 'Error',
      last_name: 'User',
      phone: '1112223333',
    });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.message).toBe('Server error during registration');

    // Restore the original run function
    pool.run = originalRun;
  });
});