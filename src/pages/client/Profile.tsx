import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin } from "lucide-react";

const ClientProfile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Card className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <User className="w-12 h-12 text-secondary" />
            <div>
              <h2 className="text-2xl font-semibold">John Doe</h2>
              <p className="text-gray-600">Client since 2023</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <span>+263 77 123 4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>123 Sample Street, Harare</span>
            </div>
          </div>

          <Button className="w-full">Edit Profile</Button>
        </div>
      </Card>
    </div>
  );
};

export default ClientProfile; 