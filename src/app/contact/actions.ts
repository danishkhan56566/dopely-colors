'use server';

import { createAdminClient } from '@/lib/supabase-server';

export async function submitContactForm(formData: FormData) {
    const supabase = createAdminClient();

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!email || !message) {
        return { error: 'Email and Message are required' };
    }

    try {
        const { error } = await supabase
            .from('messages')
            .insert({
                first_name: firstName,
                last_name: lastName,
                email,
                message,
                status: 'unread'
            });

        if (error) throw error;

        return { success: true };
    } catch (err: any) {
        console.error('Contact Form Error:', err);
        return { error: 'Failed to send message. Please try again later.' };
    }
}
