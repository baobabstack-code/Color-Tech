import React from "react";
import { Calendar, User, Tag, ChevronRight } from "lucide-react";

import { contentService, BlogPost } from "../services/contentService";
import { useEffect, useState } from "react";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const posts = await contentService.getBlogPosts();
      // Map the posts to ensure they match the BlogPost interface
      const formattedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        body: post.body,
        imageUrl: post.imageUrl,
        isPublished: post.isPublished,
        tags: post.tags,
        author: post.author,
        slug: post.slug || "",
        createdBy: 1, // Default value
        updatedBy: 1, // Default value
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }));
      setBlogPosts(formattedPosts);
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Latest Updates & Tips
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay informed with the latest automotive care tips, industry news, and
          expert advice from our experienced team.
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
                src={
                  post.imageUrl ||
                  "https://source.unsplash.com/800x400/?car-repair"
                }
                alt={post.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://source.unsplash.com/800x400/?car-repair";
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">
                  {post.tags?.split(",")[0] || "Blog"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-3">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {post.body.length > 150
                  ? post.body.substring(0, 150) + "..."
                  : post.body}
              </p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {post.author || "Admin"}
                </div>
                <div className="mx-3">•</div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="mx-3">•</div>
                <div>{Math.ceil(post.body.length / 200)} min read</div>
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
        <h3 className="text-xl font-semibold text-primary mb-6">
          Popular Categories
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "Car Care Tips",
            "Industry News",
            "Expert Advice",
            "Case Studies",
            "How-To Guides",
          ].map((category) => (
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
          Subscribe to our newsletter for the latest automotive care tips,
          industry news, and exclusive offers.
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
