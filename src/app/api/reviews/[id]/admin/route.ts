import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';

export async function DELETE(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin'])(request);
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

    // Get the original review for audit logging
    const reviewResult = await pool.query('SELECT * FROM reviews WHERE id = $1', [reviewId]);
    const review = reviewResult.rows[0];

    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    await createAuditLog({
      user_id: userId!,
      action: 'delete',
      table_name: 'reviews',
      record_id: reviewId,
      old_values: review,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      metadata: { admin_deletion: true, reason: 'Admin deletion' }
    });

    return NextResponse.json({ message: 'Review deleted successfully by admin' });

  } catch (error) {
    return handleApiError(error, 'Error admin deleting review');
  }
}