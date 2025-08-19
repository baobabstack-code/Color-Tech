"use client";

import React from "react";
import { Bell, Search, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const AdminHeader = () => {
  const { logout, user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl">
      <div className="flex items-center justify-between px-6 py-3 h-16">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search admin..."
              className="pl-10 pr-4 py-2 w-80 bg-slate-800/50 border-slate-700 text-white placeholder-slate-300 focus:bg-slate-800 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-slate-100 hover:text-white hover:bg-slate-800/50"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-slate-800 border-slate-700 text-white"
            >
              <DropdownMenuLabel className="text-slate-200">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="flex flex-col items-start p-3 text-slate-200 hover:bg-slate-700">
                <div className="font-medium text-white">
                  New form submission
                </div>
                <div className="text-sm text-slate-400">
                  John Smith submitted a contact form
                </div>
                <div className="text-xs text-slate-500 mt-1">2 minutes ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3 text-slate-200 hover:bg-slate-700">
                {/* <div className="font-medium text-white">
                  New booking request
                </div>
                <div className="text-sm text-slate-400">
                  Sarah Johnson requested oil change service
                </div>
                <div className="text-xs text-slate-500 mt-1">1 hour ago</div> */}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3 text-slate-200 hover:bg-slate-700">
                <div className="font-medium text-white">Service completed</div>
                <div className="text-sm text-slate-400">
                  Brake inspection for Mike Wilson completed
                </div>
                <div className="text-xs text-slate-500 mt-1">3 hours ago</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 text-slate-100 hover:text-white hover:bg-slate-800/50"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-white">
                    {user?.name || "Admin User"}
                  </div>
                  <div className="text-xs text-slate-300">Administrator</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-slate-800 border-slate-700 text-white"
            >
              <DropdownMenuLabel className="text-slate-200">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-slate-200 hover:bg-slate-700">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-200 hover:bg-slate-700">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={async () => {
                  console.log("Logout button clicked");
                  try {
                    await logout();
                    console.log("Logout completed");
                  } catch (error) {
                    console.error("Logout failed:", error);
                  }
                }}
                className="text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
