'use server';

import { createAdminClient, createClient } from '@/lib/supabase-server';
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
export async function logAdminAction(payload: {
    action: string;
    details: string;
    operatorId?: string;
    operatorEmail?: string;
    payload?: any;
    context?: string;
}) {
    try {
        const supabase = createAdminClient();

        let email = payload.operatorEmail;
        let userId = payload.operatorId;

        // If no email provided, try to get from current session
        if (!email) {
            const client = await createClient();
            const { data: { user } } = await client.auth.getUser();
            if (user) {
                email = user.email;
                userId = user.id;
            }
        }

        const { error } = await supabase
            .from('audit_logs')
            .insert({
                operator_id: userId,
                operator_email: email || 'System',
                action: payload.action,
                details: payload.details,
                payload: payload.payload,
                context: payload.context || 'Admin Console'
            });

        if (error) {
            console.error('Audit Log Error:', error);
        }
    } catch (err) {
        console.error('Audit Log Failed:', err);
    }
}

/**
 * Fetch audit logs
 */
export async function getAuditLogs() {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            if (error.code === '42P01') { // relation "audit_logs" does not exist
                return { logs: [], error: 'Table Missing: Run audit_logs migration' };
            }
            throw error;
        }
        return { logs: data || [], error: null };
    } catch (err: any) {
        return { logs: [], error: err.message };
    }
}

/**
 * Invite a new admin/editor
 */
export async function inviteAdmin(email: string, role: 'admin' | 'editor') {
    try {
        const supabase = createAdminClient();

        console.log(`[Admin] Inviting ${email} as ${role}`);

        const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
            data: { role: role }
        });

        // Handle specific case: User already exists
        if (error && (error.message.includes('already registered') || error.status === 422 || error.status === 400)) {
            console.log(`[Admin] User ${email} already exists. Attempting to promote.`);

            // Find the user ID from profiles
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', email)
                .single();

            if (profileError || !profile) {
                console.warn('[Admin] Profile lookup failed, but user exists in Auth. Attempting to resolve User ID via Admin API.');

                // Try to resolve user ID via generateLink (safe side-effect-free way to get user object)
                const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
                    type: 'magiclink',
                    email: email
                });

                if (linkError || !linkData.user) {
                    console.error('[Admin] Failed to resolve user via generic link:', linkError);
                    return { success: false, error: 'User exists but profile not found. Cannot promote.' };
                }

                // Create the missing profile
                // Fallback: DB constraint only allows 'admin' or 'user', so we map 'editor' -> 'admin' for now
                const dbRole = role === 'editor' ? 'admin' : role;

                const { error: createProfileError } = await supabase.from('profiles').insert({
                    id: linkData.user.id,
                    role: dbRole
                    // status and email columns do not exist in profiles table
                });

                if (createProfileError) {
                    console.error('[Admin] Failed to create missing profile:', createProfileError);
                    throw createProfileError;
                }

                console.log(`[Admin] Created missing profile for ${email}`);

                // Since we just created it with the correct role, we are done.
                await logAdminAction({
                    action: 'Promote User (Fixed Profile)',
                    details: `Created missing profile and promoted ${email} to ${role}`,
                    context: 'User Management'
                });

                revalidatePath('/admin/settings/admin');
                return { success: true };
            }

            // Update their role
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: role })
                .eq('id', profile.id);

            if (updateError) throw updateError;

            // Also update Auth metadata if possible (optional but good for consistency)
            await supabase.auth.admin.updateUserById(profile.id, {
                user_metadata: { role: role }
            });

            await logAdminAction({
                action: 'Promote User',
                details: `Promoted existing user ${email} to ${role}`,
                context: 'User Management'
            });

            revalidatePath('/admin/settings/admin');
            return { success: true };
        }

        if (error) throw error;

        // Also create an entry in profiles to ensure role is tracked
        if (data.user) {
            // Fallback: DB constraint only allows 'admin' or 'user'
            const dbRole = role === 'editor' ? 'admin' : role;

            await supabase.from('profiles').upsert({
                id: data.user.id,
                role: dbRole
                // status and email columns do not exist in profiles table
            });

            await logAdminAction({
                action: 'Invite Admin',
                details: `Invited ${email} as ${role}`,
                context: 'User Management'
            });
        }

        revalidatePath('/admin/settings/admin');
        return { success: true };
    } catch (err: any) {
        console.error('Invite Admin Error:', err);
        return { success: false, error: err.message };
    }
}
