-- Add Country and Traffic Source to Profiles for Analytics
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS traffic_source text;

-- Update the handle_new_user trigger function to capture metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, country, traffic_source)
  VALUES (
    new.id, 
    'user',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'traffic_source'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
