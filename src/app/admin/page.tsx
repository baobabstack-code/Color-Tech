"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-slate-300">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default AdminPage;
