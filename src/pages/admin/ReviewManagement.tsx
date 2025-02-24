import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Star, Calendar, User,
  CheckCircle, XCircle, Flag, ThumbsUp,
  AlertCircle
} from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  status: 'published' | 'pending' | 'flagged' | 'archived';
  helpful: number;
  response?: string;
  source: 'website' | 'google' | 'facebook';
}

export default function ReviewManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const reviews: Review[] = [
    {
      id: "RV001",
      customerName: "John Smith",
      rating: 5,
      comment: "Excellent service! The team did an amazing job with my car's paint job. Very professional and attention to detail.",
      service: "Spray Painting",
      date: "2024-03-15",
      status: 'published',
      helpful: 12,
      source: 'website'
    },
    {
      id: "RV002",
      customerName: "Sarah Johnson",
      rating: 4,
      comment: "Good work on the panel beating. Quick turnaround time and reasonable prices.",
      service: "Panel Beating",
      date: "2024-03-14",
      status: 'pending',
      helpful: 5,
      source: 'google'
    },
    {
      id: "RV003",
      customerName: "Mike Wilson",
      rating: 2,
      comment: "Service was delayed by two days.",
      service: "Dent Removal",
      date: "2024-03-13",
      status: 'flagged',
      helpful: 1,
      response: "We apologize for the delay. We've implemented new scheduling measures to prevent this in the future.",
      source: 'facebook'
    }
  ];

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
      <div className="grid gap-6">
        {reviews.map((review) => (
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
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                    <div>Service: {review.service}</div>
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
    </div>
  );
} 