import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  tags: string[];
  readTime: number;
  featured: boolean;
}

const BlogPage: React.FC = () => {
  // Mock blog posts data
  const [blogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Getting Started with WordPress Development",
      excerpt:
        "Learn the fundamentals of WordPress development and how to create amazing themes and plugins.",
      content: "Full content here...",
      author: {
        name: "Demo Seller",
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      },
      publishedAt: "2024-01-15",
      tags: ["WordPress", "Development", "Tutorial"],
      readTime: 5,
      featured: true,
    },
    {
      id: "2",
      title: "React Best Practices for 2024",
      excerpt:
        "Discover the latest React patterns and best practices to write cleaner, more maintainable code.",
      content: "Full content here...",
      author: {
        name: "Demo Seller",
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      },
      publishedAt: "2024-01-20",
      tags: ["React", "JavaScript", "Best Practices"],
      readTime: 7,
      featured: false,
    },
    {
      id: "3",
      title: "Building Scalable Vue.js Applications",
      excerpt:
        "Learn how to structure and scale your Vue.js applications for better performance and maintainability.",
      content: "Full content here...",
      author: {
        name: "Demo Seller",
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      },
      publishedAt: "2024-01-25",
      tags: ["Vue.js", "Scalability", "Performance"],
      readTime: 6,
      featured: false,
    },
  ]);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Insights, tutorials, and tips from our expert developers and designers
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Article
          </h2>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg"
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {featuredPost.author.name}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(
                          featuredPost.publishedAt
                        ).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{featuredPost.readTime} min read</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg"
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Load More Articles
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
