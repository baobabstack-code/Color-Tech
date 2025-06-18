import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
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

export async function GET(request: Request) {
  try {
    const categoriesResult = await pool.query('SELECT * FROM service_categories ORDER BY name');
    return NextResponse.json({ categories: categoriesResult.rows });
  } catch (error) {
    return handleApiError(error, 'Error fetching service categories');
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

    const { name, description } = await request.json();

    // Validation
    const requiredFieldsError = validateRequiredFields(
      { name, description },
      ['name', 'description']
    );
    if (requiredFieldsError) {
      return NextResponse.json({ message: requiredFieldsError }, { status: 400 });
    }

    const nameError = validateString(name, 2, 50);
    if (nameError) {
      return NextResponse.json({ message: `Name: ${nameError}` }, { status: 400 });
    }
    const descriptionError = validateString(description, 10, 500);
    if (descriptionError) {
      return NextResponse.json({ message: `Description: ${descriptionError}` }, { status: 400 });
    }

    // Check for duplicate category name
    const existingCategory = await pool.query('SELECT id FROM service_categories WHERE name = $1', [name]);
    if (existingCategory.rows.length > 0) {
      return NextResponse.json({ message: 'Service category with this name already exists' }, { status: 409 });
    }

    const categoryResult = await pool.query(
      `INSERT INTO service_categories (name, description, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [name, description]
    );
    const category = categoryResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'insert',
      table_name: 'service_categories',
      record_id: category.id,
      new_values: category,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Service category created successfully',
      category
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating service category');
  }
}