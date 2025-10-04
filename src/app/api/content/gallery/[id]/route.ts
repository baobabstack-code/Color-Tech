import { NextRequest, NextResponse } from "next/server";
import { DatabaseService, prisma } from "@/lib/database";

// GET: Fetch a specific gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryItem = await DatabaseService.getGalleryItemById(parseInt(id));

    if (!galleryItem) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Failed to fetch gallery item:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      id: await params.then(p => p.id)
    });
    return NextResponse.json(
      {
        message: "Failed to fetch gallery item",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT: Update a gallery item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let requestData: any = null;
  try {
    const { id } = await params;
    requestData = await request.json();

    console.log("Gallery update request data:", JSON.stringify(requestData, null, 2));
    console.log("Gallery item ID:", id);

    // Validate and sanitize input data
    if (!requestData.title || requestData.title.trim() === "") {
      return NextResponse.json(
        { message: "Title is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Use raw SQL to avoid Prisma validation issues with the schema
    const updateQuery = `
      UPDATE gallery_items 
      SET 
        title = $1,
        body = $2,
        "imageUrl" = $3,
        "videoUrl" = $4,
        "isPublished" = $5,
        tags = $6,
        author = $7,
        "updatedAt" = NOW()
      WHERE id = $8
      RETURNING *
    `;

    const updatedItem = await prisma.$queryRaw`
      UPDATE gallery_items 
      SET 
        title = ${requestData.title.trim()},
        body = ${requestData.body ? requestData.body.trim() : null},
        "imageUrl" = ${requestData.imageUrl || ""},
        "videoUrl" = ${requestData.videoUrl || null},
        "isPublished" = ${Boolean(requestData.isPublished)},
        tags = ${requestData.tags ? requestData.tags.trim() : null},
        author = ${requestData.author ? requestData.author.trim() : "Admin"},
        "updatedAt" = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (!updatedItem || (Array.isArray(updatedItem) && updatedItem.length === 0)) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    const result = Array.isArray(updatedItem) ? updatedItem[0] : updatedItem;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update gallery item:", error);
    console.error("Update error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      requestData: requestData || 'No request data'
    });
    return NextResponse.json(
      {
        message: "Failed to update gallery item",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedGalleryItem = await DatabaseService.deleteGalleryItem(
      parseInt(id)
    );

    if (!deletedGalleryItem) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    return NextResponse.json(
      { message: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
