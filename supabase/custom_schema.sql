-- Create the blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text, -- Markdown or HTML content
  featured_image text,
  
  author text DEFAULT 'Dopely Team',
  country_focus text, -- e.g., 'US', 'UK', 'Global'
  
  seo_title text,
  seo_description text,
  
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read published blogs
CREATE POLICY "Public can view published blogs" ON blogs
  FOR SELECT
  USING (status = 'published');

-- Policy: Admins can do everything
-- Note: You need to ensure your admin user has the correct role or ID. 
-- For simplicity in this tailored setup, we often rely on a specific user UUID or a generic "authenticated" check if you are the only user.
-- STRICT MODE: Only allow specific user ID (Replace USER_ID with your generic admin ID if you have one, or use authenticated for now if you are the only user)
-- FLEXIBLE MODE (Recommended for now): Allow authenticated users to create/edit (assuming you are the only one logging in)

CREATE POLICY "Authenticated users can manage blogs" ON blogs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create an index on slug for fast lookups
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs (slug);
