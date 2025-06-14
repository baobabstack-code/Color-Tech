import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';

export async function GET(request: Request, { params }: { params: { serviceId: string } }) {
  try {
    const { serviceId } = params;
    const serviceIdNum = parseInt(serviceId);

    if (isNaN(serviceIdNum)) {
      return NextResponse.json({ message: 'Invalid service ID' }, { status: 400 });
    }

    const { page, limit, offset } = getPaginationParams(request);

    const query = `
      SELECT 
        r.id, r.user_id, r.service_id, r.booking_id, r.rating, r.comment, r.status, r.created_at, r.updated_at,
        u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email,
        s.name AS service_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      WHERE r.service_id = $1 AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const queryParams = [serviceIdNum, limit, offset];

    const reviewsResult = await pool.query(query, queryParams);

    const countQuery = `SELECT COUNT(*) FROM reviews WHERE service_id = $1 AND status = 'approved'`;
    const totalResult = await pool.query(countQuery, [serviceIdNum]);
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
    return handleApiError(error, 'Error fetching reviews by service ID');
  }
}