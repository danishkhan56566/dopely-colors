import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

        if (!serviceKey) return NextResponse.json({ error: 'Server config missing Service Key' }, { status: 500 });

        const adminClient = createClient(supabaseUrl, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const { data, error } = await adminClient
            .from('gradients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching gradients:', error);
            throw error;
        }

        return NextResponse.json(data);

    } catch (err: any) {
        console.error('API GET Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, is_published } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

        if (!serviceKey) return NextResponse.json({ error: 'Server config missing Service Key' }, { status: 500 });

        const adminClient = createClient(supabaseUrl, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Update the gradient
        const { error } = await adminClient
            .from('gradients')
            .update({ is_published })
            .eq('id', id);

        if (error) {
            console.error('Error updating gradient:', error);
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('API PUT Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

        if (!serviceKey) return NextResponse.json({ error: 'Server config missing Service Key' }, { status: 500 });

        const adminClient = createClient(supabaseUrl, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Delete the gradient
        const { error } = await adminClient
            .from('gradients')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting gradient:', error);
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('API DELETE Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
