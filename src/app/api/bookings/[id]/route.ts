import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const bookingsFilePath = path.join(process.cwd(), 'src/data/bookings.json');
const customersFilePath = path.join(process.cwd(), 'src/data/customers.json');
const servicesFilePath = path.join(process.cwd(), 'src/data/services.json');

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

// Helper function to write JSON file
const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET: Fetch a single booking by ID with customer and service details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const bookings = readJsonFile(bookingsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    const booking = bookings.find((b: any) => b.id === id);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Populate with customer and service data
    const populatedBooking = {
      ...booking,
      customer: customers.find((c: any) => c.id === booking.customerId),
      service: services.find((s: any) => s.id === booking.serviceId)
    };

    return NextResponse.json(populatedBooking);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return NextResponse.json({ message: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PUT: Update an existing booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const bookings = readJsonFile(bookingsFilePath);

    const bookingIndex = bookings.findIndex((b: any) => b.id === id);
    if (bookingIndex === -1) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Update booking
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      customerId: data.customerId || bookings[bookingIndex].customerId,
      serviceId: data.serviceId || bookings[bookingIndex].serviceId,
      scheduledAt: data.scheduledAt || bookings[bookingIndex].scheduledAt,
      status: data.status || bookings[bookingIndex].status,
      notes: data.notes !== undefined ? data.notes : bookings[bookingIndex].notes,
      updatedAt: new Date().toISOString()
    };

    writeJsonFile(bookingsFilePath, bookings);
    return NextResponse.json(bookings[bookingIndex]);
  } catch (error) {
    console.error('Failed to update booking:', error);
    return NextResponse.json({ message: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE: Remove a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const bookings = readJsonFile(bookingsFilePath);

    const bookingIndex = bookings.findIndex((b: any) => b.id === id);
    if (bookingIndex === -1) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Remove booking
    bookings.splice(bookingIndex, 1);
    writeJsonFile(bookingsFilePath, bookings);

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return NextResponse.json({ message: 'Failed to delete booking' }, { status: 500 });
  }
}
