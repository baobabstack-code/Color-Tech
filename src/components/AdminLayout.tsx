import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { 
      title: "Dashboard", 
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    { 
      title: "Services", 
      path: "/admin/services",
      icon: <Wrench className="h-5 w-5" />
    },
    { 
      title: "Bookings", 
      path: "/admin/bookings",
      icon: <Calendar className="h-5 w-5" />
    },
    { 
      title: "Customers", 
      path: "/admin/customers",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Content",
      path: "/admin/content",
      icon: <FileText className="h-5 w-5" />,
      submenu: [
        { title: "Blog", path: "/admin/content/blog", icon: <FileText className="h-5 w-5" /> },
        { title: "Gallery", path: "/admin/content/gallery", icon: <Image className="h-5 w-5" /> },
        { title: "Testimonials", path: "/admin/content/testimonials", icon: <MessageSquare className="h-5 w-5" /> },
        { title: "FAQs", path: "/admin/content/faqs", icon: <HelpCircle className="h-5 w-5" /> }
      ]
    },
    { 
      title: "Inventory", 
      path: "/admin/inventory",
      icon: <Package className="h-5 w-5" />
    },
    { 
      title: "Reviews", 
      path: "/admin/reviews",
      icon: <Star className="h-5 w-5" />
    },
    { 
      title: "Settings", 
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-200 w-64`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-primary">Admin Portal</h1>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.path}>
              {item.submenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" side="right">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild>
                        <Link 
                          to={subItem.path}
                          className="flex items-center"
                        >
                          {subItem.icon}
                          <span className="ml-2">{subItem.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-margin ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </main>

      {/* Mobile menu button */}
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
    </div>
  );
} 