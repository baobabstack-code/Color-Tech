import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const galleryFilePath = path.join(process.cwd(), 'src/data/gallery.json');

interface GalleryItem {
  id: number;
  title: string;
  content_type: string;
  body: string;
  image_url: string;
  is_published: boolean;
  tags: string | null;
  author: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

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

// GET: Fetch all gallery items
export async function GET() {
  try {
    const galleryItems = readJsonFile(galleryFilePath);
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    return NextResponse.json({ message: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST: Create a new gallery item
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.image_url) {
      return NextResponse.json({ message: 'Title and image URL are required' }, { status: 400 });
    }

    const galleryItems = readJsonFile(galleryFilePath);
    
    const newItem: GalleryItem = {
      id: galleryItems.length > 0 ? Math.max(...galleryItems.map((i: any) => i.id)) + 1 : 1,
      title: data.title,
      content_type: 'gallery',
      body: data.body || JSON.stringify({ description: '', category: 'before-after' }),
      image_url: data.image_url,
      is_published: data.is_published !== undefined ? data.is_published : true,
      tags: data.tags || null,
      author: data.author || 'Admin User',
      created_by: 1,
      updated_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    galleryItems.push(newItem);
    writeJsonFile(galleryFilePath, galleryItems);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Failed to create gallery item:', error);
    return NextResponse.json({ message: 'Failed to create gallery item' }, { status: 500 });
  }
}