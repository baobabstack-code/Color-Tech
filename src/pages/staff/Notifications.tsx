import { Card } from "@/components/ui/card";
import { Bell, Calendar, AlertCircle, CheckCircle } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
  isRead: boolean;
}

export default function StaffNotifications() {
  const notifications: Notification[] = [
    {
      id: "N001",
      title: "New Service Request",
      message: "A new service request has been submitted by John Doe",
      type: "info",
      date: "2024-03-15 09:30",
      isRead: false
    },
    {
      id: "N002",
      title: "Task Completed",
      message: "Panel beating service for Toyota Camry has been completed",
      type: "success",
      date: "2024-03-14 16:45",
      isRead: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 ${!notification.isRead ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-start space-x-4">
              {notification.type === 'info' && <Bell className="w-6 h-6 text-blue-500" />}
              {notification.type === 'warning' && <AlertCircle className="w-6 h-6 text-yellow-500" />}
              {notification.type === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {notification.date}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 