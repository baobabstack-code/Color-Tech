import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all reviews with details
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        customer: true,
        service: true,
        booking: true,
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST: Create a new review
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.bookingId || !data.customerId || !data.serviceId || !data.rating) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        bookingId: data.bookingId,
        customerId: data.customerId,
        serviceId: data.serviceId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ message: 'Failed to create review' }, { status: 500 });
  }
}
