import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const blogPost = data.find((item: any) => item.id === parseInt(id));

    if (!blogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ content: blogPost });
  } catch (error) {
    console.error('Error reading blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}