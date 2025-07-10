import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get('content_type');
  const isPublished = searchParams.get('is_published');

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(fileContents);

    if (contentType === 'blog') {
      data = data.filter((item: any) => item.content_type === 'blog');
    }

    if (isPublished === 'true') {
      data = data.filter((item: any) => item.is_published === true);
    }

    return NextResponse.json({ content: data });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}