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
    const type = url.searchParams.get('type');
    const isPublished = url.searchParams.get('is_published');

    let query = `
      SELECT * FROM content WHERE 1=1
    `;
    const queryParams: (string | number | boolean)[] = [];
    let paramIndex = 1;

    // Public view: only published content, or if authenticated but not admin/staff
    if (!isAuthenticated || (isAuthenticated && request.user?.role !== 'admin' && request.user?.role !== 'staff')) {
      query += ` AND is_published = TRUE`;
    } else {
      // Admin/Staff view: can filter by published status
      if (isPublished !== null) {
        query += ` AND is_published = $${paramIndex++}`;
        queryParams.push(isPublished === 'true');
      }
    }

    if (type) {
      query += ` AND content_type = $${paramIndex++}`;
      queryParams.push(type);
    }

    query += `
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    queryParams.push(limit, offset);

    const contentResult = await pool.query(query, queryParams);

    let countQuery = `SELECT COUNT(*) FROM content WHERE 1=1`;
    const countParams: (string | number | boolean)[] = [];
    let countParamIndex = 1;

    // Public view: only published content, or if authenticated but not admin/staff
    if (!isAuthenticated || (isAuthenticated && request.user?.role !== 'admin' && request.user?.role !== 'staff')) {
      countQuery += ` AND is_published = TRUE`;
    } else {
      if (isPublished !== null) {
        countQuery += ` AND is_published = $${countParamIndex++}`;
        countParams.push(isPublished === 'true');
      }
    }

    if (type) {
      countQuery += ` AND content_type = $${countParamIndex++}`;
      countParams.push(type);
    }
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count, 10);

    return NextResponse.json({
      content: contentResult.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching content');
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

    const { title, content_type, body, image_url, is_published, tags, author } = await request.json();

    // Validation
    const requiredFieldsError = validateRequiredFields(
      { title, content_type, body },
      ['title', 'content_type', 'body']
    );
    if (requiredFieldsError) {
      return NextResponse.json({ message: requiredFieldsError }, { status: 400 });
    }

    const titleError = validateString(title, 1, 255);
    if (titleError) {
      return NextResponse.json({ message: `Title: ${titleError}` }, { status: 400 });
    }
    if (!validateEnum(content_type, ['blog', 'gallery', 'testimonial', 'faq'])) {
      return NextResponse.json({ message: 'Invalid content_type' }, { status: 400 });
    }
    const bodyError = validateString(body, 1);
    if (bodyError) {
      return NextResponse.json({ message: `Body: ${bodyError}` }, { status: 400 });
    }

    const contentResult = await pool.query(
      `INSERT INTO content (title, content_type, body, image_url, is_published, tags, author, created_by, updated_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *`,
      [title, content_type, body, image_url || null, is_published ?? false, tags || null, author || null, userId, userId]
    );
    const content = contentResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'insert',
      table_name: 'content',
      record_id: content.id,
      new_values: content,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Content created successfully',
      content
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating content');
  }
}
