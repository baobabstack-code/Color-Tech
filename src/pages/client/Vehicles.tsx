import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Car, Loader2 } from "lucide-react";
import { getMyVehicles, createVehicle, updateVehicle, deleteVehicle, Vehicle, CreateVehicleData, UpdateVehicleData } from '@/services/vehicleService';

const ClientVehicles = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await getMyVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to load your vehicles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const vehicleData: CreateVehicleData = {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        color: formData.get('color') as string,
        licensePlate: formData.get('licensePlate') as string,
        vin: (formData.get('vin') as string) || undefined,
        notes: (formData.get('notes') as string) || undefined,
      };
      
      console.log('Creating vehicle with data:', vehicleData);
      const newVehicle = await createVehicle(vehicleData);
      console.log('Vehicle created successfully:', newVehicle);
      
      setVehicles([...vehicles, newVehicle]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingVehicle) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const vehicleData: UpdateVehicleData = {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        color: formData.get('color') as string,
        licensePlate: formData.get('licensePlate') as string,
        vin: (formData.get('vin') as string) || undefined,
        notes: (formData.get('notes') as string) || undefined,
      };
      
      console.log('Updating vehicle with ID:', editingVehicle.id, 'Data:', vehicleData);
      const updatedVehicle = await updateVehicle(editingVehicle.id, vehicleData);
      console.log('Vehicle updated successfully:', updatedVehicle);
      
      setVehicles(vehicles.map(vehicle => 
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      ));
      setIsDialogOpen(false);
      setEditingVehicle(null);
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to update vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await deleteVehicle(id);
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to delete vehicle. It may be in use by existing bookings.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Vehicles</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVehicle(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={editingVehicle ? handleUpdateVehicle : handleAddVehicle} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="make">Make</Label>
                    <Input 
                      id="make" 
                      name="make" 
                      defaultValue={editingVehicle?.make || ''} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">Model</Label>
                    <Input 
                      id="model" 
                      name="model" 
                      defaultValue={editingVehicle?.model || ''} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Input 
                      id="year" 
                      name="year" 
                      type="number" 
                      min="1900" 
                      max={new Date().getFullYear() + 1}
                      defaultValue={editingVehicle?.year || new Date().getFullYear()} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="color">Color</Label>
                    <Input 
                      id="color" 
                      name="color" 
                      defaultValue={editingVehicle?.color || ''} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input 
                    id="licensePlate" 
                    name="licensePlate" 
                    defaultValue={editingVehicle?.licensePlate || ''} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="vin">VIN (Optional)</Label>
                  <Input 
                    id="vin" 
                    name="vin" 
                    defaultValue={editingVehicle?.vin || ''} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    defaultValue={editingVehicle?.notes || ''} 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingVehicle(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingVehicle ? 'Update' : 'Add'}
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
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Car className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                    <p className="text-sm text-gray-500 mt-1">{vehicle.color} • {vehicle.licensePlate}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEditDialog(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              
              {vehicle.notes && (
                <p className="mt-4 text-sm text-gray-600">{vehicle.notes}</p>
              )}
              
              {vehicle.vin && (
                <p className="mt-2 text-xs text-gray-500">VIN: {vehicle.vin}</p>
              )}
            </Card>
          ))}
          
          {vehicles.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No vehicles found. Add your first vehicle to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientVehicles; 