import { supabase } from '../lib/supabase';
import { Order, OrderWithItems, CartItem } from '../types';

export const createOrder = async (items: CartItem[], billingAddress?: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const price = item.licenseType === 'extended' ? item.product.price * 2 : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const taxAmount = 0; // Implement tax calculation as needed
  const totalAmount = subtotal + taxAmount;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      billing_address: billingAddress,
      status: 'pending',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    license_type: item.licenseType,
    quantity: item.quantity,
    unit_price: item.licenseType === 'extended' ? item.product.price * 2 : item.product.price,
    total_price: (item.licenseType === 'extended' ? item.product.price * 2 : item.product.price) * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};

export const getOrders = async (userId?: string) => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as OrderWithItems[];
};

export const getOrder = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data as OrderWithItems;
};

export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  paymentIntentId?: string
) => {
  const updates: any = { status };
  
  if (paymentIntentId) {
    updates.stripe_payment_intent_id = paymentIntentId;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;

  // If order is completed, create download tokens and licenses
  if (status === 'completed') {
    await createDownloadTokensForOrder(orderId);
    await createLicensesForOrder(orderId);
  }

  return data;
};

const createDownloadTokensForOrder = async (orderId: string) => {
  // Get order items with product files
  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(
        *,
        files:product_files(*)
      )
    `)
    .eq('order_id', orderId);

  if (error) throw error;

  const { data: order } = await supabase
    .from('orders')
    .select('user_id')
    .eq('id', orderId)
    .single();

  if (!order) return;

  // Create download tokens for each file
  const downloadTokens = [];
  
  for (const item of orderItems) {
    if (item.product?.files) {
      for (const file of item.product.files) {
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

        downloadTokens.push({
          user_id: order.user_id,
          product_id: item.product_id,
          order_id: orderId,
          file_id: file.id,
          download_token: token,
          expires_at: expiresAt.toISOString(),
        });
      }
    }
  }

  if (downloadTokens.length > 0) {
    const { error: tokenError } = await supabase
      .from('downloads')
      .insert(downloadTokens);

    if (tokenError) console.error('Error creating download tokens:', tokenError);
  }
};

const createLicensesForOrder = async (orderId: string) => {
  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;

  const { data: order } = await supabase
    .from('orders')
    .select('user_id')
    .eq('id', orderId)
    .single();

  if (!order) return;

  const licenses = orderItems.map(item => ({
    user_id: order.user_id,
    product_id: item.product_id,
    order_id: orderId,
    license_key: `LIC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    license_type: item.license_type,
  }));

  const { error: licenseError } = await supabase
    .from('licenses')
    .insert(licenses);

  if (licenseError) console.error('Error creating licenses:', licenseError);
};