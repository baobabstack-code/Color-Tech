import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';

// Helper for validation (can be moved to a separate utils file if needed)
function validateNumber(value: any, minValue: number, maxValue?: number): string | null {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Must be a number';
  }
  if (num < minValue) {
    return `Must be at least ${minValue}`;
  }
  if (maxValue !== undefined && num > maxValue) {
    return `Must be at most ${maxValue}`;
  }
  return null;
}

function validateString(value: any, minLength: number, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return 'Must be a string';
  }
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  if (value.length > maxLength) {
    return `Must be at most ${maxLength} characters long`;
  }
  return null;
}

export async function PUT(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const reviewId = parseInt(id);
    const userId = request.user?.id;

    if (isNaN(reviewId)) {
      return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
    }

    // Get the original review for audit logging and ownership check
    const originalReviewResult = await pool.query('SELECT * FROM reviews WHERE id = $1', [reviewId]);
    const originalReview = originalReviewResult.rows[0];

    if (!originalReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // Check if the user owns this review
    if (originalReview.user_id !== userId) {
      return NextResponse.json({ message: 'You can only update your own reviews' }, { status: 403 });
    }

    const { rating, comment } = await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (rating !== undefined) {
      const ratingError = validateNumber(rating, 1, 5);
      if (ratingError) return NextResponse.json({ message: `Rating: ${ratingError}` }, { status: 400 });
      updateFields.push(`rating = $${paramIndex++}`);
      updateValues.push(rating);
    }
    if (comment !== undefined) {
      const commentError = validateString(comment, 1, 1000);
      if (commentError) return NextResponse.json({ message: `Comment: ${commentError}` }, { status: 400 });
      updateFields.push(`comment = $${paramIndex++}`);
      updateValues.push(comment);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    // Reset status to pending if content is changed
    updateFields.push(`status = $${paramIndex++}`);
    updateValues.push('pending');

    const updateQuery = `UPDATE reviews SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex++} RETURNING *`;
    updateValues.push(reviewId);

    const updatedReviewResult = await pool.query(updateQuery, updateValues);
    const updatedReview = updatedReviewResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'update',
      table_name: 'reviews',
      record_id: reviewId,
      old_values: originalReview,
      new_values: updatedReview,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Review updated successfully and pending approval',
      review: updatedReview
    });

  } catch (error) {
    return handleApiError(error, 'Error updating review');
  }
}

export async function DELETE(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const { id } = params;
    const reviewId = parseInt(id);
    const userId = request.user?.id;

    if (isNaN(reviewId)) {
      return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
    }

    // Get the original review for audit logging and ownership check
    const reviewResult = await pool.query('SELECT * FROM reviews WHERE id = $1', [reviewId]);
    const review = reviewResult.rows[0];

    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // Check if the user owns this review
    // Allow admin or staff to delete any review, or the user to delete their own review
    const userRole = request.user?.role;
    if (userRole !== 'admin' && userRole !== 'staff' && review.user_id !== userId) {
      return NextResponse.json({ message: 'You do not have permission to delete this review' }, { status: 403 });
    }

    await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    await createAuditLog({
      user_id: userId!,
      action: 'delete',
      table_name: 'reviews',
      record_id: reviewId,
      old_values: review,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({ message: 'Review deleted successfully' });

  } catch (error) {
    return handleApiError(error, 'Error deleting review');
  }
}
