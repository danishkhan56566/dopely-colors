import { createClient } from '@supabase/supabase-js';
import GradientGeneratorClient from './GradientGeneratorClient';

export const revalidate = 3600; // ISR: Cache for 1 hour

async function getGradients() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const client = createClient(supabaseUrl, serviceKey);

    const { data } = await client
        .from('gradients')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    return data || [];
}

import { Suspense } from 'react';

export default async function GradientsPage() {
    const gradients = await getGradients();

    // Map to expected format
    const mappedGradients = gradients.map((g: any) => ({
        name: g.name,
        css: g.css,
        tags: g.tags || []
    }));

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <GradientGeneratorClient initialGradients={mappedGradients} />
        </Suspense>
    );
}
