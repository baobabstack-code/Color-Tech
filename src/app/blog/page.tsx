import React, { useState } from 'react'; // Keep useState for client-side interactivity
import { Search, Tag, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import Link from "next/link";
import Image from "next/image"; // Import Image for optimized images
import { headers } from 'next/headers';

// Define interfaces for fetched data
interface BlogPost {
  id: number;
  title: string;
  content_type: string;
  body: string; // Full content, might need truncation for excerpt
  image_url: string | null;
  is_published: boolean;
  tags: string | null; // Assuming tags can be used as categories
  author: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

interface BlogCategory {
  category_name: string;
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Use relative URL for Next.js fullstack
  const res = await fetch('/api/content?content_type=blog&is_published=true', { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error('Failed to fetch blog posts:', res.status, res.statusText);
    return [];
  }
  const data = await res.json();
  return data.content || [];
}

async function getBlogCategories(): Promise<BlogCategory[]> {
  const host = headers().get('host');
  const protocol = headers().get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/content/faq/categories`, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error('Failed to fetch blog categories:', res.status, res.statusText);
    return [];
  }
  const data = await res.json();
  return data.categories.map((name: string) => ({ category_name: name })) || [];
}

const BlogPage = async () => {
  const [allBlogPosts, allCategories] = await Promise.all([
    getAllBlogPosts(),
    getBlogCategories()
  ]);

  // Client-side state for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Process fetched data for display
  const processedBlogPosts = allBlogPosts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.body.substring(0, 150) + (post.body.length > 150 ? '...' : ''), // Truncate body for excerpt
    category: post.tags ? post.tags.split(',')[0].trim() : 'Uncategorized', // Use first tag as category
    author: post.author || 'Admin',
    date: new Date(post.created_at).toISOString().split('T')[0], // Format date
    readTime: `${Math.ceil(post.body.length / 200)} min`, // Estimate read time
    image: post.image_url || 'https://via.placeholder.com/800x400?text=Blog+Image',
    featured: post.tags?.includes('featured') || false // Assuming 'featured' tag
  }));

  const categories = Array.from(new Set(processedBlogPosts.map(post => post.category)));

  const filteredPosts = processedBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.find(post => post.featured);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary text-center mb-6">
          Auto Care Blog
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Stay informed with the latest car care tips, industry news, and expert advice.
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="container mx-auto mb-16">
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-8 text-white">
                <span className="inline-block bg-secondary px-3 py-1 rounded-full text-sm mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold mb-3">{featuredPost.title}</h2>
                <p className="text-gray-200 mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <User size={16} /> {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} /> {new Date(featuredPost.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} /> {featuredPost.readTime} read
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                ${!selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(post => !post.featured).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2">
                      <User size={16} /> {post.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={16} /> {post.readTime}
                    </span>
                  </div>
                  <Link href={`/blog/${post.id}`} className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200">
                    Read More <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto mt-16">
        <div className="bg-primary rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Auto Care Tips
          </h2>
          <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest car care tips, industry news, and exclusive offers.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;