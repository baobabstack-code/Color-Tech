import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';

// GET all reviews (admin only)
export async function GET(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (authenticatedUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: You do not have permission to view all reviews.' }, { status: 403 });
    }

    const result = await pool.query(`
      SELECT r.*, u.full_name as user_name, s.name as service_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      ORDER BY r.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Server error while fetching reviews' }, { status: 500 });
  }
}

interface CreateReviewPayload {
  serviceId: string;
  rating: number;
  comment: string;
}

// POST a new review
export async function POST(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized. Please log in to submit a review.' }, { status: 401 });
    }

    const userId = authenticatedUser.id;
    const body = await request.json() as CreateReviewPayload;
    const { serviceId, rating, comment } = body;

    if (!serviceId || rating === undefined || !comment) {
      return NextResponse.json({ message: 'Missing required fields: serviceId, rating, comment' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
        return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if user has already reviewed this service
    const existingReviewResult = await pool.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND service_id = $2',
      [userId, serviceId]
    );

    if (existingReviewResult.rows.length > 0) {
      return NextResponse.json({
        message: 'You have already reviewed this service. You can update your existing review.'
      }, { status: 400 });
    }

    // Check if the user has actually booked and completed this service
    const bookingCheckResult = await pool.query(
      'SELECT id FROM bookings WHERE user_id = $1 AND service_id = $2 AND status = $3 LIMIT 1',
      [userId, serviceId, 'completed']
    );

    if (bookingCheckResult.rows.length === 0) {
      return NextResponse.json({
        message: 'You can only review services that you have used and completed.'
      }, { status: 403 });
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, service_id, rating, comment, date, status)
       VALUES ($1, $2, $3, $4, NOW(), 'pending')
       RETURNING *`,
      [userId, serviceId, rating, comment]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Failed to create review' }, { status: 500 });
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    // Check for specific database errors if necessary, e.g., foreign key constraint
    if (error instanceof Error && 'code' in error && (error as any).code === '23503') {
        return NextResponse.json({ message: 'Invalid user_id or service_id provided.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error while creating review' }, { status: 500 });
  }
}
