"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Plus,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Star,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Flag,
  ThumbsUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import {
  getAllReviews,
  updateReview,
  deleteReview,
} from "@/services/reviewService";
import type { Review } from "@/services/reviewService";
import { useEffect } from "react";

// Extend Review to include display-specific properties
interface EnrichedReview extends Review {
  customerName: string; // Maps to user.name
  serviceName: string; // Maps to service.name
  source: "website" | "google" | "facebook" | "unknown"; // Placeholder for now
  helpful: number; // Placeholder for now
  response?: string; // Placeholder for now
}

export default function ReviewManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<EnrichedReview[]>([]);
  const [filterReviews, setFilterReviews] = useState<EnrichedReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Map<string, string>>(new Map()); // userId -> userName
  const [servicesMap, setServicesMap] = useState<Map<string, string>>(
    new Map()
  ); // serviceId -> serviceName

  const parseReviewData = (review: Review): EnrichedReview => {
    return {
      ...review,
      customerName: review.userName || "Unknown User",
      serviceName: review.serviceName || "Unknown Service",
      source: "website", // Placeholder
      helpful: 0, // Placeholder
      response: undefined, // Placeholder
    };
  };

  const fetchReviewsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const reviewsData = await getAllReviews();

      // Enrich reviews with customer and service names from the database relations
      const enrichedReviews = reviewsData.map((review) => ({
        ...review,
        customerName: review.user?.name || "Unknown Customer",
        serviceName: review.service?.name || "Unknown Service",
        source: "website" as const, // Placeholder
        helpful: Math.floor(Math.random() * 10), // Random helpful count for demo
        response: undefined, // Placeholder
      }));

      setReviews(enrichedReviews);
      setFilterReviews(enrichedReviews); // Initialize filtered reviews
    } catch (err: any) {
      console.error("Failed to fetch reviews data:", err);
      setError("Failed to load reviews. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReview = async (reviewId: number) => {
    try {
      await updateReview(reviewId, { status: "published" });
      await fetchReviewsData(); // Refresh data
      toast({
        title: "Success",
        description: "Review approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve review.",
        variant: "destructive",
      });
    }
  };

  const handleRejectReview = async (reviewId: number) => {
    try {
      await updateReview(reviewId, { status: "archived" });
      await fetchReviewsData(); // Refresh data
      toast({
        title: "Success",
        description: "Review rejected successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review.",
        variant: "destructive",
      });
    }
  };

  const handleFlagReview = async (reviewId: number) => {
    try {
      await updateReview(reviewId, { status: "flagged" });
      await fetchReviewsData(); // Refresh data
      toast({
        title: "Success",
        description: "Review flagged successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag review.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteReview(reviewId);
      await fetchReviewsData(); // Refresh data
      toast({
        title: "Success",
        description: "Review deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilterReviews(reviews);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = reviews.filter(
        (review) =>
          review.customerName.toLowerCase().includes(lowercasedSearch) ||
          review.comment.toLowerCase().includes(lowercasedSearch) ||
          review.serviceName.toLowerCase().includes(lowercasedSearch) ||
          review.status.toLowerCase().includes(lowercasedSearch)
      );
      setFilterReviews(filtered);
    }
  }, [searchTerm, reviews]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "pending":
        return "secondary";
      case "flagged":
        return "destructive";
      case "archived":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Review Management
        </h1>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Reviews</p>
              <h3 className="text-2xl font-bold text-white">
                {reviews.length}
              </h3>
            </div>
            <MessageSquare className="h-8 w-8 text-indigo-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Average Rating</p>
              <h3 className="text-2xl font-bold text-white">
                {reviews.length > 0
                  ? (
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </h3>
            </div>
            <Star className="h-8 w-8 text-yellow-400 fill-current" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pending</p>
              <h3 className="text-2xl font-bold text-white">
                {reviews.filter((review) => review.status === "pending").length}
              </h3>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Flagged</p>
              <h3 className="text-2xl font-bold text-white">
                {reviews.filter((review) => review.status === "flagged").length}
              </h3>
            </div>
            <Flag className="h-8 w-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <Button
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-400 mr-2" />
          <p className="text-slate-300">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12 text-red-400">
          <AlertCircle className="h-8 w-8 mr-2" />
          <p>{error}</p>
        </div>
      ) : filterReviews.length === 0 ? (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-12 text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No reviews found
          </h3>
          <p className="text-slate-400">
            {searchTerm
              ? "Try a different search term."
              : "Add your first review to get started."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filterReviews.map((review) => (
            <Card
              key={review.id}
              className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6 hover:bg-slate-800/70 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {review.customerName}
                      </h3>
                      <Badge
                        className={
                          review.status === "published"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : review.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : review.status === "flagged"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                        }
                      >
                        {review.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        {review.source}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                      <div>Service: {review.serviceName}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-400">
                      {review.helpful}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-slate-200">{review.comment}</p>
                  {review.response && (
                    <div className="mt-3 pl-4 border-l-2 border-indigo-500 bg-slate-900/30 p-3 rounded-r-lg">
                      <p className="text-sm text-slate-400 mb-1">Response:</p>
                      <p className="text-slate-200">{review.response}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  {review.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                        onClick={() => handleApproveReview(review.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        onClick={() => handleRejectReview(review.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                  {review.status !== "flagged" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => handleFlagReview(review.id)}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Flag
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
