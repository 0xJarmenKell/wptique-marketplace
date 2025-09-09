import { supabase } from "../lib/supabase";
import { products as staticProducts } from "../data/staticData";

export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // First, let's check if there are already products
    const { data: existingProducts, error: checkError } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("Error checking existing products:", checkError);
      return;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log("Products already exist in database. Skipping seed.");
      return;
    }

    // Get the current user to use as author
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated for seeding");
      return;
    }

    // Create categories first
    const categories = Array.from(
      new Set(staticProducts.map((p) => p.category.name))
    ).map((name, index) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: `${name} category`,
      is_active: true,
      sort_order: index,
    }));

    console.log("Creating categories...");
    const { error: categoryError } = await supabase
      .from("categories")
      .insert(categories);

    if (categoryError) {
      console.error("Error creating categories:", categoryError);
      // Continue anyway, categories might already exist
    }

    // Get the first category ID
    const { data: firstCategory } = await supabase
      .from("categories")
      .select("id")
      .limit(1)
      .single();

    const categoryId = firstCategory?.id || "default-category";

    // Create products
    const productsForDB = staticProducts.map((product) => ({
      title: product.title,
      slug: product.title.toLowerCase().replace(/\s+/g, "-"),
      description: product.description,
      short_description: product.description.substring(0, 150),
      price: product.price,
      original_price: product.originalPrice,
      category_id: categoryId,
      author_id: user.id,
      platform: product.platform,
      version: product.version || "1.0.0",
      demo_url: product.demoUrl,
      tags: product.tags ? product.tags.split(",") : [],
      features: ["Premium quality", "Mobile responsive", "Easy customization"],
      requirements: ["Modern browser", "Basic technical knowledge"],
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
      download_count: product.download_count || 0,
      view_count: 0,
      rating_average: product.rating_average || 0,
      rating_count: product.review_count || 0,
    }));

    console.log("Creating products...");
    const { error: productError } = await supabase
      .from("products")
      .insert(productsForDB);

    if (productError) {
      console.error("Error creating products:", productError);
      return;
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
