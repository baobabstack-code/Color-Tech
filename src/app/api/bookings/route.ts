import { NextResponse } from 'next/server';
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

// GET: Fetch all bookings with customer and service details
export async function GET() {
  try {
    const bookings = readJsonFile(bookingsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    // Populate bookings with customer and service data
    const populatedBookings = bookings.map((booking: any) => ({
      ...booking,
      customer: customers.find((c: any) => c.id === booking.customerId),
      service: services.find((s: any) => s.id === booking.serviceId)
    }));

    return NextResponse.json(populatedBookings);
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
    if (!data.customerId || !data.serviceId || !data.scheduledAt) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const bookings = readJsonFile(bookingsFilePath);
    
    const newBooking = {
      id: (bookings.length + 1).toString(),
      customerId: data.customerId,
      serviceId: data.serviceId,
      scheduledAt: data.scheduledAt,
      status: data.status || 'pending',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    writeJsonFile(bookingsFilePath, bookings);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
  }
}
