import { NextResponse } from 'next/server';
import { services, bookings, reviews } from '@/lib/mock-db';

// GET: Fetch all services with aggregated stats (booking count and average rating)
export async function GET() {
  try {
    // Calculate booking counts per service
    const bookingCounts = bookings.reduce((acc, booking) => {
      acc[booking.serviceId] = (acc[booking.serviceId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average ratings per service
    const reviewAggregates = reviews.reduce((acc, review) => {
      if (!acc[review.serviceId]) {
        acc[review.serviceId] = { totalRating: 0, count: 0 };
      }
      acc[review.serviceId].totalRating += review.rating;
      acc[review.serviceId].count += 1;
      return acc;
    }, {} as Record<string, { totalRating: number; count: number }>);

    const averageRatings = Object.entries(reviewAggregates).reduce((acc, [serviceId, { totalRating, count }]) => {
        acc[serviceId] = parseFloat((totalRating / count).toFixed(1));
        return acc;
    }, {} as Record<string, number>); 

    // Combine data
    const servicesWithStats = services.map(service => ({
      ...service,
      bookingCount: bookingCounts[service.id] || 0,
      averageRating: averageRatings[service.id] || 0,
    }));

    return NextResponse.json(servicesWithStats);

  } catch (error) {
    console.error('Failed to fetch services with stats:', error);
    return NextResponse.json({ message: 'Failed to fetch services with stats' }, { status: 500 });
  }
}
