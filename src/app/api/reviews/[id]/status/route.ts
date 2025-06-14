import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';

// Helper for validation (can be moved to a separate utils file if needed)
function validateEnum(value: string, allowedValues: string[]): boolean {
  return allowedValues.includes(value);
}

export async function PUT(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin', 'staff'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const { id } = params;
    const reviewId = parseInt(id);

    if (isNaN(reviewId)) {
      return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
    }

    const { status } = await request.json();

    if (!validateEnum(status, ['pending', 'approved', 'rejected'])) {
      return NextResponse.json({ message: 'Invalid status. Status must be pending, approved, or rejected' }, { status: 400 });
    }

    // Get the original review for audit logging
    const originalReviewResult = await pool.query('SELECT * FROM reviews WHERE id = $1', [reviewId]);
    const originalReview = originalReviewResult.rows[0];

    if (!originalReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    const updateResult = await pool.query(
      'UPDATE reviews SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, reviewId]
    );
    const updatedReview = updateResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'update',
      table_name: 'reviews',
      record_id: reviewId,
      old_values: { status: originalReview.status },
      new_values: { status: updatedReview.status },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: `Review status updated to ${status}`,
      review: updatedReview
    });

  } catch (error) {
    return handleApiError(error, 'Error updating review status');
  }
}