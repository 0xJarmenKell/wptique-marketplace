import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Download,
  Shield,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import MovingLogos from "../components/common/MovingLogos";
import { platformStats } from "../data/staticData";
import { ProductWithDetails } from "../types";
import { useFeaturedProducts } from "../hooks/useProducts";

const HomePage: React.FC = () => {
  const {
    data: featuredProducts = [],
    isLoading,
    error,
  } = useFeaturedProducts(8);

  // Debug logging
  console.log("HomePage Debug:", {
    featuredProducts,
    isLoading,
    error,
    count: featuredProducts.length,
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Premium Digital Assets for
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Modern Developers
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Discover high-quality themes, plugins, templates, and code
              snippets for WordPress, React, Vue.js, Laravel, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center group"
              >
                Browse Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {platformStats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Moving Logos Section - Improved */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Supported Platforms & Technologies
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Premium digital assets for modern development across all major
              platforms
            </p>
          </div>

          <MovingLogos />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose DevMarket?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide the tools and platform you need to build exceptional
            digital experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Secure & Trusted",
              description:
                "All products are reviewed and verified. Secure payments with Stripe and instant downloads.",
              color: "text-green-600",
              bgColor: "bg-green-100",
            },
            {
              icon: Zap,
              title: "Instant Delivery",
              description:
                "Download your purchases immediately after payment. No waiting, no delays.",
              color: "text-yellow-600",
              bgColor: "bg-yellow-100",
            },
            {
              icon: Users,
              title: "Expert Community",
              description:
                "Connect with top developers and designers. Get support and share knowledge.",
              color: "text-blue-600",
              bgColor: "bg-blue-100",
            },
            {
              icon: TrendingUp,
              title: "Always Updated",
              description:
                "Products are regularly updated for compatibility with the latest platforms.",
              color: "text-purple-600",
              bgColor: "bg-purple-100",
            },
            {
              icon: Star,
              title: "Premium Quality",
              description:
                "Curated selection of high-quality products from verified developers.",
              color: "text-orange-600",
              bgColor: "bg-orange-100",
            },
            {
              icon: Download,
              title: "Lifetime Access",
              description:
                "Re-download your purchases anytime. Lifetime access to all your products.",
              color: "text-indigo-600",
              bgColor: "bg-indigo-100",
            },
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 h-full">
                <div
                  className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Hand-picked premium products from our top sellers
            </p>
          </div>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center group"
          >
            View All
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))
            : featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust DevMarket for their digital
              assets
            </p>
            <Link
              to="/products"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center group"
            >
              Explore Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
