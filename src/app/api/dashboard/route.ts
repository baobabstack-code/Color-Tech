import { NextResponse } from 'next/server';
import { bookings, customers, services } from '@/lib/mock-db';

// GET: Fetch aggregated dashboard data
export async function GET() {
  // Calculate total revenue from completed bookings
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((acc, booking) => {
      const service = services.find(s => s.id === booking.serviceId);
      return acc + (service ? service.price : 0);
    }, 0);

  // Get total counts
  const totalBookings = bookings.length;
  const totalCustomers = customers.length;

  // Get recent bookings (e.g., the last 5), populated with details
  const recentBookings = bookings
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5)
    .map(booking => {
      const customer = customers.find(c => c.id === booking.customerId);
      const service = services.find(s => s.id === booking.serviceId);
      return { ...booking, customer, service };
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
}
