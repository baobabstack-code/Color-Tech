import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Lock, Shield } from "lucide-react";

export default function StaffSettings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-500" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <Switch id="push-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <Switch id="email-notifications" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 