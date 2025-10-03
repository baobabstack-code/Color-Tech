"use client";

import ProtectedRoute from "./ProtectedRoute";

interface AdminRouteProps {
    children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
    return (
        <ProtectedRoute requireAdmin={true}>
            {children}
        </ProtectedRoute>
    );
}

export default AdminRoute;