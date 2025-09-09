import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { getProductsByAuthor } from "../services/products";
import { getOrders } from "../services/orders";
import { supabase } from "../lib/supabase";

// Dashboard data hooks
export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboardStats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      if (user.role === "admin") {
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, price, download_count");

        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("id, total_amount");

        if (productsError || ordersError) {
          throw new Error(productsError?.message || ordersError?.message);
        }

        const totalEarnings =
          orders?.reduce((acc, order) => acc + order.total_amount, 0) || 0;
        const totalDownloads =
          products?.reduce((acc, product) => acc + product.download_count, 0) ||
          0;

        return {
          totalProducts: products?.length || 0,
          totalEarnings,
          totalDownloads,
          totalOrders: orders?.length || 0,
          recentOrders: [], // Placeholder
        };
      } else {
        // Stats for customers
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("id, total_amount")
          .eq("user_id", user.id);

        if (ordersError) throw ordersError;

        const totalSpent =
          orders?.reduce((acc, order) => acc + order.total_amount, 0) || 0;

        return {
          totalPurchases: orders?.length || 0,
          totalSpent,
          recentPurchases: [], // Placeholder
        };
      }
    },
    enabled: !!user,
  });
};

export const useUserProducts = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userProducts", user?.id],
    queryFn: () => getProductsByAuthor(user!.id),
    enabled: !!user && user.role === "admin",
  });
};

export const useUserOrders = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userOrders", user?.id],
    queryFn: () => getOrders(user!.id),
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  // This should be implemented with a mutation that updates the 'profiles' table
  return {
    mutate: (data: { name?: string; avatar?: string }) => {
      console.log("Profile update:", data);
    },
    isLoading: false,
  };
};

// These are now in useProducts.ts and are connected to the backend
// export const useCreateProduct = () => {};
// export const useUpdateProduct = () => {};
// export const useDeleteProduct = () => {};

export const useAllUsers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
    enabled: !!user && user.role === "admin",
  });
};

// Blog management hooks
export const useBlogPosts = () => {
  return {
    data: { posts: [] },
    isLoading: false,
    error: null,
  };
};

export const useCreateBlogPost = () => {
  return {
    mutate: (data: { title: string; content: string }) => {
      console.log("Create blog post:", data);
    },
    isLoading: false,
  };
};

export const useUpdateBlogPost = () => {
  return {
    mutate: ({ id, data }: { id: string; data: { title?: string } }) => {
      console.log("Update blog post:", id, data);
    },
    isLoading: false,
  };
};

export const useDeleteBlogPost = () => {
  return {
    mutate: (postId: string) => {
      console.log("Delete blog post:", postId);
    },
    isLoading: false,
  };
};
