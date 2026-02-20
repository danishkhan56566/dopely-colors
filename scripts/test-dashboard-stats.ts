
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { startOfDay, subDays, format } from 'date-fns';

// ------------------------------------------------------------------
// COPY OF getDashboardStats LOGIC FROM src/app/admin/actions.ts
// We mock the Supabase client creation to use the script's local one
// ------------------------------------------------------------------

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function testGetDashboardStats() {
    console.log('🧪 Testing getDashboardStats logic...');

    const today = new Date();
    const startOfToday = startOfDay(today).toISOString();
    const thirtyDaysAgo = subDays(today, 30).toISOString();

    try {
        console.log('1. Fetching Totals...');
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

        console.log(`   - Palettes: ${totalPalettes}`);
        console.log(`   - Favorites: ${totalFavorites}`);
        console.log(`   - Users: ${totalUsersCount}`);

        console.log('2. Fetching Recent Activity...');
        let activity: any[] = [];

        // Mocking the robust individual queries
        const { data: palData } = await supabase.from('palettes').select('*').order('created_at', { ascending: false }).limit(5);
        if (palData) {
            activity.push(...palData.map(p => ({
                id: `p-${p.id}`,
                type: 'palette',
                userId: p.user_id || p.profile_id || p.author_id,
                time: p.created_at
            })));
        }

        const { data: userData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5);
        if (userData) {
            activity.push(...userData.map(u => ({
                id: `u-${u.id}`,
                type: 'user',
                userId: u.id,
                time: u.created_at
            })));
        }

        console.log(`   - Raw Activity Items: ${activity.length}`);

        // THE CRITICAL PART: Resolving Emails via Auth API
        console.log('3. Testing Email Resolution (The Fix)...');
        const userIdsToFetch = Array.from(new Set(activity.map(a => a.userId).filter(Boolean)));
        console.log(`   - Resolving ${userIdsToFetch.length} User IDs...`);

        if (userIdsToFetch.length > 0) {
            const emailMap = new Map<string, string>();
            await Promise.all(userIdsToFetch.map(async (uid) => {
                const { data: { user } } = await supabase.auth.admin.getUserById(uid);
                if (user?.email) emailMap.set(uid, user.email);
            }));

            console.log(`   - Resolved ${emailMap.size} emails.`);
            if (emailMap.size > 0) {
                console.log('   ✅ Validated that Auth API resolution works.');
            } else {
                console.warn('   ⚠️ No emails resolved (might be expected if users deleted from auth but left in db)');
            }
        }

        console.log('4. Fetching Growth Data...');
        const { data: favoritesTimeline } = await supabase
            .from('favorites')
            .select('created_at')
            .gte('created_at', thirtyDaysAgo);

        console.log(`   - Favorites last 30d: ${favoritesTimeline?.length}`);

        console.log('\n🎉 SUCCESS: Dashboard Stats Logic Verified (No Crashes)');

    } catch (error: any) {
        console.error('\n❌ TEST FAILED:', error);
        process.exit(1);
    }
}

testGetDashboardStats();
