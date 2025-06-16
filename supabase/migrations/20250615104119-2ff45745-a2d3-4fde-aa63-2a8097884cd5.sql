
-- 1. Create a security definer function so policies do not recurse
CREATE OR REPLACE FUNCTION public.is_own_profile(profile_id uuid)
RETURNS boolean AS $$
  SELECT profile_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 2. Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Remove any existing select policies that may cause recursion issue
DROP POLICY IF EXISTS "Profiles can access own profile" ON public.profiles;

-- 4. Allow users to select (read) their own profile
CREATE POLICY "Profiles can access own profile"
  ON public.profiles
  FOR SELECT
  USING (public.is_own_profile(id));

-- 5. (Optional for admins/officers: allow them to view all, see docs)

