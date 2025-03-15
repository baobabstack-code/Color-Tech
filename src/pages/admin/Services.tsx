import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Edit, Trash2, CheckCircle, 
  Clock, AlertCircle, Loader2
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService,
  Service,
  CreateServiceData,
  UpdateServiceData
} from '@/services/serviceService';

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const serviceData: CreateServiceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      basePrice: Number(formData.get('basePrice')),
      durationMinutes: Number(formData.get('durationMinutes')),
      category: formData.get('category') as string,
    };
    
    try {
      const newService = await createService(serviceData);
      setServices([...services, newService]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Service created successfully",
      });
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingService) return;
    
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const serviceData: UpdateServiceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      basePrice: Number(formData.get('basePrice')),
      durationMinutes: Number(formData.get('durationMinutes')),
      category: formData.get('category') as string,
      status: formData.get('status') as 'active' | 'inactive',
    };
    
    try {
      const updatedService = await updateService(editingService.id, serviceData);
      setServices(services.map(service => 
        service.id === updatedService.id ? updatedService : service
      ));
      setIsDialogOpen(false);
      setEditingService(null);
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await deleteService(id);
      setServices(services.filter(service => service.id !== id));
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service. It may be in use by existing bookings.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingService(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={editingService ? handleUpdateService : handleAddService} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={editingService?.name || ''} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={editingService?.description || ''} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="basePrice">Base Price ($)</Label>
                    <Input 
                      id="basePrice" 
                      name="basePrice" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      defaultValue={editingService?.basePrice || ''} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                    <Input 
                      id="durationMinutes" 
                      name="durationMinutes" 
                      type="number" 
                      min="0" 
                      defaultValue={editingService?.durationMinutes || ''} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    name="category" 
                    defaultValue={editingService?.category || ''} 
                    required 
                  />
                </div>
                
                {editingService && (
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={editingService.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingService(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingService ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{service.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEditDialog(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-600 line-clamp-3">{service.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4 text-gray-500" />
                  <span>{service.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-semibold">${service.basePrice}</span>
                </div>
                <div className="flex items-center text-sm ml-auto">
                  {service.status === 'active' ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      <AlertCircle className="mr-1 h-4 w-4" /> Inactive
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          {services.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No services found. Add your first service to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminServices; 