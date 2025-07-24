import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    let posts = await DatabaseService.getPosts();

    // Filter by published status if provided
    if (published === "true") {
      posts = posts.filter((post: any) => post.isPublished === true);
    } else if (published === "false") {
      posts = posts.filter((post: any) => post.isPublished === false);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST: Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.body || !data.slug) {
      return NextResponse.json(
        { message: "Missing required fields: title, body, slug" },
        { status: 400 }
      );
    }

    const newPost = await DatabaseService.createPost({
      title: data.title,
      body: data.body,
      imageUrl: data.imageUrl || null,
      isPublished: data.isPublished || false,
      tags: data.tags || null,
      author: data.author || "Admin",
      slug: data.slug,
      createdBy: data.createdBy || 1,
      updatedBy: data.updatedBy || 1,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json(
      { message: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
