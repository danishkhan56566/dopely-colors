'use server';

import { createClient } from '@supabase/supabase-js';
import chroma from 'chroma-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

// Adjectives/Nouns for creative naming
const ADJECTIVES = ['Vibrant', 'Muted', 'Neon', 'Pastel', 'Dark', 'Soft', 'Bold', 'Fresh', 'Warm', 'Cool', 'Electric', 'Cozy', 'Cyber', 'Urban', 'Wild', 'Retro', 'Clean', 'Sharp', 'Deep'];
const NOUNS = ['Sunset', 'Ocean', 'Forest', 'Dream', 'Night', 'Sky', 'Berry', 'Tech', 'Minimal', 'Future', 'Wave', 'Harmony', 'Vibe', 'Flow', 'Pulse', 'Dawn', 'Mist', 'Haze', 'Light'];

// Initialize Admin Client
const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export async function generateDailyBatch(count: number = 100) {
    try {
        if (!SERVICE_KEY) return { error: 'Server config missing Service Key' };

        // 1. Fetch High Quality Seeds & EXISTING PALETTES for Deduplication
        const { data: existingData } = await adminClient
            .from('palettes')
            .select('colors')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(2000); // Check against last 2000 to be safe

        let seedPool: string[] = [];
        const existingPalettes: string[][] = [];

        if (existingData) {
            existingData.forEach((p: any) => {
                if (Array.isArray(p.colors)) {
                    seedPool.push(...p.colors);
                    existingPalettes.push(p.colors);
                }
            });
        }

        // Manual "Gold Standard" Seeds (Clean, Bright Bases)
        const GOLD_SEEDS = [
            '#FF9A9E', '#FECFEF', '#A18CD1', '#FBC2EB',
            '#84fab0', '#8fd3f4', '#a1c4fd', '#c2e9fb',
            '#ff9a9e', '#fecfef', '#feada6', '#f5efef',
            '#405de6', '#5851db', '#833ab4', '#c13584',
            '#00F260', '#0575E6', '#e1eec3', '#f05053'
        ];
        seedPool.push(...GOLD_SEEDS);

        // Safety check if retrieval failed
        if (seedPool.length === 0) seedPool = [...GOLD_SEEDS];

        const newPalettes: any[] = [];

        // Helper: Random Range with constraints
        const rand = (min: number, max: number) => min + Math.random() * (max - min);
        const noise = (c: any) => c.set('hsl.l', c.get('hsl.l') + rand(-0.05, 0.05)).set('hsl.s', c.get('hsl.s') + rand(-0.1, 0.1));

        // ALGORITHM: 4-Step "Visual Hierarchy" Engine
        const generateCleanPalette = (base: any, vibe: string) => {
            let colors: string[] = [];
            const hue = base.get('hsl.h');

            // NOISE FACTOR: Add randomness to the offsets so templates aren't static
            const offset1 = rand(30, 50);
            const offset2 = rand(150, 210);

            switch (vibe) {
                case 'Pastel Dream':
                    colors = [
                        base.set('hsl.s', rand(0.1, 0.3)).set('hsl.l', rand(0.92, 0.98)).hex(), // Random White tint
                        base.set('hsl.s', rand(0.5, 0.7)).set('hsl.l', rand(0.8, 0.9)).hex(), // Pastel 1
                        base.set('hsl.h', (hue + offset1) % 360).set('hsl.s', rand(0.5, 0.7)).set('hsl.l', rand(0.8, 0.9)).hex(), // Pastel 2
                        base.set('hsl.h', (hue - offset1) % 360).set('hsl.s', rand(0.5, 0.7)).set('hsl.l', rand(0.7, 0.8)).hex(), // Pastel 3
                    ];
                    break;

                case 'Vintage Retro':
                    colors = [
                        chroma('#FEF9E7').set('hsl.h', rand(30, 50)).hex(), // Warm Cream with variance
                        base.set('hsl.s', rand(0.5, 0.7)).set('hsl.l', rand(0.5, 0.7)).hex(), // Muted Base
                        base.set('hsl.h', (hue + offset2) % 360).set('hsl.s', rand(0.5, 0.7)).set('hsl.l', 0.4).hex(), // Deep Compl
                        chroma('#2C3E50').set('hsl.h', rand(200, 240)).set('hsl.l', rand(0.1, 0.2)).hex() // Navy/Slate variance
                    ];
                    break;

                case 'Cold Blue':
                    const blueHue = rand(190, 240);
                    colors = [
                        chroma.hsl(blueHue, rand(0.1, 0.3), 0.95).hex(), // Ice
                        chroma.hsl(blueHue, rand(0.5, 0.8), 0.7).hex(), // Sky
                        chroma.hsl(blueHue + rand(10, 30), rand(0.6, 0.9), 0.5).hex(), // Ocean
                        chroma.hsl(blueHue + rand(10, 30), rand(0.7, 1), 0.2).hex()  // Deep
                    ];
                    break;

                case 'Sunset Warm':
                    const warmHue = rand(0, 45);
                    colors = [
                        chroma.hsl(warmHue, 0.2, 0.95).hex(), // Warm White
                        chroma.hsl(warmHue, rand(0.7, 0.9), 0.6).hex(), // Gold/Orange
                        chroma.hsl((warmHue + rand(10, 40)) % 360, rand(0.7, 0.9), 0.5).hex(), // Red/Pink
                        chroma.hsl(0, rand(0.2, 0.4), 0.2).hex() // Brown/DarkRed anchored
                    ];
                    break;

                case 'Neon Nights':
                    colors = [
                        chroma.hsl(rand(220, 280), rand(0.3, 0.5), 0.1).hex(), // Deep Background (Purple/Blue based)
                        base.set('hsl.h', rand(280, 340)).set('hsl.s', 0.8).set('hsl.l', 0.3).hex(), // Deep Accent
                        base.set('hsl.s', 1).set('hsl.l', 0.6).hex(), // Main Neon
                        base.set('hsl.h', (hue + 180) % 360).set('hsl.s', 1).set('hsl.l', 0.6).hex() // Pop Neon
                    ];
                    break;

                default:
                    // Clean
                    colors = [
                        '#FFFFFF',
                        chroma.hsl(0, 0, rand(0.9, 0.95)).hex(),
                        base.saturate(1).hex(),
                        chroma.hsl(220, 0.2, 0.2).hex()
                    ];
            }

            // Clean up: Ensure step-down contrast
            let uniqueColors = colors.map(c => chroma(c));
            // Force sorting just in case?
            // No, the templates are ordered. Just fix muddy neighbors.
            for (let k = 0; k < uniqueColors.length - 1; k++) {
                if (chroma.deltaE(uniqueColors[k], uniqueColors[k + 1]) < 15) {
                    uniqueColors[k + 1] = uniqueColors[k + 1].darken(1.5).saturate(0.5);
                }
            }
            return uniqueColors.map(c => c.hex());
        };

        const VIBES = ['Pastel Dream', 'Vintage Retro', 'Cold Blue', 'Sunset Warm', 'Neon Nights'];

        // GENERATION LOOP WITH RETRY
        let attempts = 0;

        while (newPalettes.length < count && attempts < count * 10) {
            attempts++;

            // 1. Pick Seed
            let seedHex = seedPool[Math.floor(Math.random() * seedPool.length)];
            let seed = chroma(seedHex);
            const vibe = VIBES[Math.floor(Math.random() * VIBES.length)];

            // 2. Generate Candidate
            let colors = generateCleanPalette(seed, vibe);

            // 3. STRICT COLLISION CHECK (Batch Wide AND Database Wide)
            const isDuplicate = (
                // Check current batch
                newPalettes.some(existing => {
                    let matches = 0;
                    for (let c of colors) {
                        if (existing.colors.some((ex: string) => chroma.deltaE(c, ex) < 5)) matches++;
                    }
                    return matches >= 3;
                }) ||
                // Check existing DB palettes
                existingPalettes.some(existing => {
                    let matches = 0;
                    for (let c of colors) {
                        // @ts-ignore
                        if (existing.some((ex: string) => chroma.deltaE(c, ex) < 5)) matches++;
                    }
                    return matches >= 3;
                })
            );

            if (isDuplicate) {
                // Skip and Retry
                continue;
            }

            // 4. Sort (Light -> Dark)
            colors.sort((a, b) => chroma(b).luminance() - chroma(a).luminance());

            const name = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;

            newPalettes.push({
                name: name,
                colors: colors,
                category: ['Color Hunt Style', 'Daily', vibe],
                status: 'published',
                is_featured: false,
                seo_title: `${name} - ${vibe} Palette`,
                created_by: 'd83527a0-292c-4b81-a671-629c9fb28074',
                updated_at: new Date().toISOString()
            });
        }

        // 3. Bulk Insert
        const { error: insertError } = await adminClient
            .from('palettes')
            .insert(newPalettes);

        if (insertError) throw insertError;

        return { success: true, count: newPalettes.length };

    } catch (error: any) {
        console.error('Generator Error:', error);
        return { error: error.message };
    }
}

// 4. CLEANUP UTILITY (For removing existing duplicates)
export async function cleanupDuplicates() {
    try {
        if (!SERVICE_KEY) return { error: 'Server config missing Service Key' };

        console.log('Starting Duplicate Cleanup...');

        // Fetch ALL published palettes (just IDs and Colors)
        // We'll process in chunks if needed, but let's try 3000
        const { data: palettes, error } = await adminClient
            .from('palettes')
            .select('id, colors, created_at')
            .eq('status', 'published')
            .order('created_at', { ascending: true }) // Oldest first (keepers)
            .limit(3000);

        if (error) throw error;
        if (!palettes || palettes.length === 0) return { message: 'No palettes found.' };

        const duplicatesToDelete: string[] = [];
        const uniqueSignatures = new Set<string>();

        // We use a simplified signature: Sort Colors + Join
        // Fuzzy matching is hard in bulk, so we'll do Exact + Low Tolerance logic

        for (const p of palettes) {
            if (!Array.isArray(p.colors) || p.colors.length === 0) continue;

            // Create a "Signature" for the palette
            // 1. Sort hex codes
            // 2. Normalize (lowercase)
            const sorted = [...p.colors].sort().map(c => c.toLowerCase());
            const signature = sorted.join('|');

            if (uniqueSignatures.has(signature)) {
                // It's a duplicate! Mark for deletion
                duplicatesToDelete.push(p.id);
            } else {
                uniqueSignatures.add(signature);
            }
        }

        console.log(`Found ${duplicatesToDelete.length} duplicates.`);

        if (duplicatesToDelete.length > 0) {
            const { error: deleteError } = await adminClient
                .from('palettes')
                .delete()
                .in('id', duplicatesToDelete);

            if (deleteError) throw deleteError;
        }

        return {
            success: true,
            deletedCount: duplicatesToDelete.length,
            message: `Cleaned up ${duplicatesToDelete.length} duplicate palettes.`
        };

    } catch (error: any) {
        console.error('Cleanup Error:', error);
        return { error: error.message };
    }
}
