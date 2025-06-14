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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const serviceId = parseInt(id);

    if (isNaN(serviceId)) {
      return NextResponse.json({ message: 'Invalid service ID' }, { status: 400 });
    }

    const serviceResult = await pool.query(
      `SELECT s.*, sc.name AS category_name
       FROM services s
       JOIN service_categories sc ON s.category_id = sc.id
       WHERE s.id = $1`,
      [serviceId]
    );

    const service = serviceResult.rows[0];

    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    return handleApiError(error, 'Error fetching service');
  }
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
    const serviceId = parseInt(id);

    if (isNaN(serviceId)) {
      return NextResponse.json({ message: 'Invalid service ID' }, { status: 400 });
    }

    const { name, description, price, duration_minutes, category_id, is_active } = await request.json();

    // Get original service for audit logging
    const originalServiceResult = await pool.query('SELECT * FROM services WHERE id = $1', [serviceId]);
    const originalService = originalServiceResult.rows[0];
    if (!originalService) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      const nameError = validateString(name, 2, 100);
      if (nameError) return NextResponse.json({ message: `Name: ${nameError}` }, { status: 400 });
      updateFields.push(`name = $${paramIndex++}`);
      updateValues.push(name);
    }
    if (description !== undefined) {
      const descriptionError = validateString(description, 10, 1000);
      if (descriptionError) return NextResponse.json({ message: `Description: ${descriptionError}` }, { status: 400 });
      updateFields.push(`description = $${paramIndex++}`);
      updateValues.push(description);
    }
    if (price !== undefined) {
      const priceError = validateNumber(price, 0);
      if (priceError) return NextResponse.json({ message: `Price: ${priceError}` }, { status: 400 });
      updateFields.push(`price = $${paramIndex++}`);
      updateValues.push(price);
    }
    if (duration_minutes !== undefined) {
      const durationError = validateNumber(duration_minutes, 5);
      if (durationError) return NextResponse.json({ message: `Duration: ${durationError}` }, { status: 400 });
      updateFields.push(`duration_minutes = $${paramIndex++}`);
      updateValues.push(duration_minutes);
    }
    if (category_id !== undefined) {
      const categoryIdError = validateNumber(category_id, 1);
      if (categoryIdError) return NextResponse.json({ message: `Category ID: ${categoryIdError}` }, { status: 400 });
      // Check if category exists
      const categoryCheck = await pool.query('SELECT id FROM service_categories WHERE id = $1', [category_id]);
      if (categoryCheck.rows.length === 0) {
        return NextResponse.json({ message: 'Service category not found' }, { status: 404 });
      }
      updateFields.push(`category_id = $${paramIndex++}`);
      updateValues.push(category_id);
    }
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      updateValues.push(is_active);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const updateQuery = `UPDATE services SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex++} RETURNING *`;
    updateValues.push(serviceId);

    const updatedServiceResult = await pool.query(updateQuery, updateValues);
    const updatedService = updatedServiceResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'update',
      table_name: 'services',
      record_id: serviceId,
      old_values: originalService,
      new_values: updatedService,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Service updated successfully',
      service: updatedService
    });

  } catch (error) {
    return handleApiError(error, 'Error updating service');
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
    const serviceId = parseInt(id);

    if (isNaN(serviceId)) {
      return NextResponse.json({ message: 'Invalid service ID' }, { status: 400 });
    }

    // Get original service for audit logging
    const serviceResult = await pool.query('SELECT * FROM services WHERE id = $1', [serviceId]);
    const service = serviceResult.rows[0];
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    // Check if service is in use by any bookings
    const bookingsCheck = await pool.query('SELECT COUNT(*) FROM booking_services WHERE service_id = $1', [serviceId]);
    if (parseInt(bookingsCheck.rows[0].count, 10) > 0) {
      return NextResponse.json({ message: 'Service cannot be deleted as it is linked to existing bookings.' }, { status: 400 });
    }

    const deleteResult = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [serviceId]);

    if (deleteResult.rows.length === 0) {
      return NextResponse.json({ message: 'Service not found or could not be deleted' }, { status: 404 });
    }

    await createAuditLog({
      user_id: userId!,
      action: 'delete',
      table_name: 'services',
      record_id: serviceId,
      old_values: service,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({ message: 'Service deleted successfully' });

  } catch (error) {
    return handleApiError(error, 'Error deleting service');
  }
}
