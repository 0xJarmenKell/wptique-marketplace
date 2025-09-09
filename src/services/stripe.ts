import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export const createPaymentIntent = async (
  items: CartItem[],
  billingAddress?: any
): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  // Calculate total amount
  const amount = items.reduce((sum, item) => {
    const price = item.licenseType === 'extended' ? item.product.price * 2 : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // In a real application, this would call your backend API
  // For now, we'll simulate the response
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      items: items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        license_type: item.licenseType,
      })),
      billing_address: billingAddress,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  const data = await response.json();
  return {
    clientSecret: data.client_secret,
    paymentIntentId: data.id,
  };
};

export const confirmPayment = async (
  clientSecret: string,
  paymentMethod: {
    card: any;
    billing_details: {
      name: string;
      email: string;
      address?: {
        line1: string;
        city: string;
        country: string;
        postal_code: string;
      };
    };
  }
) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe not loaded');

  const { error, paymentIntent } = await stripe.confirmCardPayment(
    clientSecret,
    {
      payment_method: paymentMethod,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return paymentIntent;
};

export const createSubscription = async (
  priceId: string,
  paymentMethodId: string
) => {
  const response = await fetch('/api/create-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_id: priceId,
      payment_method_id: paymentMethodId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  return response.json();
};

export const cancelSubscription = async (subscriptionId: string) => {
  const response = await fetch('/api/cancel-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription_id: subscriptionId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }

  return response.json();
};

// Google Pay configuration
export const createGooglePayButton = async (
  amount: number,
  currency: string = 'USD'
) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe not loaded');

  const paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: currency.toLowerCase(),
    total: {
      label: 'Total',
      amount: Math.round(amount * 100),
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const elements = stripe.elements();
  const prButton = elements.create('paymentRequestButton', {
    paymentRequest,
  });

  return { paymentRequest, prButton };
};