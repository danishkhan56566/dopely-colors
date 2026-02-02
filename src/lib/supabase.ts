import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cafwmpzdgatxpavuwnvh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_S5cNoYZ_FXWt9nHOwWGHjg_N1mVxbvV';

// Safe initialization
export const supabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return !!supabaseUrl && !!supabaseAnonKey;
};

// --- Safe Auth Helpers to ignore AbortError ---

export const safeGetSession = async () => {
    try {
        return await supabase.auth.getSession();
    } catch (error: any) {
        if (
            (error instanceof Error && error.name === 'AbortError') ||
            (error?.message && error.message.includes('aborted'))
        ) {
            return { data: { session: null }, error: null };
        }
        throw error;
    }
};

export const safeGetUser = async () => {
    try {
        return await supabase.auth.getUser();
    } catch (error: any) {
        if (
            (error instanceof Error && error.name === 'AbortError') ||
            (error?.message && error.message.includes('aborted'))
        ) {
            return { data: { user: null }, error: null };
        }
        throw error;
    }
};
