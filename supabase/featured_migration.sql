-- Add featured_order column to palettes table
ALTER TABLE public.palettes 
ADD COLUMN IF NOT EXISTS featured_order integer;

-- Update existing featured palettes to have an order
-- We'll just order them by favorites_count or created_at essentially for initial migration
WITH ordered_palettes AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY favorites_count DESC, created_at DESC) as rn
  FROM public.palettes
  WHERE is_featured = true
)
UPDATE public.palettes
SET featured_order = ordered_palettes.rn
FROM ordered_palettes
WHERE public.palettes.id = ordered_palettes.id;
