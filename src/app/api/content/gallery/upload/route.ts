import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';
import { promises as fs } from 'fs';
import path from 'path';
import { config } from '@/config'; // Import config for upload directory

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

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const file = formData.get('file') as File;
    const is_published = formData.get('is_published') === 'true'; // Convert string to boolean

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    // File type validation
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ message: `Invalid file type. Only ${allowedMimeTypes.join(', ')} are allowed.` }, { status: 400 });
    }

    // File size limit (e.g., 5MB)
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ message: `File size exceeds the limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.` }, { status: 400 });
    }

    // Define upload directory (e.g., public/uploads)
    // Ensure config.uploads.directory is relative to 'public' and doesn't start with './'
    const baseUploadDir = config.uploads.directory.startsWith('./') ? config.uploads.directory.substring(2) : config.uploads.directory;
    const uploadDir = path.join(process.cwd(), 'public', baseUploadDir);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.name);
    const filename = `${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(uploadDir, filename);
    // Construct the URL-friendly path relative to the public directory
    const relativeFilePath = path.posix.join('/', baseUploadDir, filename); // Use path.posix for URL-friendly paths

    // Save the file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const contentData = {
      title: title,
      content_type: 'gallery',
      body: JSON.stringify({
        file_path: relativeFilePath,
        original_name: file.name,
        mime_type: file.type,
        size: file.size
      }),
      image_url: relativeFilePath, // Store the public URL path
      is_published: is_published,
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
