import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { handleApiError } from '@/lib/apiAuth';

export async function GET(request: Request, { params }: { params: { date: string } }) {
  try {
    const { date } = params;

    // Validate date format
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return NextResponse.json({ message: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
    }

    // Define all possible time slots (e.g., 9:00 AM to 5:00 PM in 1-hour increments)
    const allTimeSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Get bookings for the specified date
    const result = await pool.query(
      `SELECT start_time, end_time 
       FROM bookings 
       WHERE booking_date = $1 
       AND status NOT IN ('cancelled')`,
      [date]
    );

    // Filter out booked time slots
    const availableTimeSlots = allTimeSlots.filter(timeSlot => {
      // Check if this time slot overlaps with any booked slot
      return !result.rows.some((booking: any) => {
        const slotTime = new Date(`${date}T${timeSlot}`);
        const bookingStart = new Date(`${date}T${booking.start_time}`);
        const bookingEnd = new Date(`${date}T${booking.end_time}`);

        return slotTime >= bookingStart && slotTime < bookingEnd;
      });
    });

    return NextResponse.json({
      date,
      available_slots: availableTimeSlots
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching available time slots');
  }
}