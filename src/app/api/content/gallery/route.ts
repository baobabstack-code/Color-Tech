import { NextRequest, NextResponse } from "next/server";
import { DatabaseService, prisma } from "@/lib/database";

// GET: Fetch all gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    let galleryItems;
    if (published === "true") {
      galleryItems = await DatabaseService.getGalleryItems(); // Only published
    } else {
      galleryItems = await DatabaseService.getAllGalleryItems(); // All items
    }

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    return NextResponse.json(
      { message: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

// POST: Create a new gallery item
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Gallery create request data:", JSON.stringify(data, null, 2));

    // Basic validation
    if (!data.title || (!data.imageUrl && !data.videoUrl)) {
      return NextResponse.json(
        { message: "Missing required fields: title, imageUrl or videoUrl" },
        { status: 400 }
      );
    }

    // Use raw SQL to avoid Prisma validation issues with schema
    const newGalleryItem = await prisma.$queryRaw`
      INSERT INTO gallery_items (
        title, 
        body, 
        "imageUrl", 
        "videoUrl", 
        "isPublished", 
        tags, 
        author,
        "createdBy",
        "updatedBy",
        "createdAt",
        "updatedAt",
        type
      ) VALUES (
        ${data.title || "Untitled"},
        ${data.body || null},
        ${data.imageUrl || ""},
        ${data.videoUrl || null},
        ${Boolean(data.isPublished)},
        ${data.tags || null},
        ${data.author || "Admin"},
        '1',
        '1',
        NOW(),
        NOW(),
        'single_image'
      )
      RETURNING *
    `;

    const result = Array.isArray(newGalleryItem) ? newGalleryItem[0] : newGalleryItem;
    console.log("Created gallery item:", result);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    console.error("Create error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      {
        message: "Failed to create gallery item",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
