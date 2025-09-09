import { supabase, createSignedUrl } from '../lib/supabase';
import { Download } from '../types';

export const getUserDownloads = async (userId: string) => {
  const { data, error } = await supabase
    .from('downloads')
    .select(`
      *,
      product:products(title, slug),
      file:product_files(file_name, file_type)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getDownloadUrl = async (downloadToken: string) => {
  // Verify download token
  const { data: download, error } = await supabase
    .from('downloads')
    .select(`
      *,
      file:product_files(*)
    `)
    .eq('download_token', downloadToken)
    .gt('expires_at', new Date().toISOString())
    .is('downloaded_at', null)
    .single();

  if (error) throw error;
  if (!download) throw new Error('Invalid or expired download token');

  // Create signed URL for file download
  const signedUrl = await createSignedUrl(
    'product-files',
    download.file.file_path,
    3600 // 1 hour expiry
  );

  // Mark as downloaded
  await supabase
    .from('downloads')
    .update({
      downloaded_at: new Date().toISOString(),
      ip_address: '0.0.0.0', // You might want to get real IP
      user_agent: navigator.userAgent,
    })
    .eq('id', download.id);

  return signedUrl.signedUrl;
};

export const createDownloadToken = async (
  userId: string,
  productId: string,
  fileId: string,
  orderId: string
) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

  const { data, error } = await supabase
    .from('downloads')
    .insert({
      user_id: userId,
      product_id: productId,
      file_id: fileId,
      order_id: orderId,
      download_token: token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getDownloadStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('downloads')
    .select('id, downloaded_at')
    .eq('user_id', userId);

  if (error) throw error;

  const totalDownloads = data.length;
  const completedDownloads = data.filter(d => d.downloaded_at).length;
  const pendingDownloads = totalDownloads - completedDownloads;

  return {
    total: totalDownloads,
    completed: completedDownloads,
    pending: pendingDownloads,
  };
};