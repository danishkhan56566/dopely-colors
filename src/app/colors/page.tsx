import { createClient } from '@/lib/supabase-server';
import { ColorList } from '@/components/colors/ColorList';
import chroma from 'chroma-js';
import { getNearestColorName } from '@/lib/color-utils';

export const revalidate = 86400; // Cache for 24 hours

async function getPublishedColors() {
    const supabase = await createClient(); // Await createClient!
    const { data } = await supabase
        .from('colors')
        .select('name, hex')
        .eq('published', true)
        .order('name');
    return data || [];
}

function getSystematicColors() {
    const colors: { name: string; hex: string }[] = [];
    // Generate ~200 systematic colors to ensure sitemap coverage
    // Loop through hues (every 15deg) and lightness/saturation
    for (let h = 0; h < 360; h += 15) {
        for (let s = 0.5; s <= 1.0; s += 0.5) { // 2 saturations
            for (let l = 0.3; l <= 0.7; l += 0.2) { // 3 lightnesses
                const hex = chroma.hsl(h, s, l).hex().toUpperCase();
                colors.push({
                    name: getNearestColorName(hex), // Best guess name
                    hex: hex
                });
            }
        }
    }
    return colors;
}

export default async function ColorNamesPage() {
    const dbColors = await getPublishedColors();
    const systematicColors = getSystematicColors();

    // Deduplicate: User DB colors take precedence
    const seenHexes = new Set(dbColors.map(c => c.hex.toUpperCase()));
    const uniqueSystematic = systematicColors.filter(c => !seenHexes.has(c.hex.toUpperCase()));

    // Combine
    const allColors = [...dbColors, ...uniqueSystematic];

    return <ColorList initialColors={allColors} />;
}
