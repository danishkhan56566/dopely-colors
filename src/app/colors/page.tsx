import { createClient } from '@/lib/supabase-server';
import { ColorList } from '@/components/colors/ColorList';

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

export default async function ColorNamesPage() {
    const colors = await getPublishedColors();
    return <ColorList initialColors={colors} />;
}
