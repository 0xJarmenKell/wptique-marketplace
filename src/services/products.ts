import { supabase } from '../lib/supabase';
import { ProductWithDetails, Category } from '../types';

export interface ProductFilters {
  search?: string;
  category?: string;
  platform?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sortBy?: 'created_at' | 'price' | 'rating_average' | 'download_count';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export const getProducts = async (filters: ProductFilters = {}) => {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('is_active', true);

  // Apply filters
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.category) {
    query = query.eq('category_id', filters.category);
  }

  if (filters.platform) {
    query = query.eq('platform', filters.platform);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.featured) {
    query = query.eq('is_featured', true);
  }

  // Apply sorting
  if (filters.sortBy) {
    query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as ProductWithDetails[];
};

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      author:profiles(*),
      files:product_files(*),
      reviews:reviews(
        *,
        user:profiles(full_name, avatar_url)
      )
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data as ProductWithDetails;
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data as Category[];
};

export const getFeaturedProducts = async (limit = 8) => {
  return getProducts({ featured: true, limit });
};

export const getProductsByAuthor = async (authorId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('author_id', authorId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProductWithDetails[];
};

export const incrementProductViews = async (productId: string) => {
  const { error } = await supabase.rpc('increment_product_views', {
    product_id: productId
  });

  if (error) console.error('Error incrementing views:', error);
};

export const createProduct = async (productData: {
  title: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  category_id: string;
  platform: string;
  demo_url?: string;
  tags?: string[];
  features?: string[];
  requirements?: string[];
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Generate slug from title
  const slug = productData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      slug,
      author_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (
  productId: string,
  updates: Partial<ProductWithDetails>
) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
};