
-- Enable Row Level Security on the services table (if not already enabled)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Drop existing duplicate/incorrect public SELECT policies if needed
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

-- Allow anyone to view active services (for the /services portal screen)
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT
  USING (is_active = true);

-- (Optional: Officers can manage services; create this only if you want officer-only administration)
-- CREATE POLICY "Officers can manage services" ON public.services
--   FOR ALL
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.profiles 
--       WHERE id = auth.uid() AND role = 'officer'
--     )
--   );
