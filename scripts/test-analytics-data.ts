
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { subDays, format } from 'date-fns';

// ------------------------------------------------------------------
// COPY OF getAnalyticsData LOGIC FROM src/app/admin/analytics/actions.ts
// ------------------------------------------------------------------

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

async function testGetAnalyticsData() {
    console.log('🧪 Testing getAnalyticsData logic...');

    try {
        console.log('1. Get Totals...');
        const [
            { count: totalPalettes },
            { count: totalFavorites },
            { count: totalViews },
        ] = await Promise.all([
            supabase.from('palettes').select('*', { count: 'exact', head: true }),
            supabase.from('favorites').select('*', { count: 'exact', head: true }),
            supabase.from('palette_views').select('*', { count: 'exact', head: true }),
        ]);

        console.log(`   - Palettes: ${totalPalettes}`);
        console.log(`   - Favorites: ${totalFavorites}`);
        console.log(`   - Views (Users): ${totalViews}`);

        const { data: { users: allAuthUsers }, error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
        console.log(`   - Auth Users Sample: ${allAuthUsers?.length}`);

        console.log('2. Get Daily Stats (Last 30 Days)...');
        const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

        const { data: recentPalettes } = await supabase
            .from('palettes')
            .select('created_at')
            .gte('created_at', thirtyDaysAgo);

        console.log(`   - Recent Palettes: ${recentPalettes?.length}`);

        const { data: recentUsers } = await supabase
            .from('profiles')
            .select('created_at')
            .gte('created_at', thirtyDaysAgo);

        console.log(`   - Recent Users: ${recentUsers?.length}`);

        // THE CRITICAL TEST: Countries & Traffic (The Fix)
        console.log('3. Testing Countries & Traffic (Should be empty but safe)...');

        // This query originally failed because it selected country, traffic_source
        // The fix changed it to select('id')
        const { data: allProfiles, error: profileError } = await supabase
            .from('profiles')
            .select('id'); // Corrected query

        if (profileError) {
            throw new Error(`Profile query failed: ${profileError.message}`);
        }
        console.log(`   ✅ Query passed! Profiles fetched: ${allProfiles?.length}`);

        // Ensure logic handles absence of data gracefully
        const countryMap = new Map<string, number>();
        allProfiles?.forEach((p: any) => {
            // Logic commented out in actual code, but let's verify if we tried to access p.country
            if (p.country) {
                console.warn('⚠️ Unexpected: Country data found? Schema might have changed.');
            }
        });

        console.log('   ✅ No crash accessing missing columns (because we select ID only).');

        console.log('\n🎉 SUCCESS: Analytics Data Logic Verified (No Crashes)');

    } catch (error: any) {
        console.error('\n❌ TEST FAILED:', error);
        process.exit(1);
    }
}

testGetAnalyticsData();
