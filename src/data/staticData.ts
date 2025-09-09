export const products = [
  {
    id: "1",
    title: "Modern E-commerce Theme",
    description:
      "A sleek, responsive WordPress theme perfect for online stores.",
    price: 59,
    originalPrice: 89,
    image:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    category: {
      id: "1",
      name: "WordPress Themes",
      slug: "wordpress-themes",
      description: "Premium WordPress themes",
      platform: "WordPress",
    },
    platform: "WordPress",
    tags: "ecommerce,responsive",
    author: {
      id: "admin-user-id",
      full_name: "Admin User",
      email: "admin@devmarket.com",
      role: "admin",
    },
    authorId: "admin-user-id",
    rating_average: 4.8,
    review_count: 124,
    download_count: 2847,
    demoUrl: "https://demo.example.com",
    version: "2.1.0",
    is_featured: true,
    is_active: true,
    files: [],
    reviews: [],
    created_at: new Date(),
    lastUpdated: new Date(),
  },
  {
    id: "2",
    title: "React Dashboard Components",
    description:
      "Complete set of modern dashboard components built with React.",
    price: 79,
    image:
      "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    category: {
      id: "2",
      name: "React Components",
      slug: "react-components",
      description: "Modern React components",
      platform: "React",
    },
    platform: "React",
    tags: "dashboard,typescript",
    author: {
      id: "admin-user-id",
      full_name: "Admin User",
      email: "admin@devmarket.com",
      role: "admin",
    },
    authorId: "admin-user-id",
    rating_average: 4.9,
    review_count: 89,
    download_count: 1523,
    demoUrl: "https://demo.example.com",
    version: "1.5.2",
    is_featured: true,
    is_active: true,
    files: [],
    reviews: [],
    created_at: new Date(),
    lastUpdated: new Date(),
  },
];

export const platformStats = [
  { label: "Active Products", value: "12,000+" },
  { label: "Happy Customers", value: "50,000+" },
  { label: "Total Downloads", value: "2.5M+" },
  { label: "Expert Sellers", value: "1,200+" },
];
