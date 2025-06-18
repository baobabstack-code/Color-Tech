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
      { make, model, year, license_plate, vin }, // Added license_plate and vin to required fields
      ['make', 'model', 'year', 'license_plate', 'vin']
    );
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    // Specific validation for year, license_plate, and VIN
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 1) { // Assuming vehicles can't be from too far in the past or future
      return NextResponse.json({ message: 'Invalid year. Must be a valid year.' }, { status: 400 });
    }

    if (license_plate && !/^[A-Z0-9]{1,10}$/i.test(license_plate)) { // Example regex for alphanumeric, 1-10 chars
      return NextResponse.json({ message: 'Invalid license plate format.' }, { status: 400 });
    }

    if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) { // Standard 17-character VIN format (excluding I, O, Q)
      return NextResponse.json({ message: 'Invalid VIN format. Must be 17 alphanumeric characters (excluding I, O, Q).' }, { status: 400 });
    }

    // Check for duplicate license_plate or VIN
    const existingVehicle = await pool.query(
      'SELECT id FROM vehicles WHERE license_plate = $1 OR vin = $2',
      [license_plate, vin]
    );
    if (existingVehicle.rows.length > 0) {
      return NextResponse.json({ message: 'Vehicle with this license plate or VIN already exists.' }, { status: 409 });
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