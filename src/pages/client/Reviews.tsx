import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Star, ThumbsUp, Calendar } from 'lucide-react';
import ReviewForm from '@/components/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  userHasLiked?: boolean;
}

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userServices, setUserServices] = useState<{ id: string; name: string }[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Mock data - replace with API calls
  useEffect(() => {
    // Fetch user's completed services
    setUserServices([
      { id: '1', name: 'Panel Beating Service - Feb 2024' },
      { id: '2', name: 'Spray Painting Service - Jan 2024' },
    ]);

    // Fetch existing reviews
    setReviews([
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        serviceId: '1',
        serviceName: 'Panel Beating Service',
        rating: 5,
        comment: 'Excellent service! The team did a fantastic job.',
        date: '2024-02-15',
        likes: 3,
        userHasLiked: false,
      },
      // Add more mock reviews...
    ]);
  }, []);

  const handleSubmitReview = async (reviewData: {
    rating: number;
    comment: string;
    serviceId: string;
  }) => {
    // Mock API call - replace with actual API
    const newReview: Review = {
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: user?.name || '',
      serviceId: reviewData.serviceId,
      serviceName: userServices.find(s => s.id === reviewData.serviceId)?.name || '',
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
      likes: 0,
      userHasLiked: false,
    };

    setReviews(prev => [newReview, ...prev]);
  };

  const handleLikeReview = async (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? {
              ...review,
              likes: review.userHasLiked ? review.likes - 1 : review.likes + 1,
              userHasLiked: !review.userHasLiked,
            }
          : review
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reviews & Testimonials</h1>

      {/* Review Form Section */}
      {userServices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Select Service</h3>
              <div className="space-y-2">
                {userServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedService === service.id
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </Card>
            {selectedService && (
              <ReviewForm
                serviceId={selectedService}
                onSubmit={handleSubmitReview}
              />
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Reviews</h2>
        {reviews.map(review => (
          <Card key={review.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <span className="text-gray-400">•</span>
                  <div className="flex">
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
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{review.comment}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleLikeReview(review.id)}
                      className={`flex items-center space-x-1 ${
                        review.userHasLiked ? 'text-secondary' : ''
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {review.serviceName}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews; 