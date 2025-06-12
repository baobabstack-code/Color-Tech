"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Clock, User, Car,
  CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { useData } from '@/hooks/useData';
import { bookingService } from '@/services/bookingService';
import type { Booking } from '@/services/bookingService';

export default function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const bookings: Booking[] = [
    {
      id: "BK001",
      customerName: "John Smith",
      service: "Panel Beating",
      vehicleInfo: {
        make: "Toyota",
        model: "Camry",
        year: "2020",
        color: "Silver"
      },
      date: "2024-03-20",
      time: "09:00",
      status: 'confirmed',
      estimatedDuration: "3 hours",
      assignedStaff: "Mike Wilson"
    },
    {
      id: "BK002",
      customerName: "Sarah Johnson",
      service: "Spray Painting",
      vehicleInfo: {
        make: "BMW",
        model: "3 Series",
        year: "2022",
        color: "Blue"
      },
      date: "2024-03-21",
      time: "14:00",
      status: 'pending',
      notes: "Customer requested metallic finish",
      estimatedDuration: "4 hours"
    }
  ];

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
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold">{booking.customerName}</h3>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{booking.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {booking.vehicleInfo.make} {booking.vehicleInfo.model} ({booking.vehicleInfo.year})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {new Date(booking.date).toLocaleDateString()} {booking.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{booking.estimatedDuration}</p>
                  </div>
                </div>
                {booking.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    Notes: {booking.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {booking.assignedStaff && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {booking.assignedStaff}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}