"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Loader2 } from "lucide-react";
import { getBookingHistory, Booking } from '@/services/bookingService';
import { useToast } from "@/hooks/use-toast";

const ServiceHistory = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getBookingHistory();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast({
        title: "Error",
        description: "Failed to load your service history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Service History</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">{booking.serviceName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Completed on {formatDate(booking.scheduledDate || booking.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-medium ${booking.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">You don't have any service history yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;