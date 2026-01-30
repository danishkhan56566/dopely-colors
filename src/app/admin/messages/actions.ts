'use server';

import { createAdminClient } from '@/lib/supabase-server';

export type AdminMessage = {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    message: string;
    status: 'unread' | 'read' | 'archived';
};

export async function getMessagesAdmin(filter: 'all' | 'unread' = 'all') {
    try {
        if (!process.env.SUPABASE_SERVICE_KEY) {
            console.error('SERVER ACTION: Missing SUPABASE_SERVICE_KEY');
            return { error: 'Server config missing Service Key' };
        }

        const supabase = createAdminClient();

        console.log('SERVER ACTION: Connecting to Supabase...');
        let query = supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter === 'unread') {
            query = query.eq('status', 'unread');
        }

        const { data, error } = await query;

        if (error) {
            console.error('SERVER ACTION: Query failed:', error);
            throw error;
        }

        console.log(`SERVER ACTION: Found ${data?.length} messages. Filter: ${filter}`);

        const messages: AdminMessage[] = (data || []).map((msg: any) => ({
            id: msg.id,
            created_at: msg.created_at,
            first_name: msg.first_name,
            last_name: msg.last_name,
            email: msg.email,
            message: msg.message,
            status: msg.status || 'unread'
        }));

        // ADD FAKE DEBUG MESSAGE
        messages.unshift({
            id: 'debug-fake-id',
            created_at: new Date().toISOString(),
            first_name: 'DEBUG',
            last_name: 'SYSTEM',
            email: 'debug@system.com',
            message: 'If you can see this, the Server Action IS returning data to the Client.',
            status: 'unread'
        });

        // FORCE RETURN STATIC DATA ONLY TO TEST PIPELINE
        // return { messages: JSON.parse(JSON.stringify(messages)) };

        console.log('SERVER ACTION: Returning static debug message');
        return {
            messages: [{
                id: 'FORCE_STATIC_RETURN',
                created_at: new Date().toISOString(),
                first_name: 'FORCE',
                last_name: 'RETURN',
                email: 'force@check.com',
                message: 'This is a hardcoded return. If you see this, Supabase fetch is likely crashing/hanging.',
                status: 'unread'
            }]
        };
    } catch (err: any) {
        console.error('Fetch Messages Error:', err);
        return { error: err.message };
    }
}

export async function updateMessageStatusAdmin(id: string, status: string) {
    try {
        if (!process.env.SUPABASE_SERVICE_KEY) return { error: 'Missing Service Key' };
        const supabase = createAdminClient();

        const { error } = await supabase
            .from('messages')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function deleteMessageAdmin(id: string) {
    try {
        if (!process.env.SUPABASE_SERVICE_KEY) return { error: 'Missing Service Key' };
        const supabase = createAdminClient();

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function checkSupabaseConnection() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'missing';
        const key = process.env.SUPABASE_SERVICE_KEY;
        const keyStatus = key ? `Present (${key.substring(0, 5)}...)` : 'missing';

        const supabase = createAdminClient();

        // Try simple count
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true });

        // Try insert test
        const { data: insertData, error: insertError } = await supabase
            .from('messages')
            .insert({
                first_name: 'Connectivity',
                last_name: 'Test',
                email: 'test@connectivity.check',
                message: 'Connection Verified at ' + new Date().toISOString(),
                status: 'unread'
            })
            .select()
            .single();

        return {
            url: url,
            keyStatus: keyStatus,
            count: count,
            readError: error ? error.message : null,
        };
    } catch (e: any) {
        return { error: e.message };
    }
}

