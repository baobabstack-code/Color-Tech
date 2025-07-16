"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Users, Search, Mail, Phone, Calendar, Loader2, UserPlus, Trash2, Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Matches the data structure from our new API endpoint
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  bookingCount: number;
  lastActivity: string;
}

const CustomerForm = ({ customer, onSave, onCancel }: { customer?: Customer | null, onSave: (customer: Omit<Customer, 'id' | 'bookingCount' | 'lastActivity' | 'createdAt'>) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-slate-200">Full Name</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={e => setFormData({ ...formData, name: e.target.value })} 
          required 
          className="bg-slate-800 border-slate-600 text-white placeholder-slate-300"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-slate-200">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          value={formData.email} 
          onChange={e => setFormData({ ...formData, email: e.target.value })} 
          required 
          className="bg-slate-800 border-slate-600 text-white placeholder-slate-300"
        />
      </div>
      <div>
        <Label htmlFor="phone" className="text-slate-200">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          value={formData.phone} 
          onChange={e => setFormData({ ...formData, phone: e.target.value })} 
          className="bg-slate-800 border-slate-600 text-white placeholder-slate-300"
        />
      </div>
      <DialogFooter className="gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
        >
          Save Customer
        </Button>
      </DialogFooter>
    </form>
  );
};

export default function CustomerManagement() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/customers/with-stats');
      if (!response.ok) throw new Error('Failed to fetch customers.');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCustomer = async (customerData: Omit<Customer, 'id' | 'bookingCount' | 'lastActivity' | 'createdAt'>) => {
    const method = selectedCustomer ? 'PUT' : 'POST';
    const url = selectedCustomer ? `/api/customers/${selectedCustomer.id}` : '/api/customers';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) throw new Error(`Failed to ${selectedCustomer ? 'update' : 'create'} customer.`);
      
      toast({ title: 'Success', description: `Customer successfully ${selectedCustomer ? 'updated' : 'created'}.` });
      closeModal();
      fetchCustomers(); // Refresh data
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/customers/${customerId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete customer.');

      toast({ title: 'Success', description: 'Customer deleted successfully.' });
      fetchCustomers(); // Refresh data
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const openModal = (customer: Customer | null = null) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Customer Management
        </h1>
        <Button 
          onClick={() => openModal()} 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
        >
          <UserPlus className="h-4 w-4" /> Add New Customer
        </Button>
      </div>
        
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 h-4 w-4" />
        <Input
          placeholder="Search customers by name, email, or phone..."
          className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-16 text-slate-300">
          <Users className="h-16 w-16 mx-auto mb-4 text-slate-500" />
          <h3 className="text-xl font-semibold text-white">No customers found</h3>
          <p className="mb-4 text-slate-300">Create a new customer to get started.</p>
          <Button 
            onClick={() => openModal()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />Add Customer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6 hover:bg-slate-800/70 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" 
                      onClick={() => openModal(customer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30" 
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 space-y-2 text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-300" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-300" />
                    <span>{customer.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4"/>
                  <span>{customer.bookingCount} booking(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4"/>
                  <span>Last activity: {new Date(customer.lastActivity).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onEscapeKeyDown={closeModal} onPointerDownOutside={closeModal} className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm customer={selectedCustomer} onSave={handleSaveCustomer} onCancel={closeModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}