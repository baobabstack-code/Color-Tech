import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted location
    router.replace(`/login?from=${encodeURIComponent(pathname || "")}`);
    return null; // Return null or a loading indicator while redirecting
  }

  if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to home page
    router.replace("/");
    return null; // Return null or a loading indicator while redirecting
  }

  return <>{children}</>;
}

export default ProtectedRoute;
