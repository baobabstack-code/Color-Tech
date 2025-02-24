import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { 
  Wrench, Calendar, CheckCircle, 
  Clock, AlertCircle, Users,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Task {
  id: string;
  title: string;
  customer: string;
  status: 'pending' | 'in-progress' | 'completed';
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

const StaffDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "T001",
      title: "Panel Repair - Toyota Corolla",
      customer: "John Doe",
      status: "in-progress",
      deadline: "2024-03-16",
      priority: "high"
    }
  ]);

  const stats = {
    totalCustomers: 150,
    activeServices: 12,
    completedServices: 45,
    pendingRequests: 8,
    completedTasks: 45,
    pendingTasks: 8,
    todaysTasks: 5,
    upcomingTasks: 12
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Wrench className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-sm text-gray-600">Active Services</p>
              <h3 className="text-2xl font-bold">{stats.activeServices}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Completed Services</p>
              <h3 className="text-2xl font-bold">{stats.completedServices}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Pending Tasks</p>
              <h3 className="text-2xl font-bold">{stats.pendingTasks}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600">Customer: {task.customer}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{task.deadline}</span>
                  </div>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }
                  `}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 