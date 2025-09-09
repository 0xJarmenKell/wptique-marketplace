import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCreateProduct } from "../hooks/useProducts";
import { useCategories } from "../hooks/useProducts";

const CreateProductPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    price: "",
    category_id: "",
    platform: "WordPress",
    tags: "",
    demo_url: "",
    image: "",
    images: "",
  });

  useEffect(() => {
    if (categories.length > 0 && !formData.category_id) {
      setFormData((prev) => ({ ...prev, category_id: categories[0].id }));
    }
  }, [categories, formData.category_id]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setFormData((prev) => ({
          ...prev,
          image: result,
          images: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== "admin") {
      alert("Only admins can create products");
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        platform: formData.platform,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        demo_url: formData.demo_url,
        features: [],
        requirements: [],
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  // Check if user has permission to create products
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">Only admins can create products.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Product
        </h1>
        <p className="text-gray-600">Add a new digital product to your store</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Product Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product title"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                disabled={isLoadingCategories}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {isLoadingCategories ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label
                htmlFor="platform"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="WordPress">WordPress</option>
                <option value="React">React</option>
                <option value="Vue">Vue</option>
                <option value="Angular">Angular</option>
                <option value="HTML">HTML</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., theme, responsive, modern"
              />
            </div>

            {/* Demo URL */}
            <div>
              <label
                htmlFor="demo_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Demo URL
              </label>
              <input
                type="url"
                id="demo_url"
                name="demo_url"
                value={formData.demo_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="mt-6">
            <label
              htmlFor="short_description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Short Description
            </label>
            <textarea
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A brief summary of your product..."
            />
          </div>

          {/* Description */}
          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your product..."
            />
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="mx-auto max-h-64 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setFormData((prev) => ({
                        ...prev,
                        image: "",
                        images: "",
                      }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="cursor-pointer text-blue-600 hover:text-blue-500"
                    >
                      Upload an image
                    </label>
                    <p className="mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={createProductMutation.isPending}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createProductMutation.isPending ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
