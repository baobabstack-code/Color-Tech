"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { 
  Users, Wrench, Calendar, TrendingUp, 
  AlertCircle, CheckCircle, Clock,
  DollarSign, Settings, Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceRequest {
  id: string;
  customerName: string;
  service: string;
  status: 'pending' | 'in-progress' | 'completed';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface DashboardStats {
  totalCustomers: number;
  activeBookings: number;
  revenue: number;
  pendingRequests: number;
  completedServices: number;
  averageRating: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.fullName.split(' ')[0];
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([
    {
      id: "SR001",
      customerName: "John Doe",
      service: "Panel Beating",
      status: "in-progress",
      date: "2024-03-15",
      priority: "high"
    },
    // Add more mock data
  ]);

  const stats: DashboardStats = {
    totalCustomers: 156,
    activeBookings: 24,
    revenue: 15679,
    pendingRequests: 12,
    completedServices: 89,
    averageRating: 4.8
  };

  return (
    <div className="ml-47 p-8 bg-gray-50 max-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your admin portal today
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <select className="border rounded-md p-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
              </div>
              <Calendar className="h-8 w-8 text-secondary" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-100 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Services</p>
                <h3 className="text-2xl font-bold">{stats.completedServices}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-100 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <h3 className="text-2xl font-bold">{stats.averageRating}</h3>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Activity Feed and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* Activity items */}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Add New Service
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                View Schedule
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;