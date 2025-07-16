import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const customersFilePath = path.join(process.cwd(), 'src/data/customers.json');
const bookingsFilePath = path.join(process.cwd(), 'src/data/bookings.json');

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

// GET: Fetch all customers with statistics
export async function GET() {
  try {
    const customers = readJsonFile(customersFilePath);
    const bookings = readJsonFile(bookingsFilePath);

    // Add statistics to each customer
    const customersWithStats = customers.map((customer: any) => {
      const customerBookings = bookings.filter((booking: any) => 
        booking.customerId === customer.id || booking.customerId === customer.id.toString()
      );

      const lastBooking = customerBookings
        .sort((a: any, b: any) => new Date(b.scheduledAt || b.createdAt).getTime() - new Date(a.scheduledAt || a.createdAt).getTime())[0];

      return {
        ...customer,
        bookingCount: customerBookings.length,
        lastActivity: lastBooking ? (lastBooking.scheduledAt || lastBooking.createdAt) : customer.createdAt
      };
    });

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error('Failed to fetch customers with stats:', error);
    return NextResponse.json({ message: 'Failed to fetch customers with stats' }, { status: 500 });
  }
}