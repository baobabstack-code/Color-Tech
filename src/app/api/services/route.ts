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

function validateNumber(value: any, minValue: number): string | null {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Must be a number';
  }
  if (num < minValue) {
    return `Must be at least ${minValue}`;
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { page, limit, offset } = getPaginationParams(request);
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('category_id');
    const isActive = url.searchParams.get('is_active');

    let query = `
      SELECT s.*, sc.name AS category_name
      FROM services s
      JOIN service_categories sc ON s.category_id = sc.id
      WHERE 1=1
    `;
    const queryParams: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (categoryId) {
      query += ` AND s.category_id = $${paramIndex++}`;
      queryParams.push(parseInt(categoryId));
    }
    if (isActive !== null) {
      query += ` AND s.is_active = $${paramIndex++}`;
      queryParams.push(isActive === 'true');
    }

    query += `
      ORDER BY s.name
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    queryParams.push(limit, offset);

    const servicesResult = await pool.query(query, queryParams);

    let countQuery = `
      SELECT COUNT(*) FROM services s
      WHERE 1=1
    `;
    const countParams: (string | number | boolean)[] = [];
    let countParamIndex = 1;

    if (categoryId) {
      countQuery += ` AND s.category_id = $${countParamIndex++}`;
      countParams.push(parseInt(categoryId));
    }
    if (isActive !== null) {
      countQuery += ` AND s.is_active = $${countParamIndex++}`;
      countParams.push(isActive === 'true');
    }
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count, 10);

    return NextResponse.json({
      services: servicesResult.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching services');
  }
}

export async function POST(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const { name, description, price, duration_minutes, category_id, is_active } = await request.json();

    // Validation
    const requiredFieldsError = validateRequiredFields(
      { name, description, price, duration_minutes, category_id },
      ['name', 'description', 'price', 'duration_minutes', 'category_id']
    );
    if (requiredFieldsError) {
      return NextResponse.json({ message: requiredFieldsError }, { status: 400 });
    }

    const nameError = validateString(name, 2, 100);
    if (nameError) {
      return NextResponse.json({ message: `Name: ${nameError}` }, { status: 400 });
    }
    const descriptionError = validateString(description, 10, 1000);
    if (descriptionError) {
      return NextResponse.json({ message: `Description: ${descriptionError}` }, { status: 400 });
    }
    const priceError = validateNumber(price, 0);
    if (priceError) {
      return NextResponse.json({ message: `Price: ${priceError}` }, { status: 400 });
    }
    const durationError = validateNumber(duration_minutes, 5);
    if (durationError) {
      return NextResponse.json({ message: `Duration: ${durationError}` }, { status: 400 });
    }
    const categoryIdError = validateNumber(category_id, 1);
    if (categoryIdError) {
      return NextResponse.json({ message: `Category ID: ${categoryIdError}` }, { status: 400 });
    }

    // Check if category exists
    const categoryCheck = await pool.query('SELECT id FROM service_categories WHERE id = $1', [category_id]);
    if (categoryCheck.rows.length === 0) {
      return NextResponse.json({ message: 'Service category not found' }, { status: 404 });
    }

    const serviceResult = await pool.query(
      `INSERT INTO services (name, description, price, duration_minutes, category_id, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
      [name, description, price, duration_minutes, category_id, is_active ?? true]
    );
    const service = serviceResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'insert',
      table_name: 'services',
      record_id: service.id,
      new_values: service,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Service created successfully',
      service
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating service');
  }
}
