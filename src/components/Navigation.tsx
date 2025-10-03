"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Calendar,
  Users,
  FileText,
  Image,
  MessageSquare,
  HelpCircle,
  Settings,
  Menu,
  X,
  Home,
  Mail,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavLink {
  title: string;
  path: string;
  icon?: React.ReactElement;
  submenu?: NavLink[];
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();

  const publicLinks: NavLink[] = [
    {
      title: "Home",
      path: "/",
      icon: <Home className="h-4 w-4 text-current" strokeWidth={2.5} />,
    },
    {
      title: "Services",
      path: "/services",
      icon: <Wrench className="h-4 w-4 text-current" strokeWidth={2.5} />,
    },
    {
      title: "Gallery",
      path: "/gallery",
      icon: <Image className="h-4 w-4 text-current" strokeWidth={2.5} />,
    },
    {
      title: "Blog",
      path: "/blog",
      icon: <FileText className="h-4 w-4 text-current" strokeWidth={2.5} />,
    },
    {
      title: "About",
      path: "/about",
      icon: <Info className="h-4 w-4 text-current" strokeWidth={2.5} />,
    },
    {
      title: "Contact",
      path: "/contact",
      icon: <Mail className="h-4 w-4 text-current" strokeWidth={2.5} />,
    },
  ];

  const clientLinks: NavLink[] = [
    { title: "My Bookings", path: "/client/bookings" },
    { title: "Service History", path: "/client/history" },
    { title: "Reviews", path: "/client/reviews" },
    { title: "Profile", path: "/client/profile" },
  ];

  const adminLinks: NavLink[] = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Manage Services",
      path: "/admin/services",
      icon: <Wrench className="h-4 w-4" />,
    },
    {
      title: "Bookings",
      path: "/admin/bookings",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Customers",
      path: "/admin/customers",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Content",
      path: "/admin/content",
      icon: <FileText className="h-4 w-4" />,
      submenu: [
        {
          title: "Blog Posts",
          path: "/admin/content/blog",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Gallery",
          path: "/admin/content/gallery",
          icon: <Image className="h-4 w-4" />,
        },
        {
          title: "Testimonials",
          path: "/admin/content/testimonials",
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          title: "FAQs",
          path: "/admin/content/faqs",
          icon: <HelpCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const getNavLinks = () => {
    switch (user?.role) {
      case "admin":
        return adminLinks;
      case "client":
        return clientLinks;
      default:
        return [];
    }
  };

  return (
    <nav
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[97vw] max-w-6xl rounded-3xl shadow-2xl border border-white/30 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-200 transition-all duration-300 flex items-center px-4 py-4 gap-4 ring-1 ring-white/40 ring-inset hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] sm:px-6 md:px-10 md:gap-8"
      style={{
        boxShadow:
          "0 8px 32px 0 rgba(31,38,135,0.37), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
        border: "1.5px solid rgba(255,255,255,0.22)",
        backdropFilter: "blur(22px) saturate(200%)",
      }}
    >
      {/* Logo with vibrant gradient and subtle border */}
      <div className="flex items-center gap-2 sm:gap-3 select-none bg-white/60 dark:bg-slate-800/60 rounded-2xl px-2 py-1 sm:px-3 shadow-md border border-white/30">
        <img
          src={(typeof window !== 'undefined' && (window as any).__APP_LOGO_URL__) || '/images/hero/colorful-car.jpg'}
          alt="Color-Tech Logo"
          className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-lg rounded-xl"
        />
        <span className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-x tracking-tight drop-shadow-md">
          ColorTech Panel Beaters
        </span>
      </div>

      {/* Nav links with animated underline and modern spacing */}
      <div className="hidden md:flex flex-1 justify-center gap-6 lg:gap-10">
        {publicLinks.map((link) => (
          <Link
            key={link.title}
            href={link.path}
            className={`relative px-2 py-1.5 text-base lg:text-lg font-semibold transition-colors duration-200 group ${pathname === link.path
              ? "text-sky-500 dark:text-fuchsia-400"
              : "text-slate-800/90 dark:text-slate-100/90 hover:text-sky-500 dark:hover:text-fuchsia-400"
              }`}
          >
            {link.title}
            <span
              className={`absolute left-1/2 -bottom-1 h-0.5 bg-gradient-to-r from-sky-400 to-fuchsia-400 rounded-full transition-all duration-300 ${pathname === link.path
                ? "w-4/5 -translate-x-1/2"
                : "w-0 group-hover:w-4/5 group-hover:-translate-x-1/2"
                }`}
            ></span>
          </Link>
        ))}
      </div>

      {/* Reserved space for future features */}
      <div className="hidden md:flex items-center gap-3 ml-auto pr-2">
        {/* Login removed - admin access via direct URL */}
      </div>

      {/* Mobile menu button (hamburger) */}
      <button
        type="button"
        className="ml-auto flex md:hidden items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200 shadow-md border border-white/30"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 sm:h-7 sm:w-7 text-gray-700 dark:text-gray-200" />
        ) : (
          <Menu className="h-6 w-6 sm:h-7 sm:w-7 text-gray-700 dark:text-gray-200" />
        )}
      </button>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"} overflow-hidden bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-xl border border-white/30 absolute left-1/2 -translate-x-1/2 top-20 w-[90vw] max-w-md z-40`}
      >
        <div className="flex flex-col gap-3 px-4">
          {publicLinks.map((link) => (
            <Link
              key={link.title}
              href={link.path}
              className={`flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${pathname === link.path
                ? "bg-primary/10 text-primary"
                : "text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary"
                }`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              {getNavLinks().map((link) => (
                <Link
                  key={link.title}
                  href={link.path}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-colors duration-200 ${pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  {link.title}
                </Link>
              ))}
              <button
                type="button"
                onClick={async () => {
                  try {
                    await signOut();
                    setIsOpen(false);
                  } catch (error) {
                    console.error("Logout failed:", error);
                    setIsOpen(false);
                  }
                }}
                className="block w-full text-left px-4 py-3 rounded-full text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
