-- Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  color text DEFAULT 'bg-gray-500',
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Seed Initial Data
INSERT INTO public.categories (name, slug, color) VALUES
('SaaS', 'saas', 'bg-blue-500'),
('Nature', 'nature', 'bg-green-500'),
('Food', 'food', 'bg-orange-500'),
('Cyberpunk', 'cyberpunk', 'bg-purple-500'),
('Minimal', 'minimal', 'bg-gray-500'),
('Tech', 'tech', 'bg-indigo-500'),
('Pastel', 'pastel', 'bg-pink-300'),
('Dark Mode', 'dark-mode', 'bg-slate-900')
ON CONFLICT (name) DO NOTHING;
