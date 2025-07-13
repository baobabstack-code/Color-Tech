import { NextResponse } from 'next/server';
import { settings } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(settings.notifications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    settings.notifications = { ...settings.notifications, ...body };
    console.log('Updated notification settings:', settings.notifications);
    return NextResponse.json(settings.notifications);
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
