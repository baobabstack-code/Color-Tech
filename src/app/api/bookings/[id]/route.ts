import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  id: string;
}

// GET: Fetch a single booking by ID with customer and service details
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
      },
    });

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
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        customerId: data.customerId,
        serviceId: data.serviceId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        notes: data.notes,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
    console.error('Failed to update booking:', error);
    return NextResponse.json({ message: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE: Remove a booking
export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    await prisma.booking.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
    console.error('Failed to delete booking:', error);
    return NextResponse.json({ message: 'Failed to delete booking' }, { status: 500 });
  }
}
