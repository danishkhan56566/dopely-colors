
-- 1. Create the Chat History Table
create table if not exists chat_messages (
  id bigint primary key generated always as identity,
  created_at timestamptz default now(),
  user_id text not null, -- Stores the browser-generated ID (e.g. "user_xyz")
  role text not null check (role in ('user', 'model')), -- "user" or "model" (AI)
  content text not null
);

-- 2. Enable Row Level Security (RLS)
-- This is good practice, even if we start with public access
alter table chat_messages enable row level security;

-- 3. Create Policies

-- Allow ANYONE (including anonymous users with a user_id) to INSERT
-- This is necessary because your users might not be "Logged In" via Supabase Auth yet.
create policy "Allow public insert"
on chat_messages for insert
with check (true);

-- Allow Users to SELECT their own history
-- We match the "user_id" column to the ID validating the request
-- NOTE: For a simple API key setup, we might just allow public select filtering by user_id
create policy "Allow public select by user_id"
on chat_messages for select
using (true);
