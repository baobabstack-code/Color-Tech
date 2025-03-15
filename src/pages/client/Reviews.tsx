import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit2, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  getMyReviews, 
  createReview, 
  updateReview, 
  deleteReview,
  Review,
  CreateReviewData,
  UpdateReviewData
} from '@/services/reviewService';
import { getAllServices, Service } from '@/services/serviceService';

const ClientReviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchServices();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await getMyReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load your reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      toast({
        title: "Error",
        description: "Please select a service to review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const reviewData: CreateReviewData = {
      serviceId: selectedService,
      rating,
      comment,
    };
    
    try {
      const newReview = await createReview(reviewData);
      setReviews([...reviews, newReview]);
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Your review has been submitted",
      });
    } catch (error) {
      console.error('Error creating review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    
    setIsSubmitting(true);
    
    const reviewData: UpdateReviewData = {
      rating,
      comment,
    };
    
    try {
      const updatedReview = await updateReview(editingReview.id, reviewData);
      setReviews(reviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      ));
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Your review has been updated",
      });
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(id);
      setReviews(reviews.filter(review => review.id !== id));
      toast({
        title: "Success",
        description: "Your review has been deleted",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete your review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingReview(null);
    setSelectedService(null);
    setRating(5);
    setComment('');
  };

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < count ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={editingReview ? handleUpdateReview : handleCreateReview} className="space-y-4">
              {!editingReview && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Service</label>
                  <Select 
                    value={selectedService || ''} 
                    onValueChange={setSelectedService}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`h-6 w-6 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <Textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this service..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{review.serviceName || 'Service'}</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEditDialog(review)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center mt-2">
                {renderStars(review.rating)}
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(review.date || review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="mt-4 text-gray-700">{review.comment}</p>
              
              {review.status === 'pending' && (
                <div className="mt-2 text-sm text-amber-600">
                  Pending approval
                </div>
              )}
            </Card>
          ))}
          
          {reviews.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">You haven't written any reviews yet. Share your experience with our services!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientReviews; 