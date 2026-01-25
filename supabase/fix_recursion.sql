-- 1. Create a Secure Function to check Admin Status
-- "SECURITY DEFINER" means this function runs with the privileges of the database owner,
-- bypassing RLS on user_profiles to avoid the recursion loop.
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

-- 2. Fix PROFILES Policy (The Source of the Recursion)
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;

CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT USING (
    public.is_admin() -- Uses the secure function instead of querying the table directly
  );

-- 3. Update Other Policies to use the new function (Cleaner & Safer)

-- Posts/Blog
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
CREATE POLICY "Admins can manage all posts" ON public.posts
  FOR ALL USING ( public.is_admin() );

-- Palettes
DROP POLICY IF EXISTS "Admin manage palettes" ON public.palettes;
CREATE POLICY "Admin manage palettes" ON public.palettes
  FOR ALL USING ( public.is_admin() );
