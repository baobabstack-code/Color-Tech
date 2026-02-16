import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        // Check if user is trying to access admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
            const token = req.nextauth.token;
            
            // Check if user has admin flag or matches admin emails
            const isAdmin = token?.isAdmin === true;

            if (!isAdmin) {
                return Response.redirect(new URL("/", req.url));
            }
        }

        // Return undefined for allowed requests
        return undefined;
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Require authentication for admin routes only
                if (req.nextUrl.pathname.startsWith("/admin")) {
                    return !!token;
                }
                return true;
            },
        },
    }
)

export const config = {
    matcher: ["/admin/:path*"]
}

