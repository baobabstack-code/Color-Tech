import { NextRequest, NextResponse } from 'next/server';
import ContentModel from '@/models/Content'; // Assuming ContentModel.ts is in models/

// GET /api/content/faq/categories
export async function GET(request: NextRequest) {
  try {
    const categories = await ContentModel.getFaqCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    return NextResponse.json({ message: 'Server error while fetching FAQ categories' }, { status: 500 });
  }
}
