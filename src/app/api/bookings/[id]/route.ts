import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';

// Helper for validation (can be moved to a separate utils file if needed)
function validateRequiredFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  return null;
}

function validateEnum(value: string, allowedValues: string[]): boolean {
  return allowedValues.includes(value);
}

export async function GET(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const bookingId = parseInt(id);
    const userId = request.user?.id;
    const userRole = request.user?.role;

    if (isNaN(bookingId)) {
      return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
    }

    const bookingResult = await pool.query(
      `SELECT 
        b.id, b.user_id, b.vehicle_id, b.booking_date, b.start_time, b.end_time, 
        b.total_price, b.status, b.notes, b.created_at, b.updated_at,
        u.email AS user_email, u.first_name AS user_first_name, u.last_name AS user_last_name,
        v.make, v.model, v.year, v.license_plate,
        json_agg(s.name) AS service_names
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN vehicles v ON b.vehicle_id = v.id
       LEFT JOIN booking_services bs ON b.id = bs.booking_id
       LEFT JOIN services s ON bs.service_id = s.id
       WHERE b.id = $1
       GROUP BY b.id, u.id, v.id`,
      [bookingId]
    );

    const booking = bookingResult.rows[0];

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Check if user has permission to view this booking
    if (userRole !== 'admin' && userRole !== 'staff' && booking.user_id !== userId) {
      return NextResponse.json({ message: 'You do not have permission to view this booking' }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return handleApiError(error, 'Error fetching booking');
  }
}

export async function PUT(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const bookingId = parseInt(id);
    const userId = request.user?.id;
    const userRole = request.user?.role;

    if (isNaN(bookingId)) {
      return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
    }

    // Get current booking
    const currentBookingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
    const currentBooking = currentBookingResult.rows[0];

    if (!currentBooking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Check if user has permission to update this booking
    if (userRole !== 'admin' && userRole !== 'staff' && currentBooking.user_id !== userId) {
      return NextResponse.json({ message: 'You do not have permission to update this booking' }, { status: 403 });
    }

    // Regular users can only update pending bookings
    if (userRole !== 'admin' && userRole !== 'staff' && currentBooking.status !== 'pending') {
      return NextResponse.json({ message: 'You can only update pending bookings' }, { status: 403 });
    }

    const { scheduled_date, scheduled_time, notes, status, staff_id, service_ids } = await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (scheduled_date !== undefined) {
      updateFields.push(`booking_date = $${paramIndex++}`);
      updateValues.push(scheduled_date);
    }
    if (scheduled_time !== undefined) {
      updateFields.push(`start_time = $${paramIndex++}`);
      updateValues.push(scheduled_time);

      // Recalculate end time if services are provided or already exist
      let totalDuration = 0;
      if (Array.isArray(service_ids) && service_ids.length > 0) {
        for (const serviceId of service_ids) {
          const serviceResult = await pool.query('SELECT duration_minutes FROM services WHERE id = $1', [serviceId]);
          if (serviceResult.rows.length > 0) {
            totalDuration += serviceResult.rows[0].duration_minutes;
          }
        }
      } else {
        // If no new service_ids, try to get existing services for duration calculation
        const existingServicesResult = await pool.query(
          `SELECT s.duration_minutes FROM booking_services bs JOIN services s ON bs.service_id = s.id WHERE bs.booking_id = $1`,
          [bookingId]
        );
        totalDuration = existingServicesResult.rows.reduce((sum: number, s: any) => sum + s.duration_minutes, 0);
      }

      const [startHours, startMinutes] = scheduled_time.split(':').map(Number);
      const startTimeInMinutes = startHours * 60 + startMinutes;
      const endTimeInMinutes = startTimeInMinutes + totalDuration;

      const endHours = Math.floor(endTimeInMinutes / 60);
      const endMinutes = endTimeInMinutes % 60;
      const end_time = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      updateFields.push(`end_time = $${paramIndex++}`);
      updateValues.push(end_time);
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${paramIndex++}`);
      updateValues.push(notes);
    }

    // Only admin/staff can update status and staff_id
    if ((userRole === 'admin' || userRole === 'staff') && status !== undefined) {
      if (!validateEnum(status, ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])) {
        return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
      }
      updateFields.push(`status = $${paramIndex++}`);
      updateValues.push(status);
    }

    if (userRole === 'admin' && staff_id !== undefined) {
      updateFields.push(`staff_id = $${paramIndex++}`);
      updateValues.push(staff_id);
    }

    if (updateFields.length === 0 && (!Array.isArray(service_ids) || service_ids.length === 0)) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    // Update booking details
    if (updateFields.length > 0) {
      const updateQuery = `UPDATE bookings SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex++}`;
      updateValues.push(bookingId);
      await pool.query(updateQuery, updateValues);
    }

    // Update services if provided
    if (Array.isArray(service_ids) && service_ids.length > 0) {
      let newTotalPrice = 0;
      const newServiceDetails: any[] = [];

      for (const serviceId of service_ids) {
        const serviceResult = await pool.query('SELECT id, price FROM services WHERE id = $1', [serviceId]);
        const service = serviceResult.rows[0];
        if (!service) {
          return NextResponse.json({ message: `Service with ID ${serviceId} not found` }, { status: 404 });
        }
        newTotalPrice += service.price;
        newServiceDetails.push(service);
      }

      // Remove existing services for this booking
      await pool.query('DELETE FROM booking_services WHERE booking_id = $1', [bookingId]);

      // Add new services
      for (const service of newServiceDetails) {
        await pool.query(
          `INSERT INTO booking_services (booking_id, service_id, quantity, price_at_booking)
           VALUES ($1, $2, $3, $4)`,
          [bookingId, service.id, 1, service.price]
        );
      }

      // Update total price of the booking
      await pool.query('UPDATE bookings SET total_price = $1 WHERE id = $2', [newTotalPrice, bookingId]);
    }

    // Log the action
    await createAuditLog({
      user_id: userId!, // Non-null assertion as authenticateApi ensures userId is present
      action: 'update',
      table_name: 'bookings',
      record_id: bookingId,
      old_values: currentBooking, // Pass the original booking for old_values
      new_values: { ...currentBooking, ...await request.json() }, // This is a simplification, ideally construct based on actual updates
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      metadata: {
        services_updated: Array.isArray(service_ids),
        admin_action: userRole === 'admin' || userRole === 'staff'
      }
    });

    return NextResponse.json({
      message: 'Booking updated successfully'
    });

  } catch (error) {
    return handleApiError(error, 'Error updating booking');
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
      return authorizeResult; // Not authorized as admin
    }

    const { id } = params;
    const bookingId = parseInt(id);
    const userId = request.user?.id;

    if (isNaN(bookingId)) {
      return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
    }

    // Get current booking for audit log
    const currentBookingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
    const currentBooking = currentBookingResult.rows[0];

    if (!currentBooking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Delete booking services first due to foreign key constraints
    await pool.query('DELETE FROM booking_services WHERE booking_id = $1', [bookingId]);
    // Then delete the booking
    await pool.query('DELETE FROM bookings WHERE id = $1', [bookingId]);

    // Log the action
    await createAuditLog({
      user_id: userId!, // Non-null assertion as authenticateApi ensures userId is present
      action: 'delete',
      table_name: 'bookings',
      record_id: bookingId,
      old_values: currentBooking,
      new_values: null,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      metadata: { admin_action: true }
    });

    return NextResponse.json({
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    return handleApiError(error, 'Error deleting booking');
  }
}
