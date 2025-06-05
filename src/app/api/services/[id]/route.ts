import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';

interface ServiceParams {
  params: {
    id: string;
  };
}

// GET /api/services/[id]
export async function GET(request: NextRequest, { params }: ServiceParams) {
  try {
    const { id } = params;
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ message: 'Server error while fetching service' }, { status: 500 });
  }
}

interface UpdateServicePayload {
  name?: string;
  description?: string;
  basePrice?: number;
  durationMinutes?: number;
  category?: string;
  status?: 'active' | 'inactive' | 'discontinued'; // Assuming possible statuses
}

// PUT /api/services/[id] (admin only)
export async function PUT(request: NextRequest, { params }: ServiceParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json() as UpdateServicePayload;

    const { name, description, basePrice, durationMinutes, category, status } = body;

    // Check if service exists
    const serviceCheck = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (serviceCheck.rows.length === 0) {
        return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    // Build the update query dynamically
    const currentService = serviceCheck.rows[0];
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined && name !== currentService.name) {
        updates.push(`name = $${paramCount++}`);
        values.push(name);
    }
    if (description !== undefined && description !== currentService.description) {
        updates.push(`description = $${paramCount++}`);
        values.push(description);
    }
    if (basePrice !== undefined && basePrice !== currentService.base_price) {
        updates.push(`base_price = $${paramCount++}`);
        values.push(basePrice);
    }
    if (durationMinutes !== undefined && durationMinutes !== currentService.duration_minutes) {
        updates.push(`duration_minutes = $${paramCount++}`);
        values.push(durationMinutes);
    }
    if (category !== undefined && category !== currentService.category) {
        updates.push(`category = $${paramCount++}`);
        values.push(category);
    }
    if (status !== undefined && status !== currentService.status) {
        updates.push(`status = $${paramCount++}`);
        values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: 'No fields to update or values are the same as current.' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const queryText = `UPDATE services SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      // Should not happen if serviceCheck passed, but as a safeguard
      return NextResponse.json({ message: 'Service not found after update attempt' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ message: 'Server error while updating service' }, { status: 500 });
  }
}

// DELETE /api/services/[id] (admin only)
export async function DELETE(request: NextRequest, { params }: ServiceParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = params;

    // Check if service exists
    const serviceCheck = await pool.query('SELECT id FROM services WHERE id = $1', [id]);
    if (serviceCheck.rows.length === 0) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    // Check if service is used in any bookings
    const bookingCheck = await pool.query('SELECT id FROM bookings WHERE service_id = $1 LIMIT 1', [id]);
    if (bookingCheck.rows.length > 0) {
      // Instead of deleting, mark as inactive (or a different status like 'discontinued')
      const result = await pool.query(
        `UPDATE services SET status = 'inactive', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );
      return NextResponse.json({
        message: 'Service marked as inactive because it is associated with existing bookings.',
        service: result.rows[0]
      });
    }

    // If no bookings, proceed with actual deletion
    await pool.query('DELETE FROM services WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ message: 'Server error while deleting service' }, { status: 500 });
  }
}
