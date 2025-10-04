import { NextRequest, NextResponse } from "next/server";
import { DatabaseService, prisma } from "@/lib/database";

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
    console.log("Blog update request data:", JSON.stringify(data, null, 2));

    // Use raw SQL to avoid Prisma validation issues
    const updatedPost = await prisma.$queryRaw`
      UPDATE posts 
      SET 
        title = ${data.title},
        body = ${data.body},
        "imageUrl" = ${data.imageUrl || null},
        "videoUrl" = ${data.videoUrl || null},
        "isPublished" = ${Boolean(data.isPublished)},
        tags = ${data.tags || null},
        author = ${data.author || "Admin"},
        slug = ${data.slug},
        "updatedAt" = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (!updatedPost || (Array.isArray(updatedPost) && updatedPost.length === 0)) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    const result = Array.isArray(updatedPost) ? updatedPost[0] : updatedPost;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json(
      { 
        message: "Failed to update blog post",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
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
    console.log("Delete blog post ID:", id);

    // Use raw SQL to avoid Prisma validation issues
    const deletedRows = await prisma.$executeRaw`
      DELETE FROM posts 
      WHERE id = ${parseInt(id)}
    `;

    if (deletedRows === 0) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Blog post deleted successfully",
      deletedCount: deletedRows
    });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json(
      {
        message: "Failed to delete blog post",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
