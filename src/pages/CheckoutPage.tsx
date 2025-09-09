import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Shield, Lock } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validation
    const errors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      { key: "email", label: "Email Address" },
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "country", label: "Country" },
      { key: "zipCode", label: "ZIP Code" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.key as keyof typeof formData].trim()) {
        errors[field.key] = `${field.label} is required`;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (paymentMethod === "card") {
      // Card validation
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = "Card number is required";
      } else if (formData.cardNumber.replace(/\s/g, "").length < 13) {
        errors.cardNumber = "Please enter a valid card number";
      }

      if (!formData.expiryDate.trim()) {
        errors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        errors.expiryDate = "Please enter expiry date in MM/YY format";
      }

      if (!formData.cvv.trim()) {
        errors.cvv = "CVV is required";
      } else if (formData.cvv.length < 3) {
        errors.cvv = "Please enter a valid CVV";
      }

      if (!formData.nameOnCard.trim()) {
        errors.nameOnCard = "Name on card is required";
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Payment successful! Check your email for download links.");
      clearCart();
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          No items to checkout
        </h1>
        <Link to="/products" className="text-blue-600 hover:text-blue-700">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  {validationErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Billing Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Method
            </h2>

            {/* Payment Options */}
            <div className="space-y-4 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Credit/Debit Card</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="font-medium">PayPal</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="googlepay"
                  checked={paymentMethod === "googlepay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="font-medium">Google Pay</span>
              </label>
            </div>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.cardNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  {validationErrors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.cardNumber}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.licenseType}`}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.licenseType} License × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      $
                      {(item.licenseType === "extended"
                        ? item.product.price * 2
                        : item.product.price) * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Processing Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Secure Checkout</h3>
            </div>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>SSL encrypted payment processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Powered by Stripe</span>
              </div>
            </div>
          </div>

          {/* Complete Order Button */}
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : `Complete Order - $${total.toFixed(2)}`}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">
            <p>
              By completing your order, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
