-- RENAME TABLE FIX
-- Run this ENTIRE script in Supabase SQL Editor

-- 1. Create the new 'posts' table
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  featured_image text,
  author text DEFAULT 'Danish Khan',
  country_focus text,
  seo_title text,
  seo_description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamp with time zone
);

-- 2. Enable Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. Create Access Policies (Permissions)
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.posts;
CREATE POLICY "Authenticated users can manage posts" ON public.posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. FORCE REFRESH of Schema Cache (Fixes "table not found" errors)
NOTIFY pgrst, 'reload config';
