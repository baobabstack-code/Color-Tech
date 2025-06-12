import Link from "next/link";
import { Heart } from "lucide-react";

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full py-4 px-6 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600">
          <span>© {currentYear} Color-Tech Panel & Paint. All rights reserved.</span>
        </div>
        
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <Link
            href="/admin/help"
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Help Center
          </Link>
          <Link
            href="/admin/documentation"
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Documentation
          </Link>
          <a 
            href="https://color-tech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Main Website
          </a>
        </div>

        <div className="flex items-center text-sm text-gray-600 mt-4 md:mt-0">
          <span>Made with</span>
          <Heart className="h-4 w-4 mx-1 text-red-500" />
          <span>by Color-Tech Team</span>
        </div>
      </div>
    </div>
  );
} 