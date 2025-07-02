import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config/jwt';
import logger from '@/utils/logger'; // Import the logger

interface UserPayload {
  id: number;
  email: string;
  role: string;
}

// Extend NextRequest to include user property for authenticated requests
export interface AuthenticatedRequest extends NextRequest {
  user?: UserPayload;
}

/**
 * Middleware-like function to authenticate requests based on JWT.
 * Attaches user payload to the request object if authentication is successful.
 */
export async function authenticateApi(request: AuthenticatedRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.getSecret()) as UserPayload;
    request.user = decoded; // Attach user payload to the request
    return null; // No response means continue to the route handler
  } catch (err) {
    logger.error('JWT verification error:', err);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}

/**
 * Middleware-like function to authorize requests based on user roles.
 * Requires authenticateApi to be called first.
 */
export function authorizeApi(allowedRoles: string[]) {
  return async (request: AuthenticatedRequest): Promise<NextResponse | null> => {
    if (!request.user) {
      // This should ideally not happen if authenticateApi is called first
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    return null; // No response means continue to the route handler
  };
}

/**
 * Helper function to handle API errors consistently.
 */
export function handleApiError(error: any, message: string, status: number = 500): NextResponse {
  logger.error(message, error);
  return NextResponse.json({ message: message, error: process.env.NODE_ENV === 'development' ? error.message : undefined }, { status });
}