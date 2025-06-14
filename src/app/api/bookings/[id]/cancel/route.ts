import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';

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
    const bookingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Check if user has permission to cancel this booking
    if (userRole !== 'admin' && userRole !== 'staff' && booking.user_id !== userId) {
      return NextResponse.json({ message: 'You do not have permission to cancel this booking' }, { status: 403 });
    }

    // Regular users can only cancel pending bookings
    if (userRole !== 'admin' && userRole !== 'staff' && booking.status !== 'pending') {
      return NextResponse.json({ message: 'You can only cancel pending bookings' }, { status: 403 });
    }

    // Update booking status to cancelled
    await pool.query('UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2', ['cancelled', bookingId]);

    // Log the action
    await createAuditLog({
      user_id: userId!, // Non-null assertion as authenticateApi ensures userId is present
      action: 'update',
      table_name: 'bookings',
      record_id: bookingId,
      old_values: { status: booking.status },
      new_values: { status: 'cancelled' },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      metadata: {
        cancellation: true,
        admin_action: userRole === 'admin' || userRole === 'staff'
      }
    });

    return NextResponse.json({
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    return handleApiError(error, 'Error cancelling booking');
  }
}