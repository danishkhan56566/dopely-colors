import { ExploreLayout } from '@/components/explore/ExploreLayout';
import { createPublicClient } from '@/lib/supabase-server';
import { fetchPalettesAction } from './actions';

// export const dynamic = 'force-dynamic'; // DISABLED to save CPU
export const revalidate = 3600; // Cache for 1 hour

export const metadata = {
    title: 'Explore Color Palettes - Dopely Colors',
    description: 'Browse thousands of beautiful color palettes created by our community. Filter by color, style, or popularity.',
    alternates: {
        canonical: 'https://dopelycolors.com/explore',
    },
};

export default async function ExplorePage() {
    const supabase = createPublicClient();

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

    // Fetch Initial Palettes (ISR)
    const { palettes } = await fetchPalettesAction(0, 'all', 'popular');

    return <ExploreLayout initialCategories={formattedCategories} initialPalettes={palettes} />;
}
