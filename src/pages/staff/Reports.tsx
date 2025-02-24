import { Card } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  status: string;
}

export default function StaffReports() {
  const reports: Report[] = [
    {
      id: "R001",
      title: "Weekly Performance Report",
      date: "March 10, 2024",
      type: "Performance",
      status: "Completed"
    },
    {
      id: "R002",
      title: "Service Quality Assessment",
      date: "March 8, 2024",
      type: "Quality",
      status: "Pending Review"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="w-6 h-6 text-secondary" />
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-gray-600">Type: {report.type}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{report.date}</span>
                </div>
                <span className="text-sm text-gray-500">{report.status}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 