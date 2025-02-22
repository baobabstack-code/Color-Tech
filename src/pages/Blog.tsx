import React, { useState } from 'react';
import { Search, Tag, Calendar, Clock, User, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Essential Car Paint Care Tips for Long-lasting Shine",
      excerpt: "Learn the best practices for maintaining your car's paint and protecting it from environmental damage.",
      category: "Car Care",
      author: "John Smith",
      date: "2024-02-15",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800",
      featured: true
    },
    {
      id: 2,
      title: "Understanding Modern Auto Body Repair Techniques",
      excerpt: "Discover how advanced technology is revolutionizing the auto body repair industry.",
      category: "Industry News",
      author: "Sarah Johnson",
      date: "2024-02-12",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800"
    },
    {
      id: 3,
      title: "The Impact of Weather on Your Car's Paint",
      excerpt: "How different weather conditions affect your vehicle's paint and what you can do about it.",
      category: "Car Care",
      author: "Mike Wilson",
      date: "2024-02-10",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1600661653561-629509216228?w=800"
    },
    {
      id: 4,
      title: "Latest Innovations in Auto Paint Technology",
      excerpt: "Exploring cutting-edge developments in automotive paint and coating systems.",
      category: "Industry News",
      author: "Emily Brown",
      date: "2024-02-08",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1632823471406-462e45297d86?w=800"
    },
    {
      id: 5,
      title: "DIY Car Maintenance: What to Do and What to Avoid",
      excerpt: "A comprehensive guide to safe DIY car maintenance and when to seek professional help.",
      category: "Tips & Tricks",
      author: "David Lee",
      date: "2024-02-05",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800"
    },
    {
      id: 6,
      title: "Sustainable Practices in Auto Body Repair",
      excerpt: "How the industry is adopting eco-friendly methods and materials.",
      category: "Industry News",
      author: "Lisa Chen",
      date: "2024-02-03",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800"
    }
  ];

  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

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
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
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
                <img
                  src={post.image}
                  alt={post.title}
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
                  <span className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200">
                    Read More <ChevronRight size={16} />
                  </span>
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

export default Blog; 