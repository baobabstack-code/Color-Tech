"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isMobile ? 'ml-0' : 'ml-64'
        }`}>
          <AdminHeader 
            onMenuClick={() => setSidebarOpen(true)}
            isMobile={isMobile}
          />
          <main className={`flex-1 pt-16 transition-all duration-300 ${
            isMobile ? 'p-4' : 'p-6 pt-20'
          }`}>
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
