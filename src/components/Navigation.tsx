"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Users, 
  FileText,
  Image,
  MessageSquare,
  HelpCircle,
  Package,
  Star,
  Settings,
  Menu,
  X,
  ChevronDown,
  UserCircle,
  Bell,
  LogOut,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: NavLink[];
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const publicLinks: NavLink[] = [
    { title: "Home", path: "/" },
    { title: "Services", path: "/services" },
    { title: "Gallery", path: "/gallery" },
    { title: "Blog", path: "/blog" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];

  const clientLinks: NavLink[] = [
    { title: "Dashboard", path: "/client/dashboard" },
    { title: "My Bookings", path: "/client/bookings" },
    { title: "Service History", path: "/client/history" },
    { title: "Reviews", path: "/client/reviews" },
    { title: "Profile", path: "/client/profile" },
  ];

  const adminLinks: NavLink[] = [
    { 
      title: "Dashboard", 
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    { 
      title: "Services", 
      path: "/admin/services",
      icon: <Wrench className="h-4 w-4" />
    },
    { 
      title: "Bookings", 
      path: "/admin/bookings",
      icon: <Calendar className="h-4 w-4" />
    },
    { 
      title: "Customers", 
      path: "/admin/customers",
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Content",
      path: "/admin/content",
      icon: <FileText className="h-4 w-4" />,
      submenu: [
        { 
          title: "Blog Posts", 
          path: "/admin/content/blog",
          icon: <FileText className="h-4 w-4" />
        },
        { 
          title: "Gallery", 
          path: "/admin/content/gallery",
          icon: <Image className="h-4 w-4" />
        },
        { 
          title: "Testimonials", 
          path: "/admin/content/testimonials",
          icon: <MessageSquare className="h-4 w-4" />
        },
        { 
          title: "FAQs", 
          path: "/admin/content/faqs",
          icon: <HelpCircle className="h-4 w-4" />
        }
      ]
    },
    { 
      title: "Inventory", 
      path: "/admin/inventory",
      icon: <Package className="h-4 w-4" />
    },
    { 
      title: "Reviews", 
      path: "/admin/reviews",
      icon: <Star className="h-4 w-4" />
    },
    { 
      title: "Staff", 
      path: "/admin/staff",
      icon: <Users className="h-4 w-4" />
    },
    { 
      title: "Settings", 
      path: "/admin/settings",
      icon: <Settings className="h-4 w-4" />
    }
  ];

  const getNavLinks = () => {
    switch (user?.role) {
      case 'admin':
        return adminLinks;
      case 'client':
        return clientLinks;
      default:
        return [];
    }
  };

  const userIcon = <UserCircle className="h-5 w-5 text-primary" />;
  const shieldIcon = <ShieldCheck className="h-4 w-4 text-primary" />;

  // Enhanced glassmorphism nav bar styles
  return (
    <nav
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[97vw] max-w-6xl rounded-3xl shadow-2xl border border-white/30 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-200 transition-all duration-300 flex items-center px-4 sm:px-10 py-4 gap-4 sm:gap-8 ring-1 ring-white/40 ring-inset hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
      style={{
        boxShadow:
          '0 8px 32px 0 rgba(31,38,135,0.37), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
        border: '1.5px solid rgba(255,255,255,0.22)',
        backdropFilter: 'blur(22px) saturate(200%)',
      }}
    >
      {/* Logo with vibrant gradient and subtle border */}
      <div className="flex items-center gap-3 select-none bg-white/60 dark:bg-slate-800/60 rounded-2xl px-3 py-1 shadow-md border border-white/30">
        <img src="/images/hero/colorful-car.jpg" alt="Color-Tech Logo" className="h-10 w-10 drop-shadow-lg rounded-xl" />
        <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-x tracking-tight drop-shadow-md">
          ColorTech Panel Beaters
        </span>
      </div>

      {/* Nav links with animated underline and modern spacing */}
      <div className="flex-1 flex justify-center gap-10">
        {publicLinks.map((link) => (
          <Link
            key={link.title}
            href={link.path}
            className="relative px-3 py-1.5 text-lg font-semibold text-slate-800/90 dark:text-slate-100/90 hover:text-sky-500 dark:hover:text-fuchsia-400 transition-colors duration-200 group"
          >
            {link.title}
            <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-fuchsia-400 rounded-full transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10"></span>
          </Link>
        ))}
      </div>

      {/* Search bar and login button with modern style */}
      <div className="flex items-center gap-3 ml-auto pr-2">
        <Button
          asChild
          variant="ghost"
          className="px-6 py-2 rounded-full text-slate-800/90 dark:text-slate-100/90 font-semibold hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>

      {/* Mobile menu button (hamburger) */}
      <button
        className="ml-4 flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200 shadow-md border border-white/30"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-7 w-7 text-gray-700 dark:text-gray-200" />
        ) : (
          <Menu className="h-7 w-7 text-gray-700 dark:text-gray-200" />
        )}
      </button>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'} overflow-hidden bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-xl border border-white/30 absolute left-1/2 -translate-x-1/2 top-20 w-[90vw] max-w-md z-40`}> 
        <div className="flex flex-col gap-3 px-4">
          {publicLinks.map((link) => (
            <Link
              key={link.title}
              href={link.path}
              className="px-4 py-3 rounded-full text-gray-700 dark:text-gray-200 font-medium hover:bg-primary/10 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              onClick={() => setIsOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              {getNavLinks().map((link) => (
                <Link
                  key={link.title}
                  href={link.path}
                  className="block px-4 py-3 rounded-full text-gray-700 dark:text-gray-200 font-medium hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-full text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="border-t border-gray-200 dark:border-gray-700 my-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-3 rounded-full text-gray-700 dark:text-gray-200 font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {userIcon}
                <span>Client Portal</span>
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-2 px-4 py-3 rounded-full text-gray-700 dark:text-gray-200 font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {shieldIcon}
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
