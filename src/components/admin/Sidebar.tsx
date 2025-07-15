"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  FileEdit,
  Users,
  Package,
  Star,
  Wrench,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  MessageSquare,
} from "lucide-react";
import Logo from "../Logo";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Form Submissions",
    href: "/admin/form-submissions",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: <FileEdit className="h-5 w-5" />,
    children: [
      {
        name: "Blog Posts",
        href: "/admin/content/blog",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        name: "Gallery",
        href: "/admin/content/gallery",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        name: "Testimonials",
        href: "/admin/content/testimonials",
        icon: <Star className="h-4 w-4" />,
      },
      {
        name: "FAQs",
        href: "/admin/content/faqs",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: <Star className="h-5 w-5" />,
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: <Package className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Content"]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    return (
      pathname === href ||
      (href !== "/admin/dashboard" && pathname?.startsWith(href))
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const active = isActive(item.href);

    return (
      <div key={item.name}>
        <div className="flex items-center">
          <Link
            href={item.href}
            className={`flex items-center flex-1 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
              active
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            } ${level > 0 ? "ml-6 pl-6" : ""}`}
          >
            <span
              className={`mr-3 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}
            >
              {item.icon}
            </span>
            <span className="flex-1">{item.name}</span>
          </Link>

          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.name)}
              className={`p-1.5 rounded-md transition-colors ${
                active ? "text-white" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-50 w-64 h-full bg-gray-800 border-r border-gray-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Logo className="h-8 w-auto" />
          <div>
            <h1 className="text-lg font-bold text-white">Color-Tech</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-700">
        <Link
          href="/"
          target="_blank"
          className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Home className="h-4 w-4 mr-3" />
          <span>View Website</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          <p>Color-Tech Admin v1.0</p>
          <p className="mt-1">© 2024 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
