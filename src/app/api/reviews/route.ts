import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';
import { createAuditLog } from '@/utils/auditLogger';

// Helper for validation (can be moved to a separate utils file if needed)
function validateRequiredFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `${field} is required`;
    }
  }
  return null;
}

function validateNumber(value: any, minValue: number, maxValue?: number): string | null {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Must be a number';
  }
  if (num < minValue) {
    return `Must be at least ${minValue}`;
  }
  if (maxValue !== undefined && num > maxValue) {
    return `Must be at most ${maxValue}`;
  }
  return null;
}

function validateString(value: any, minLength: number, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return 'Must be a string';
  }
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  if (value.length > maxLength) {
    return `Must be at most ${maxLength} characters long`;
  }
  return null;
}

function validateEnum(value: string, allowedValues: string[]): boolean {
  return allowedValues.includes(value);
}

export async function GET(request: AuthenticatedRequest) {
  try {
    // Attempt to authenticate the request. If successful, request.user will be populated.
    // If not, authResult will contain a NextResponse, which means it's an unauthenticated request.
    const authResult = await authenticateApi(request);
    const isAuthenticated = !authResult; // If authResult is null, it means authentication passed.

    const { page, limit, offset } = getPaginationParams(request);
    const url = new URL(request.url);
    const status = url.searchParams.get('status'); // For admin/staff to filter all reviews

    let query = `
      SELECT
        r.id, r.user_id, r.service_id, r.booking_id, r.rating, r.comment, r.status, r.created_at, r.updated_at,
        u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email,
        s.name AS service_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      WHERE 1=1
    `;
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    // Public view: only approved reviews, or if authenticated but not admin/staff
    if (!isAuthenticated || (isAuthenticated && request.user?.role !== 'admin' && request.user?.role !== 'staff')) {
      query += ` AND r.status = 'approved'`;
    } else {
      // Admin/Staff view: can filter by status
      if (status) {
        query += ` AND r.status = $${paramIndex++}`;
        queryParams.push(status);
      }
    }

    query += `
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    queryParams.push(limit, offset);

    const reviewsResult = await pool.query(query, queryParams);

    let countQuery = `SELECT COUNT(*) FROM reviews r WHERE 1=1`;
    const countParams: (string | number)[] = [];
    let countParamIndex = 1;

    // Public view: only approved reviews, or if authenticated but not admin/staff
    if (!isAuthenticated || (isAuthenticated && request.user?.role !== 'admin' && request.user?.role !== 'staff')) {
      countQuery += ` AND r.status = 'approved'`;
    } else {
      if (status) {
        countQuery += ` AND r.status = $${countParamIndex++}`;
        countParams.push(status);
      }
    }
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count, 10);

    return NextResponse.json({
      reviews: reviewsResult.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching reviews');
  }
}

export async function POST(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const { service_id, booking_id, rating, comment } = await request.json();

    // Validation
    const requiredFieldsError = validateRequiredFields(
      { service_id, booking_id, rating, comment },
      ['service_id', 'booking_id', 'rating', 'comment']
    );
    if (requiredFieldsError) {
      return NextResponse.json({ message: requiredFieldsError }, { status: 400 });
    }

    const serviceIdError = validateNumber(service_id, 1);
    if (serviceIdError) {
      return NextResponse.json({ message: `Service ID: ${serviceIdError}` }, { status: 400 });
    }
    const bookingIdError = validateNumber(booking_id, 1);
    if (bookingIdError) {
      return NextResponse.json({ message: `Booking ID: ${bookingIdError}` }, { status: 400 });
    }
    const ratingError = validateNumber(rating, 1, 5);
    if (ratingError) {
      return NextResponse.json({ message: `Rating: ${ratingError}` }, { status: 400 });
    }
    const commentError = validateString(comment, 1, 1000);
    if (commentError) {
      return NextResponse.json({ message: `Comment: ${commentError}` }, { status: 400 });
    }

    // Check if booking exists and belongs to user
    const bookingCheck = await pool.query('SELECT user_id FROM bookings WHERE id = $1', [booking_id]);
    if (bookingCheck.rows.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
    if (bookingCheck.rows[0].user_id !== userId) {
      return NextResponse.json({ message: 'You can only review your own bookings' }, { status: 403 });
    }

    // Check if service exists
    const serviceCheck = await pool.query('SELECT id FROM services WHERE id = $1', [service_id]);
    if (serviceCheck.rows.length === 0) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    // Check if a review already exists for this booking and service by this user
    const existingReviewCheck = await pool.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND booking_id = $2 AND service_id = $3',
      [userId, booking_id, service_id]
    );
    if (existingReviewCheck.rows.length > 0) {
      return NextResponse.json({ message: 'You have already submitted a review for this booking and service.' }, { status: 409 });
    }

    const reviewResult = await pool.query(
      `INSERT INTO reviews (user_id, service_id, booking_id, rating, comment, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
      [userId, service_id, booking_id, rating, comment, 'pending']
    );
    const review = reviewResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'insert',
      table_name: 'reviews',
      record_id: review.id,
      new_values: review,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Review submitted successfully and pending approval',
      review
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating review');
  }
}
