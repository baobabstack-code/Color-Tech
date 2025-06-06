import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

interface ServiceReviewsParams {
  params: {
    serviceId: string;
  };
}

// GET /api/services/[serviceId]/reviews
export async function GET(request: NextRequest, { params }: ServiceReviewsParams) {
  try {
    const { serviceId } = params;

    if (!serviceId) {
      return NextResponse.json({ message: 'Service ID is required' }, { status: 400 });
    }

    // Fetch approved reviews for a specific service, along with user's full name
    // Only select necessary user fields to avoid exposing sensitive data.
    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.date, u.full_name as "userName"
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.service_id = $1 AND r.status = 'approved'
       ORDER BY r.date DESC`,
      [serviceId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews for service:', error);
    return NextResponse.json({ message: 'Server error while fetching reviews for service' }, { status: 500 });
  }
}
