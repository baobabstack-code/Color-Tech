import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all bookings with customer and service details
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true, // Populates the related User
        service: true,  // Populates the related Service
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST: Create a new booking
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.customerId || !data.serviceId || !data.startTime) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        customerId: data.customerId,
        serviceId: data.serviceId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status, // Assumes status is a valid BookingStatus enum
        notes: data.notes,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
  }
}
