import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';

export async function GET(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (authenticatedUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: You do not have permission to view all bookings.' }, { status: 403 });
    }

    const result = await pool.query(`
      SELECT b.*, u.full_name as client_name, s.name as service_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      ORDER BY b.scheduled_date DESC, b.scheduled_time DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ message: 'Server error while fetching bookings' }, { status: 500 });
  }
}

interface CreateBookingPayload {
  userId: string;
  vehicleId: string;
  serviceId: string;
  scheduledDate: string; // Assuming YYYY-MM-DD format
  scheduledTime: string; // Assuming HH:MM format
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as CreateBookingPayload;
    const { userId, vehicleId, serviceId, scheduledDate, scheduledTime, notes } = body;

    // Validate input
    if (!userId || !vehicleId || !serviceId || !scheduledDate || !scheduledTime) {
      return NextResponse.json({ message: 'Missing required fields: userId, vehicleId, serviceId, scheduledDate, scheduledTime' }, { status: 400 });
    }

    // Ensure the user can only create bookings for themselves unless they're an admin
    if (authenticatedUser.role !== 'admin' && authenticatedUser.id !== userId) {
      return NextResponse.json({ message: 'Not authorized to create bookings for other users' }, { status: 403 });
    }

    // TODO: Add further validation (e.g., check if vehicleId and serviceId exist, date format, availability)

    const result = await pool.query(
      `INSERT INTO bookings (user_id, vehicle_id, service_id, scheduled_date, scheduled_time, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [userId, vehicleId, serviceId, scheduledDate, scheduledTime, notes || null]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    // Check for specific database errors if necessary, e.g., foreign key constraint
    if (error instanceof Error && 'code' in error && (error as any).code === '23503') { // Foreign key violation
        return NextResponse.json({ message: 'Invalid user_id, vehicle_id, or service_id provided.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error while creating booking' }, { status: 500 });
  }
}
