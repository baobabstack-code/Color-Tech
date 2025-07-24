import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await DatabaseService.getPostById(parseInt(id));

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT: Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedPost = await DatabaseService.updatePost(parseInt(id), {
      title: data.title,
      body: data.body,
      imageUrl: data.imageUrl,
      isPublished: data.isPublished,
      tags: data.tags,
      author: data.author,
      slug: data.slug,
      updatedBy: data.updatedBy || 1,
    });

    if (!updatedPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json(
      { message: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedPost = await DatabaseService.deletePost(parseInt(id));

    if (!deletedPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json(
      { message: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
