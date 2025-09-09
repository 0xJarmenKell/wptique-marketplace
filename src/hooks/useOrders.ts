import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} from '../services/orders';
import { CartItem } from '../types';

export const useOrders = (userId?: string) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getOrders(userId),
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ items, billingAddress }: { items: CartItem[]; billingAddress?: any }) =>
      createOrder(items, billingAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
      paymentIntentId,
    }: {
      orderId: string;
      status: 'pending' | 'completed' | 'failed' | 'refunded';
      paymentIntentId?: string;
    }) => updateOrderStatus(orderId, status, paymentIntentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
    },
  });
};