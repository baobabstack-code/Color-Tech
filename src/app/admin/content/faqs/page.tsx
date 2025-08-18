"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  Plus,
  Eye,
  Edit,
  FileText,
  Trash2,
  Search,
  Save,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft";
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft";
}

export default function FAQManagement() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    category: "General",
    status: "published",
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/content/faqs");
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = selectedFAQ
        ? `/api/content/faqs/${selectedFAQ.id}`
        : "/api/content/faqs";
      const method = selectedFAQ ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `FAQ ${selectedFAQ ? "updated" : "created"} successfully`,
        });
        setIsModalOpen(false);
        resetForm();
        fetchFAQs();
      } else {
        throw new Error("Failed to save FAQ");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save FAQ",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const response = await fetch(`/api/content/faqs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "FAQ deleted successfully",
        });
        fetchFAQs();
      } else {
        throw new Error("Failed to delete FAQ");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const openModal = (faq?: FAQ) => {
    if (faq) {
      setSelectedFAQ(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        status: faq.status,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedFAQ(null);
    setFormData({
      question: "",
      answer: "",
      category: "General",
      status: "published",
    });
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || faq.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || faq.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: faqs.length,
    published: faqs.filter(f => f.status === "published").length,
    draft: faqs.filter(f => f.status === "draft").length,
    categories: categories.length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          FAQ Management
        </h1>
        <Button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total FAQs</p>
              <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
            </div>
            <HelpCircle className="h-8 w-8 text-indigo-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Published</p>
              <h3 className="text-2xl font-bold text-white">{stats.published}</h3>
            </div>
            <Eye className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Drafts</p>
              <h3 className="text-2xl font-bold text-white">{stats.draft}</h3>
            </div>
            <Edit className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Categories</p>
              <h3 className="text-2xl font-bold text-white">{stats.categories}</h3>
            </div>
            <FileText className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-300"
            />
          </div>
        </div>
        <Select
          value={filterStatus}
          onValueChange={(value: any) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              All Status
            </SelectItem>
            <SelectItem value="published" className="text-white hover:bg-slate-700">
              Published
            </SelectItem>
            <SelectItem value="draft" className="text-white hover:bg-slate-700">
              Drafts
            </SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterCategory}
          onValueChange={setFilterCategory}
        >
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="text-white hover:bg-slate-700"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* FAQs List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
        </div>
      ) : filteredFAQs.length === 0 ? (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-12 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No FAQs found
          </h3>
          <p className="text-slate-300 mb-6">
            Create your first FAQ to get started
          </p>
          <Button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First FAQ
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <Card
              key={faq.id}
              className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="flex items-center gap-2 text-left"
                      >
                        {expandedFAQ === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                        <h3 className="text-lg font-semibold text-white hover:text-indigo-300 transition-colors">
                          {faq.question}
                        </h3>
                      </button>
                      <Badge
                        className={
                          faq.status === "published"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {faq.status}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {faq.category}
                      </Badge>
                    </div>

                    {expandedFAQ === faq.id && (
                      <div className="ml-7 mb-4">
                        <p className="text-slate-200 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-400 ml-7">
                      <span>{faq.views} views</span>
                      <span>Created {formatDate(faq.createdAt)}</span>
                      {faq.updatedAt !== faq.createdAt && (
                        <span>Updated {formatDate(faq.updatedAt)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(faq)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                      className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* FAQ Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {selectedFAQ ? "Edit FAQ" : "Create New FAQ"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="question" className="text-slate-200">
                Question
              </Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="Enter the question..."
              />
            </div>

            <div>
              <Label htmlFor="answer" className="text-slate-200">
                Answer
              </Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                className="bg-slate-800 border-slate-600 text-white h-32"
                placeholder="Enter the answer..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-slate-200">
                  Category
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="e.g., General, Services, Pricing"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-slate-200">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="published" className="text-white hover:bg-slate-700">
                      Published
                    </SelectItem>
                    <SelectItem value="draft" className="text-white hover:bg-slate-700">
                      Draft
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {selectedFAQ ? "Update FAQ" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
