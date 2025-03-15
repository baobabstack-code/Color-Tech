import React from 'react';
import { Calendar, User, Tag, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}

const Blog = () => {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Essential Tips for Maintaining Your Car\'s Paint',
      excerpt: 'Learn the best practices for keeping your vehicle\'s paint looking fresh and protected from environmental damage.',
      category: 'Car Care Tips',
      author: 'James Thompson',
      date: '2024-02-15',
      image: 'https://images.unsplash.com/photo-1596883040737-6d38c9e905b0?w=800&h=400',
      readTime: '5 min read'
    },
    {
      id: '2',
      title: 'Understanding Modern Auto Paint Technology',
      excerpt: 'Discover how advanced paint technologies are revolutionizing the automotive refinishing industry.',
      category: 'Industry News',
      author: 'David Wilson',
      date: '2024-02-10',
      image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?w=800&h=400',
      readTime: '7 min read'
    },
    {
      id: '3',
      title: 'When to Consider Panel Beating vs. Replacement',
      excerpt: 'Expert advice on deciding whether to repair or replace damaged vehicle panels.',
      category: 'Expert Advice',
      author: 'Robert Chen',
      date: '2024-02-05',
      image: 'https://images.unsplash.com/photo-1630332661797-c5ee3ec92e6f?w=800&h=400',
      readTime: '6 min read'
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4">Latest Updates & Tips</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay informed with the latest automotive care tips, industry news, and expert advice 
          from our experienced team.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://source.unsplash.com/800x400/?car-repair';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-3">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {post.author}
                </div>
                <div className="mx-3">•</div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="mx-3">•</div>
                <div>{post.readTime}</div>
              </div>

              <button className="flex items-center text-secondary hover:text-secondary/80 transition-colors duration-200">
                Read More
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Categories */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-primary mb-6">Popular Categories</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {['Car Care Tips', 'Industry News', 'Expert Advice', 'Case Studies', 'How-To Guides'].map((category) => (
            <button
              key={category}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors duration-200"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-primary text-white rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
        <p className="mb-6 max-w-xl mx-auto">
          Subscribe to our newsletter for the latest automotive care tips, industry news, 
          and exclusive offers.
        </p>
        <form className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-r-md transition-colors duration-200"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Blog; 