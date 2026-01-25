-- Allow ANY authenticated user to insert palettes (for now, to unblock Admin)
-- We strictly rely on the app logic to enforce who can access the /admin route
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.palettes;

CREATE POLICY "Enable insert for authenticated users" ON public.palettes
  FOR INSERT 
  WITH CHECK ( auth.role() = 'authenticated' );

-- Also ensure they can see what they inserted
DROP POLICY IF EXISTS "Enable select for own palettes" ON public.palettes;
CREATE POLICY "Enable select for own palettes" ON public.palettes
  FOR SELECT 
  USING ( auth.uid() = created_by OR status = 'published' );

-- Enable update for own palettes
DROP POLICY IF EXISTS "Enable update for own palettes" ON public.palettes;
CREATE POLICY "Enable update for own palettes" ON public.palettes
  FOR UPDATE
  USING ( auth.uid() = created_by );

-- Enable delete for own palettes
DROP POLICY IF EXISTS "Enable delete for own palettes" ON public.palettes;
CREATE POLICY "Enable delete for own palettes" ON public.palettes
  FOR DELETE
  USING ( auth.uid() = created_by );
