import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        // Check if user is trying to access admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
            const adminEmail = process.env.ADMIN_EMAIL;
            const userEmail = req.nextauth.token?.email;

            // Only allow access if user email matches admin email
            if (userEmail !== adminEmail) {
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

