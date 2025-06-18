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
      isAdmin ? [parseInt(id)] : [parseInt(id), userId] // Parse id to integer
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

    // Specific validation for year, license_plate, and VIN
    const currentYear = new Date().getFullYear();
    if (year !== undefined && (isNaN(year) || year < 1900 || year > currentYear + 1)) {
      return NextResponse.json({ message: 'Invalid year. Must be a valid year.' }, { status: 400 });
    }

    if (license_plate !== undefined && !/^[A-Z0-9]{1,10}$/i.test(license_plate)) {
      return NextResponse.json({ message: 'Invalid license plate format.' }, { status: 400 });
    }

    if (vin !== undefined && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      return NextResponse.json({ message: 'Invalid VIN format. Must be 17 alphanumeric characters (excluding I, O, Q).' }, { status: 400 });
    }

    // Check for duplicate license_plate or VIN, excluding the current vehicle being updated
    if (license_plate !== undefined || vin !== undefined) {
      const existingVehicle = await pool.query(
        'SELECT id FROM vehicles WHERE (license_plate = $1 OR vin = $2) AND id != $3',
        [license_plate, vin, parseInt(id)]
      );
      if (existingVehicle.rows.length > 0) {
        return NextResponse.json({ message: 'Another vehicle with this license plate or VIN already exists.' }, { status: 409 });
      }
    }

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
      isAdmin ? [parseInt(id)] : [parseInt(id), userId] // Parse id to integer
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

    values.push(parseInt(id)); // Parse id to integer

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
      isAdmin ? [parseInt(id)] : [parseInt(id), userId] // Parse id to integer
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ message: 'Vehicle not found or unauthorized' }, { status: 404 });
    }

    // Check if the vehicle is linked to any existing bookings
    const bookingsCheck = await pool.query('SELECT COUNT(*) FROM bookings WHERE vehicle_id = $1', [parseInt(id)]);
    if (parseInt(bookingsCheck.rows[0].count, 10) > 0) {
      return NextResponse.json({ message: 'Vehicle cannot be deleted as it is linked to existing bookings.' }, { status: 400 });
    }

    // Delete vehicle
    const deleteQuery = `
      DELETE FROM vehicles
      WHERE id = $1
      RETURNING id
    `;

    await pool.query(deleteQuery, [parseInt(id)]); // Parse id to integer

    return NextResponse.json({
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    return handleApiError(error, 'Error deleting vehicle');
  }
}