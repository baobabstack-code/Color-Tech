"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Star, Calendar, User,
  CheckCircle, XCircle, Flag, ThumbsUp,
  AlertCircle, RefreshCw
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { getAllReviews, updateReview, deleteReview } from '@/services/reviewService';
import type { Review } from '@/services/reviewService';
import { getAllUsers } from '@/services/userService'; // To get customer names
import { getAllServices } from '@/services/serviceService'; // To get service names
import { useEffect } from 'react';

// Extend Review to include display-specific properties
interface EnrichedReview extends Review {
  customerName: string; // Maps to userName
  serviceName: string; // Maps to serviceName
  source: 'website' | 'google' | 'facebook' | 'unknown'; // Placeholder for now
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
  const [servicesMap, setServicesMap] = useState<Map<string, string>>(new Map()); // serviceId -> serviceName

  const parseReviewData = (review: Review): EnrichedReview => {
    return {
      ...review,
      customerName: review.userName || 'Unknown User',
      serviceName: review.serviceName || 'Unknown Service',
      source: 'website', // Placeholder
      helpful: 0, // Placeholder
      response: undefined, // Placeholder
    };
  };

  const fetchReviewsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reviewsData, usersData, servicesData] = await Promise.all([
        getAllReviews(),
        getAllUsers(),
        getAllServices(),
      ]);

      const usersMap = new Map<string, string>();
      usersData.forEach(user => usersMap.set(user.id, `${user.fullName}`)); // Use fullName
      setUsersMap(usersMap);

      const servicesMap = new Map<string, string>();
      servicesData.forEach(service => servicesMap.set(service.id.toString(), service.name)); // Convert service.id to string
      setServicesMap(servicesMap);

      // Enrich reviews with customer and service names
      const enrichedReviews = reviewsData.map(review => ({
        ...review,
        customerName: usersMap.get(review.userId) || 'Unknown Customer',
        serviceName: servicesMap.get(review.serviceId) || 'Unknown Service',
        source: 'website', // Placeholder
        helpful: 0, // Placeholder
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

  useEffect(() => {
    fetchReviewsData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilterReviews(reviews);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = reviews.filter(review =>
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
      case 'published':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'flagged':
        return 'destructive';
      case 'archived':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Review Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <h3 className="text-2xl font-bold">156</h3>
            </div>
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold">4.8</h3>
            </div>
            <Star className="h-8 w-8 text-yellow-400 fill-current" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Flagged</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
            <Flag className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8 mr-2" />
          <p>{error}</p>
        </div>
      ) : filterReviews.length === 0 ? (
        <div className="flex justify-center items-center py-12 text-gray-500">
          <p>No reviews found. {searchTerm ? 'Try a different search term.' : 'Add your first review.'}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filterReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{review.customerName}</h3>
                      <Badge variant={getStatusBadgeVariant(review.status)}>
                        {review.status}
                      </Badge>
                      <Badge variant="outline">{review.source}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString()} {/* Use createdAt */}
                      </div>
                      <div>Service: {review.serviceName}</div> {/* Use serviceName */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{review.helpful}</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600">{review.comment}</p>
                  {review.response && (
                    <div className="mt-3 pl-4 border-l-2 border-primary">
                      <p className="text-sm text-gray-500">Response:</p>
                      <p className="text-gray-600">{review.response}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  {review.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" className="text-green-500">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
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