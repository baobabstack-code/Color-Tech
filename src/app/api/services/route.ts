import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';

// GET all services
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY name');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ message: 'Server error while fetching services' }, { status: 500 });
  }
}

interface CreateServicePayload {
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  category: string;
}

// POST a new service (admin only)
export async function POST(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json() as CreateServicePayload;
    const { name, description, basePrice, durationMinutes, category } = body;

    if (!name || !description || basePrice === undefined || durationMinutes === undefined || !category) {
      return NextResponse.json({ message: 'Missing required fields: name, description, basePrice, durationMinutes, category' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO services (name, description, base_price, duration_minutes, category, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
      [name, description, basePrice, durationMinutes, category]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Failed to create service' }, { status: 500 });
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ message: 'Server error while creating service' }, { status: 500 });
  }
}
