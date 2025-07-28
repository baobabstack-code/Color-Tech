"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  body: string;
  imageUrl: string | null;
  isPublished: boolean;
  tags: string | null;
  author: string;
  slug: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const SingleBlogPostPage = ({ params }: PageProps) => {
  const [paramId, setParamId] = useState<string>("");

  useEffect(() => {
    params.then(({ id }) => setParamId(id));
  }, [params]);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPost() {
      if (!paramId) return;

      try {
        const res = await fetch(`/api/content/blog/${paramId}`);
        if (!res.ok) {
          setError("Blog post not found");
          setBlogPost(null);
          return;
        }
        const data = await res.json();
        setBlogPost(data);
      } catch (e) {
        setError("Failed to fetch blog post");
        setBlogPost(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogPost();
  }, [paramId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 pt-20">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading blog post...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 pt-20">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 pt-20">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Blog post not found.
        </p>
      </div>
    );
  }

  const readTime = `${Math.ceil(blogPost.body.length / 200)} min`;
  const category = blogPost.tags
    ? blogPost.tags.split(",")[0].trim()
    : "Uncategorized";
  const imageUrl =
    blogPost.imageUrl || "https://via.placeholder.com/1200x600?text=Blog+Image";

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary dark:text-sky-300 hover:underline mb-8"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Blog
        </Link>

        <article className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          <div className="relative h-80 md:h-96">
            <Image
              src={imageUrl}
              alt={blogPost.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-2xl"
            />
          </div>
          <div className="p-6 md:p-8">
            <span className="inline-block bg-secondary text-white px-3 py-1 rounded-full text-sm mb-4">
              {category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {blogPost.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
              <span className="flex items-center gap-2">
                <User size={16} /> {blogPost.author || "Admin"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />{" "}
                {new Date(blogPost.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> {readTime} read
              </span>
            </div>
            <div
              className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blogPost.body }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleBlogPostPage;
