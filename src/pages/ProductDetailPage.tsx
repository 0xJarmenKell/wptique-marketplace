import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Download,
  Heart,
  ShoppingCart,
  Eye,
  Code,
  FileText,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Product } from "../types";
import { products } from "../data/staticData";
import { useCart } from "../contexts/CartContext";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState<
    "standard" | "extended"
  >("standard");

  useEffect(() => {
    if (!id) return;

    const foundProduct = products.find((p) => p.id === id);
    setProduct(foundProduct || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <Link to="/products" className="text-blue-600 hover:text-blue-700">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const imagesArray = product.images || [];

  const tagsArray = product.tags || [];

  const handleAddToCart = () => {
    addToCart(product, selectedLicense);
  };

  const licensePrice =
    selectedLicense === "extended"
      ? Number(product.price) * 2
      : Number(product.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={imagesArray[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {imagesArray.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {imagesArray.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {product.demoUrl && (
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>Live Preview</span>
              </a>
            )}
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.platform}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 text-sm">{product.category}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* Rating and Stats */}
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Download className="w-4 h-4" />
                <span>{product.downloads} downloads</span>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* License Selection */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Choose License
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="license"
                  value="standard"
                  checked={selectedLicense === "standard"}
                  onChange={(e) =>
                    setSelectedLicense(
                      e.target.value as "standard" | "extended"
                    )
                  }
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      Standard License
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Personal and commercial use
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="license"
                  value="extended"
                  checked={selectedLicense === "extended"}
                  onChange={(e) =>
                    setSelectedLicense(
                      e.target.value as "standard" | "extended"
                    )
                  }
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      Extended License
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price * 2}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Unlimited projects and resale rights
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Purchase Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${licensePrice}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold text-lg mb-3"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            <button className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold text-lg">
              Buy Now
            </button>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>✓ Instant download after purchase</p>
              <p>✓ 30-day money-back guarantee</p>
              <p>✓ Lifetime updates included</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Version:</span>
                <span className="ml-2 font-medium">{product.version}</span>
              </div>
              <div>
                <span className="text-gray-600">Author:</span>
                <span className="ml-2 font-medium text-blue-600">
                  {product.author}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Downloads:</span>
                <span className="ml-2 font-medium">
                  {product.downloads.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tagsArray.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          What's Included
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Code,
              title: "Source Code",
              description: "Clean, well-documented code",
            },
            {
              icon: FileText,
              title: "Documentation",
              description: "Comprehensive setup guide",
            },
            {
              icon: Smartphone,
              title: "Mobile Ready",
              description: "Fully responsive design",
            },
            {
              icon: Monitor,
              title: "Browser Support",
              description: "Works on all modern browsers",
            },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
