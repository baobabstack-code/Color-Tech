"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoShowcaseProps {
  videos: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
  }[];
}

export default function VideoShowcase({ videos }: VideoShowcaseProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
            See Our Work in Action
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Watch our skilled technicians transform vehicles with precision and
            expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative overflow-hidden rounded-2xl shadow-xl border dark:border-slate-700 bg-white/10 dark:bg-slate-800/80 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedVideo(video.videoUrl)}
            >
              <div className="aspect-video relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                  {video.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative max-w-4xl w-full">
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:text-gray-300 hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVideo(null);
                }}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
