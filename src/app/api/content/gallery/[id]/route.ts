import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

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
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedGalleryItem = await DatabaseService.updateGalleryItem(
      parseInt(id),
      {
        title: data.title,
        body: data.body,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        isPublished: data.isPublished,
        tags: data.tags,
        author: data.author,
        updatedBy: data.updatedBy || "1",
      }
    );

    if (!updatedGalleryItem) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGalleryItem);
  } catch (error) {
    console.error("Failed to update gallery item:", error);
    console.error("Update error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      id: await params.then(p => p.id),
      data: await request.json().catch(() => 'Could not parse request data')
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
