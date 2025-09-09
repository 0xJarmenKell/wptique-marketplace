import React from "react";
import { supabase } from "../lib/supabase";

const DatabaseDebugPage: React.FC = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const checkDatabase = async () => {
    setLoading(true);
    try {
      // Check products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*");

      if (productsError) {
        console.error("Products error:", productsError);
      } else {
        console.log("Products in database:", productsData);
        setProducts(productsData || []);
      }

      // Check categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*");

      if (categoriesError) {
        console.error("Categories error:", categoriesError);
      } else {
        console.log("Categories in database:", categoriesData);
        setCategories(categoriesData || []);
      }
    } catch (error) {
      console.error("Database check error:", error);
    }
    setLoading(false);
  };

  const addSampleProduct = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in first");
        return;
      }

      // First create a category if none exists
      let categoryId = null;
      if (categories.length === 0) {
        const { data: newCategory, error: catError } = await supabase
          .from("categories")
          .insert({
            name: "WordPress Themes",
            slug: "wordpress-themes",
            description: "Premium WordPress themes",
            is_active: true,
            sort_order: 0,
          })
          .select()
          .single();

        if (catError) {
          console.error("Error creating category:", catError);
          return;
        }
        categoryId = newCategory.id;
      } else {
        categoryId = categories[0].id;
      }

      // Create a sample product
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          title: "Sample WordPress Theme",
          slug: "sample-wordpress-theme",
          description:
            "A beautiful and responsive WordPress theme for modern websites.",
          short_description: "Beautiful responsive WordPress theme",
          price: 59,
          original_price: 89,
          category_id: categoryId,
          author_id: user.id,
          platform: "WordPress",
          version: "1.0.0",
          demo_url: "https://demo.example.com",
          tags: ["wordpress", "responsive", "ecommerce"],
          features: [
            "Responsive design",
            "Easy customization",
            "SEO optimized",
          ],
          requirements: ["WordPress 5.0+", "PHP 7.4+"],
          is_featured: true,
          is_active: true,
          download_count: 0,
          view_count: 0,
          rating_average: 0,
          rating_count: 0,
        })
        .select();

      if (productError) {
        console.error("Error creating product:", productError);
        alert("Error creating product: " + productError.message);
      } else {
        console.log("Product created:", newProduct);
        alert("Sample product created successfully!");
        checkDatabase(); // Refresh the data
      }
    } catch (error) {
      console.error("Error adding sample product:", error);
      alert("Error: " + error);
    }
  };

  React.useEffect(() => {
    checkDatabase();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Debug Page</h1>

      <div className="space-y-6">
        <button
          onClick={checkDatabase}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Database"}
        </button>

        <button
          onClick={addSampleProduct}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4"
        >
          Add Sample Product
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Categories ({categories.length})
            </h2>
            <div className="bg-gray-100 p-4 rounded">
              {categories.length === 0 ? (
                <p className="text-gray-600">No categories found</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id} className="text-sm">
                      <strong>{cat.name}</strong> ({cat.slug}) - Active:{" "}
                      {cat.is_active ? "Yes" : "No"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Products ({products.length})
            </h2>
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
              {products.length === 0 ? (
                <p className="text-gray-600">No products found</p>
              ) : (
                <ul className="space-y-2">
                  {products.map((product) => (
                    <li key={product.id} className="text-sm border-b pb-2">
                      <strong>{product.title}</strong>
                      <br />
                      Price: ${product.price} | Featured:{" "}
                      {product.is_featured ? "Yes" : "No"} | Active:{" "}
                      {product.is_active ? "Yes" : "No"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDebugPage;
