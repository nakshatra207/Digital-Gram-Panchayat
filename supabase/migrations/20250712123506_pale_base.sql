/*
  # Fix profiles table RLS policies

  1. Security Changes
    - Drop existing problematic RLS policies that cause infinite recursion
    - Create simple, safe RLS policies for the profiles table
    - Ensure users can access their own profile data
    - Allow staff and officers to view profiles without recursion

  2. Policy Changes
    - Replace complex policies with simple auth.uid() checks
    - Remove any recursive policy dependencies
    - Add proper policies for different user roles
*/

-- Drop all existing policies on profiles table to start fresh
DROP POLICY IF EXISTS "Profiles can access own profile" ON profiles;
DROP POLICY IF EXISTS "Staff and officers can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create a simple function to check if user is staff or officer
CREATE OR REPLACE FUNCTION is_staff_or_officer()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' IN ('staff', 'officer')
  );
$$;

-- Allow staff and officers to view all profiles using the function
CREATE POLICY "Staff and officers can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_staff_or_officer());

-- Allow staff and officers to update profiles
CREATE POLICY "Staff and officers can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_staff_or_officer())
  WITH CHECK (is_staff_or_officer());