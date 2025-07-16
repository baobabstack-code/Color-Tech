import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const testimonialsFilePath = path.join(process.cwd(), 'src/data/testimonials.json');

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  source: string;
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

// GET: Fetch all testimonials
export async function GET() {
  try {
    const testimonials = readJsonFile(testimonialsFilePath);
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json({ message: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST: Create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.quote) {
      return NextResponse.json({ message: 'Name and quote are required' }, { status: 400 });
    }

    const testimonials = readJsonFile(testimonialsFilePath);
    
    const newTestimonial: Testimonial = {
      id: (testimonials.length + 1).toString(),
      name: data.name,
      role: data.role || 'Customer',
      image: data.image || '/images/testimonials/default.jpg',
      quote: data.quote,
      rating: data.rating || 5,
      status: data.status || 'pending',
      date: data.date || new Date().toISOString().split('T')[0],
      source: data.source || 'website'
    };

    testimonials.push(newTestimonial);
    writeJsonFile(testimonialsFilePath, testimonials);

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return NextResponse.json({ message: 'Failed to create testimonial' }, { status: 500 });
  }
}