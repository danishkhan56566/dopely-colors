
import { getAnalyticsData } from '../src/app/admin/analytics/actions';

async function main() {
    console.log('Testing getAnalyticsData()...');

    // Ensure critical env vars are present
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        console.error('ERROR: Missing Supabase environment variables');
        console.error('Run with: export $(grep -v \'^#\' .env.local | xargs) && npx tsx scripts/test-analytics-real.ts');
        process.exit(1);
    }

    try {
        const data = await getAnalyticsData();

        if (!data) {
            console.error('FAILED: getAnalyticsData returned null');
            process.exit(1);
        }

        console.log('SUCCESS: Retrieved analytics data');
        console.log('Summary:', data.summary);
        console.log('Countries (Top 5):', data.extension.countries);
        console.log('Traffic Sources (Top 5):', data.extension.trafficSources);

        if (data.extension.countries.length === 0) {
            console.log('NOTE: No country data found yet (expected if no users have country set)');
        }

    } catch (error) {
        console.error('CRASHED:', error);
        process.exit(1);
    }
}

main();
