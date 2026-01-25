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

async function runCleanup() {
    console.log('🔍 Scanning database for duplicates...');

    // Fetch ALL palettes (might be large, but we need all to dedupe)
    // We'll fetch 5000 to be safe, should cover recent mess
    const { data: palettes, error } = await supabase
        .from('palettes')
        .select('id, colors, created_at, name')
        .eq('status', 'published')
        .order('created_at', { ascending: true }); // Keep oldest

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    if (!palettes?.length) {
        console.log('No palettes found.');
        return;
    }

    console.log(`📊 Found ${palettes.length} total palettes.`);

    const duplicates: string[] = [];
    const signatures = new Set<string>();
    let preservedCount = 0;

    for (const p of palettes) {
        if (!Array.isArray(p.colors) || p.colors.length === 0) continue;

        // Normalize: Sorted + Lowercase
        const sig = [...p.colors].sort().map(c => c.toLowerCase()).join('|');

        if (signatures.has(sig)) {
            duplicates.push(p.id);
            // console.log(`  Found duplicate: ${p.name} (${p.id})`);
        } else {
            signatures.add(sig);
            preservedCount++;
        }
    }

    console.log(`\n🧹 Summary:`);
    console.log(`  - Unique (Preserved): ${preservedCount}`);
    console.log(`  - Duplicates (To Delete): ${duplicates.length}`);

    if (duplicates.length > 0) {
        console.log(`\n🗑️ Deleting ${duplicates.length} palettes...`);

        // Batch delete
        const BATCH_SIZE = 100;
        for (let i = 0; i < duplicates.length; i += BATCH_SIZE) {
            const chunk = duplicates.slice(i, i + BATCH_SIZE);
            const { error: delErr } = await supabase
                .from('palettes')
                .delete()
                .in('id', chunk);

            if (delErr) console.error(`  ❌ Failed to delete chunk ${i}:`, delErr.message);
            else console.log(`  ✅ Deleted items ${i + 1} to ${i + chunk.length}`);
        }
        console.log('\n✨ Cleanup Complete!');
    } else {
        console.log('\n✨ Database is already clean!');
    }
}

runCleanup();
