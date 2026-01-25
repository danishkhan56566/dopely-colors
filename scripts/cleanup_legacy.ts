import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual Env Loader
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const val = parts.slice(1).join('=').trim().replace(/"/g, '');
                    if (key && val) process.env[key] = val;
                }
            });
        }
    } catch (e) {
        console.warn('Could not read .env.local');
    }
};

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Missing Supabase Credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false }
});

async function runLegacyCleanup() {
    console.log('🔍 Scanning database for LEGACY (Non-4-Color) palettes...');

    // Fetch ALL published palettes
    // We need to check everything to ensure we leave only the "Good" ones.
    const { data: palettes, error } = await supabase
        .from('palettes')
        .select('id, colors, name, created_at')
        .eq('status', 'published');

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    if (!palettes?.length) {
        console.log('No palettes found.');
        return;
    }

    console.log(`📊 Checking ${palettes.length} palettes...`);

    const badIds: string[] = [];

    for (const p of palettes) {
        // Condition 1: Must be array
        if (!Array.isArray(p.colors)) {
            badIds.push(p.id);
            continue;
        }

        // Condition 2: MUST BE EXACTLY 4 COLORS
        if (p.colors.length !== 4) {
            // console.log(`  Flagged Legacy (${p.colors.length} colors): ${p.name}`);
            badIds.push(p.id);
            continue;
        }

        // Condition 3: Must be valid hex codes (simple check)
        const invalidHex = p.colors.some((c: string) => !/^#[0-9A-F]{6}$/i.test(c));
        if (invalidHex) {
            badIds.push(p.id);
        }
    }

    const count = badIds.length;
    console.log(`\n🧹 Found ${count} legacy/broken palettes to delete.`);

    if (count > 0) {
        // Batch delete
        const BATCH_SIZE = 100;
        for (let i = 0; i < badIds.length; i += BATCH_SIZE) {
            const chunk = badIds.slice(i, i + BATCH_SIZE);
            const { error: delErr } = await supabase
                .from('palettes')
                .delete()
                .in('id', chunk);

            if (delErr) console.error(`  ❌ Failed to delete chunk ${i}:`, delErr.message);
            else console.log(`  ✅ Deleted items ${i + 1} to ${i + chunk.length}`);
        }
        console.log('\n✨ Database is now STRICTLY 4-Color!');
    } else {
        console.log('✨ No legacy palettes found.');
    }
}

runLegacyCleanup();
