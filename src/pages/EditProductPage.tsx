import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Save } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";
import { Product } from "../types";

const EditProductPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    platform: "WordPress",
    tags: "",
    image: "",
    images: "",
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditing);

  // Mock product data for editing (in real app, this would come from API)
  useEffect(() => {
    if (isEditing) {
      // Simulate fetching product data
      setTimeout(() => {
        const mockProduct: Product = {
          id: id!,
          title: "Sample Product",
          description: "This is a sample product description",
          price: 59,
          image:
            "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
          images:
            "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
          category: {
            id: "1",
            name: "WordPress Themes",
            slug: "wordpress-themes",
            description: "",
            platform: "WordPress",
          },
          platform: "WordPress",
          tags: "wordpress,theme,responsive",
          author: user!,
          authorId: user!.id,
          rating: 4.5,
          reviewCount: 10,
          downloads: 100,
          files: [],
          version: "1.0.0",
          lastUpdated: new Date(),
          createdAt: new Date(),
          featured: false,
        };

        setFormData({
          title: mockProduct.title,
          description: mockProduct.description,
          price: mockProduct.price.toString(),
          categoryId: mockProduct.category.id,
          platform: mockProduct.platform,
          tags: mockProduct.tags,
          image: mockProduct.image,
          images: mockProduct.images,
        });
        setSelectedImage(mockProduct.image);
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditing, user]);

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

    if (!user || user.role !== "seller") {
      alert("Only sellers can manage products");
      return;
    }

    try {
      if (isEditing) {
        await updateProductMutation.mutateAsync({
          productId: id!,
          productData: {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            categoryId: formData.categoryId,
            platform: formData.platform,
            tags: formData.tags,
            image: formData.image,
            images: formData.images,
          },
        });
        alert("Product updated successfully!");
      } else {
        await createProductMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId,
          platform: formData.platform,
          tags: formData.tags,
          image: formData.image,
          images: formData.images,
        });
        alert("Product created successfully!");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save product:", error);
      alert(
        `Failed to ${
          isEditing ? "update" : "create"
        } product. Please try again.`
      );
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">Only admins can manage products.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
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
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing
            ? "Update your product information"
            : "Add a new product to your store"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your product"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform *
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="WordPress">WordPress</option>
                <option value="React">React</option>
                <option value="Vue.js">Vue.js</option>
                <option value="Laravel">Laravel</option>
                <option value="HTML">HTML</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="wordpress, theme, responsive (comma separated)"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Product Images
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image *
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {selectedImage ? (
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
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
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
                  >
                    {selectedImage ? "Change Image" : "Upload Image"}
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Recommended: 800x600px, max 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              createProductMutation.isPending || updateProductMutation.isPending
            }
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? "Update Product" : "Create Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
