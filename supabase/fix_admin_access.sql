-- 1. MAKE EVERYONE ADMIN (For your single-user app)
-- This ensures that whoever you are logged in as will have access.
UPDATE public.profiles 
SET role = 'admin';

-- 2. FIX RLS POLICIES (Make them simpler and more robust)
ALTER TABLE public.palettes ENABLE ROW LEVEL SECURITY;

-- Allow public to see published palettes
DROP POLICY IF EXISTS "Public read palettes" ON public.palettes;
CREATE POLICY "Public read palettes" ON public.palettes
  FOR SELECT USING (status = 'published');

-- Allow Admins to do EVERYTHING (Select, Insert, Update, Delete)
DROP POLICY IF EXISTS "Admins manage all" ON public.palettes;
CREATE POLICY "Admins manage all" ON public.palettes
  FOR ALL USING (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- 3. CONFIRM IT WORKED
-- This query will show you your current user and role
select * from public.profiles;
