import { supabase } from '../lib/supabase';
import { Review } from '../types';

export const getProductReviews = async (productId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(full_name, avatar_url)
    `)
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createReview = async (reviewData: {
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if user has purchased this product
  const { data: purchase } = await supabase
    .from('order_items')
    .select(`
      order:orders!inner(user_id, status)
    `)
    .eq('product_id', reviewData.product_id)
    .eq('order.user_id', user.id)
    .eq('order.status', 'completed')
    .limit(1)
    .single();

  const isVerifiedPurchase = !!purchase;

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...reviewData,
      user_id: user.id,
      is_verified_purchase: isVerifiedPurchase,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateReview = async (reviewId: string, updates: Partial<Review>) => {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteReview = async (reviewId: string) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
};

export const getUserReviews = async (userId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      product:products(title, slug)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};