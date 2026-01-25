import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { palettes } = body;

        if (!palettes || !Array.isArray(palettes)) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

        if (!serviceKey) return NextResponse.json({ error: 'Server config missing Service Key' }, { status: 500 });

        // Create Admin Client (Bypasses RLS)
        const adminClient = createClient(supabaseUrl, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const { error } = await adminClient.from('palettes').insert(palettes);
        if (error) throw error;

        return NextResponse.json({ success: true, count: palettes.length });

    } catch (err: any) {
        console.error('Admin API Publish Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
