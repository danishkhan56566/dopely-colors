import { createClient } from '@/lib/supabase-server';
import { ColorList } from '@/components/colors/ColorList';

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
