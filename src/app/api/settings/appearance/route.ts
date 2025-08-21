import { NextResponse } from 'next/server';
import { settings } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(settings.appearance);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Accept simple image URL fields and theme color
    if (body.themeColor !== undefined) settings.appearance.themeColor = body.themeColor;
    if (body.logoUrl !== undefined) settings.appearance.logoUrl = body.logoUrl;
    if (body.heroImageUrl !== undefined) settings.appearance.heroImageUrl = body.heroImageUrl;
    if (body.fallbackImageUrl !== undefined) settings.appearance.fallbackImageUrl = body.fallbackImageUrl;
    if (Array.isArray(body.carouselImageUrls)) settings.appearance.carouselImageUrls = body.carouselImageUrls;

    console.log('Updated appearance settings:', settings.appearance);
    return NextResponse.json(settings.appearance);
  } catch (error) {
    console.error('Failed to update appearance settings:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
