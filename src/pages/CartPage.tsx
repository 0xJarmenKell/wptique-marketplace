import React from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Discover amazing themes, plugins, and templates to power your next
            project.
          </p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center space-x-2 font-semibold"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {items.length} item{items.length !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.licenseType}`}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="hover:text-blue-600"
                        >
                          {item.product.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by {item.product.author.name}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {item.product.platform}
                        </span>
                        <span className="capitalize">
                          {item.licenseType} License
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        $
                        {(item.licenseType === "extended"
                          ? item.product.price * 2
                          : item.product.price) * item.quantity}
                      </div>
                      {item.licenseType === "extended" && (
                        <div className="text-sm text-gray-500">
                          ${item.product.price} × 2 (Extended) × {item.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
            >
              Clear Cart
            </button>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Processing Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              to={user ? "/checkout" : "/auth"}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-center flex items-center justify-center space-x-2"
            >
              {user ? (
                <span>Proceed to Checkout</span>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Login to Checkout</span>
                </>
              )}
            </Link>

            {!user && (
              <div className="mt-2 text-center text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                <p>
                  Please create an account or log in to complete your purchase
                </p>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>✓ Secure checkout with Stripe</p>
              <p>✓ Instant download after payment</p>
              <p>✓ 30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
