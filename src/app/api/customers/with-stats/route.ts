import { NextResponse } from 'next/server';
import { customers, bookings } from '@/lib/mock-db';

// GET: Fetch all customers with aggregated stats
export async function GET() {
  try {
    const customerStats = customers.map(customer => {
      const customerBookings = bookings.filter(b => b.customerId === customer.id);
      const bookingCount = customerBookings.length;
      
      let lastActivity = null;
      if (bookingCount > 0) {
        // Sort bookings by date to find the most recent one
        customerBookings.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
        lastActivity = customerBookings[0].scheduledAt;
      }

      return {
        ...customer,
        bookingCount,
        lastActivity: lastActivity || customer.createdAt, // Fallback to join date if no bookings
      };
    });

    return NextResponse.json(customerStats);

  } catch (error) {
    console.error('Failed to fetch customers with stats:', error);
    return NextResponse.json({ message: 'Failed to fetch customers with stats' }, { status: 500 });
  }
}
