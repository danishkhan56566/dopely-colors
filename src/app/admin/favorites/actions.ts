'use server';

import { createAdminClient } from '@/lib/supabase-server';

export type FavoriteItem = {
    id: string;
    created_at: string;
    palette_name: string;
    palette_colors: string[];
    user_email: string;
    user_id: string;
};

export type FavoritesData = {
    items: FavoriteItem[];
    total: number;
    growth: number; // Percentage growth in last 30 days
};

export async function getFavoritesData(): Promise<FavoritesData | null> {
    const supabase = createAdminClient();

    try {
        // 1. Fetch latest 50 favorites
        const { data: favorites, error, count } = await supabase
            .from('favorites')
            .select(`
                id, 
                created_at, 
                user_id, 
                palette_id,
                palettes (name, colors)
            `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        // 2. Fetch users to map emails (batch fetch)
        const userIds = Array.from(new Set(favorites.map(f => f.user_id)));
        const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

        // Simple map for email lookup
        const userMap = new Map<string, string>();
        users.forEach(u => userMap.set(u.id, u.email || 'Unknown'));

        // 3. Map to FavoriteItem
        const items: FavoriteItem[] = favorites.map((f: any) => ({
            id: f.id,
            created_at: f.created_at,
            palette_name: f.palettes?.name || 'Untitled Palette',
            palette_colors: f.palettes?.colors || [],
            user_email: userMap.get(f.user_id) || 'deleted_user',
            user_id: f.user_id
        }));

        // 4. Calculate Growth (Total vs Last 30 Days)
        // Check count of favorites created in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: recentCount } = await supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', thirtyDaysAgo.toISOString());

        // Simple growth calc: (recent / total) * 100 for now, or could do period over period
        const total = count || 0;
        const growth = total > 0 ? Math.round(((recentCount || 0) / total) * 100) : 0;

        return {
            items,
            total,
            growth
        };

    } catch (error) {
        console.error('Error fetching favorites:', error);
        return null;
    }
}
