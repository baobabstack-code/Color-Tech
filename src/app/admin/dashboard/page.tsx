"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { 
  Users, Wrench, Calendar, TrendingUp, 
  AlertCircle, CheckCircle, Clock,
  DollarSign, Settings, Star, Loader2,
  CheckSquare, XCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllBookings, Booking } from '@/services/bookingService';
import { getAllUsers } from '@/services/userService';
import { getAllServices } from '@/services/serviceService';
import { getAllReviews } from '@/services/reviewService';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const firstName = user?.fullName?.split(' ')[0] || 'Admin';
  const [isLoading, setIsLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeBookings: 0,
    revenue: 0,
    pendingRequests: 0,
    completedServices: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper functions for status display
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'scheduled': return 'bg-blue-100 text-blue-600';
      case 'confirmed': return 'bg-purple-100 text-purple-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'in_progress': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckSquare className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all required data in parallel
      const [bookings, users, services, reviews] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
        getAllServices(),
        getAllReviews()
      ]);

      // Calculate dashboard statistics
      const activeBookingsCount = bookings.filter(b => 
        b.status === 'pending' || b.status === 'confirmed' || b.status === 'in_progress'
      ).length;
      
      const completedServicesCount = bookings.filter(b => b.status === 'completed').length;
      
      const pendingRequestsCount = bookings.filter(b => b.status === 'pending').length;
      
      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
      
      // Calculate estimated revenue (this would typically come from a real revenue endpoint)
      const estimatedRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, booking) => {
          // Find the service price if available
          const service = services.find(s => s.id === booking.serviceId);
          return sum + (service?.basePrice || 0);
        }, 0);

      setStats({
        totalCustomers: users.length,
        activeBookings: activeBookingsCount,
        revenue: estimatedRevenue,
        pendingRequests: pendingRequestsCount,
        completedServices: completedServicesCount,
        averageRating: parseFloat(avgRating.toString())
      });

      // Set recent bookings (last 5)
      const sortedBookings = [...bookings].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentBookings(sortedBookings.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-47 p-8 bg-gray-50 max-h-screen overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your admin portal today
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <select className="border rounded-md p-2">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <button 
                onClick={fetchDashboardData}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
              >
                <TrendingUp className="h-4 w-4" />
                Refresh Data
              </button>
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
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
              </Card>
            </div>

            {/* Activity Feed and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-2 p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                {recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                          </div>
                          <div>
                            <h3 className="font-medium">{booking.serviceName || 'Service Booking'}</h3>
                            <p className="text-sm text-gray-500">{booking.clientName || 'Client'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(booking.scheduledDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">{booking.scheduledTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No recent bookings found</p>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button 
                    onClick={() => window.location.href = '/admin/services'}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Wrench className="w-4 h-4" />
                    Manage Services
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/bookings'}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    View Bookings
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/users'}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Manage Users
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/settings'}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    System Settings
                  </button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;