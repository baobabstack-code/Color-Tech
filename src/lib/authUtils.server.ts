import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/config';

export interface AuthenticatedUser {
  id: string;
  role: string;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthenticatedUser;
    // Ensure essential fields are present in the decoded token
    if (!decoded || !decoded.id || !decoded.role) {
        console.error("Token verification successful, but decoded token is missing id or role.", decoded);
        return null;
    }
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
