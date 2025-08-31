"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface HomepageSection {
    id: number;
    sectionKey: string;
    title: string;
    subtitle?: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const HomepageSectionsPage = () => {
    const [sections, setSections] = useState<HomepageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        sectionKey: '',
        title: '',
        subtitle: '',
        description: '',
        isActive: true,
    });

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const response = await fetch('/api/admin/homepage-sections');
            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                toast.error('Failed to fetch homepage sections');
            }
        } catch (error) {
            toast.error('Error fetching homepage sections');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingSection
                ? `/api/admin/homepage-sections/${editingSection.id}`
                : '/api/admin/homepage-sections';

            const method = editingSection ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingSection ? 'Section updated successfully' : 'Section created successfully');
                fetchSections();
                resetForm();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to save section');
            }
        } catch (error) {
            toast.error('Error saving section');
        }
    };

    const handleEdit = (section: HomepageSection) => {
        setEditingSection(section);
        setFormData({
            sectionKey: section.sectionKey,
            title: section.title,
            subtitle: section.subtitle || '',
            description: section.description || '',
            isActive: section.isActive,
        });
        setIsCreating(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this section?')) return;

        try {
            const response = await fetch(`/api/admin/homepage-sections/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Section deleted successfully');
                fetchSections();
            } else {
                toast.error('Failed to delete section');
            }
        } catch (error) {
            toast.error('Error deleting section');
        }
    };

    const resetForm = () => {
        setFormData({
            sectionKey: '',
            title: '',
            subtitle: '',
            description: '',
            isActive: true,
        });
        setEditingSection(null);
        setIsCreating(false);
    };

    const predefinedSections = [
        { key: 'transformation_gallery', label: 'Transformation Gallery' },
        { key: 'hero_section', label: 'Hero Section' },
        { key: 'why_choose_us', label: 'Why Choose Us' },
        { key: 'our_services', label: 'Our Services' },
        { key: 'our_process', label: 'Our Process' },
        { key: 'testimonials', label: 'Testimonials' },
        { key: 'blog_section', label: 'Blog Section' },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Homepage Sections
                </h1>
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Homepage Sections
                    </h1>
                    <p className="text-slate-400">Manage content for different sections of your homepage</p>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                </Button>
            </div>

            {/* Create/Edit Form */}
            {isCreating && (
                <Card className="p-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">
                            {editingSection ? 'Edit Section' : 'Create New Section'}
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetForm}
                            className="text-slate-400 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Section Key
                                </label>
                                {!editingSection ? (
                                    <select
                                        value={formData.sectionKey}
                                        onChange={(e) => setFormData({ ...formData, sectionKey: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a section</option>
                                        {predefinedSections.map((section) => (
                                            <option key={section.key} value={section.key}>
                                                {section.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <Input
                                        value={formData.sectionKey}
                                        disabled
                                        className="bg-slate-700 border-slate-600 text-slate-400"
                                    />
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <label className="text-sm font-medium text-slate-300">Active</label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Title
                            </label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="Enter section title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Subtitle (Optional)
                            </label>
                            <Input
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="Enter section subtitle"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Description (Optional)
                            </label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="Enter section description"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {editingSection ? 'Update' : 'Create'} Section
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Sections List */}
            <div className="grid gap-4">
                {sections.map((section) => (
                    <Card key={section.id} className="p-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${section.isActive
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {section.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 mb-1">Key: {section.sectionKey}</p>
                                {section.subtitle && (
                                    <p className="text-slate-300 mb-2">{section.subtitle}</p>
                                )}
                                {section.description && (
                                    <p className="text-slate-400 text-sm">{section.description}</p>
                                )}
                                <p className="text-xs text-slate-500 mt-2">
                                    Updated: {new Date(section.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(section)}
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(section.id)}
                                    className="border-red-600 text-red-400 hover:bg-red-600/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {sections.length === 0 && (
                    <Card className="p-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 text-center">
                        <p className="text-slate-400">No homepage sections found. Create your first section to get started.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default HomepageSectionsPage;