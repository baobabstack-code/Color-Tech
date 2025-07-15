"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2,
  Eye
} from 'lucide-react';

interface FormSubmission {
  id: number;
  type: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export default function FormSubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/form-submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchSubmissions();
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status: status as any });
        }
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSubmissions();
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive" className="bg-red-500"><Clock className="w-3 h-3 mr-1" />New</Badge>;
      case 'responded':
        return <Badge variant="default" className="bg-blue-500"><CheckCircle className="w-3 h-3 mr-1" />Responded</Badge>;
      case 'closed':
        return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Form Submissions</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            Total: {submissions.length}
          </Badge>
          <Badge variant="destructive" className="text-sm">
            New: {submissions.filter(s => s.status === 'new').length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Submissions</h2>
          {submissions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No form submissions yet.
              </CardContent>
            </Card>
          ) : (
            submissions.map((submission) => (
              <Card 
                key={submission.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedSubmission?.id === submission.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{submission.name}</span>
                    </div>
                    {getStatusBadge(submission.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Mail className="w-3 h-3" />
                    <span>{submission.email}</span>
                  </div>
                  
                  {submission.service && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Service:</strong> {submission.service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(submission.createdAt)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {submission.message}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Submission Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Submission Details</h2>
          {selectedSubmission ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {selectedSubmission.name}
                  </CardTitle>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{selectedSubmission.email}</span>
                  </div>
                  
                  {selectedSubmission.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedSubmission.phone}</span>
                    </div>
                  )}
                  
                  {selectedSubmission.service && (
                    <div>
                      <strong>Service Requested:</strong>
                      <span className="ml-2 capitalize">
                        {selectedSubmission.service.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {formatDate(selectedSubmission.createdAt)}</span>
                  </div>
                  
                  {selectedSubmission.updatedAt !== selectedSubmission.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Updated: {formatDate(selectedSubmission.updatedAt)}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <strong>Message:</strong>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    {selectedSubmission.message}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateSubmissionStatus(selectedSubmission.id, 'responded')}
                    disabled={selectedSubmission.status === 'responded'}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark Responded
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateSubmissionStatus(selectedSubmission.id, 'closed')}
                    disabled={selectedSubmission.status === 'closed'}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Close
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSubmission(selectedSubmission.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                Select a submission to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}