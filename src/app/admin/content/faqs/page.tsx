"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HelpCircle, Plus, Eye, Edit, FileText } from "lucide-react";

export default function FAQManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          FAQ Management
        </h1>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total FAQs</p>
              <h3 className="text-2xl font-bold text-white">15</h3>
            </div>
            <HelpCircle className="h-8 w-8 text-indigo-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Published</p>
              <h3 className="text-2xl font-bold text-white">12</h3>
            </div>
            <Eye className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Drafts</p>
              <h3 className="text-2xl font-bold text-white">3</h3>
            </div>
            <Edit className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Categories</p>
              <h3 className="text-2xl font-bold text-white">4</h3>
            </div>
            <FileText className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-12 text-center">
        <HelpCircle className="h-16 w-16 mx-auto mb-4 text-slate-600" />
        <h3 className="text-xl font-semibold text-white mb-2">
          FAQ management coming soon
        </h3>
        <p className="text-slate-400 mb-6">
          Full FAQ management functionality will be implemented
        </p>
      </Card>
    </div>
  );
}
