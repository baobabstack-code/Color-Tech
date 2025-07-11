"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Clock, User, Car,
  CheckCircle, XCircle, AlertCircle, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllBookings, updateBooking, deleteBooking } from '@/services/bookingService';
import type { Booking } from '@/services/bookingService';
import { getAllUsers } from '@/services/userService'; // To get customer names
import { getAllServices } from '@/services/serviceService'; // To get service names
import { useEffect } from 'react';
// Extend Booking to include display-specific properties
interface EnrichedBooking extends Booking {
  customerName: string; // Maps to userName
  serviceName: string; // Maps to serviceName
}

export default function BookingManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Map<string, string>>(new Map()); // userId -> userName
  const [servicesMap, setServicesMap] = useState<Map<string, string>>(new Map()); // serviceId -> serviceName

  useEffect(() => {
    fetchBookingsData();
  }, []);

  const fetchBookingsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bookingsData, usersData, servicesData] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
        getAllServices(),
      ]);

      const usersMap = new Map<string, string>();
      usersData.forEach(user => usersMap.set(user.id, `${user.fullName}`));
      setUsersMap(usersMap);

      const servicesMap = new Map<string, string>();
      servicesData.forEach(service => servicesMap.set(service.id.toString(), service.name)); // Convert service.id to string
      setServicesMap(servicesMap);

      // Enrich bookings with customer and service names
      const enrichedBookings = bookingsData.map(booking => ({
        ...booking,
        customerName: usersMap.get(booking.userId) || 'Unknown Customer',
        serviceName: servicesMap.get(booking.serviceId) || 'Unknown Service',
      }));

      setBookings(enrichedBookings);
    } catch (err: any) {
      console.error("Failed to fetch bookings data:", err);
      setError("Failed to load bookings. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Bookings</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Today</p>
              <h3 className="text-2xl font-bold">6</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search bookings..."
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

      {/* Bookings Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
          <Button variant="outline" onClick={fetchBookingsData} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No bookings found</p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Booking
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.filter(booking =>
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.serviceName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.status.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold">{booking.customerName}</h3>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-medium">{booking.serviceName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle ID</p>
                      <p className="font-medium">{booking.vehicleId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium">
                        {new Date(booking.scheduledDate).toLocaleDateString()} {booking.scheduledTime}
                      </p>
                    </div>
                  </div>
                  {booking.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      Notes: {booking.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end items-center space-x-2">
                {booking.status === 'pending' && (
                  <>
                    <Button variant="outline" size="sm" className="text-green-500">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
