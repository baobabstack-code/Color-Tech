import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";

interface Appointment {
  id: string;
  time: string;
  customer: string;
  service: string;
  duration: string;
}

export default function StaffSchedule() {
  const [appointments] = useState<Appointment[]>([
    {
      id: "A001",
      time: "09:00 AM",
      customer: "John Doe",
      service: "Panel Beating",
      duration: "2 hours"
    },
    {
      id: "A002",
      time: "11:30 AM",
      customer: "Jane Smith",
      service: "Spray Painting",
      duration: "3 hours"
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Schedule</h1>

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Clock className="w-8 h-8 text-secondary" />
                <div>
                  <h3 className="font-semibold">{appointment.time}</h3>
                  <p className="text-sm text-gray-600">{appointment.service}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{appointment.customer}</span>
                  </div>
                  <span className="text-sm text-gray-500">Duration: {appointment.duration}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 