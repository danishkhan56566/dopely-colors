-- Create messages table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text,
  last_name text,
  email text not null,
  message text not null,
  status text default 'unread' check (status in ('unread', 'read', 'archived'))
);

-- Enable RLS
alter table messages enable row level security;

-- Policies

-- Public can insert (send messages)
drop policy if exists "Public can create messages" on messages;
create policy "Public can create messages"
  on messages for insert
  with check (true);

-- Authenticated users (admins) can view all
drop policy if exists "Admins can view all messages" on messages;
create policy "Admins can view all messages"
  on messages for select
  to authenticated
  using (true);

-- Authenticated users (admins) can update (mark as read)
drop policy if exists "Admins can update messages" on messages;
create policy "Admins can update messages"
  on messages for update
  to authenticated
  using (true);

-- Authenticated users (admins) can delete
drop policy if exists "Admins can delete messages" on messages;
create policy "Admins can delete messages"
  on messages for delete
  to authenticated
  using (true);
