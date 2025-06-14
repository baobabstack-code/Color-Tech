import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';

export async function PUT(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
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
    const contentId = parseInt(id);

    if (isNaN(contentId)) {
      return NextResponse.json({ message: 'Invalid content ID' }, { status: 400 });
    }

    // Get original content for audit logging
    const originalContentResult = await pool.query('SELECT * FROM content WHERE id = $1', [contentId]);
    const originalContent = originalContentResult.rows[0];
    if (!originalContent) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    const updatedContentResult = await pool.query(
      `UPDATE content SET is_published = TRUE, updated_by = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [userId, contentId]
    );
    const updatedContent = updatedContentResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'update',
      table_name: 'content',
      record_id: contentId,
      old_values: { is_published: originalContent.is_published },
      new_values: { is_published: true },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Content published successfully',
      content: updatedContent
    });

  } catch (error) {
    return handleApiError(error, 'Error publishing content');
  }
}
