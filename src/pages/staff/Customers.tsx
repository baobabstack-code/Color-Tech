import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Car } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  lastVisit: string;
}

export default function StaffCustomers() {
  const customers: Customer[] = [
    {
      id: "C001",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      vehicle: "Toyota Camry 2020",
      lastVisit: "2024-03-10"
    },
    {
      id: "C002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      vehicle: "Honda Civic 2021",
      lastVisit: "2024-03-12"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>

      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <User className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Car className="w-4 h-4 mr-2" />
                      {customer.vehicle}
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">View History</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 