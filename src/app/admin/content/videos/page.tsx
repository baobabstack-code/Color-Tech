"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Upload, Save, X } from "lucide-react";
import GalleryPicker from "@/components/media/GalleryPicker";
import { useToast } from "@/hooks/use-toast";

type VideoItem = { id: string; url: string; title?: string; description?: string };

export default function VideosManagement() {
    const { toast } = useToast();
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [form, setForm] = useState<{ title: string; description: string; url: string }>({ title: "", description: "", url: "" });
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => { fetchList(); }, []);

    async function fetchList() {
        setIsLoading(true);
        try {
            const res = await fetch("/api/media?type=video");
            const data = await res.json();
            setVideos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave() {
        try {
            let url = form.url;
            if (videoFile) {
                const fd = new FormData();
                fd.append("file", videoFile);
                fd.append("type", "video");
                const up = await fetch("/api/media", { method: "POST", body: fd });
                if (!up.ok) throw new Error("Upload failed");
                const uploaded = await up.json();
                url = uploaded.url;
            }
            if (!url) throw new Error("Please upload or select a video");
            setIsModalOpen(false);
            setVideoFile(null);
            setForm({ title: "", description: "", url: "" });
            await fetchList();
            toast({ title: "Saved", description: "Video uploaded" });
        } catch (e: any) {
            toast({ title: "Error", description: e.message || "Failed to save", variant: "destructive" });
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this video?")) return;
        try {
            const res = await fetch(`/api/media/${encodeURIComponent(id)}?rt=video`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            await fetchList();
            toast({ title: "Deleted", description: "Video removed" });
        } catch (e: any) {
            toast({ title: "Error", description: e.message || "Failed to delete", variant: "destructive" });
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Videos Management</h1>
                <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((v) => (
                        <Card key={v.id} className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 overflow-hidden">
                            <div className="aspect-video">
                                <video src={v.url} className="w-full h-full object-cover" controls />
                            </div>
                            <CardContent className="p-4 flex justify-end">
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(v.id)} className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Video</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Video</Label>
                            <div className="col-span-3">
                                <div className="flex gap-2">
                                    <Input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="bg-slate-800 border-slate-600" />
                                    <Button type="button" variant="outline" onClick={() => setShowPicker(true)}><Upload className="h-4 w-4 mr-1" />Choose</Button>
                                </div>
                                {videoFile && (
                                    <div className="mt-2">
                                        <video src={URL.createObjectURL(videoFile)} className="w-full rounded" controls />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}><X className="h-4 w-4 mr-2" />Cancel</Button>
                        <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {showPicker && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Select Video</h2>
                            <Button variant="ghost" onClick={() => setShowPicker(false)}>Close</Button>
                        </div>
                        <GalleryPicker type="video" onSelect={(url) => { setForm((p) => ({ ...p, url })); setVideoFile(null); setShowPicker(false); }} />
                    </div>
                </div>
            )}
        </div>
    );
}


