import { ExploreLayout } from '@/components/explore/ExploreLayout';
import { createPublicClient } from '@/lib/supabase-server';
import { fetchPalettesAction } from './actions';

// export const dynamic = 'force-dynamic'; // DISABLED to save CPU
export const revalidate = 3600; // Cache for 1 hour

type Props = {
    searchParams: Promise<{ q?: string; category?: string; sort?: string; tag?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
    const { q, category } = await searchParams;
    
    let title = 'Explore Color Palettes - Dopely Colors';
    let description = 'Browse thousands of beautiful color palettes created by our community. Filter by color, style, or popularity.';

    if (q) {
        title = `"${q}" Color Palettes - Explore - Dopely Colors`;
        description = `Discover beautiful ${q} color palettes and schemes. Browse through thousands of curated combinations for your next project.`;
    } else if (category && category !== 'all') {
        title = `${category} Color Palettes - Explore - Dopely Colors`;
        description = `Browse our collection of ${category} color palettes. Find the perfect color schemes for branding, web design, and digital art.`;
    }

    return {
        title,
        description,
        alternates: {
            canonical: 'https://dopelycolors.com/explore',
        },
    };
}

export default async function ExplorePage({ searchParams }: Props) {
    const { tag, category } = await searchParams;
    const activeCategory = tag || category;

    // SEO REDIRECT: Ensure query-param categories go to their canonical home
    if (activeCategory && activeCategory !== 'all') {
        const { redirect } = await import('next/navigation');
        redirect(`/palettes/${activeCategory.toLowerCase()}`);
    }

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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Featured Color Palettes",
        "description": "A curated collection of beautiful color palettes for designers and developers.",
        "itemListElement": palettes.map((palette: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://dopelycolors.com/palette/${palette.colors.join('-').replace(/#/g, '')}`,
            "name": `Color Palette ${palette.colors.join(' - ')}`
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ExploreLayout initialCategories={formattedCategories} initialPalettes={palettes} />
        </>
    );
}
