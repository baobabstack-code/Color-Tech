import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Eye, Calendar,
  ChevronDown, ChevronUp
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'published' | 'draft';
  lastUpdated: string;
  views: number;
}

export default function FaqManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: "FAQ001",
      question: "How long does a typical panel beating job take?",
      answer: "The duration of a panel beating job depends on the extent of damage. Minor repairs can be completed in 1-2 days, while major repairs might take 5-7 working days. We provide a detailed timeline during the initial assessment.",
      category: "Services",
      status: 'published',
      lastUpdated: "2024-03-01",
      views: 1250
    },
    {
      id: "FAQ002",
      question: "Do you provide color matching services?",
      answer: "Yes, we use advanced computerized color matching technology to ensure your vehicle's new paint perfectly matches the existing color. Our system can match any manufacturer's color code with precision.",
      category: "Paint Work",
      status: 'draft',
      lastUpdated: "2024-03-15",
      views: 890
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total FAQs</p>
              <h3 className="text-2xl font-bold">32</h3>
            </div>
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <h3 className="text-2xl font-bold">28</h3>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold">15.2K</h3>
            </div>
            <Eye className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* FAQ Grid */}
      <div className="grid gap-6">
        {faqs.map((faq) => (
          <Card key={faq.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 hover:bg-transparent"
                      onClick={() => toggleExpand(faq.id)}
                    >
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                    <Badge variant={faq.status === 'published' ? 'default' : 'secondary'}>
                      {faq.status}
                    </Badge>
                    <Badge variant="outline">{faq.category}</Badge>
                  </div>
                  {expandedFaq === faq.id && (
                    <p className="text-gray-600 mt-2 pl-7">{faq.answer}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pl-7">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(faq.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {faq.views.toLocaleString()} views
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 