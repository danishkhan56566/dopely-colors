'use server';

import { createClient } from '@/lib/supabase-server';

export async function fetchPalettesAction(page = 0, filter: string | null = null, sort = 'popular') {
    const supabase = await createClient();
    const ITEMS_PER_PAGE = 24;

    try {
        let query = supabase
            .from('palettes')
            .select('*', { count: 'exact' })
            .eq('status', 'published');

        // Apply Tag Filter
        if (filter && filter !== 'all') {
            query = query.contains('category', [filter]);
        }

        // Apply Sorting
        if (sort === 'new') {
            query = query.order('created_at', { ascending: false });
        } else if (sort === 'popular') {
            query = query.order('favorites_count', { ascending: false });
        }

        // Apply Pagination
        const from = page * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        const formatted = data?.map(p => ({
            id: p.id,
            name: p.name,
            likes: p.favorites_count || 0,
            date: new Date(p.created_at).toLocaleDateString(),
            createdAt: p.created_at, // Pass raw for "time ago"
            colors: p.colors || [],
            tags: p.category?.[0] || 'uncategorized'
        })) || [];

        return {
            palettes: formatted,
            hasMore: count !== null && (from + data.length < count),
            error: null
        };
    } catch (err: any) {
        console.error('Server Action Error:', err);
        return { palettes: [], hasMore: false, error: err.message };
    }
}
