import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const testimonialsFilePath = path.join(process.cwd(), 'src/data/testimonials.json');

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

// GET: Fetch single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonials = readJsonFile(testimonialsFilePath);
    
    const testimonial = testimonials.find((t: any) => t.id === id);
    if (!testimonial) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }
    
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Failed to fetch testimonial:', error);
    return NextResponse.json({ message: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// PUT: Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const testimonials = readJsonFile(testimonialsFilePath);

    const testimonialIndex = testimonials.findIndex((t: any) => t.id === id);
    if (testimonialIndex === -1) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }

    // Update testimonial
    testimonials[testimonialIndex] = {
      ...testimonials[testimonialIndex],
      name: data.name || testimonials[testimonialIndex].name,
      role: data.role || testimonials[testimonialIndex].role,
      image: data.image || testimonials[testimonialIndex].image,
      quote: data.quote || testimonials[testimonialIndex].quote,
      rating: data.rating !== undefined ? data.rating : testimonials[testimonialIndex].rating,
      status: data.status || testimonials[testimonialIndex].status,
      source: data.source || testimonials[testimonialIndex].source
    };

    writeJsonFile(testimonialsFilePath, testimonials);
    return NextResponse.json(testimonials[testimonialIndex]);
  } catch (error) {
    console.error('Failed to update testimonial:', error);
    return NextResponse.json({ message: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE: Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonials = readJsonFile(testimonialsFilePath);

    const testimonialIndex = testimonials.findIndex((t: any) => t.id === id);
    if (testimonialIndex === -1) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }

    // Remove testimonial
    testimonials.splice(testimonialIndex, 1);
    writeJsonFile(testimonialsFilePath, testimonials);

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    return NextResponse.json({ message: 'Failed to delete testimonial' }, { status: 500 });
  }
}