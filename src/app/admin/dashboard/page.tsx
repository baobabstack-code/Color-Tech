"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getAllReviews } from "@/services/reviewService";
import type { Review } from "@/services/reviewService";
import { Star, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";

// Define types for our data
interface Booking {
  id: string;
  customer: { name: string };
  service: { name: string };
  startTime: string;
  status: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentBookings: Booking[];
}

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-slate-800/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
    <div className="flex items-center">
      <div className="mr-3 sm:mr-4 text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <div>
        <h3 className="text-slate-300 text-xs sm:text-sm font-medium">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const RecentBookingsTable = ({ bookings }: { bookings: Booking[] }) => (
  <div className="bg-slate-800/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700/50">
    <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Recent Bookings</h2>
    
    {/* Desktop Table View */}
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-900/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
              Service
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-slate-800/30 divide-y divide-slate-700">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {booking.customer?.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                {booking.service?.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                {new Date(booking.startTime).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.status === "completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : booking.status === "confirmed"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-3">
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No recent bookings</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/30">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-white text-sm">{booking.customer?.name || "N/A"}</h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  booking.status === "completed"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : booking.status === "confirmed"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-slate-200 text-sm mb-1">{booking.service?.name || "N/A"}</p>
            <p className="text-slate-400 text-xs">{new Date(booking.startTime).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

const RecentReviewsTable = ({ reviews }: { reviews: Review[] }) => (
  <div className="bg-slate-800/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700/50">
    <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Recent Reviews</h2>
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No recent reviews</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/30 hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating
                        ? "text-yellow-400 fill-current"
                        : "text-slate-600"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-300">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${review.status === "published"
                  ? "bg-green-500/20 text-green-400"
                  : review.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : review.status === "flagged"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-slate-500/20 text-slate-400"
                  }`}
              >
                {review.status}
              </span>
            </div>
            <p className="text-slate-200 text-sm line-clamp-2 mb-2">
              {review.comment}
            </p>
            <div className="text-xs text-slate-400">
              Service ID: {review.serviceId} • User ID: {review.userId}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, reviewsData] = await Promise.all([
          fetch("/api/dashboard"),
          getAllReviews(),
        ]);

        if (!dashboardResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data: DashboardData = await dashboardResponse.json();
        setDashboardData(data);
        setReviews(reviewsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // For now, bypass authentication for testing
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        No data available.
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Calculate review statistics
  const reviewStats = {
    total: reviews.length,
    averageRating:
      reviews.length > 0
        ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
        : "0.0",
    pending: reviews.filter((review) => review.status === "pending").length,
    flagged: reviews.filter((review) => review.status === "flagged").length,
  };

  // Get recent reviews (last 5)
  const recentReviews = reviews
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="text-sm text-slate-300">Welcome back, Admin</div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <StatCard
          title="Total Bookings"
          value={dashboardData.stats.totalBookings}
          icon={<span>📅</span>}
        />
        <StatCard
          title="Total Customers"
          value={dashboardData.stats.totalCustomers}
          icon={<span>👥</span>}
        />
      </div>

      {/* Reviews Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Reviews"
          value={reviewStats.total}
          icon={<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />}
        />
        <StatCard
          title="Average Rating"
          value={reviewStats.averageRating}
          icon={<Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 fill-current" />}
        />
        <StatCard
          title="Pending Reviews"
          value={reviewStats.pending}
          icon={<AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />}
        />
        <StatCard
          title="Flagged Reviews"
          value={reviewStats.flagged}
          icon={<AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />}
        />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        <RecentBookingsTable bookings={dashboardData.recentBookings} />
        <RecentReviewsTable reviews={recentReviews} />
      </div>
    </div>
  );
}
