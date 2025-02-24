import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  serviceId: string;
  onSubmit: (review: {
    rating: number;
    comment: string;
    serviceId: string;
  }) => Promise<void>;
}

const ReviewForm = ({ serviceId, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating required",
        description: "Please select a rating before submitting",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment, serviceId });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setRating(0);
      setComment('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoverRating(index)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(index)}
              >
                <Star
                  className={`w-6 h-6 ${
                    index <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with our service..."
            className="min-h-[100px]"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Review
        </Button>
      </form>
    </Card>
  );
};

export default ReviewForm; 