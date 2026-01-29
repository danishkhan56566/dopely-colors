import { createAdminClient } from './supabase-server';
import { type FeaturePermissions } from '@/app/admin/settings/admin/actions';

/**
 * Server-side check for admin permissions
 */
export async function checkPermission(
    userId: string,
    feature: string,
    grade: 'view' | 'edit' | 'publish'
): Promise<boolean> {
    try {
        const supabase = createAdminClient();

        // 1. Get user role from profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        // Super admins always have all permissions
        if (profile?.role === 'admin') return true;

        // If not admin/editor at all, denied
        if (profile?.role !== 'editor') return false;

        // 2. Fetch specific granular permissions
        const { data } = await supabase
            .from('admin_permissions')
            .select('permissions')
            .eq('user_id', userId)
            .single();

        if (!data || !data.permissions) return false;

        const perms = data.permissions as FeaturePermissions;
        const featurePerms = perms[feature];

        if (!featurePerms) return false;

        return !!featurePerms[grade];
    } catch (error) {
        console.error('Permission check error:', error);
        return false;
    }
}
