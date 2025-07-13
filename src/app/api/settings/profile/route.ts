import { NextResponse } from 'next/server';
import { settings } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(settings.profile);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In a real app, you would handle password changes separately and securely
    const { currentPassword, newPassword, ...profileData } = body;
    
    settings.profile = { ...settings.profile, ...profileData };
    console.log('Updated profile settings:', settings.profile);

    if (newPassword) {
        console.log('Password change requested. In a real app, we would handle this securely.');
    }

    return NextResponse.json(settings.profile);
  } catch (error) {
    console.error('Failed to update profile settings:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
