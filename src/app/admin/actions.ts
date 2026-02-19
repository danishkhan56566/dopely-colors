'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export async function getDashboardStats() {
    const supabase = createAdminClient();
    const today = new Date();
    const startOfToday = startOfDay(today).toISOString();
    const thirtyDaysAgo = subDays(today, 30).toISOString();

    try {
        // 1. Fetch Totals
        const [
            { count: totalPalettes },
            { count: totalFavorites },
            { count: totalUsersCount },
            { count: todaysPalettes }
        ] = await Promise.all([
            supabase.from('palettes').select('*', { count: 'exact', head: true }),
            supabase.from('favorites').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('palettes').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday)
        ]);

        // 2. Fetch Recent Activity (Resilient Individual Queries)
        let activity: any[] = [];

        try {
            const { data: palData } = await supabase.from('palettes').select('*').order('created_at', { ascending: false }).limit(10);
            if (palData) {
                activity.push(...palData.map(p => ({
                    id: `p-${p.id}`,
                    type: 'palette',
                    user: 'System User', // Default, will try to resolve later
                    userId: p.user_id || p.profile_id || p.author_id,
                    detail: `created a new palette "${p.name || 'Untitled'}"`,
                    time: p.created_at
                })));
            }
        } catch (e) { console.error('Recent Palettes Error:', e); }

        try {
            const { data: favData } = await supabase.from('favorites').select('*').order('created_at', { ascending: false }).limit(10);
            if (favData) {
                activity.push(...favData.map(f => ({
                    id: `f-${f.id}`,
                    type: 'favorite',
                    user: 'System User',
                    userId: f.user_id || f.profile_id,
                    detail: `favorited a palette`,
                    time: f.created_at
                })));
            }
        } catch (e) { console.error('Recent Favorites Error:', e); }

        try {
            const { data: userData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10);
            if (userData) {
                activity.push(...userData.map(u => ({
                    id: `u-${u.id}`,
                    type: 'user',
                    user: u.email || 'Anonymous',
                    userId: u.id,
                    detail: `joined the platform`,
                    time: u.created_at
                })));
            }
        } catch (e) { console.error('Recent Users Error:', e); }

        // Resolve emails if possible
        const userIdsToFetch = Array.from(new Set(activity.map(a => a.userId).filter(Boolean)));
        if (userIdsToFetch.length > 0) {
            try {
                // Resolved via Auth API because profiles table doesn't have email column
                const emailMap = new Map<string, string>();
                await Promise.all(userIdsToFetch.map(async (uid) => {
                    const { data: { user } } = await supabase.auth.admin.getUserById(uid);
                    if (user?.email) emailMap.set(uid, user.email);
                }));

                activity = activity.map(a => ({
                    ...a,
                    user: emailMap.get(a.userId) || a.user
                }));
            } catch (e) { console.error('Profile Resolve Error:', e); }
        }

        // Final sort and slice
        activity = activity
            .filter(a => a.time)
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 10);

        // 3. Favorites Growth (Last 30 days)
        const { data: favoritesTimeline } = await supabase
            .from('favorites')
            .select('created_at')
            .gte('created_at', thirtyDaysAgo);

        const growthDataMap = new Map();
        for (let i = 29; i >= 0; i--) {
            const dateStr = format(subDays(today, i), 'MMM dd');
            growthDataMap.set(dateStr, 0);
        }

        favoritesTimeline?.forEach(f => {
            const dateStr = format(new Date(f.created_at), 'MMM dd');
            if (growthDataMap.has(dateStr)) {
                growthDataMap.set(dateStr, growthDataMap.get(dateStr) + 1);
            }
        });

        const favoritesGrowth = Array.from(growthDataMap.entries()).map(([date, count]) => ({
            date,
            count
        }));

        // 4. Techniques/Categories Popularity
        const { data: popularCategories } = await supabase
            .from('categories')
            .select('name, palette_count')
            .order('palette_count', { ascending: false })
            .limit(5);

        return {
            stats: {
                totalPalettes: totalPalettes || 0,
                totalFavorites: totalFavorites || 0,
                totalUsers: totalUsersCount || 0,
                todaysPalettes: todaysPalettes || 0
            },
            activity,
            favoritesGrowth,
            popularity: popularCategories || []
        };
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return null;
    }
}
