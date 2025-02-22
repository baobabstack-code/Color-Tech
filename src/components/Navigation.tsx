import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Services", path: "/services" },
    { title: "Gallery", path: "/gallery" },
    { title: "Blog", path: "/blog" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="relative px-4 py-2 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20 shadow-lg">
              <span className="text-xl font-bold bg-gradient-to-r from-[#F97316] via-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent animate-fade-in hover:scale-105 transition-transform duration-200">
                Color-tech
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="text-gray-600 hover:text-secondary transition-colors duration-200"
              >
                {link.title}
              </Link>
            ))}
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

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="block py-2 text-gray-600 hover:text-secondary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            {/* Search Bar */}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="bg-secondary text-white rounded-md px-3 py-1 mt-2 hover:bg-primary transition-colors duration-200 w-full">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
