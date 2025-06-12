"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Car } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

const ClientBookings = () => {
  const router = useRouter(); // Initialize useRouter

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Car className="w-8 h-8 text-secondary" />
              <div>
                <h3 className="font-semibold">Panel Beating Service</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>March 15, 2024</span>
                  <Clock className="w-4 h-4" />
                  <span>10:00 AM</span>
                </div>
              </div>
            </div>
            <Button variant="outline">View Details</Button>
          </div>
        </Card>
      </div>

      <Button className="mt-6" onClick={() => router.push('/booking')}>Book New Service</Button>
    </div>
  );
};

export default ClientBookings;