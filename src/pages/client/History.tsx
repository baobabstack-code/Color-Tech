import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle } from "lucide-react";

const ServiceHistory = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Service History</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Complete Body Repair</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Completed on February 1, 2024</span>
                </div>
              </div>
            </div>
            <span className="text-green-500 font-medium">Completed</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ServiceHistory; 