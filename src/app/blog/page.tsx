"use client";
import React, { useState, useEffect } from "react";
import { Search, Tag, Calendar, Clock, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Define interfaces for fetched data
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

const BlogPage = () => {
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const res = await fetch("/api/content/blog?published=true");
        if (!res.ok) {
          console.error(
            "Failed to fetch blog posts:",
            res.status,
            res.statusText
          );
          setAllBlogPosts([]);
          return;
        }
        const data = await res.json();
        setAllBlogPosts(data || []);
      } catch (e) {
        console.error("Error fetching blog posts:", e);
        setAllBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogPosts();
  }, []);

  // Process fetched data for display
  const processedBlogPosts = allBlogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt:
      post.body.substring(0, 150) + (post.body.length > 150 ? "..." : ""),
    category: post.tags ? post.tags.split(",")[0].trim() : "Uncategorized",
    author: post.author || "Admin",
    date: new Date(post.createdAt).toISOString().split("T")[0],
    readTime: `${Math.ceil(post.body.length / 200)} min`,
    image:
      post.imageUrl || "https://via.placeholder.com/800x400?text=Blog+Image",
    featured: post.tags?.includes("featured") || false,
  }));

  const categories = Array.from(
    new Set(processedBlogPosts.map((post) => post.category))
  );

  const filteredPosts = processedBlogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.find((post) => post.featured);

  return (
    <div className="min-h-screen pt-32 md:pt-36 pb-12 px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white text-center mb-6">
          Auto Care Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 text-center max-w-2xl mx-auto">
          Stay informed with the latest car care tips, industry news, and expert
          advice.
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="container mx-auto mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-white/10 hover:scale-[1.02] transition-transform duration-300 group">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end rounded-2xl">
              <div className="p-8 text-white">
                <span className="inline-block bg-secondary px-3 py-1 rounded-full text-sm mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold mb-3 group-hover:text-sky-300">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-200 mb-4 group-hover:text-gray-50">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <User size={16} className="text-white" />{" "}
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-white" />{" "}
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-white" />{" "}
                    {featuredPost.readTime} read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="container mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/40 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              className={`rounded-full text-sm font-medium transition-colors duration-200 ${!selectedCategory ? "" : "bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`rounded-full text-sm font-medium transition-colors duration-200 ${selectedCategory === category ? "" : "bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
            <span className="sr-only">Loading blog posts...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filter criteria."
                : "Check back soon for new articles and updates."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts
              .filter((post) => !post.featured)
              .map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="block">
                  <article className="bg-white/90 dark:bg-slate-900/90 rounded-2xl overflow-hidden shadow-xl border border-white/30 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group">
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="w-full h-full object-cover rounded-t-2xl"
                      />
                      <span className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-200 mb-4 group-hover:text-primary/90">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-2">
                            <User
                              size={16}
                              className="text-gray-500 dark:text-gray-400"
                            />{" "}
                            {post.author}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock
                              size={16}
                              className="text-gray-500 dark:text-gray-400"
                            />{" "}
                            {post.readTime}
                          </span>
                        </div>
                        <span className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200 group-hover:text-primary">
                          Read More{" "}
                          <ChevronRight
                            size={16}
                            className="text-primary dark:text-white group-hover:text-primary"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto mt-16">
        <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl border border-white/30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-40"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Auto Care Tips
            </h2>
            <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest car care tips, industry
              news, and exclusive offers.
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-white/40 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200"
              />
              <Button
                type="submit"
                variant="secondary"
                className="px-6 py-3 rounded-lg shadow-xl"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
