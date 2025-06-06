import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';

interface ReviewParams {
  params: {
    id: string;
  };
}

// GET /api/reviews/[id]
export async function GET(request: NextRequest, { params }: ReviewParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const userId = authenticatedUser.id;
    const isAdmin = authenticatedUser.role === 'admin';

    let queryText = `
      SELECT r.*, u.full_name as user_name, s.name as service_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      WHERE r.id = $1
    `;
    const queryParams: any[] = [id];

    if (!isAdmin) {
      // Non-admins can only see their own reviews by ID, though typically this might be less common
      // Or this endpoint could be admin-only for direct ID access,
      // and users access their reviews via /my-reviews.
      // Sticking to original logic: admin or owner.
      queryText += ' AND r.user_id = $2';
      queryParams.push(userId);
    }

    const result = await pool.query(queryText, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Review not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ message: 'Server error while fetching review' }, { status: 500 });
  }
}

interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

// PUT /api/reviews/[id]
export async function PUT(request: NextRequest, { params }: ReviewParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: reviewId } = params;
    const userId = authenticatedUser.id;
    const isAdmin = authenticatedUser.role === 'admin';
    const body = await request.json() as UpdateReviewPayload;

    // Fetch the review to check ownership
    const reviewCheckResult = await pool.query('SELECT user_id, status FROM reviews WHERE id = $1', [reviewId]);
    if (reviewCheckResult.rows.length === 0) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    const currentReview = reviewCheckResult.rows[0];

    // Authorization: Admin can update any review. User can only update their own.
    if (!isAdmin && currentReview.user_id !== userId) {
      return NextResponse.json({ message: 'Not authorized to update this review' }, { status: 403 });
    }

    // Non-admins cannot change the status.
    if (!isAdmin && body.status) {
      return NextResponse.json({ message: 'Only admins can change review status' }, { status: 403 });
    }

    const updates: string[] = [];
    const queryParams: any[] = [];
    let paramCounter = 1;

    if (body.rating !== undefined && (isAdmin || currentReview.user_id === userId)) {
      updates.push(`rating = $${paramCounter++}`);
      queryParams.push(body.rating);
    }
    if (body.comment !== undefined && (isAdmin || currentReview.user_id === userId)) {
      updates.push(`comment = $${paramCounter++}`);
      queryParams.push(body.comment);
    }
    if (body.status && isAdmin) { // Only admin can update status
      updates.push(`status = $${paramCounter++}`);
      queryParams.push(body.status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: 'No update fields provided or values are the same as current.' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    queryParams.push(reviewId);

    const updateQuery = `UPDATE reviews SET ${updates.join(', ')} WHERE id = $${paramCounter} RETURNING *`;
    const result = await pool.query(updateQuery, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Failed to update review' }, { status: 500 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ message: 'Server error while updating review' }, { status: 500 });
  }
}

// DELETE /api/reviews/[id]
export async function DELETE(request: NextRequest, { params }: ReviewParams) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: reviewId } = params;
    const userId = authenticatedUser.id;
    const isAdmin = authenticatedUser.role === 'admin';

    const reviewCheckResult = await pool.query('SELECT user_id FROM reviews WHERE id = $1', [reviewId]);

    if (reviewCheckResult.rows.length === 0) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    const review = reviewCheckResult.rows[0];

    if (!isAdmin && review.user_id !== userId) {
      return NextResponse.json({ message: 'Not authorized to delete this review' }, { status: 403 });
    }

    await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ message: 'Server error while deleting review' }, { status: 500 });
  }
}
