'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export type PermissionGrade = {
    view: boolean;
    edit: boolean;
    publish: boolean;
};

export type FeaturePermissions = Record<string, PermissionGrade>;

/**
 * Get permissions for a specific user
 */
export async function getAdminPermissions(userId: string): Promise<{ permissions: FeaturePermissions | null, error: string | null }> {
    try {
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('admin_permissions')
            .select('permissions')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return { permissions: null, error: null };
            }
            return { permissions: null, error: error.message };
        }

        return { permissions: data.permissions as FeaturePermissions, error: null };
    } catch (err: any) {
        return { permissions: null, error: err.message };
    }
}

/**
 * Update permissions for a specific user
 */
export async function updateAdminPermissions(userId: string, permissions: FeaturePermissions) {
    try {
        const supabase = createAdminClient();

        // Upsert permissions
        const { error } = await supabase
            .from('admin_permissions')
            .upsert({
                user_id: userId,
                permissions: permissions,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });

        if (error) throw error;

        revalidatePath('/admin/settings/admin');
        return { success: true };
    } catch (err: any) {
        console.error('Update Permissions Error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Log an action to the audit trail
 */
export async function logAdminAction(action: string, details: string, operatorId?: string) {
    // In a real app, this would write to a dedicated 'audit_logs' table
    // For now we can just console log or if we have a table, insert into it.
    console.log(`[AUDIT] Action: ${action} | Details: ${details} | Operator: ${operatorId || 'System'}`);

    // Optional: Insert into audit_logs table if you want to implement it now
    /*
    const supabase = createAdminClient();
    await supabase.from('audit_logs').insert({
        operator_id: operatorId,
        action,
        details,
        timestamp: new Date().toISOString()
    });
    */
}
