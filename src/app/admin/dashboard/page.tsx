"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session || !user || user.role !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Admin Dashboard, {user.name || user.email}!</h1>
      <p className="text-lg mb-8">This is your administrative dashboard.</p>
      <button 
        onClick={logout} 
        className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}