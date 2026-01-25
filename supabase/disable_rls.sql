-- TEMPORARY DEBUG FIX: Disable RLS
-- This turns off all permission checks for the 'posts' table.
-- Why? Because your Admin Panel (Client) key and Auth Session might be mismatched.
-- This will allow you to Add/Delete posts immediately.

ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- If you want to re-enable it later, run:
-- ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
