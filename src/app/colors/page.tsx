import { createPublicClient } from '@/lib/supabase-server';
import { ColorList } from '@/components/colors/ColorList';
import { getSystematicColors } from '@/lib/color-utils';

export const revalidate = 86400; // Cache for 24 hours

async function getPublishedColors() {
    const supabase = createPublicClient();
    const { data } = await supabase
        .from('colors')
        .select('name, hex')
        .eq('published', true)
        .order('name');
    return data || [];
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
