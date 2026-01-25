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

        const adminClient = createClient(supabaseUrl, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Transform Palettes to Gradients
        const gradients = palettes.map((p: any) => {
            const c1 = p.colors[0];
            const c2 = p.colors[1] || p.colors[0];
            // Optional: 3rd color for more complexity
            const c3 = p.colors[2];

            let css = '';
            let tags = [...(p.category ? [p.category] : []), 'Generated'];

            if (c3) {
                css = `linear-gradient(to right, ${c1}, ${c2}, ${c3})`;
            } else {
                css = `linear-gradient(to right, ${c1}, ${c2})`;
            }

            return {
                name: p.name ? `${p.name} Gradient` : 'Untitled Gradient',
                css: css,
                tags: tags,
                colors: c3 ? [c1, c2, c3] : [c1, c2], // Store raw colors too
                type: 'linear',
                is_featured: false,
                is_published: false,
                created_at: new Date().toISOString()
            };
        });

        const { error } = await adminClient.from('gradients').insert(gradients);

        if (error) {
            console.error('Gradient Insert Error:', error);
            throw error;
        }

        return NextResponse.json({ success: true, count: gradients.length });

    } catch (err: any) {
        console.error('API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
