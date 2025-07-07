import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration for Strapi backend URL
const STRAPI_ADMIN_URL = process.env.STRAPI_ADMIN_URL || 'http://localhost:1337/admin';

/**
 * This middleware redirects all admin routes to the Strapi admin panel
 * It intercepts requests to /admin/* and redirects them to the Strapi admin interface
 */
export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the path after /admin to preserve any specific routes
    const adminPath = request.nextUrl.pathname.replace(/^\/admin/, '');
    
    // Construct the full Strapi admin URL with the specific path
    const strapiUrl = new URL(`${STRAPI_ADMIN_URL}${adminPath}`, request.url);
    
    // Preserve any query parameters
    strapiUrl.search = request.nextUrl.search;
    
    // Redirect to Strapi admin panel
    return NextResponse.redirect(strapiUrl);
  }
  
  // Continue with the request for non-admin routes
  return NextResponse.next();
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: '/admin/:path*',
};