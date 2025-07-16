import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const galleryFilePath = path.join(process.cwd(), 'src/data/gallery.json');

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

// Helper function to write JSON file
const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET: Fetch single gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const galleryItems = readJsonFile(galleryFilePath);
    
    const item = galleryItems.find((i: any) => i.id === id);
    if (!item) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to fetch gallery item:', error);
    return NextResponse.json({ message: 'Failed to fetch gallery item' }, { status: 500 });
  }
}

// PUT: Update gallery item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const data = await request.json();
    const galleryItems = readJsonFile(galleryFilePath);

    const itemIndex = galleryItems.findIndex((i: any) => i.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    // Update gallery item
    galleryItems[itemIndex] = {
      ...galleryItems[itemIndex],
      title: data.title || galleryItems[itemIndex].title,
      body: data.body || galleryItems[itemIndex].body,
      image_url: data.image_url || galleryItems[itemIndex].image_url,
      is_published: data.is_published !== undefined ? data.is_published : galleryItems[itemIndex].is_published,
      tags: data.tags !== undefined ? data.tags : galleryItems[itemIndex].tags,
      author: data.author || galleryItems[itemIndex].author,
      updated_by: 1,
      updated_at: new Date().toISOString()
    };

    writeJsonFile(galleryFilePath, galleryItems);
    return NextResponse.json(galleryItems[itemIndex]);
  } catch (error) {
    console.error('Failed to update gallery item:', error);
    return NextResponse.json({ message: 'Failed to update gallery item' }, { status: 500 });
  }
}

// DELETE: Delete gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const galleryItems = readJsonFile(galleryFilePath);

    const itemIndex = galleryItems.findIndex((i: any) => i.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    // Remove gallery item
    galleryItems.splice(itemIndex, 1);
    writeJsonFile(galleryFilePath, galleryItems);

    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    return NextResponse.json({ message: 'Failed to delete gallery item' }, { status: 500 });
  }
}