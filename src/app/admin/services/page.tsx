"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, Clock, Users, 
  CheckCircle, AlertCircle, Star,
  Loader2, Plus, Edit, BarChart2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllServices } from "@/services/serviceService";
import { getAllBookings } from "@/services/bookingService";
import { getAllReviews } from "@/services/reviewService";

// Local interface for display purposes
interface ServiceDisplay {
  id: string;
  name: string;
  description: string;
  duration: string;
  capacity: number;
  rating: number;
  status: 'active' | 'inactive';
  bookingCount: number;
}

export default function ServiceManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Fetch services, bookings, and reviews in parallel
      const [servicesData, bookingsData, reviewsData] = await Promise.all([
        getAllServices(),
        getAllBookings(),
        getAllReviews()
      ]);
      
      // Calculate booking counts per service
      const bookingCounts: Record<string, number> = {};
      bookingsData.forEach(booking => {
        if (booking.serviceId) {
          bookingCounts[booking.serviceId] = (bookingCounts[booking.serviceId] || 0) + 1;
        }
      });
      
      // Calculate average ratings per service
      const serviceRatings: Record<string, number> = {};
      const serviceReviewCounts: Record<string, number> = {};
      
      reviewsData.forEach(review => {
        if (review.serviceId && review.rating) {
          if (!serviceRatings[review.serviceId]) {
            serviceRatings[review.serviceId] = 0;
            serviceReviewCounts[review.serviceId] = 0;
          }
          serviceRatings[review.serviceId] += review.rating;
          serviceReviewCounts[review.serviceId]++;
        }
      });
      
      // Calculate average ratings
      const averageRatings: Record<string, number> = {};
      Object.keys(serviceRatings).forEach(serviceId => {
        averageRatings[serviceId] = serviceReviewCounts[serviceId] > 0
          ? parseFloat((serviceRatings[serviceId] / serviceReviewCounts[serviceId]).toFixed(1))
          : 0;
      });
      
      // Transform the data to match our display interface
      const formattedServices = servicesData.map(service => ({
        id: service.id.toString(), // Convert number ID to string
        name: service.name,
        description: service.description,
        duration: `${service.duration_minutes} minutes`,
        capacity: 4, // Default value, could be added to service model in future
        rating: averageRatings[service.id.toString()] || 0, // Use string ID, default to 0 if undefined
        status: (service.is_active ? 'active' : 'inactive') as 'active' | 'inactive', // Explicit cast
        bookingCount: bookingCounts[service.id.toString()] || 0 // Use string ID
      }));
      
      setServices(formattedServices);
    } catch (err) {
      console.error('Failed to fetch services data:', err);
      toast({
        title: "Error",
        description: "Failed to load services data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 max-h-screen overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchServices} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Refresh
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Service
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
            <Button variant="outline" onClick={fetchServices} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No services found</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <Card key={service.id} className="p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-1 max-w-2xl">{service.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Bookings: {service.bookingCount}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.round(service.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2">{service.rating > 0 ? service.rating : 'No ratings'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Bookings
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" />
                    Analytics
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}