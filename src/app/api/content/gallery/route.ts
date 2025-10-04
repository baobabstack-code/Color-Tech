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

    // Basic validation - for Before/After type, we need beforeImageUrl and afterImageUrl
    // For single image, we need imageUrl or videoUrl
    const isBeforeAfter = data.type === 'before_after';
    if (!data.title) {
      return NextResponse.json(
        { message: "Missing required field: title" },
        { status: 400 }
      );
    }
    
    if (isBeforeAfter) {
      if (!data.beforeImageUrl || !data.afterImageUrl) {
        return NextResponse.json(
          { message: "Before/After gallery items require both beforeImageUrl and afterImageUrl" },
          { status: 400 }
        );
      }
    } else {
      if (!data.imageUrl && !data.videoUrl) {
        return NextResponse.json(
          { message: "Single image gallery items require imageUrl or videoUrl" },
          { status: 400 }
        );
      }
    }

    // Determine the type based on whether before/after images are provided
    const galleryType = isBeforeAfter ? 'before_after' : 'single_image';
    
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
        type,
        "beforeImageUrl",
        "afterImageUrl"
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
        ${galleryType},
        ${data.beforeImageUrl || null},
        ${data.afterImageUrl || null}
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
