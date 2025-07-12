/*
  # Create Demo Users Migration

  1. Demo Users
    - Creates three demo users for testing:
      - admin@gp.gov.in (Officer role)
      - staff@gp.gov.in (Staff role) 
      - citizen@gp.gov.in (Citizen role)
    
  2. User Profiles
    - Creates corresponding profiles for each demo user
    - Sets appropriate roles and basic information
    
  3. Security
    - Uses Supabase's built-in authentication system
    - Passwords are hashed automatically by Supabase
*/

-- Insert demo users into auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES 
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '00000000-0000-0000-0000-000000000000',
  'admin@gp.gov.in',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin Officer"}',
  false,
  'authenticated'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  '00000000-0000-0000-0000-000000000000',
  'staff@gp.gov.in',
  crypt('staff123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Staff Member"}',
  false,
  'authenticated'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  '00000000-0000-0000-0000-000000000000',
  'citizen@gp.gov.in',
  crypt('citizen123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test Citizen"}',
  false,
  'authenticated'
);

-- Insert corresponding profiles
INSERT INTO profiles (
  id,
  full_name,
  email,
  phone,
  address,
  role,
  created_at,
  updated_at
) VALUES 
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Admin Officer',
  'admin@gp.gov.in',
  '+91-9876543210',
  'Gram Panchayat Office, Village Center',
  'officer',
  now(),
  now()
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'Staff Member',
  'staff@gp.gov.in',
  '+91-9876543211',
  'Gram Panchayat Office, Village Center',
  'staff',
  now(),
  now()
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'Test Citizen',
  'citizen@gp.gov.in',
  '+91-9876543212',
  'Village Road, House No. 123',
  'citizen',
  now(),
  now()
);

-- Insert demo identities for email authentication
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
) VALUES 
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "email": "admin@gp.gov.in"}',
  'email',
  now(),
  now()
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12", "email": "staff@gp.gov.in"}',
  'email',
  now(),
  now()
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13", "email": "citizen@gp.gov.in"}',
  'email',
  now(),
  now()
);