import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Edit, Trash2, CheckCircle, 
  Clock, AlertCircle 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: 'active' | 'inactive';
}

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Panel Beating",
      description: "Complete panel repair service",
      price: 150,
      duration: "3-5 days",
      status: "active"
    },
    // Add more services...
  ]);

  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleAddService = (formData: FormData) => {
    const newService: Service = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: formData.get('duration') as string,
      status: 'active'
    };

    setServices(prev => [...prev, newService]);
    toast({
      title: "Service added",
      description: "New service has been successfully added.",
    });
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    toast({
      title: "Service deleted",
      description: "Service has been successfully removed.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <form action={handleAddService} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" name="duration" required />
              </div>
              <Button type="submit" className="w-full">
                Add Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">
                    Price: ${service.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Duration: {service.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingService(service)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminServices; 