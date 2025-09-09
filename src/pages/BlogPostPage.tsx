import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  tags: string[];
  readTime: number;
  featured: boolean;
}

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Simulate fetching blog post
    const fetchPost = async () => {
      setLoading(true);
      // Mock data - in real app, this would come from API
      const mockPost: BlogPost = {
        id: id || "1",
        title: "Getting Started with WordPress Development",
        excerpt:
          "Learn the fundamentals of WordPress development and how to create amazing themes and plugins.",
        content: `
# Getting Started with WordPress Development

WordPress is one of the most popular content management systems in the world, powering millions of websites. Whether you're a beginner or an experienced developer, understanding WordPress development can open up many opportunities.

## Why Choose WordPress?

WordPress offers several advantages for developers:

- **Open Source**: Free to use and modify
- **Large Community**: Extensive support and resources
- **Flexible**: Can be used for simple blogs or complex applications
- **SEO Friendly**: Built-in SEO features

## Setting Up Your Development Environment

Before you start developing with WordPress, you need to set up a proper development environment:

### 1. Local Development Server
Use tools like XAMPP, MAMP, or Local by Flywheel to create a local WordPress installation.

### 2. Code Editor
Choose a code editor like Visual Studio Code, Sublime Text, or PHPStorm for efficient development.

### 3. Version Control
Use Git for version control to track changes and collaborate with other developers.

## Understanding WordPress Architecture

WordPress follows the MVC (Model-View-Controller) pattern with some modifications:

- **Themes**: Control the visual appearance
- **Plugins**: Add functionality
- **Custom Post Types**: Extend content types
- **Taxonomies**: Organize content

## Best Practices

Here are some best practices for WordPress development:

1. **Security First**: Always sanitize user input and validate data
2. **Performance**: Optimize images, use caching, and minimize HTTP requests
3. **Code Standards**: Follow WordPress coding standards
4. **Documentation**: Document your code and functionality

## Conclusion

WordPress development offers endless possibilities for creating amazing websites. By following best practices and staying updated with the latest trends, you can build robust and scalable WordPress solutions.

Happy coding! 🚀
        `,
        author: {
          name: "Demo Seller",
          avatar:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
          bio: "Full-stack developer with 5+ years of experience in WordPress, React, and Node.js development.",
        },
        publishedAt: "2024-01-15",
        tags: ["WordPress", "Development", "Tutorial", "PHP"],
        readTime: 5,
        featured: true,
      };

      setTimeout(() => {
        setPost(mockPost);
        setLoading(false);
      }, 1000);
    };

    fetchPost();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Article Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The article you're looking for doesn't exist.
        </p>
        <Link
          to="/blog"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/blog"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog</span>
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

        {/* Author and Meta Info */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{post.author.name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isLiked
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{likes}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <MessageCircle className="w-4 h-4" />
              <span>12</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg"
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-xl"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-12">
        <div
          dangerouslySetInnerHTML={{
            __html: post.content.replace(/\n/g, "<br>"),
          }}
        />
      </article>

      {/* Author Bio */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <Link
            to={`/profile/${post.author.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="flex-shrink-0"
          >
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            />
          </Link>
          <div className="flex-1">
            <Link
              to={`/profile/${post.author.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              About {post.author.name}
            </Link>
            <p className="text-gray-600 mb-4">{post.author.bio}</p>
            <Link
              to={`/blog?author=${post.author.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              View all posts by {post.author.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Related Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mock related articles */}
          <Link
            to="/blog/2"
            className="bg-white rounded-lg shadow border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <h4 className="font-semibold text-gray-900 mb-2">
              React Best Practices for 2024
            </h4>
            <p className="text-gray-600 text-sm">
              Discover the latest React patterns and best practices...
            </p>
          </Link>
          <Link
            to="/blog/3"
            className="bg-white rounded-lg shadow border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <h4 className="font-semibold text-gray-900 mb-2">
              Building Scalable Vue.js Applications
            </h4>
            <p className="text-gray-600 text-sm">
              Learn how to structure and scale your Vue.js applications...
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
