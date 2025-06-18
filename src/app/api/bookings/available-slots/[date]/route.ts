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

    // Define configurable business hours and slot duration
    const BUSINESS_START_HOUR = 9; // 9 AM
    const BUSINESS_END_HOUR = 17;   // 5 PM
    const MIN_SLOT_DURATION_MINUTES = 60; // 1 hour slots

    // Dynamically generate all possible time slots
    const allTimeSlots: string[] = [];
    for (let hour = BUSINESS_START_HOUR; hour <= BUSINESS_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += MIN_SLOT_DURATION_MINUTES) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allTimeSlots.push(time);
      }
    }

    // Get bookings for the specified date, including service durations to calculate actual end times
    const result = await pool.query(
      `SELECT
         b.start_time,
         b.end_time,
         COALESCE(SUM(s.duration_minutes), 0) AS total_service_duration
       FROM bookings b
       LEFT JOIN booking_services bs ON b.id = bs.booking_id
       LEFT JOIN services s ON bs.service_id = s.id
       WHERE b.booking_date = $1
       AND b.status NOT IN ('cancelled', 'completed') -- Consider 'completed' as well if slots should be freed up after completion
       GROUP BY b.id, b.start_time, b.end_time`,
      [date]
    );

    // Filter out booked time slots based on actual booking intervals
    const availableTimeSlots = allTimeSlots.filter(timeSlot => {
      const [slotHours, slotMinutes] = timeSlot.split(':').map(Number);
      // Use UTC to avoid local timezone issues
      const slotStart = new Date(Date.UTC(
        parseInt(date.substring(0, 4)), // Year
        parseInt(date.substring(5, 7)) - 1, // Month (0-indexed)
        parseInt(date.substring(8, 10)), // Day
        slotHours,
        slotMinutes
      ));
      const slotEnd = new Date(slotStart.getTime() + MIN_SLOT_DURATION_MINUTES * 60 * 1000); // Add slot duration

      // Check if this time slot overlaps with any booked slot
      return !result.rows.some((booking: any) => {
        const [bookingStartHours, bookingStartMinutes] = booking.start_time.split(':').map(Number);
        const [bookingEndHours, bookingEndMinutes] = booking.end_time.split(':').map(Number);

        // Use UTC for booked times as well
        const bookedStart = new Date(Date.UTC(
          parseInt(date.substring(0, 4)),
          parseInt(date.substring(5, 7)) - 1,
          parseInt(date.substring(8, 10)),
          bookingStartHours,
          bookingStartMinutes
        ));
        const bookedEnd = new Date(Date.UTC(
          parseInt(date.substring(0, 4)),
          parseInt(date.substring(5, 7)) - 1,
          parseInt(date.substring(8, 10)),
          bookingEndHours,
          bookingEndMinutes
        ));

        // Check for overlap: [slotStart, slotEnd) and [bookedStart, bookedEnd)
        return (slotStart < bookedEnd && bookedStart < slotEnd);
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