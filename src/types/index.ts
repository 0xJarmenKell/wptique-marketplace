import { Database } from './database';

// Database types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductFile = Database['public']['Tables']['product_files']['Row'];
export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
export type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Download = Database['public']['Tables']['downloads']['Row'];
export type License = Database['public']['Tables']['licenses']['Row'];

// Extended types for UI
export interface ProductWithDetails extends Product {
  category?: Category;
  author?: Profile;
  files?: ProductFile[];
  reviews?: Review[];
}

export interface OrderWithItems extends Order {
  items?: (OrderItem & {
    product?: Product;
  })[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  avatar?: string;
}

export interface CartItem {
  product: ProductWithDetails;
  quantity: number;
  licenseType: "standard" | "extended";
}
