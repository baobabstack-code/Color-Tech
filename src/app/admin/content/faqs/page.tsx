"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Eye, Calendar,
  ChevronDown, ChevronUp, RefreshCw, AlertCircle
} from "lucide-react";
import { contentService, FAQ } from "@/services/contentService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Interface is now imported from contentService.ts

export default function FaqManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    totalViews: 0
  });
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<FAQ | null>(null);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "Services",
    status: "draft" as 'draft' | 'published',
    views: 0,
    lastUpdated: new Date().toISOString().split('T')[0]
  });
  
  const { toast } = useToast();

  const fetchFAQs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contentService.getFAQs();
      setFaqs(data);
      setFilteredFaqs(data);
      
      // Calculate stats
      const published = data.filter(faq => faq.status === 'published').length;
      const totalViews = data.reduce((sum, faq) => sum + faq.views, 0);
      
      setStats({
        total: data.length,
        published,
        totalViews
      });
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load FAQs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFaqs(faqs);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(lowercasedSearch) || 
        faq.answer.toLowerCase().includes(lowercasedSearch) ||
        faq.category.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredFaqs(filtered);
    }
  }, [searchTerm, faqs]);

  const toggleExpand = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  
  const handleAddFaq = async () => {
    try {
      await contentService.createFAQ(newFaq);
      setIsAddDialogOpen(false);
      setNewFaq({
        question: "",
        answer: "",
        category: "Services",
        status: "draft" as 'draft' | 'published',
        views: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      toast({
        title: "Success",
        description: "FAQ added successfully",
      });
      fetchFAQs();
    } catch (err) {
      console.error('Error adding FAQ:', err);
      toast({
        title: "Error",
        description: "Failed to add FAQ. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditFaq = async () => {
    if (!currentFaq) return;
    
    try {
      await contentService.updateFAQ(currentFaq.id, {
        ...currentFaq,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setIsEditDialogOpen(false);
      setCurrentFaq(null);
      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
      fetchFAQs();
    } catch (err) {
      console.error('Error updating FAQ:', err);
      toast({
        title: "Error",
        description: "Failed to update FAQ. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteFaq = async () => {
    if (!currentFaq) return;
    
    try {
      await contentService.deleteFAQ(currentFaq.id);
      setIsDeleteDialogOpen(false);
      setCurrentFaq(null);
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
      fetchFAQs();
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      toast({
        title: "Error",
        description: "Failed to delete FAQ. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchFAQs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New FAQ</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                    placeholder="Enter question"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                    placeholder="Enter answer"
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newFaq.category}
                      onChange={(e) => setNewFaq({...newFaq, category: e.target.value})}
                      placeholder="Category"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newFaq.status} 
                      onValueChange={(value: 'draft' | 'published') => setNewFaq({...newFaq, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddFaq}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total FAQs</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <h3 className="text-2xl font-bold">{stats.published}</h3>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</h3>
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
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading FAQs...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8 mr-2" />
          <p>{error}</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="flex justify-center items-center py-12 text-gray-500">
          <p>No FAQs found. {searchTerm ? 'Try a different search term.' : 'Add your first FAQ.'}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredFaqs.map((faq) => (
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
                    <Dialog open={isEditDialogOpen && currentFaq?.id === faq.id} onOpenChange={(open: boolean) => {
                      setIsEditDialogOpen(open);
                      if (!open) setCurrentFaq(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentFaq(faq)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit FAQ</DialogTitle>
                        </DialogHeader>
                        {currentFaq && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-question">Question</Label>
                              <Input
                                id="edit-question"
                                value={currentFaq.question}
                                onChange={(e) => setCurrentFaq({...currentFaq, question: e.target.value})}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-answer">Answer</Label>
                              <Textarea
                                id="edit-answer"
                                value={currentFaq.answer}
                                onChange={(e) => setCurrentFaq({...currentFaq, answer: e.target.value})}
                                rows={5}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Input
                                  id="edit-category"
                                  value={currentFaq.category}
                                  onChange={(e) => setCurrentFaq({...currentFaq, category: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select 
                                  value={currentFaq.status} 
                                  onValueChange={(value: 'draft' | 'published') => setCurrentFaq({...currentFaq, status: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleEditFaq}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isDeleteDialogOpen && currentFaq?.id === faq.id} onOpenChange={(open: boolean) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setCurrentFaq(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => setCurrentFaq(faq)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Are you sure you want to delete this FAQ?</p>
                          <p className="font-semibold mt-2">"{currentFaq?.question}"</p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleDeleteFaq}>Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add FAQ Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newFaq.question}
                onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                placeholder="Enter question"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={newFaq.answer}
                onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                placeholder="Enter answer"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({...newFaq, category: e.target.value})}
                  placeholder="Category"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newFaq.status} 
                  onValueChange={(value: 'draft' | 'published') => setNewFaq({...newFaq, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFaq}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}