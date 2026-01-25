'use server';

import { createClient, createAdminClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import chroma from 'chroma-js';

import { getColorPsychology } from '@/lib/color-utils';

// Smart Color Naming System
// Enhanced Color Naming System
function generateColorName(hex: string, existingNames: Set<string> = new Set()) {
    const color = chroma(hex);
    const h = color.get('hsl.h');
    const s = color.get('hsl.s');
    const l = color.get('hsl.l');

    // 1. Expanded Base Nouns (Fine-grained Hue)
    let noun = 'Color';
    // Reds & Pinks
    if (h >= 345 || h < 10) noun = 'Red';
    else if (h >= 10 && h < 20) noun = 'Crimson';
    else if (h >= 20 && h < 30) noun = 'Vermilion';
    else if (h >= 30 && h < 45) noun = 'Orange';
    else if (h >= 45 && h < 55) noun = 'Amber';
    else if (h >= 55 && h < 70) noun = 'Yellow';
    else if (h >= 70 && h < 90) noun = 'Lime';
    else if (h >= 90 && h < 140) noun = 'Green';
    else if (h >= 140 && h < 160) noun = 'Emerald';
    else if (h >= 160 && h < 180) noun = 'Teal';
    else if (h >= 180 && h < 200) noun = 'Cyan';
    else if (h >= 200 && h < 220) noun = 'Sky';
    else if (h >= 220 && h < 250) noun = 'Blue';
    else if (h >= 250 && h < 270) noun = 'Indigo';
    else if (h >= 270 && h < 290) noun = 'Violet';
    else if (h >= 290 && h < 315) noun = 'Purple';
    else if (h >= 315 && h < 330) noun = 'Magenta';
    else if (h >= 330 && h < 345) noun = 'Rose';

    // Grayscale / Neutrals
    if (s < 0.15) {
        if (l > 0.85) noun = 'White';
        else if (l < 0.15) noun = 'Black';
        else noun = 'Grey';
    } else if (s < 0.25 && l > 0.7) {
        noun = 'Beige'; // Warm low sat
    }

    // 2. Vast Adjective Library
    const primaryAdjectives = [
        'Pure', 'True', 'Classic', 'Royal', 'Noble', 'Majestic', 'Grand', 'Imperial',
        'Vivid', 'Bold', 'Bright', 'Luminous', 'Radiant', 'Brilliant', 'Glowing',
        'Deep', 'Dark', 'Rich', 'Profound', 'Abyssal', 'Midnight', 'Shadow',
        'Pale', 'Soft', 'Light', 'Faint', 'Delicate', 'Whisper', 'Misted', 'Hazed',
        'Neon', 'Electric', 'Acid', 'Cyber', 'Laser', 'Plasma', 'Hyper',
        'Dusty', 'Muted', 'Dull', 'Ash', 'Faded', 'Washed', 'Vintage', 'Retro'
    ];

    const natureAdjectives = [
        'Forest', 'Ocean', 'Sky', 'Sunset', 'Floral', 'Spring', 'Summer', 'Autumn', 'Winter',
        'Tropical', 'Arctic', 'Desert', 'Alpine', 'Marine', 'Solar', 'Lunar', 'Stellar',
        'Berry', 'Fruit', 'Citrus', 'Leaf', 'Petal', 'Wood', 'Stone', 'Earth', 'Sand'
    ];

    const emotionalAdjectives = [
        'Happy', 'Calm', 'Peaceful', 'Wild', 'Crazy', 'Sweet', 'Bitter', 'Fresh', 'Warm', 'Cool',
        'Magic', 'Mystic', 'Fantasy', 'Dream', 'Night', 'Day', 'Dawn', 'Dusk'
    ];

    // 3. Selection Logic based on properties
    let validAdjectives: string[] = [];

    // Lightness specific
    if (l < 0.2) validAdjectives.push('Midnight', 'Abyssal', 'Shadow', 'Obsidian', 'Raven');
    if (l < 0.4) validAdjectives.push('Dark', 'Deep', 'Rich', 'Royal', 'Imperial');
    if (l > 0.8) validAdjectives.push('Pale', 'Soft', 'Whisper', 'Ghost', 'Snow');
    if (l > 0.6) validAdjectives.push('Light', 'Pastel', 'Cream', 'Milk');

    // Saturation specific
    if (s > 0.9) validAdjectives.push('Neon', 'Electric', 'Hyper', 'Super', 'Ultra', 'Vivid');
    if (s > 0.7) validAdjectives.push('Bright', 'Intense', 'Hot', 'Luminous', 'Radiant');
    if (s < 0.2) validAdjectives.push('Dusty', 'Ash', 'Muted', 'Grey', 'Faded');
    if (s < 0.4) validAdjectives.push('Soft', 'Calm', 'Gentle', 'Subtle');

    // Fallback mixing
    if (validAdjectives.length < 3) {
        validAdjectives = [...validAdjectives, ...primaryAdjectives, ...natureAdjectives];
    }

    // 4. Generate & avoid uniqueness
    let finalName = '';
    let attempts = 0;

    while (!finalName || existingNames.has(finalName)) {
        attempts++;
        const adj = validAdjectives[Math.floor(Math.random() * validAdjectives.length)];

        // Sometimes use double adjectives for variety if we are colliding a lot
        const useDouble = attempts > 5;
        const secondAdj = attempts > 5 ? emotionalAdjectives[Math.floor(Math.random() * emotionalAdjectives.length)] + ' ' : '';

        finalName = `${secondAdj}${adj} ${noun}`;

        // Hard stop to prevent infinite loops (though unlikely with this combinatorial space)
        if (attempts > 20) {
            finalName = `${adj} ${noun} ${Math.floor(Math.random() * 1000)}`; // Fallback with number
        }
    }

    return finalName;
}

export async function generateRandomColors(count = 100) {
    // Use Admin Client to bypass RLS for bulk generation
    const supabase = createAdminClient();

    // Generate distinct colors using Golden Ratio
    const colors: any[] = [];
    let hue = Math.random();
    const goldenRatioConjugate = 0.618033988749895;

    // Keep track of names generated in this batch to avoid duplicates
    const generatedNames = new Set<string>();

    for (let i = 0; i < count; i++) {
        hue += goldenRatioConjugate;
        hue %= 1;

        // Use HSL for better spread: S: 0.5-0.95, L: 0.4-0.8 (avoid too dark/light)
        const s = 0.5 + Math.random() * 0.45;
        const l = 0.35 + Math.random() * 0.45;

        const hex = chroma.hsl(hue * 360, s, l).hex().toUpperCase();

        // Generate Rich SEO Content
        const psychology = getColorPsychology(hex);

        // Flatten the structured data for SEO text fields
        // We'll store JSON in text fields for now or just the main summaries
        const description = psychology.description;
        const psychologyText = JSON.stringify(psychology.psychology);
        const meaningText = JSON.stringify(psychology.meaning);
        const usageText = JSON.stringify(psychology.usage);

        // Uniqueness check for name
        const name = generateColorName(hex, generatedNames);
        generatedNames.add(name);

        // Simple duplicate check local (basic)
        if (!colors.find(c => c.hex === hex)) {
            colors.push({
                name: name,
                hex: hex,
                published: true,
                description: description,
                psychology: psychologyText,
                meaning: meaningText,
                usage_info: usageText
            });
        }
    }

    // Upsert or Ignore Duplicates
    const { error } = await supabase.from('colors').upsert(colors, { onConflict: 'hex', ignoreDuplicates: true });

    if (error) {
        // Fallback: If rich SEO columns don't exist yet (migration not applied), save basic data
        // 42703: Postgres undefined_column
        // PGRST204: PostgREST column not found in schema cache
        if (error.code === '42703' || error.code === 'PGRST204') {
            console.warn('Rich text columns missing in DB. Saving basic color data only.');
            const basicColors = colors.map(({ name, hex, published }) => ({ name, hex, published }));
            const { error: retryError } = await supabase.from('colors').upsert(basicColors, { onConflict: 'hex', ignoreDuplicates: true });
            if (retryError) throw retryError;
        } else {
            console.error('Error auto-generating colors:', error);
            throw error;
        }
    }

    revalidatePath('/admin/colors');
    revalidatePath('/colors');
}

export async function getColors() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('colors')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function createColor(name: string, hex: string) {
    const supabase = createAdminClient();
    // Normalize hex
    const normalizedHex = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;

    // Check duplication
    const { data: existing } = await supabase.from('colors').select('id').eq('hex', normalizedHex).single();
    if (existing) {
        throw new Error('Color with this hex already exists');
    }

    const { error } = await supabase
        .from('colors')
        .insert({ name, hex: normalizedHex, published: false });

    if (error) throw error;

    revalidatePath('/admin/colors');
    revalidatePath('/colors');
}

export async function updateColor(id: string, updates: { name?: string; published?: boolean }) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('colors')
        .update(updates)
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/colors');
    revalidatePath('/colors');
}

export async function deleteColor(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('colors')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/colors');
    revalidatePath('/colors');
}

export async function deleteAllColors() {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('colors')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (error) throw error;

    revalidatePath('/admin/colors');
    revalidatePath('/colors');
}
