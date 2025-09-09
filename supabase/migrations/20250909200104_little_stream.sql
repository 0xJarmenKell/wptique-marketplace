/*
  # Create Admin User and Dashboard Setup

  1. Admin User Creation
    - Creates a default admin user for dashboard access
    - Sets up proper role and permissions
  
  2. Admin Functions
    - Helper functions for admin operations
    - User role management functions

  Note: This creates a default admin user with email: admin@devmarket.com and password: admin123
  You should change these credentials after first login.
*/

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT DEFAULT 'Admin User'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('full_name', admin_name),
    false,
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO user_id;

  -- Create profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    admin_email,
    admin_name,
    'admin',
    NOW(),
    NOW()
  );

  RETURN 'Admin user created successfully with ID: ' || user_id::TEXT;
END;
$$;

-- Create the default admin user
SELECT create_admin_user('admin@devmarket.com', 'admin123', 'System Administrator');

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin', updated_at = NOW()
  WHERE email = user_email;
  
  IF FOUND THEN
    RETURN 'User promoted to admin successfully';
  ELSE
    RETURN 'User not found';
  END IF;
END;
$$;

-- Function to get admin stats
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'total_products', (SELECT COUNT(*) FROM products WHERE is_active = true),
    'total_orders', (SELECT COUNT(*) FROM orders),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed'),
    'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
    'active_subscriptions', (SELECT COUNT(*) FROM user_subscriptions WHERE status = 'active')
  ) INTO stats;
  
  RETURN stats;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_admin_user TO service_role;
GRANT EXECUTE ON FUNCTION promote_to_admin TO service_role;
GRANT EXECUTE ON FUNCTION get_admin_stats TO authenticated;