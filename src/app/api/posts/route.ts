import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        creator: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await prisma.post.create({
      data: {
        title: body.title,
        body: body.content || body.body,
        imageUrl: body.imageUrl,
        isPublished: body.isPublished || false,
        tags: body.tags,
        author: body.author || "Admin",
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
        createdBy: 1, // TODO: Replace with actual user ID from session
        updatedBy: 1,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
