import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET: Fetch a single booking by ID with customer and service details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id);
    
    if (isNaN(bookingId)) {
      return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
    }

    const booking = await DatabaseService.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return NextResponse.json({ message: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PUT: Update an existing booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id);
    
    if (isNaN(bookingId)) {
      return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
    }

    const data = await request.json();

    const updatedBooking = await DatabaseService.updateBooking(bookingId, {
      ...(data.customerId && { customer: { connect: { id: data.customerId } } }),
      ...(data.serviceId && { service: { connect: { id: data.serviceId } } }),
      ...(data.scheduledAt && { scheduledAt: new Date(data.scheduledAt) }),
      ...(data.status && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Failed to update booking:', error);
    return NextResponse.json({ message: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE: Remove a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id);
    
    if (isNaN(bookingId)) {
      return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
    }

    await DatabaseService.deleteBooking(bookingId);
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return NextResponse.json({ message: 'Failed to delete booking' }, { status: 500 });
  }
}
