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

export async function POST(request: AuthenticatedRequest) {
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

    // Assuming file_path, original_name, mime_type, size are provided in the request body
    const { title, file_path, original_name, mime_type, size, is_published } = await request.json();

    const validationError = validateRequiredFields(
      { title, file_path, original_name, mime_type, size },
      ['title', 'file_path', 'original_name', 'mime_type', 'size']
    );
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const contentData = {
      title: title,
      content_type: 'gallery',
      body: JSON.stringify({
        file_path: file_path,
        original_name: original_name,
        mime_type: mime_type,
        size: size
      }),
      image_url: file_path, // Assuming image_url stores the file_path
      is_published: is_published ?? false,
      created_by: userId,
      updated_by: userId
    };

    const contentResult = await pool.query(
      `INSERT INTO content (title, content_type, body, image_url, is_published, created_by, updated_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [contentData.title, contentData.content_type, contentData.body, contentData.image_url, contentData.is_published, contentData.created_by, contentData.updated_by]
    );
    const content = contentResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'insert',
      table_name: 'content',
      record_id: content.id,
      new_values: content,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Gallery image uploaded successfully',
      content
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error uploading gallery image');
  }
}
