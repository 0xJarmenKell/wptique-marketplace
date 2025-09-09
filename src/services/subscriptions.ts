import { supabase } from '../lib/supabase';
import { SubscriptionPlan, UserSubscription } from '../types';

export const getSubscriptionPlans = async () => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price');

  if (error) throw error;
  return data as SubscriptionPlan[];
};

export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data as UserSubscription & { plan: SubscriptionPlan };
};

export const createSubscription = async (
  userId: string,
  planId: string,
  stripeSubscriptionId?: string
) => {
  const currentPeriodStart = new Date();
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // 1 month from now

  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      current_period_start: currentPeriodStart.toISOString(),
      current_period_end: currentPeriodEnd.toISOString(),
      stripe_subscription_id: stripeSubscriptionId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSubscription = async (
  subscriptionId: string,
  updates: Partial<UserSubscription>
) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const cancelSubscription = async (subscriptionId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'cancelled' })
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};