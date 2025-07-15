"use client";

import { useState, useEffect, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Wrench, Clock, Users, Star, Loader2, Plus, Edit, Trash2, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Matches the data structure from our new API endpoint
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  bookingCount: number;
  averageRating: number;
}

const ServiceForm = ({ service, onSave, onCancel }: { service?: Service | null, onSave: (service: any) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    basePrice: service?.price || 0,
    durationMinutes: service?.duration || 30,
    category: service?.category || 'General',
    status: service?.isActive ? 'active' : 'inactive',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Service Name</Label>
        <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" step="0.01" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })} required />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input id="duration" type="number" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })} required />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="isActive" checked={formData.status === 'active'} onCheckedChange={checked => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })} />
        <Label htmlFor="isActive">Service is Active</Label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Service</Button>
      </DialogFooter>
    </form>
  );
};

export default function ServiceManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services/with-stats');
      if (!response.ok) throw new Error('Failed to fetch services.');
      const data = await response.json();
      setServices(data);
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (serviceData: Omit<Service, 'id' | 'bookingCount' | 'averageRating'>) => {
    const method = selectedService ? 'PUT' : 'POST';
    const url = selectedService ? `/api/services/${selectedService.id}` : '/api/services';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) throw new Error(`Failed to ${selectedService ? 'update' : 'create'} service.`);
      
      toast({ title: 'Success', description: `Service successfully ${selectedService ? 'updated' : 'created'}.` });
      setIsModalOpen(false);
      setSelectedService(null);
      fetchServices(); // Refresh data
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete service.');

      toast({ title: 'Success', description: 'Service deleted successfully.' });
      fetchServices(); // Refresh data
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const openModal = (service: Service | null = null) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <Button onClick={() => openModal()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Service
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No services found</p>
            <Button onClick={() => openModal()} className="mt-4"><Plus className="h-4 w-4 mr-2" />Add Your First Service</Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <Card key={service.id} className="p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      <Badge variant={service.isActive ? 'default' : 'secondary'}>{service.isActive ? 'Active' : 'Inactive'}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1 max-w-2xl">{service.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openModal(service)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 border-t pt-4">
                  <div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-gray-500" /><span>{service.duration} minutes</span></div>
                  <div className="flex items-center space-x-2"><Users className="w-4 h-4 text-gray-500" /><span>{service.bookingCount} bookings</span></div>
                  <div className="flex items-center space-x-2"><Star className="w-4 h-4 text-gray-500" /><span>{service.averageRating > 0 ? `${service.averageRating.toFixed(1)} stars` : 'No ratings'}</span></div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onEscapeKeyDown={closeModal} onPointerDownOutside={closeModal}>
          <DialogHeader>
            <DialogTitle>{selectedService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          <ServiceForm service={selectedService} onSave={handleSaveService} onCancel={closeModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}