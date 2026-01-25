-- Function to increment favorites count
create or replace function increment_favorites(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.palettes
  set favorites_count = favorites_count + 1
  where id = row_id;
end;
$$;

-- Function to decrement favorites count
create or replace function decrement_favorites(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.palettes
  set favorites_count = favorites_count - 1
  where id = row_id;
end;
$$;
