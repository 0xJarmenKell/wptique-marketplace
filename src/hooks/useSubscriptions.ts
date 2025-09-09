import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubscriptionPlans,
  getUserSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
} from '../services/subscriptions';

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: getSubscriptionPlans,
  });
};

export const useUserSubscription = (userId: string) => {
  return useQuery({
    queryKey: ['user-subscription', userId],
    queryFn: () => getUserSubscription(userId),
    enabled: !!userId,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      planId,
      stripeSubscriptionId,
    }: {
      userId: string;
      planId: string;
      stripeSubscriptionId?: string;
    }) => createSubscription(userId, planId, stripeSubscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subscriptionId, updates }: { subscriptionId: string; updates: any }) =>
      updateSubscription(subscriptionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
};