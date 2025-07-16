import React from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen ml-64">
          <AdminHeader />
          <main className="flex-1 p-6 pt-20">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
