'use server';

import { createAdminClient } from '@/lib/supabase-server';

export async function createPalettesBulk(palettes: any[]) {
    try {
        if (!process.env.SUPABASE_SERVICE_KEY) return { error: 'Server config missing Service Key' };

        const adminClient = createAdminClient();

        const { error } = await adminClient
            .from('palettes')
            .insert(palettes);

        if (error) throw error;

        return { success: true };
    } catch (err: any) {
        console.error('Bulk Insert Error:', err);
        return { error: err.message };
    }
}
