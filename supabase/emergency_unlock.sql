-- EMERGENCY UNLOCK
-- This disables the security checks solely for the palettes table.
-- This allows anyone (even anonymous users if not careful, but technically authenticated) to Insert.
-- Use this to verify the UI works, then we can re-enable security later.

ALTER TABLE public.palettes DISABLE ROW LEVEL SECURITY;
