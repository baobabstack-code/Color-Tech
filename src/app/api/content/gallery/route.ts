import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

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

    // Basic validation
    if (!data.title || (!data.imageUrl && !data.videoUrl)) {
      return NextResponse.json(
        { message: "Missing required fields: title, imageUrl or videoUrl" },
        { status: 400 }
      );
    }

    // Ensure we have valid values for all required fields
    const galleryData = {
      title: data.title || "Untitled",
      body: data.body || null,
      imageUrl: data.imageUrl || "",
      videoUrl: data.videoUrl || null,
      isPublished: Boolean(data.isPublished),
      tags: data.tags || null,
      author: data.author || "Admin",
      createdBy: "1", // Use a fixed admin user ID for now
      updatedBy: "1", // Use a fixed admin user ID for now
    };

    const newGalleryItem = await DatabaseService.createGalleryItem(galleryData);

    return NextResponse.json(newGalleryItem, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    return NextResponse.json(
      { message: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
