import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import CreateBlogPostPage from "./pages/CreateBlogPostPage";
// import SubscriptionPlansPage from "./pages/SubscriptionPlansPage";
import SubscriptionCheckoutPage from "./pages/SubscriptionCheckoutPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import DatabaseDebugPage from "./pages/DatabaseDebugPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/create-product"
                    element={<CreateProductPage />}
                  />
                  <Route
                    path="/edit-product/:id"
                    element={<EditProductPage />}
                  />
                  <Route
                    path="/create-blog-post"
                    element={<CreateBlogPostPage />}
                  />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  {/* <Route
                    path="/subscription-plans"
                    element={<SubscriptionPlansPage />}
                  /> */}
                  <Route
                    path="/subscription-checkout/:planId"
                    element={<SubscriptionCheckoutPage />}
                  />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogPostPage />} />
                  <Route path="/debug" element={<DatabaseDebugPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
