import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, AuthenticatedUser } from '@/lib/authUtils.server';
import ContentModel from '@/models/Content';
import { writeFile } from 'fs/promises';
import path from 'path';

// Ensure the uploads directory exists (basic check, ideally done at server start)
// For serverless functions, writing to filesystem needs care, consider cloud storage for production
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/gallery');
// Ensure this directory exists or is created, and is writable.
// For this example, we'll assume it exists. A robust solution would create it.

// POST /api/content/gallery/upload (admin/staff only)
export async function POST(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser || (authenticatedUser.role !== 'admin' && authenticatedUser.role !== 'staff')) {
      return NextResponse.json({ message: 'Unauthorized: Admin or staff access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const is_published_str = formData.get('is_published') as string | null;
    const is_published = is_published_str === 'true';


    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Basic validation for file type and size can be added here if needed

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to avoid collisions
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    const publicPath = `/uploads/gallery/${filename}`; // Path accessible via web

    // Create directory if it doesn't exist (important for serverless environments where /tmp might be ephemeral)
    // For a persistent solution, ensure UPLOAD_DIR is writable or use cloud storage.
    // This is a simplified example; robust error handling for fs operations is needed.
    try {
        await require('fs').promises.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (mkdirError) {
        console.error("Error creating upload directory:", mkdirError);
        // Potentially ignore if directory already exists, or handle specific errors
    }

    await writeFile(filePath, buffer);
    console.log(`File uploaded to ${filePath}`);


    const contentData = {
      title: title || file.name,
      type: 'gallery' as 'gallery', // Type assertion
      content: JSON.stringify({
        file_path: publicPath, // Store the web-accessible path
        original_name: file.name,
        mime_type: file.type,
        size: file.size,
      }),
      is_published: is_published !== undefined ? is_published : false,
      created_by: parseInt(authenticatedUser.id, 10),
      updated_by: parseInt(authenticatedUser.id, 10),
    };

    const newContent = await ContentModel.create(contentData);

    // TODO: Add audit logging if required

    return NextResponse.json({ message: 'Gallery image uploaded successfully', content: newContent }, { status: 201 });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    return NextResponse.json({ message: 'Server error while uploading gallery image' }, { status: 500 });
  }
}
