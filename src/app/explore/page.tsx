import { ExploreLayout } from '@/components/explore/ExploreLayout';
import { createClient } from '@/lib/supabase-server';

// export const dynamic = 'force-dynamic'; // DISABLED to save CPU
export const revalidate = 3600; // Cache for 1 hour

export default async function ExplorePage() {
    const supabase = await createClient();

    // Fetch categories sorted by name
    const { data: categories } = await supabase
        .from('categories')
        .select('name, slug, color')
        .order('name');

    // Transform to expected format
    const formattedCategories = [
        { id: 'all', label: 'All' },
        ...(categories?.map(c => ({
            id: c.name, // Using name as ID for filtering compatibility
            label: c.name
        })) || [])
    ];

    return <ExploreLayout initialCategories={formattedCategories} />;
}
