import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Wrench, History, Star, Edit2, Trash2 } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  id: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      serviceName: 'Panel Beating Service',
      rating: 5,
      comment: 'Excellent service! The team did a fantastic job.',
      date: '2024-02-15',
    },
    {
      id: '2',
      serviceName: 'Spray Painting Service',
      rating: 4,
      comment: 'Great work on the color matching.',
      date: '2024-01-20',
    },
  ]);

  const firstName = user?.fullName.split(' ')[0];

  // Mock repair stages - this would come from your API
  const repairStages = [
    {
      id: 1,
      title: "Vehicle Check-in",
      description: "Initial inspection and documentation",
      status: "completed" as const,
      date: "2024-03-10"
    },
    {
      id: 2,
      title: "Damage Assessment",
      description: "Detailed evaluation and cost estimation",
      status: "completed" as const,
      date: "2024-03-11"
    },
    {
      id: 3,
      title: "Panel Beating",
      description: "Repair and restoration of damaged panels",
      status: "in-progress" as const,
      date: "2024-03-12"
    },
    {
      id: 4,
      title: "Spray Painting",
      description: "Color matching and painting",
      status: "pending" as const
    },
    {
      id: 5,
      title: "Quality Check",
      description: "Final inspection and detailing",
      status: "pending" as const
    }
  ];

  const currentStage = 3; // This would be dynamic based on actual repair progress

  const stats = [
    {
      icon: <Calendar className="w-8 h-8 text-secondary" />,
      title: "Next Appointment",
      value: "March 15, 2024"
    },
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "Estimated Completion",
      value: "March 20, 2024"
    },
    {
      icon: <Wrench className="w-8 h-8 text-secondary" />,
      title: "Current Service",
      value: "Panel Beating"
    },
    {
      icon: <History className="w-8 h-8 text-secondary" />,
      title: "Services Completed",
      value: "2/5"
    }
  ];

  const handleUpdateReview = (reviewId: string, newComment: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, comment: newComment }
          : review
      )
    );
    setEditingReview(null);
    toast({
      title: "Review updated",
      description: "Your review has been successfully updated.",
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    toast({
      title: "Review deleted",
      description: "Your review has been successfully deleted.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {firstName}! 🚗
        </h1>
        <p className="text-gray-600 mt-2">
          Track your vehicle services and appointments
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome Back, {user?.name}</h1>
        <Button variant="outline" onClick={() => window.location.href = '/client/bookings'}>
          Book New Service
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center space-x-4">
              {stat.icon}
              <div>
                <h3 className="font-semibold">{stat.title}</h3>
                <p className="text-sm text-gray-600">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <Card key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{review.serviceName}</h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setEditingReview(review)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Review</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Textarea
                          defaultValue={review.comment}
                          className="min-h-[100px]"
                          id={`edit-review-${review.id}`}
                        />
                        <Button
                          className="w-full"
                          onClick={() => {
                            const textarea = document.getElementById(`edit-review-${review.id}`) as HTMLTextAreaElement;
                            handleUpdateReview(review.id, textarea.value);
                          }}
                        >
                          Update Review
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Progress Tracker */}
        <ProgressTracker stages={repairStages} currentStage={currentStage} />

        {/* Current Service Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Service Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vehicle</h3>
              <p className="text-base">Toyota Camry (2020)</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Service Type</h3>
              <p className="text-base">Panel Beating & Spray Painting</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Technician</h3>
              <p className="text-base">David Wilson</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="text-base text-gray-600">
                Front bumper and right fender repair in progress. Color matching completed.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard; 