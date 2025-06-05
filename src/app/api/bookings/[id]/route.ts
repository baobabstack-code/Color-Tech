import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';

interface BookingParams {
  params: {
    id: string;
  };
}

// GET /api/bookings/[id]
export async function GET(request: NextRequest, { params }: BookingParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const userId = authenticatedUser.id;
    const isAdmin = authenticatedUser.role === 'admin';

    let queryText = `
      SELECT b.*, u.full_name as client_name, s.name as service_name,
             v.make as vehicle_make, v.model as vehicle_model, v.year as vehicle_year, v.license_plate as vehicle_license_plate
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = $1
    `;
    const queryParams: any[] = [id];

    if (!isAdmin) {
      queryText += ' AND b.user_id = $2';
      queryParams.push(userId);
    }

    const result = await pool.query(queryText, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Booking not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ message: 'Server error while fetching booking' }, { status: 500 });
  }
}

interface UpdateBookingPayload {
  scheduledDate?: string;
  scheduledTime?: string;
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  serviceId?: string;
  vehicleId?: string;
  // Admin specific fields if any
  staff_id?: string;
}

// PUT /api/bookings/[id]
export async function PUT(request: NextRequest, { params }: BookingParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = params;
    const userId = authenticatedUser.id;
    const isAdmin = authenticatedUser.role === 'admin';
    const body = await request.json() as UpdateBookingPayload;

    // Fetch the booking to check ownership and current status
    const bookingCheckResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
    if (bookingCheckResult.rows.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
    const currentBooking = bookingCheckResult.rows[0];

    if (!isAdmin && currentBooking.user_id !== userId) {
      return NextResponse.json({ message: 'Not authorized to update this booking' }, { status: 403 });
    }

    // Clients can only cancel their bookings, or update notes/schedule if pending
    if (!isAdmin) {
      if (body.status && body.status !== 'cancelled') {
        return NextResponse.json({ message: 'Clients can only cancel bookings or update notes/schedule for pending bookings.' }, { status: 403 });
      }
      if ((body.scheduledDate || body.scheduledTime || body.serviceId || body.vehicleId) && currentBooking.status !== 'pending') {
        return NextResponse.json({ message: 'Cannot modify details of a non-pending booking.' }, { status: 403 });
      }
       // Prevent clients from updating staff_id
      if (body.staff_id) {
        return NextResponse.json({ message: 'Clients cannot assign staff.' }, { status: 403 });
      }
    }

    const updates: string[] = [];
    const queryParams: any[] = [];
    let paramCounter = 1;

    if (body.scheduledDate) {
      updates.push(`scheduled_date = $${paramCounter++}`);
      queryParams.push(body.scheduledDate);
    }
    if (body.scheduledTime) {
      updates.push(`scheduled_time = $${paramCounter++}`);
      queryParams.push(body.scheduledTime);
    }
    if (body.status) {
      updates.push(`status = $${paramCounter++}`);
      queryParams.push(body.status);
    }
    if (body.notes !== undefined) { // Allow setting notes to empty string
      updates.push(`notes = $${paramCounter++}`);
      queryParams.push(body.notes);
    }
    if (body.serviceId && (isAdmin || currentBooking.status === 'pending')) {
        updates.push(`service_id = $${paramCounter++}`);
        queryParams.push(body.serviceId);
    }
    if (body.vehicleId && (isAdmin || currentBooking.status === 'pending')) {
        updates.push(`vehicle_id = $${paramCounter++}`);
        queryParams.push(body.vehicleId);
    }
    if (body.staff_id && isAdmin) { // Only admin can update staff_id
        updates.push(`staff_id = $${paramCounter++}`);
        queryParams.push(body.staff_id);
    }


    if (updates.length === 0) {
      return NextResponse.json({ message: 'No update fields provided' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    queryParams.push(bookingId);

    const updateQuery = `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${paramCounter} RETURNING *`;
    const result = await pool.query(updateQuery, queryParams);

    if (result.rows.length === 0) {
      // This case should ideally not be reached if bookingCheckResult found a row
      return NextResponse.json({ message: 'Failed to update booking' }, { status: 500 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === '23503') { // Foreign key violation
        return NextResponse.json({ message: 'Invalid service_id or vehicle_id provided.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error while updating booking' }, { status: 500 });
  }
}

// DELETE /api/bookings/[id]
export async function DELETE(request: NextRequest, { params }: BookingParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = params;
    const userId = authenticatedUser.id;
    const isAdmin = authenticatedUser.role === 'admin';

    const bookingCheckResult = await pool.query('SELECT user_id, status FROM bookings WHERE id = $1', [bookingId]);

    if (bookingCheckResult.rows.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingCheckResult.rows[0];

    if (!isAdmin && booking.user_id !== userId) {
      return NextResponse.json({ message: 'Not authorized to delete this booking' }, { status: 403 });
    }

    // Original logic: For non-admin users, only allow deletion of pending bookings
    // This seems to be a business rule. In many systems, users can only cancel, not delete.
    // If deletion means actual row removal, this rule is fine.
    // If "delete" means "cancel", then the PUT endpoint with status 'cancelled' is more appropriate.
    // Assuming actual deletion for now as per original route.
    if (!isAdmin && booking.status !== 'pending') {
      return NextResponse.json({ message: 'Cannot delete bookings that are not in pending status. Please cancel instead.' }, { status: 403 });
    }

    await pool.query('DELETE FROM bookings WHERE id = $1', [bookingId]);

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ message: 'Server error while deleting booking' }, { status: 500 });
  }
}
