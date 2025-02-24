import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wrench, Clock, DollarSign, 
  AlertCircle, CheckCircle 
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: 'active' | 'inactive';
}

export default function StaffServices() {
  const services: Service[] = [
    {
      id: "S001",
      name: "Panel Beating",
      description: "Professional panel beating service for all vehicle types",
      price: 150,
      duration: "2-3 hours",
      status: 'active'
    },
    {
      id: "S002",
      name: "Spray Painting",
      description: "High-quality spray painting with color matching",
      price: 200,
      duration: "3-4 hours",
      status: 'active'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Services</h1>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <Wrench className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold">{service.name}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">{service.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {service.price}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                `}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 