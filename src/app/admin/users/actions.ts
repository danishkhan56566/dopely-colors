'use server';

import { createAdminClient } from '@/lib/supabase-server';

export type AdminUser = {
    id: string;
    email?: string;
    role: string;
    status: string;
    created_at: string;
    last_sign_in?: string;
};

export async function getUsersAdmin(): Promise<{ users: AdminUser[], error: string | null }> {
    try {
        const supabase = createAdminClient();

        // Fetch auth users (pagination handling simplified for now, fetches 1000)
        const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 1000
        });

        if (authError) {
            console.error('Admin auth fetch error:', authError);
            return { users: [], error: authError.message };
        }

        // Fetch profiles
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*');

        if (profileError) {
            console.error('Admin profile fetch error:', profileError);
            return { users: [], error: profileError.message };
        }

        // Map profiles for quick lookup
        const profileMap = new Map(profiles?.map(p => [p.id, p]));

        // Merge data
        const combinedUsers: AdminUser[] = authUsers.map(user => {
            const profile = profileMap.get(user.id);
            return {
                id: user.id,
                email: user.email,
                role: profile?.role || 'user', // Default to 'user' if no profile
                status: profile?.status || 'active', // Default to 'active'
                created_at: user.created_at,
                last_sign_in: user.last_sign_in_at
            };
        });

        // Sort by created_at descending
        combinedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return { users: combinedUsers, error: null };
    } catch (err: any) {
        console.error('Server action error:', err);
        return { users: [], error: err.message || 'Unknown error' };
    }
}

export async function updateUserRoleAdmin(userId: string, newRole: string) {
    try {
        const supabase = createAdminClient();

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) return { error: error.message };
        return { error: null };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function updateUserStatusAdmin(userId: string, newStatus: string) {
    try {
        const supabase = createAdminClient();

        const { error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', userId);

        if (error) return { error: error.message };
        return { error: null };
    } catch (err: any) {
        return { error: err.message };
    }
}
