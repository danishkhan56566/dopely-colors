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
            return { error: 'Server config missing Service Key' };
        }

        const supabase = createAdminClient();

        let query = supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter === 'unread') {
            query = query.eq('status', 'unread');
        }

        const { data, error } = await query;

        if (error) throw error;

        console.log('Admin fetching messages, found:', data?.length);

        return { messages: data as AdminMessage[] };
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
