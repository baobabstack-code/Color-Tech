import { NextResponse } from 'next/server';
import { settings } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(settings.appearance);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Note: Handling file uploads (logo) would require a different setup,
    // typically using multipart/form-data. For this mock API, we'll just handle the theme color.
    if (body.themeColor) {
      settings.appearance.themeColor = body.themeColor;
    }
    
    console.log('Updated appearance settings:', settings.appearance);
    return NextResponse.json(settings.appearance);
  } catch (error) {
    console.error('Failed to update appearance settings:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
