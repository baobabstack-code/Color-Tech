import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET: Fetch all bookings with customer and service details
export async function GET() {
  try {
    const bookings = await DatabaseService.getBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST: Create a new booking
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.customerId || !data.serviceId || !data.scheduledAt) {
      return NextResponse.json({ message: 'Missing required fields: customerId, serviceId, scheduledAt' }, { status: 400 });
    }

    const newBooking = await DatabaseService.createBooking({
      customer: { connect: { id: data.customerId } },
      service: { connect: { id: data.serviceId } },
      scheduledAt: new Date(data.scheduledAt),
      status: data.status || 'pending',
      notes: data.notes,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
  }
}
