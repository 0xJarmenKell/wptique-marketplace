import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProduct,
  getCategories,
  getFeaturedProducts,
  getProductsByAuthor,
  createProduct,
  updateProduct,
  deleteProduct,
  ProductFilters,
} from '../services/products';

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const useFeaturedProducts = (limit?: number) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => getFeaturedProducts(limit),
  });
};

export const useProductsByAuthor = (authorId: string) => {
  return useQuery({
    queryKey: ['products', 'author', authorId],
    queryFn: () => getProductsByAuthor(authorId),
    enabled: !!authorId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, updates }: { productId: string; updates: any }) =>
      updateProduct(productId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};