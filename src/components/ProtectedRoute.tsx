"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Redirect to login page but save the attempted location
      router.replace(`/login?from=${encodeURIComponent(pathname || "")}`);
      return;
    }

    if (requireAdmin && !isAdmin) {
      // Show unauthorized message for a moment, then redirect
      setShowUnauthorized(true);
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);

      // Return cleanup function
      return () => clearTimeout(timer);
    }

    // Explicitly return undefined for other cases
    return undefined;
  }, [isAuthenticated, isAdmin, requireAdmin, router, pathname, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (showUnauthorized || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-red-400 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-300 mb-4">
              You don't have permission to access this area. Only the business admin email can access admin features.
            </p>
            <p className="text-sm text-gray-400">
              Redirecting to home page in a few seconds...
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
