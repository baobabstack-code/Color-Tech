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
      SELECT b.*, s.name as service_name, s.description as service_description,
             v.make as vehicle_make, v.model as vehicle_model, v.year as vehicle_year, v.license_plate as vehicle_license_plate
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.user_id = $1
      ORDER BY b.scheduled_date DESC, b.scheduled_time DESC
    `, [userId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ message: 'Server error while fetching user bookings' }, { status: 500 });
  }
}
