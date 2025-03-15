import { useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 h-16 shadow-sm">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo Container */}
          <Link to="/" className="flex items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-secondary/50 rounded-lg blur-sm group-hover:blur opacity-75 transition-all duration-300 group-hover:opacity-100"></div>
              <div className="relative px-4 py-2 bg-white rounded-lg border border-gray-100 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-2">
                  <Logo className="h-8 w-auto" />
                  <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-secondary bg-clip-text text-transparent">
                    Color Tech
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {publicLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="text-gray-600 hover:text-secondary transition-colors duration-200"
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10">
                        {userIcon}
                      </div>
                      {/* Notification indicator */}
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-white shadow-lg border-gray-200"
                    sideOffset={5}
                    alignOffset={5}
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                        <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Role-specific items */}
                    {getNavLinks().map((link) => (
                      <DropdownMenuItem key={link.path} asChild>
                        <Link 
                          to={link.path}
                          className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                          {link.icon && <span className="mr-2">{link.icon}</span>}
                          {link.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    
                    {/* Common items */}
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/notifications" 
                        className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                          3
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/settings" 
                        className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onSelect={(event) => {
                        event.preventDefault();
                        logout();
                      }}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border-gray-200">
                    <DropdownMenuItem asChild className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                      <Link to="/login" className="flex items-center px-4 py-2 text-sm text-gray-700">
                        {userIcon}
                        <span>Client Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                      <Link to="/admin/login" className="flex items-center px-4 py-2 text-sm text-gray-700">
                        {shieldIcon}
                        <span>Admin Login</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-md px-3 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button className="bg-secondary text-white rounded-md px-3 py-1 hover:bg-primary transition-colors duration-200">
              Search
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="text-gray-600 hover:text-secondary transition-colors duration-200 px-4 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-100 pt-4">
                    {getNavLinks().map((link) => (
                      <Link
                        key={link.title}
                        to={link.path}
                        className="block px-4 py-2 text-gray-600 hover:text-secondary"
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
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-100 pt-4 px-4 space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-gray-600 hover:text-secondary py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {userIcon}
                    <span>Client Portal</span>
                  </Link>
                  <Link
                    to="/admin/login"
                    className="flex items-center space-x-2 text-gray-600 hover:text-secondary py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {shieldIcon}
                    <span>Admin Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
