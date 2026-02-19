'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { subDays, format } from 'date-fns';

export type AnalyticsSummary = {
    totalUsers: number;
    totalPalettes: number;
    totalFavorites: number;
    totalViews: number;
};

export type DailyStat = {
    date: string;
    palettes: number;
    users: number;
};

export type TopPalette = {
    id: string;
    name: string;
    colors: string[];
    favorites_count: number;
    views_count: number;
};

export type AnalyticsExtension = {
    retention: {
        activeUsers: number; // Signed in < 30 days
        retentionRate: number;
    };
    countries: { name: string; count: number; percent: string; flag: string }[];
    trafficSources: { name: string; count: number }[];
};

export async function getAnalyticsData() {
    const supabase = createAdminClient();

    try {
        // 1. Get Totals
        const [
            { count: totalPalettes },
            { count: totalFavorites },
            { count: totalViews },
        ] = await Promise.all([
            supabase.from('palettes').select('*', { count: 'exact', head: true }),
            supabase.from('favorites').select('*', { count: 'exact', head: true }),
            supabase.from('palette_views').select('*', { count: 'exact', head: true }),
        ]);

        const { data: { users: allAuthUsers }, error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 9999 });
        const totalUsers = allAuthUsers?.length || 0;

        // 2. Get Daily Stats (last 30 days)
        const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

        const { data: recentPalettes } = await supabase
            .from('palettes')
            .select('created_at')
            .gte('created_at', thirtyDaysAgo);

        const { data: recentUsers } = await supabase
            .from('profiles')
            .select('created_at')
            .gte('created_at', thirtyDaysAgo);

        // Aggregate daily
        const dailyStatsMap = new Map<string, { palettes: number; users: number }>();

        // Initialize last 30 days with 0
        for (let i = 29; i >= 0; i--) {
            const dateStr = format(subDays(new Date(), i), 'MMM dd');
            dailyStatsMap.set(dateStr, { palettes: 0, users: 0 });
        }

        // Fill data
        recentPalettes?.forEach(p => {
            const dateStr = format(new Date(p.created_at), 'MMM dd');
            if (dailyStatsMap.has(dateStr)) {
                const stat = dailyStatsMap.get(dateStr)!;
                stat.palettes++;
            }
        });

        recentUsers?.forEach(u => {
            const dateStr = format(new Date(u.created_at), 'MMM dd');
            if (dailyStatsMap.has(dateStr)) {
                const stat = dailyStatsMap.get(dateStr)!;
                stat.users++;
            }
        });

        const dailyStats: DailyStat[] = Array.from(dailyStatsMap.entries()).map(([date, stats]) => ({
            date,
            ...stats
        }));

        // 3. Get Top Palettes
        const { data: topPalettes } = await supabase
            .from('palettes')
            .select('id, name, colors, favorites_count, views_count')
            .order('favorites_count', { ascending: false })
            .limit(5);

        // 4. Calculate Real Retention (Active Users in last 30 days)
        const thirtyDaysAgoDate = subDays(new Date(), 30);
        const activeUsersCount = allAuthUsers?.filter(u => {
            if (!u.last_sign_in_at) return false;
            return new Date(u.last_sign_in_at) > thirtyDaysAgoDate;
        }).length || 0;

        const retentionRate = totalUsers > 0 ? Math.round((activeUsersCount / totalUsers) * 100) : 0;


        // 5. Countries & Traffic (REAL data from profiles)
        const { data: allProfiles } = await supabase
            .from('profiles')
            .select('id, country, traffic_source');

        // Aggregate Countries
        const countryMap = new Map<string, number>();
        allProfiles?.forEach((p: any) => {
            if (p.country) {
                const c = p.country === 'Unknown' ? 'Unknown' : p.country;
                countryMap.set(c, (countryMap.get(c) || 0) + 1);
            }
        });

        const totalTrackedCountries = Array.from(countryMap.values()).reduce((a, b) => a + b, 0);
        const countries: AnalyticsExtension['countries'] = Array.from(countryMap.entries())
            .map(([name, count]) => ({
                name,
                count,
                percent: totalTrackedCountries > 0 ? `${Math.round((count / totalTrackedCountries) * 100)}%` : '0%',
                flag: getFlagEmoji(name)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Aggregate Traffic Sources
        const trafficMap = new Map<string, number>();
        allProfiles?.forEach((p: any) => {
            if (p.traffic_source) {
                trafficMap.set(p.traffic_source, (trafficMap.get(p.traffic_source) || 0) + 1);
            }
        });

        const trafficSources: AnalyticsExtension['trafficSources'] = Array.from(trafficMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            summary: {
                totalUsers: totalUsers || 0,
                totalPalettes: totalPalettes || 0,
                totalFavorites: totalFavorites || 0,
                totalViews: totalViews || 0
            },
            dailyStats,
            topPalettes: topPalettes as TopPalette[] || [],
            extension: {
                retention: {
                    activeUsers: activeUsersCount,
                    retentionRate
                },
                countries,
                trafficSources
            }
        };

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
}

// Helper to get flag emoji (simple version)
function getFlagEmoji(countryName: string) {
    // Very basic mapping for demo purposes, can be expanded or replaced with a library
    const flags: Record<string, string> = {
        'United States': '🇺🇸',
        'United Kingdom': '🇬🇧',
        'Germany': '🇩🇪',
        'India': '🇮🇳',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'France': '🇫🇷',
        'Brazil': '🇧🇷',
        'Unknown': '🌍'
    };
    return flags[countryName] || '🏳️';
}
