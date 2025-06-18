import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';
import { createAuditLog } from '@/utils/auditLogger'; // Assuming auditLogger is compatible

// Helper for validation (can be moved to a separate utils file if needed)
function validateRequiredFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  return null;
}

function validateDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult; // Not authenticated
    }

    const userRole = request.user?.role;
    if (userRole !== 'admin' && userRole !== 'staff') {
      return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { page, limit, offset } = getPaginationParams(request);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');
    const staffId = url.searchParams.get('staff_id');

    let query = `
      SELECT 
        b.id, b.user_id, b.vehicle_id, b.booking_date, b.start_time, b.end_time, 
        b.total_price, b.status, b.notes, b.created_at, b.updated_at,
        u.email AS user_email, u.first_name AS user_first_name, u.last_name AS user_last_name,
        v.make, v.model, v.year, v.license_plate,
        json_agg(s.name) AS service_names
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN booking_services bs ON b.id = bs.booking_id
      LEFT JOIN services s ON bs.service_id = s.id
      WHERE 1=1
    `;
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND b.status = $${paramIndex++}`;
      queryParams.push(status);
    }
    if (date) {
      query += ` AND b.booking_date = $${paramIndex++}`;
      queryParams.push(date);
    }
    if (staffId) {
      const parsedStaffId = parseInt(staffId);
      if (isNaN(parsedStaffId)) {
        return NextResponse.json({ message: 'Invalid staff_id provided' }, { status: 400 });
      }
      query += ` AND b.staff_id = $${paramIndex++}`;
      queryParams.push(parsedStaffId);
    }

    query += `
      GROUP BY b.id, u.id, v.id
      ORDER BY b.booking_date DESC, b.start_time DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    queryParams.push(limit, offset);

    const bookingsResult = await pool.query(query, queryParams);

    let countQuery = `SELECT COUNT(*) FROM bookings WHERE 1=1`;
    const countParams: (string | number)[] = [];
    let countParamIndex = 1;
    if (status) {
      countQuery += ` AND status = $${countParamIndex++}`;
      countParams.push(status);
    }
    if (date) {
      countQuery += ` AND booking_date = $${countParamIndex++}`;
      countParams.push(date);
    }
    if (staffId) {
      const parsedStaffId = parseInt(staffId);
      if (isNaN(parsedStaffId)) {
        // This error would have been caught by the main query's validation,
        // but including it here for consistency in case this block is reached independently.
        return NextResponse.json({ message: 'Invalid staff_id provided for count' }, { status: 400 });
      }
      countQuery += ` AND staff_id = $${countParamIndex++}`;
      countParams.push(parsedStaffId);
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
    return handleApiError(error, 'Error fetching all bookings');
  }
}

export async function POST(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult; // Not authenticated
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const { vehicle_id, service_ids, scheduled_date, scheduled_time, notes } = await request.json();

    // Validation
    const validationError = validateRequiredFields(
      { vehicle_id, service_ids, scheduled_date, scheduled_time },
      ['vehicle_id', 'service_ids', 'scheduled_date', 'scheduled_time']
    );
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }
    if (!validateDateFormat(scheduled_date)) {
      return NextResponse.json({ message: 'Invalid date format for scheduled_date. Use YYYY-MM-DD' }, { status: 400 });
    }
    if (!Array.isArray(service_ids) || service_ids.length === 0) {
      return NextResponse.json({ message: 'At least one service must be selected' }, { status: 400 });
    }
    // Validate each service_id is a number and remove duplicates
    const uniqueServiceIds = Array.from(new Set(service_ids.map(id => parseInt(id))));
    if (uniqueServiceIds.some(isNaN)) {
      return NextResponse.json({ message: 'Invalid service_id found in the list' }, { status: 400 });
    }
    // Replace service_ids with validated unique numeric IDs
    service_ids.splice(0, service_ids.length, ...uniqueServiceIds);

    // Verify vehicle belongs to user
    const vehicleResult = await pool.query('SELECT user_id FROM vehicles WHERE id = $1', [vehicle_id]);
    const vehicle = vehicleResult.rows[0];
    if (!vehicle) {
      return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
    }
    if (vehicle.user_id !== userId) {
      return NextResponse.json({ message: 'You do not have permission to book this vehicle' }, { status: 403 });
    }

    // Verify services exist and calculate total price/duration
    let totalPrice = 0;
    let totalDuration = 0;
    const serviceDetails: any[] = [];

    for (const serviceId of service_ids) {
      const serviceResult = await pool.query('SELECT id, price, duration_minutes FROM services WHERE id = $1', [serviceId]);
      const service = serviceResult.rows[0];
      if (!service) {
        return NextResponse.json({ message: `Service with ID ${serviceId} not found` }, { status: 404 });
      }
      totalPrice += service.price;
      totalDuration += service.duration_minutes;
      serviceDetails.push(service);
    }

    // Calculate end time
    const [startHours, startMinutes] = scheduled_time.split(':').map(Number);
    const startTimeInMinutes = startHours * 60 + startMinutes;
    let endTimeInMinutes = startTimeInMinutes + totalDuration;

    // Handle time rollover for end_time
    const endHours = Math.floor(endTimeInMinutes / 60) % 24; // Modulo 24 to handle next day
    const endMinutes = endTimeInMinutes % 60;
    const end_time = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    // If the booking spans into the next day, you might need to adjust the booking_date as well.
    // This current implementation only adjusts the time string.
    // For multi-day bookings, a separate 'end_date' column would be more appropriate.
    // For now, assuming bookings are within a single day or the time rollover is handled by the frontend/business logic.

    // Create booking
    const bookingResult = await pool.query(
      `INSERT INTO bookings (user_id, vehicle_id, booking_date, start_time, end_time, total_price, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [userId, vehicle_id, scheduled_date, scheduled_time, end_time, totalPrice, notes || null, 'pending']
    );
    const bookingId = bookingResult.rows[0].id;

    // Add services to booking
    for (const service of serviceDetails) {
      await pool.query(
        `INSERT INTO booking_services (booking_id, service_id, quantity, price_at_booking)
         VALUES ($1, $2, $3, $4)`,
        [bookingId, service.id, 1, service.price]
      );
    }

    // Log the action
    await createAuditLog({
      user_id: userId,
      action: 'insert',
      table_name: 'bookings',
      record_id: bookingId,
      old_values: null,
      new_values: {
        user_id: userId,
        vehicle_id,
        booking_date: scheduled_date,
        start_time: scheduled_time,
        end_time,
        total_price: totalPrice,
        service_ids,
        notes: notes || null,
        status: 'pending'
      },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      metadata: null
    });

    return NextResponse.json({
      message: 'Booking created successfully',
      booking_id: bookingId
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating booking');
  }
}
