alter table public.colors 
add column if not exists description text,
add column if not exists psychology text,
add column if not exists meaning text,
add column if not exists usage_info text;
