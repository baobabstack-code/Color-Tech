"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Bookings', href: '/admin/bookings' },
  { name: 'Content', href: '/admin/content' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Inventory', href: '/admin/inventory' },
  { name: 'Reviews', href: '/admin/reviews' },
  { name: 'Services', href: '/admin/services' },
  { name: 'Settings', href: '/admin/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold">Admin Panel</div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname ? pathname.startsWith(link.href) : false;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <button 
          onClick={logout} 
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
