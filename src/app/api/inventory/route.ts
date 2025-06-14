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

function validateString(value: any, minLength: number, maxLength?: number): string | null {
  if (typeof value !== 'string') {
    return 'Must be a string';
  }
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  if (maxLength !== undefined && value.length > maxLength) {
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

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin', 'staff'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const { page, limit, offset } = getPaginationParams(request);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    let query = `
      SELECT * FROM inventory WHERE 1=1
    `;
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex++}`;
      queryParams.push(category);
    }

    query += `
      ORDER BY name
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    queryParams.push(limit, offset);

    const inventoryResult = await pool.query(query, queryParams);

    let countQuery = `SELECT COUNT(*) FROM inventory WHERE 1=1`;
    const countParams: (string | number)[] = [];
    let countParamIndex = 1;

    if (category) {
      countQuery += ` AND category = $${countParamIndex++}`;
      countParams.push(category);
    }
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count, 10);

    return NextResponse.json({
      inventory: inventoryResult.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching inventory items');
  }
}

export async function POST(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin', 'staff'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const { name, description, quantity, unit_price, reorder_level, category } = await request.json();

    // Validation
    const requiredFieldsError = validateRequiredFields(
      { name, quantity, unit_price },
      ['name', 'quantity', 'unit_price']
    );
    if (requiredFieldsError) {
      return NextResponse.json({ message: requiredFieldsError }, { status: 400 });
    }

    const nameError = validateString(name, 1, 255);
    if (nameError) {
      return NextResponse.json({ message: `Name: ${nameError}` }, { status: 400 });
    }
    const descriptionError = validateString(description, 0, 1000);
    if (descriptionError) {
      return NextResponse.json({ message: `Description: ${descriptionError}` }, { status: 400 });
    }
    const quantityError = validateNumber(quantity, 0);
    if (quantityError) {
      return NextResponse.json({ message: `Quantity: ${quantityError}` }, { status: 400 });
    }
    const unitPriceError = validateNumber(unit_price, 0);
    if (unitPriceError) {
      return NextResponse.json({ message: `Unit Price: ${unitPriceError}` }, { status: 400 });
    }
    const reorderLevelError = validateNumber(reorder_level, 0);
    if (reorderLevelError) {
      return NextResponse.json({ message: `Reorder Level: ${reorderLevelError}` }, { status: 400 });
    }

    const itemResult = await pool.query(
      `INSERT INTO inventory (name, description, quantity, unit_price, reorder_level, category, created_by, updated_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
      [name, description || null, quantity, unit_price, reorder_level || 0, category || null, userId, userId]
    );
    const item = itemResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'insert',
      table_name: 'inventory',
      record_id: item.id,
      new_values: item,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Inventory item created successfully',
      item
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating inventory item');
  }
}