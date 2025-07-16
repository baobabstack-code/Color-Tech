import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const blogPostsFilePath = path.join(process.cwd(), 'src/data/blog-posts.json');

interface BlogPost {
  id: number;
  title: string;
  content_type: string;
  body: string;
  image_url: string | null;
  is_published: boolean;
  tags: string | null;
  author: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

// Helper function to write JSON file
const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET: Fetch all blog posts
export async function GET() {
  try {
    const blogPosts = readJsonFile(blogPostsFilePath);
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ message: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST: Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.body) {
      return NextResponse.json({ message: 'Title and body are required' }, { status: 400 });
    }

    const blogPosts = readJsonFile(blogPostsFilePath);
    
    const newPost: BlogPost = {
      id: blogPosts.length > 0 ? Math.max(...blogPosts.map((p: any) => p.id)) + 1 : 1,
      title: data.title,
      content_type: 'blog',
      body: data.body,
      image_url: data.image_url || null,
      is_published: data.is_published || false,
      tags: data.tags || null,
      author: data.author || 'Admin User',
      created_by: 1,
      updated_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    blogPosts.push(newPost);
    writeJsonFile(blogPostsFilePath, blogPosts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create blog post:', error);
    return NextResponse.json({ message: 'Failed to create blog post' }, { status: 500 });
  }
}