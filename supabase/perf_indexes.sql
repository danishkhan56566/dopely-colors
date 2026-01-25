-- Indexes for Explore Page performance
-- Speeds up "New" sorting
CREATE INDEX IF NOT EXISTS idx_palettes_created_at ON public.palettes(created_at DESC);

-- Speeds up "Popular" sorting
CREATE INDEX IF NOT EXISTS idx_palettes_favorites ON public.palettes(favorites_count DESC);

-- Speeds up Category Filtering (using GIN for array)
CREATE INDEX IF NOT EXISTS idx_palettes_category ON public.palettes USING GIN (category);

-- Speeds up Status filtering (common where clause)
CREATE INDEX IF NOT EXISTS idx_palettes_status ON public.palettes(status);

-- Composite index for common "Published + Sorted" queries
CREATE INDEX IF NOT EXISTS idx_palettes_status_created ON public.palettes(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_palettes_status_favorites ON public.palettes(status, favorites_count DESC);
