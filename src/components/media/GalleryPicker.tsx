"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GalleryPicker({
  onSelect,
  className = "",
  type = 'image',
}: {
  onSelect: (url: string) => void;
  className?: string;
  type?: 'image' | 'video';
}) {
  const { toast } = useToast();
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/media?type=${type}`);
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append('type', type);

    try {
      const uploadedMedia = await fetch("/api/content/media", {
        method: "POST",
        body: formData,
      });
      const newImage = await uploadedMedia.json();
      setImages((prev) => [newImage, ...prev]);
      setUploadProgress(0);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadProgress(0);
      toast({
        title: "Upload Failed",
        description: error.error || "Failed to upload image",
        variant: "destructive",
      });

      if (error.details) {
        toast({
          title: "Upload Requirements",
          description: `Max size: ${error.details.maxFileSize}, Formats: ${error.details.allowedTypes.join(", ")}`,
          variant: "default",
        });
      }
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept={type === 'video' ? 'video/*' : 'image/*'}
          className="hidden"
          id="media-upload"
          onChange={handleUpload}
          disabled={uploading}
        />
        <label
          htmlFor="media-upload"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {type === 'video' ? 'Upload Video' : 'Upload Image'}
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group cursor-pointer"
              onClick={() => onSelect(img.url)}
            >
              <div className="aspect-square overflow-hidden rounded-md border border-gray-200 group-hover:border-primary group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Select</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
