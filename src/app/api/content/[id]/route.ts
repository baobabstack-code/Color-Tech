import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';

// Helper for validation (can be moved to a separate utils file if needed)
function validateRequiredFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `${field} is required`;
    }
  }
  return null;
}

function validateString(value: any, minLength: number, maxLength?: number): string | null {
  if (typeof value !== 'string') {
    return 'Must be a string';
  }
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  if (maxLength !== undefined && value.length > maxLength) {
    return `Must be at most ${maxLength} characters long`;
  }
  return null;
}

function validateEnum(value: string, allowedValues: string[]): boolean {
  return allowedValues.includes(value);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const contentId = parseInt(id);

    if (isNaN(contentId)) {
      return NextResponse.json({ message: 'Invalid content ID' }, { status: 400 });
    }

    const contentResult = await pool.query('SELECT * FROM content WHERE id = $1', [contentId]);
    const content = contentResult.rows[0];

    if (!content) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    // For public routes, only return published content
    if (!content.is_published) {
      return NextResponse.json({ message: 'Content not found or not published' }, { status: 404 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    return handleApiError(error, 'Error fetching content by ID');
  }
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

    const { title, content_type, body, image_url, is_published, tags, author } = await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      const titleError = validateString(title, 1, 255);
      if (titleError) return NextResponse.json({ message: `Title: ${titleError}` }, { status: 400 });
      updateFields.push(`title = $${paramIndex++}`);
      updateValues.push(title);
    }
    if (content_type !== undefined) {
      if (!validateEnum(content_type, ['blog', 'gallery', 'testimonial', 'faq'])) {
        return NextResponse.json({ message: 'Invalid content_type' }, { status: 400 });
      }
      updateFields.push(`content_type = $${paramIndex++}`);
      updateValues.push(content_type);
    }
    if (body !== undefined) {
      const bodyError = validateString(body, 1);
      if (bodyError) return NextResponse.json({ message: `Body: ${bodyError}` }, { status: 400 });
      updateFields.push(`body = $${paramIndex++}`);
      updateValues.push(body);
    }
    if (image_url !== undefined) {
      updateFields.push(`image_url = $${paramIndex++}`);
      updateValues.push(image_url);
    }
    if (is_published !== undefined) {
      updateFields.push(`is_published = $${paramIndex++}`);
      updateValues.push(is_published);
    }
    if (tags !== undefined) {
      updateFields.push(`tags = $${paramIndex++}`);
      updateValues.push(tags);
    }
    if (author !== undefined) {
      updateFields.push(`author = $${paramIndex++}`);
      updateValues.push(author);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    updateFields.push(`updated_by = $${paramIndex++}`);
    updateValues.push(userId);
    updateFields.push(`updated_at = NOW()`);

    const updateQuery = `UPDATE content SET ${updateFields.join(', ')} WHERE id = $${paramIndex++} RETURNING *`;
    updateValues.push(contentId);

    const updatedContentResult = await pool.query(updateQuery, updateValues);
    const updatedContent = updatedContentResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'update',
      table_name: 'content',
      record_id: contentId,
      old_values: originalContent,
      new_values: updatedContent,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Content updated successfully',
      content: updatedContent
    });

  } catch (error) {
    return handleApiError(error, 'Error updating content');
  }
}

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
    const contentId = parseInt(id);

    if (isNaN(contentId)) {
      return NextResponse.json({ message: 'Invalid content ID' }, { status: 400 });
    }

    // Get original content for audit logging
    const contentResult = await pool.query('SELECT * FROM content WHERE id = $1', [contentId]);
    const content = contentResult.rows[0];
    if (!content) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    await pool.query('DELETE FROM content WHERE id = $1', [contentId]);

    await createAuditLog({
      user_id: userId!,
      action: 'delete',
      table_name: 'content',
      record_id: contentId,
      old_values: content,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({ message: 'Content deleted successfully' });

  } catch (error) {
    return handleApiError(error, 'Error deleting content');
  }
}
