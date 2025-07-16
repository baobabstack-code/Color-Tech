import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET: Fetch single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);
    
    if (isNaN(reviewId)) {
      return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
    }

    const review = await DatabaseService.getReviewById(reviewId);
    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json(review);
  } catch (error) {
    console.error('Failed to fetch review:', error);
    return NextResponse.json({ message: 'Failed to fetch review' }, { status: 500 });
  }
}

// PUT: Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);
    
    if (isNaN(reviewId)) {
      return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
    }

    const data = await request.json();

    const updatedReview = await DatabaseService.updateReview(reviewId, {
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.comment !== undefined && { comment: data.comment }),
      ...(data.status && { status: data.status }),
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Failed to update review:', error);
    return NextResponse.json({ message: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE: Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);
    
    if (isNaN(reviewId)) {
      return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
    }

    await DatabaseService.deleteReview(reviewId);
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json({ message: 'Failed to delete review' }, { status: 500 });
  }
}