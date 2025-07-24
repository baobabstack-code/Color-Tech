import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get("content_type");
  const isPublished = searchParams.get("is_published");

  try {
    let data;

    if (contentType === "blog") {
      if (isPublished === "true") {
        data = await DatabaseService.getBlogPosts(); // Only published blog posts
      } else {
        data = await DatabaseService.getPosts(); // All blog posts
      }
    } else {
      // Default to blog posts if no content type specified
      data = await DatabaseService.getPosts();

      if (isPublished === "true") {
        data = data.filter((item: any) => item.isPublished === true);
      }
    }

    return NextResponse.json({ content: data });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
