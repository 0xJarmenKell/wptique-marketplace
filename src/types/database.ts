export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'customer'
          company: string | null
          website: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'customer'
          company?: string | null
          website?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'customer'
          company?: string | null
          website?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          short_description: string | null
          price: number
          original_price: number | null
          category_id: string | null
          author_id: string
          platform: string
          version: string
          demo_url: string | null
          tags: string[]
          features: string[]
          requirements: string[]
          changelog: string | null
          is_featured: boolean
          is_active: boolean
          download_count: number
          view_count: number
          rating_average: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          short_description?: string | null
          price: number
          original_price?: number | null
          category_id?: string | null
          author_id: string
          platform: string
          version?: string
          demo_url?: string | null
          tags?: string[]
          features?: string[]
          requirements?: string[]
          changelog?: string | null
          is_featured?: boolean
          is_active?: boolean
          download_count?: number
          view_count?: number
          rating_average?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price?: number
          original_price?: number | null
          category_id?: string | null
          author_id?: string
          platform?: string
          version?: string
          demo_url?: string | null
          tags?: string[]
          features?: string[]
          requirements?: string[]
          changelog?: string | null
          is_featured?: boolean
          is_active?: boolean
          download_count?: number
          view_count?: number
          rating_average?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_files: {
        Row: {
          id: string
          product_id: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          is_main_file: boolean
          is_preview: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          is_main_file?: boolean
          is_preview?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          is_main_file?: boolean
          is_preview?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          interval: string
          features: string[]
          max_downloads: number
          max_products: number
          is_active: boolean
          stripe_price_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          interval: string
          features?: string[]
          max_downloads?: number
          max_products?: number
          is_active?: boolean
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          interval?: string
          features?: string[]
          max_downloads?: number
          max_products?: number
          is_active?: boolean
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'inactive' | 'cancelled' | 'expired'
          current_period_start: string | null
          current_period_end: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: 'active' | 'inactive' | 'cancelled' | 'expired'
          current_period_start?: string | null
          current_period_end?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'active' | 'inactive' | 'cancelled' | 'expired'
          current_period_start?: string | null
          current_period_end?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          subtotal: number
          tax_amount: number
          total_amount: number
          currency: string
          payment_method: string | null
          stripe_payment_intent_id: string | null
          billing_address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          subtotal: number
          tax_amount?: number
          total_amount: number
          currency?: string
          payment_method?: string | null
          stripe_payment_intent_id?: string | null
          billing_address?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          currency?: string
          payment_method?: string | null
          stripe_payment_intent_id?: string | null
          billing_address?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          license_type: 'standard' | 'extended'
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          license_type?: 'standard' | 'extended'
          quantity?: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          license_type?: 'standard' | 'extended'
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          is_verified_purchase: boolean
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          comment?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      downloads: {
        Row: {
          id: string
          user_id: string
          product_id: string
          order_id: string
          file_id: string
          download_token: string
          expires_at: string
          downloaded_at: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          order_id: string
          file_id: string
          download_token: string
          expires_at: string
          downloaded_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          order_id?: string
          file_id?: string
          download_token?: string
          expires_at?: string
          downloaded_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      licenses: {
        Row: {
          id: string
          user_id: string
          product_id: string
          order_id: string
          license_key: string
          license_type: 'standard' | 'extended'
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          order_id: string
          license_key: string
          license_type?: 'standard' | 'extended'
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          order_id?: string
          license_key?: string
          license_type?: 'standard' | 'extended'
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'customer'
      order_status: 'pending' | 'completed' | 'failed' | 'refunded'
      subscription_status: 'active' | 'inactive' | 'cancelled' | 'expired'
      license_type: 'standard' | 'extended'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}