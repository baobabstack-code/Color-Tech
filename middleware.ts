import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define admin emails - must match the ones in NextAuth config
const ADMIN_EMAILS = [
  "admin@colortech.co.zw", // Your main admin email
  "mrshepard18@gmail.com", // Additional admin access
  // Add more admin emails here as needed
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Check if user is trying to access admin routes
    if (pathname.startsWith("/admin")) {
      // If no token or user is not an admin, redirect to home
      if (!token || !token.email || !ADMIN_EMAILS.includes(token.email)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to non-admin routes for any authenticated user
        if (!pathname.startsWith("/admin")) {
          return !!token;
        }

        // For admin routes, check if user email is in admin list
        return !!token && !!token.email && ADMIN_EMAILS.includes(token.email);
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
