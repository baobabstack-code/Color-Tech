import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/gallery",
    "/services",
    "/services/(.*)",
    "/blog",
    "/blog/(.*)",
    "/api/content/(.*)",
    "/api/services",
    "/api/services/(.*)",
    "/api/form-submissions",
    "/sign-in",
    "/sign-up",
    "/accessibility-showcase"
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/webhooks/(.*)",
    "/_next/(.*)",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml"
  ]
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};