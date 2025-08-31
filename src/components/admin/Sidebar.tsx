"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  FileEdit,
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
        name: "Homepage Sections",
        href: "/admin/content/homepage",
        icon: <Home className="h-4 w-4" />,
      },
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
            className={`flex items-center flex-1 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${active
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                : "text-slate-100 hover:text-white hover:bg-slate-800/50"
              } ${level > 0 ? "ml-6 pl-6" : ""}`}
          >
            <span
              className={`mr-3 transition-colors ${active ? "text-white" : "text-slate-200 group-hover:text-white"}`}
            >
              {item.icon}
            </span>
            <span className="flex-1">{item.name}</span>
            {active && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75" />
            )}
          </Link>

          {hasChildren && (
            <button
              type="button"
              onClick={() => toggleExpanded(item.name)}
              className={`p-1.5 rounded-md transition-colors ${active ? "text-white" : "text-slate-200 hover:text-white"
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
    <aside className="fixed left-0 top-0 z-50 w-64 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Logo className="h-6 w-auto text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Color-Tech
            </h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-800/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center w-full px-3 py-2.5 text-sm text-slate-100 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200 group"
        >
          <Home className="h-4 w-4 mr-3 text-slate-200 group-hover:text-indigo-400 transition-colors" />
          <span>View Website</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="text-xs text-slate-500 text-center">
          <p className="font-medium">Color-Tech Admin v1.0</p>
          <p className="mt-1 text-slate-600">© 2024 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
