-- Run this in your Supabase SQL Editor
-- This adds the necessary tracking columns to handle automated MoR provisioning

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS checkout_session_id TEXT;

-- Create an index to quickly lookup users by their generated subscription ID from the Webhook
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON public.profiles(subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_ls_customer_id ON public.profiles(lemon_squeezy_customer_id);

-- Optional: RLS Policies for secure viewing if not already setup
-- Assumes you already have a policy allowing users to view their own profile.
