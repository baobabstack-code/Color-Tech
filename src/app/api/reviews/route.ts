import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET: Fetch all reviews with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let reviews;
    if (status === 'published') {
      reviews = await DatabaseService.getPublishedReviews();
    } else {
      reviews = await DatabaseService.getReviews();
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST: Create new review
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newReview = await DatabaseService.createReview({
      user: { connect: { id: data.userId } },
      service: { connect: { id: data.serviceId } },
      ...(data.bookingId && { booking: { connect: { id: data.bookingId } } }),
      rating: data.rating,
      comment: data.comment,
      status: data.status || 'pending',
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ message: 'Failed to create review' }, { status: 500 });
  }
}