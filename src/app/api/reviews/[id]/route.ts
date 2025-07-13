import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  id: string;
}

// GET: Fetch a single review by ID
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        booking: true,
      },
    });

    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Failed to fetch review:', error);
    return NextResponse.json({ message: 'Failed to fetch review' }, { status: 500 });
  }
}

// PUT: Update an existing review
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: data.rating,
        comment: data.comment,
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    console.error('Failed to update review:', error);
    return NextResponse.json({ message: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE: Remove a review
export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    await prisma.review.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    console.error('Failed to delete review:', error);
    return NextResponse.json({ message: 'Failed to delete review' }, { status: 500 });
  }
}
