-- 1. Ensure Profile Exists & Is Admin (Hardcoded for your ID)
INSERT INTO public.profiles (id, role)
VALUES ('d83527a0-292c-4b81-a671-629c9fb28074', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 2. Force Security Definer Function Update
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Check directly in the table, bypassing RLS
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Reset Palette Policies COMPLETELY
ALTER TABLE public.palettes ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Admin manage palettes" ON public.palettes;
DROP POLICY IF EXISTS "Admin insert palettes" ON public.palettes;
DROP POLICY IF EXISTS "Admin update palettes" ON public.palettes;
DROP POLICY IF EXISTS "Admin delete palettes" ON public.palettes;
DROP POLICY IF EXISTS "Public read palettes" ON public.palettes;

-- Create Explicit Policies (Safest Approach)

-- A. PUBLIC READ (Published only)
CREATE POLICY "Public read palettes" ON public.palettes
  FOR SELECT USING (status = 'published');

-- B. ADMIN ALL ACCESS (Explicit separation)
CREATE POLICY "Admin insert palettes" ON public.palettes
  FOR INSERT WITH CHECK ( public.is_admin() );

CREATE POLICY "Admin update palettes" ON public.palettes
  FOR UPDATE USING ( public.is_admin() );

CREATE POLICY "Admin delete palettes" ON public.palettes
  FOR DELETE USING ( public.is_admin() );

CREATE POLICY "Admin select palettes" ON public.palettes
  FOR SELECT USING ( public.is_admin() );

