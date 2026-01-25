
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const supabaseUrl = 'https://cafwmpzdgatxpavuwnvh.supabase.co';
    // SERVICE KEY (Bypasses RLS) - Use with caution!
    const supabaseServiceKey = 'sb_secret_MqeKah2URuj3mu1AG6TsiA_r5PC8PZE';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    // 1. Check existence
    const { data: existing, error: findError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found"
        return NextResponse.json({ error: 'DB Error finding post', details: findError }, { status: 500 });
    }

    if (!existing) {
        return NextResponse.json({ message: 'Post already gone. Ghost is purely cache.' });
    }

    // 2. DELETE
    const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('slug', slug);

    if (deleteError) {
        return NextResponse.json({ error: 'Failed to delete', details: deleteError }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: 'NUKE LAUNCHED. Post deleted via Service Role.',
        deleted_post: existing.title
    });
}
