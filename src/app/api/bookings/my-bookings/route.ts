import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult; // Not authenticated
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const { page, limit, offset } = getPaginationParams(request);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let query = `
      SELECT 
        b.id, b.user_id, b.vehicle_id, b.booking_date, b.start_time, b.end_time, 
        b.total_price, b.status, b.notes, b.created_at, b.updated_at,
        v.make, v.model, v.year, v.license_plate,
        json_agg(s.name) AS service_names
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN booking_services bs ON b.id = bs.booking_id
      LEFT JOIN services s ON bs.service_id = s.id
      WHERE b.user_id = $1
    `;
    const queryParams: (string | number)[] = [userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND b.status = $${paramIndex++}`;
      queryParams.push(status);
    }

    query += `
      GROUP BY b.id, v.id
      ORDER BY b.booking_date DESC, b.start_time DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    queryParams.push(limit, offset);

    const bookingsResult = await pool.query(query, queryParams);

    let countQuery = `SELECT COUNT(*) FROM bookings WHERE user_id = $1`;
    const countParams: (string | number)[] = [userId];
    if (status) {
      countQuery += ` AND status = $2`;
      countParams.push(status);
    }
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count, 10);

    return NextResponse.json({
      bookings: bookingsResult.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching user bookings');
  }
}
