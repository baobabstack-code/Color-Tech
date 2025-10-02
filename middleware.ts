import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
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
  "/accessibility-showcase",
  "/api/webhooks/(.*)",
  "/_next/(.*)",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml"
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};