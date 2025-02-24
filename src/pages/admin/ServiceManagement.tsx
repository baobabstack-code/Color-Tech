import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, Clock, Users, 
  CheckCircle, AlertCircle, Star 
} from "lucide-react";

interface Service {
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
  const services: Service[] = [
    {
      id: "SV001",
      name: "Panel Beating",
      description: "Professional panel beating service for all vehicle types",
      duration: "2-3 hours",
      capacity: 4,
      rating: 4.7,
      status: 'active',
      bookingCount: 156
    },
    // Add more services
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Management</h1>
        <Button>Add New Service</Button>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id} className="p-6">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <Badge variant={service.status === 'active' ? 'success' : 'secondary'}>
                    {service.status}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-1">{service.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{service.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span>Capacity: {service.capacity}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{service.rating} Rating</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm">Edit Service</Button>
              <Button variant="outline" size="sm">View Bookings</Button>
              <Button variant="outline" size="sm">Service Analytics</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 