import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour to save Vercel Usage

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

        if (!serviceKey) {
            // Fallback to anon key if service key is missing (dev env), but warn
            console.warn('Missing SUPABASE_SERVICE_KEY in API');
        }

        const client = createClient(
            supabaseUrl,
            serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await client
            .from('gradients')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);

    } catch (err: any) {
        console.error('API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
