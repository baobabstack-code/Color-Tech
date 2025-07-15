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

// GET: Fetch aggregated dashboard data
export async function GET() {
  try {
    const bookings = readJsonFile(bookingsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    // Calculate total revenue from completed bookings
    const totalRevenue = bookings
      .filter((b: any) => b.status === 'completed')
      .reduce((acc: number, booking: any) => {
        const service = services.find((s: any) => s.id.toString() === booking.serviceId.toString());
        return acc + (service ? service.basePrice : 0);
      }, 0);

    // Get total counts
    const totalBookings = bookings.length;
    const totalCustomers = customers.length;

    // Get recent bookings (e.g., the last 5), populated with details
    const recentBookings = bookings
      .sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
      .slice(0, 5)
      .map((booking: any) => {
        const customer = customers.find((c: any) => c.id.toString() === booking.customerId.toString());
        const service = services.find((s: any) => s.id.toString() === booking.serviceId.toString());
        return { 
          ...booking, 
          customer: customer ? { name: customer.name } : { name: 'Unknown Customer' },
          service: service ? { name: service.name } : { name: 'Unknown Service' },
          startTime: booking.scheduledAt // Map scheduledAt to startTime for compatibility
        };
      });

    const dashboardData = {
      stats: {
        totalRevenue,
        totalBookings,
        totalCustomers,
      },
      recentBookings,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
