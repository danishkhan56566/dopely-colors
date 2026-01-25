import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import chroma from 'chroma-js';

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

async function runFuzzyCleanup() {
    console.log('🔍 Scanning database for VISUAL duplicates (Fuzzy Match)...');

    // Fetch last 1000 published palettes
    const { data: palettes, error } = await supabase
        .from('palettes')
        .select('id, colors, name, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false }) // Newest first
        .limit(1000);

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    if (!palettes?.length) {
        console.log('No palettes found.');
        return;
    }

    console.log(`📊 Processing ${palettes.length} palettes...`);

    const duplicatesToDelete: Set<string> = new Set();
    const keepers: any[] = [];

    // O(N^2) comparison - simple enough for < 1000 items
    for (const p of palettes) {
        if (!Array.isArray(p.colors) || p.colors.length === 0) continue;

        let isDuplicate = false;

        // Check against "Keepers" (older or already processed unique ones)
        for (const keeper of keepers) {
            // Compare p (Newer) vs keeper (Older/Existing)

            // Heuristic: If 3 out of 4 colors are very similar (DeltaE < 5), it's a dupe.
            // We ignore order by checking "best match" for each color.

            let matches = 0;
            const pColors = p.colors;
            const kColors = keeper.colors;

            for (const c1 of pColors) {
                // Is this color present in the keeper?
                if (kColors.some((c2: string) => chroma.deltaE(c1, c2) < 5)) {
                    matches++;
                }
            }

            if (matches >= 3) {
                // Found a match!
                // console.log(`  Identified Duplicate: ${p.name} (${p.id}) similar to ${keeper.name}`);
                duplicatesToDelete.add(p.id);
                isDuplicate = true;
                break; // Stop checking this candidate
            }
        }

        if (!isDuplicate) {
            keepers.push(p);
        }
    }

    const count = duplicatesToDelete.size;
    console.log(`\n🧹 Found ${count} fuzzy duplicates to delete.`);

    if (count > 0) {
        const ids = Array.from(duplicatesToDelete);

        // Batch delete
        const BATCH_SIZE = 100;
        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            const chunk = ids.slice(i, i + BATCH_SIZE);
            const { error: delErr } = await supabase
                .from('palettes')
                .delete()
                .in('id', chunk);

            if (delErr) console.error(`  ❌ Failed to delete chunk ${i}:`, delErr.message);
            else console.log(`  ✅ Deleted items ${i + 1} to ${i + chunk.length}`);
        }
    } else {
        console.log('✨ No visual duplicates found.');
    }
}

runFuzzyCleanup();
