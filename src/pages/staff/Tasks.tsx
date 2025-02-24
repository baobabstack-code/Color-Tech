import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, Clock, AlertCircle,
  Calendar, ArrowRight
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  customer: string;
  vehicle: string;
  status: 'pending' | 'in-progress' | 'completed';
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export default function StaffTasks() {
  const [tasks] = useState<Task[]>([
    {
      id: "T001",
      title: "Panel Repair",
      customer: "John Doe",
      vehicle: "Toyota Camry 2020",
      status: "in-progress",
      deadline: "2024-03-16",
      priority: "high"
    },
    {
      id: "T002",
      title: "Spray Painting",
      customer: "Jane Smith",
      vehicle: "Honda Civic 2021",
      status: "pending",
      deadline: "2024-03-17",
      priority: "medium"
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">Customer: {task.customer}</p>
                  <p className="text-sm text-gray-600">Vehicle: {task.vehicle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{task.deadline}</span>
                </div>
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
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
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 