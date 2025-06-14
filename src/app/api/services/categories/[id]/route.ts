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

export async function PUT(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
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

    const { id } = params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }

    const { name, description } = await request.json();

    // Get original category for audit logging
    const originalCategoryResult = await pool.query('SELECT * FROM service_categories WHERE id = $1', [categoryId]);
    const originalCategory = originalCategoryResult.rows[0];
    if (!originalCategory) {
      return NextResponse.json({ message: 'Service category not found' }, { status: 404 });
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      const nameError = validateString(name, 2, 50);
      if (nameError) return NextResponse.json({ message: `Name: ${nameError}` }, { status: 400 });
      updateFields.push(`name = $${paramIndex++}`);
      updateValues.push(name);
    }
    if (description !== undefined) {
      const descriptionError = validateString(description, 10, 500);
      if (descriptionError) return NextResponse.json({ message: `Description: ${descriptionError}` }, { status: 400 });
      updateFields.push(`description = $${paramIndex++}`);
      updateValues.push(description);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const updateQuery = `UPDATE service_categories SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex++} RETURNING *`;
    updateValues.push(categoryId);

    const updatedCategoryResult = await pool.query(updateQuery, updateValues);
    const updatedCategory = updatedCategoryResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'update',
      table_name: 'service_categories',
      record_id: categoryId,
      old_values: originalCategory,
      new_values: updatedCategory,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Service category updated successfully',
      category: updatedCategory
    });

  } catch (error) {
    return handleApiError(error, 'Error updating service category');
  }
}

export async function DELETE(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
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

    const { id } = params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }

    // Get original category for audit logging
    const categoryResult = await pool.query('SELECT * FROM service_categories WHERE id = $1', [categoryId]);
    const category = categoryResult.rows[0];
    if (!category) {
      return NextResponse.json({ message: 'Service category not found' }, { status: 404 });
    }

    // Check if category is in use by any services
    const servicesCheck = await pool.query('SELECT COUNT(*) FROM services WHERE category_id = $1', [categoryId]);
    if (parseInt(servicesCheck.rows[0].count, 10) > 0) {
      return NextResponse.json({ message: 'Service category cannot be deleted as it is linked to existing services.' }, { status: 400 });
    }

    const deleteResult = await pool.query('DELETE FROM service_categories WHERE id = $1 RETURNING id', [categoryId]);

    if (deleteResult.rows.length === 0) {
      return NextResponse.json({ message: 'Service category not found or could not be deleted' }, { status: 404 });
    }

    await createAuditLog({
      user_id: userId!,
      action: 'delete',
      table_name: 'service_categories',
      record_id: categoryId,
      old_values: category,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({ message: 'Service category deleted successfully' });

  } catch (error) {
    return handleApiError(error, 'Error deleting service category');
  }
}