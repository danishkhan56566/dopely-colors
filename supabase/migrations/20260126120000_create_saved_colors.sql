-- Create saved_colors table for user favorites
CREATE TABLE IF NOT EXISTS public.saved_colors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hex text NOT NULL,
  name text, -- Optional custom name
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, hex)
);

-- Enable RLS
ALTER TABLE public.saved_colors ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own saved colors" 
  ON public.saved_colors FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved colors" 
  ON public.saved_colors FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can sections their own saved colors" 
  ON public.saved_colors FOR DELETE 
  USING (auth.uid() = user_id);
