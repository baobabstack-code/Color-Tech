import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, Phone, Mail, Calendar, 
  CheckCircle, AlertCircle, Star 
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  performance: number;
  specialization: string[];
  availability: 'available' | 'busy' | 'off-duty';
}

export default function StaffManagement() {
  const staffMembers: StaffMember[] = [
    {
      id: "ST001",
      name: "John Smith",
      email: "john@colortech.com",
      phone: "+1234567890",
      role: "Senior Technician",
      status: 'active',
      performance: 4.8,
      specialization: ["Panel Beating", "Spray Painting"],
      availability: 'available'
    },
    // Add more mock data
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Button>Add New Staff</Button>
      </div>

      <div className="grid gap-6">
        {staffMembers.map((staff) => (
          <Card key={staff.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{staff.name}</h3>
                  <p className="text-gray-600">{staff.role}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2" />
                      {staff.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2" />
                      {staff.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={staff.status === 'active' ? 'success' : 'secondary'}>
                  {staff.status}
                </Badge>
                <Badge variant={
                  staff.availability === 'available' ? 'success' : 
                  staff.availability === 'busy' ? 'warning' : 'secondary'
                }>
                  {staff.availability}
                </Badge>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">{staff.performance}</span>
                <span className="text-gray-600">Performance Rating</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {staff.specialization.map((spec) => (
                  <Badge key={spec} variant="outline">{spec}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm">View Schedule</Button>
              <Button variant="outline" size="sm">Performance Review</Button>
              <Button variant="outline" size="sm">Edit Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 