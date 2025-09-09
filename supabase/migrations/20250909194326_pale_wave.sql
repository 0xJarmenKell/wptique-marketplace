/*
  # Seed Initial Data

  1. Categories
    - WordPress Themes
    - React Components
    - Vue Templates
    - Laravel Packages
    - HTML Templates

  2. Subscription Plans
    - Free Plan
    - Pro Plan
    - Enterprise Plan

  3. Sample Products
    - Demo products for each category
*/

-- Insert categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('WordPress Themes', 'wordpress-themes', 'Premium WordPress themes for all types of websites', 1),
  ('React Components', 'react-components', 'Reusable React components and UI libraries', 2),
  ('Vue Templates', 'vue-templates', 'Modern Vue.js templates and starter kits', 3),
  ('Laravel Packages', 'laravel-packages', 'Laravel packages and complete applications', 4),
  ('HTML Templates', 'html-templates', 'Static HTML templates and landing pages', 5),
  ('Plugins & Extensions', 'plugins-extensions', 'Plugins and extensions for various platforms', 6),
  ('Code Snippets', 'code-snippets', 'Useful code snippets and utilities', 7),
  ('UI Kits', 'ui-kits', 'Complete UI design systems and component libraries', 8);

-- Insert subscription plans
INSERT INTO subscription_plans (name, description, price, interval, features, max_downloads, max_products) VALUES
  (
    'Free',
    'Perfect for getting started',
    0.00,
    'month',
    ARRAY['Up to 3 downloads per month', 'Basic support', 'Access to free products'],
    3,
    -1
  ),
  (
    'Pro',
    'For professional developers',
    19.99,
    'month',
    ARRAY['Unlimited downloads', 'Priority support', 'Access to all products', 'Early access to new releases'],
    -1,
    -1
  ),
  (
    'Enterprise',
    'For teams and agencies',
    99.99,
    'month',
    ARRAY['Everything in Pro', 'Team collaboration', 'Custom licensing', 'Dedicated support'],
    -1,
    -1
  );

-- Note: Sample products will be inserted through the application
-- to demonstrate the full product creation workflow