import React from "react";
import { Link } from "react-router-dom";
import { Star, Download, Heart, ShoppingCart } from "lucide-react";
import { ProductWithDetails } from "../../types";
import { useCart } from "../../contexts/CartContext";

interface ProductCardProps {
  product: ProductWithDetails;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Platform Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
              {product.platform}
            </span>
          </div>

          {/* Wishlist Button */}
          <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 opacity-0 group-hover:opacity-100">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">
              {product.category?.name || 'Uncategorized'}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating_average}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {product.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Download className="w-4 h-4" />
              <span>{product.download_count} downloads</span>
            </div>
            <div className="text-sm text-gray-500">
              by {product.author?.full_name || 'Unknown'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {product.original_price && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.original_price}
                </span>
              )}
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 group/btn"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Add to Cart</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
