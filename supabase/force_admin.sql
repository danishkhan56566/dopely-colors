-- 1. Force Upgrade User to Admin
-- This explicitly sets your user ID to 'admin' role, creating the profile if it doesn't exist.
INSERT INTO public.profiles (id, role)
VALUES ('d83527a0-292c-4b81-a671-629c9fb28074', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 2. Verify Security Function (Just in case it wasn't created properly)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-apply Palette Permission (Ensure connection is open)
DROP POLICY IF EXISTS "Admin manage palettes" ON public.palettes;
CREATE POLICY "Admin manage palettes" ON public.palettes
  FOR ALL USING ( public.is_admin() );
