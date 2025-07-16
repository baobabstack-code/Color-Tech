import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET: Fetch aggregated dashboard data
export async function GET() {
  try {
    const stats = await DatabaseService.getDashboardStats();

    // Calculate total revenue from completed bookings
    const completedBookings = await DatabaseService.getBookings();
    const totalRevenue = completedBookings
      .filter(booking => booking.status === 'completed')
      .reduce((acc, booking) => acc + booking.service.basePrice, 0);

    // Format recent bookings for compatibility
    const recentBookings = stats.recentBookings.map(booking => ({
      ...booking,
      startTime: booking.scheduledAt, // Map scheduledAt to startTime for compatibility
    }));

    const dashboardData = {
      stats: {
        totalRevenue,
        totalBookings: stats.totalBookings,
        totalCustomers: stats.totalUsers,
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
