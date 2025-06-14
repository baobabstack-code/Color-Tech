import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';

// Helper for validation (can be moved to a separate utils file if needed)
function validateRequiredFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  return null;
}

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const { page, limit, offset } = getPaginationParams(request);

    const query = `
      SELECT v.*, u.first_name, u.last_name, u.email
      FROM vehicles v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `SELECT COUNT(*) FROM vehicles`;

    const result = await pool.query(query, [limit, offset]);
    const countResult = await pool.query(countQuery);

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / Number(limit));

    return NextResponse.json({
      vehicles: result.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching all vehicles');
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

    const { make, model, year, color, license_plate, vin, notes } = await request.json();

    const validationError = validateRequiredFields(
      { make, model, year },
      ['make', 'model', 'year']
    );
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const query = `
      INSERT INTO vehicles (
        user_id, make, model, year, color, license_plate, vin, notes, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId, make, model, year, color, license_plate, vin, notes
    ]);

    return NextResponse.json({
      message: 'Vehicle created successfully',
      vehicle: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating vehicle');
  }
}