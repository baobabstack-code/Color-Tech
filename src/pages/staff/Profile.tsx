import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function StaffProfile() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 