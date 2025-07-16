import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const blogPostsFilePath = path.join(process.cwd(), 'src/data/blog-posts.json');

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

// GET: Fetch single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const blogPosts = readJsonFile(blogPostsFilePath);
    
    const post = blogPosts.find((p: any) => p.id === id);
    if (!post) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return NextResponse.json({ message: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT: Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const data = await request.json();
    const blogPosts = readJsonFile(blogPostsFilePath);

    const postIndex = blogPosts.findIndex((p: any) => p.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    // Update blog post
    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      title: data.title || blogPosts[postIndex].title,
      body: data.body || blogPosts[postIndex].body,
      image_url: data.image_url !== undefined ? data.image_url : blogPosts[postIndex].image_url,
      is_published: data.is_published !== undefined ? data.is_published : blogPosts[postIndex].is_published,
      tags: data.tags !== undefined ? data.tags : blogPosts[postIndex].tags,
      author: data.author || blogPosts[postIndex].author,
      updated_by: 1,
      updated_at: new Date().toISOString()
    };

    writeJsonFile(blogPostsFilePath, blogPosts);
    return NextResponse.json(blogPosts[postIndex]);
  } catch (error) {
    console.error('Failed to update blog post:', error);
    return NextResponse.json({ message: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE: Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const blogPosts = readJsonFile(blogPostsFilePath);

    const postIndex = blogPosts.findIndex((p: any) => p.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    // Remove blog post
    blogPosts.splice(postIndex, 1);
    writeJsonFile(blogPostsFilePath, blogPosts);

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json({ message: 'Failed to delete blog post' }, { status: 500 });
  }
}