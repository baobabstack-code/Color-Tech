import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminRoute from "@/components/AdminRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}
