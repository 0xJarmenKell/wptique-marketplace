import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Shield, Lock, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
}

const SubscriptionCheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: {
      line1: "",
      city: "",
      country: "",
      postal_code: "",
    },
  });

  useEffect(() => {
    // Mock plan data - in real app, fetch from API
    const mockPlans = [
      {
        id: "free",
        name: "Free",
        description: "Perfect for getting started",
        price: 0,
        interval: "MONTHLY",
        features: [
          "Up to 3 products",
          "Basic analytics",
          "Community support",
          "5GB storage",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        description: "For growing businesses",
        price: 19.99,
        interval: "MONTHLY",
        features: [
          "Up to 50 products",
          "Advanced analytics",
          "Priority support",
          "100GB storage",
          "Custom branding",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "For large organizations",
        price: 99.99,
        interval: "MONTHLY",
        features: [
          "Unlimited products",
          "Enterprise analytics",
          "24/7 dedicated support",
          "Unlimited storage",
          "Custom integrations",
          "White-label solution",
        ],
      },
    ];

    const foundPlan = mockPlans.find((p) => p.id === planId);
    setPlan(foundPlan || null);
  }, [planId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please sign in to subscribe");
      navigate("/auth");
      return;
    }

    if (!plan) {
      alert("Plan not found");
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would:
      // 1. Create Stripe customer if needed
      // 2. Create payment method
      // 3. Create subscription
      // 4. Update user subscription in database
      
      console.log("Processing subscription:", {
        planId: plan.id,
        userId: user.id,
        paymentData: formData,
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      alert(`Successfully subscribed to ${plan.name} plan!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
        <p className="text-gray-600 mb-8">Please sign in to subscribe to a plan.</p>
        <button
          onClick={() => navigate("/auth")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
        <p className="text-gray-600 mb-8">The subscription plan you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/subscription-plans")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          View All Plans
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/subscription-plans")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Subscribe to {plan.name}</h1>
        <p className="text-gray-600 mt-2">Complete your subscription to get started</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Plan Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Summary</h2>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${plan.price}
                  </div>
                  <div className="text-sm text-gray-600">
                    per {plan.interval.toLowerCase()}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{plan.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">What's included:</h4>
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Secure Payment</h3>
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
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Card Details</h3>
              
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
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
                    CVV *
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
                  Name on Card *
                </label>
                <input
                  type="text"
                  name="nameOnCard"
                  value={formData.nameOnCard}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="billing.line1"
                  value={formData.billingAddress.line1}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="billing.city"
                    value={formData.billingAddress.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="billing.postal_code"
                    value={formData.billingAddress.postal_code}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="billing.country"
                  value={formData.billingAddress.country}
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

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                `Subscribe for $${plan.price}/${plan.interval.toLowerCase()}`
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>You can cancel your subscription at any time.</p>
              <p>No hidden fees or long-term commitments.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckoutPage;