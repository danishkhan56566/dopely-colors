-- Add the missing SEO Title column to the palettes table
ALTER TABLE public.palettes 
ADD COLUMN IF NOT EXISTS seo_title text;
