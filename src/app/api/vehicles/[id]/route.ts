import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';

export async function GET(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const userId = request.user?.id;
    const isAdmin = request.user?.role === 'admin';

    if (!id) {
      return NextResponse.json({ message: 'Vehicle ID is required' }, { status: 400 });
    }

    const query = `
      SELECT * FROM vehicles
      WHERE id = $1 ${!isAdmin ? 'AND user_id = $2' : ''}
    `;

    const result = await pool.query(
      query,
      isAdmin ? [id] : [id, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ vehicle: result.rows[0] });
  } catch (error) {
    return handleApiError(error, 'Error fetching vehicle');
  }
}

export async function PUT(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const userId = request.user?.id;
    const isAdmin = request.user?.role === 'admin';
    const { make, model, year, color, license_plate, vin, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Vehicle ID is required' }, { status: 400 });
    }

    // Check if vehicle exists and belongs to user/admin
    const checkQuery = `
      SELECT * FROM vehicles
      WHERE id = $1 ${!isAdmin ? 'AND user_id = $2' : ''}
    `;

    const checkResult = await pool.query(
      checkQuery,
      isAdmin ? [id] : [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ message: 'Vehicle not found or unauthorized' }, { status: 404 });
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    if (make !== undefined) {
      updates.push(`make = $${paramCounter++}`);
      values.push(make);
    }
    if (model !== undefined) {
      updates.push(`model = $${paramCounter++}`);
      values.push(model);
    }
    if (year !== undefined) {
      updates.push(`year = $${paramCounter++}`);
      values.push(year);
    }
    if (color !== undefined) {
      updates.push(`color = $${paramCounter++}`);
      values.push(color);
    }
    if (license_plate !== undefined) {
      updates.push(`license_plate = $${paramCounter++}`);
      values.push(license_plate);
    }
    if (vin !== undefined) {
      updates.push(`vin = $${paramCounter++}`);
      values.push(vin);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCounter++}`);
      values.push(notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const updateQuery = `
      UPDATE vehicles
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCounter++}
      RETURNING *
    `;

    values.push(id);

    const updateResult = await pool.query(updateQuery, values);

    return NextResponse.json({
      message: 'Vehicle updated successfully',
      vehicle: updateResult.rows[0]
    });
  } catch (error) {
    return handleApiError(error, 'Error updating vehicle');
  }
}

export async function DELETE(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const userId = request.user?.id;
    const isAdmin = request.user?.role === 'admin';

    if (!id) {
      return NextResponse.json({ message: 'Vehicle ID is required' }, { status: 400 });
    }

    // Check if vehicle exists and belongs to user/admin
    const checkQuery = `
      SELECT * FROM vehicles
      WHERE id = $1 ${!isAdmin ? 'AND user_id = $2' : ''}
    `;

    const checkResult = await pool.query(
      checkQuery,
      isAdmin ? [id] : [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ message: 'Vehicle not found or unauthorized' }, { status: 404 });
    }

    // Delete vehicle
    const deleteQuery = `
      DELETE FROM vehicles
      WHERE id = $1
      RETURNING id
    `;

    await pool.query(deleteQuery, [id]);

    return NextResponse.json({
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    return handleApiError(error, 'Error deleting vehicle');
  }
}