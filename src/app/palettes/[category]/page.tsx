import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PaletteCard } from '@/components/explore/PaletteCard';
import { fetchPalettesAction } from '@/app/explore/actions';
import { seoCategoriesDb, generateGenericSeoContent } from '@/data/seoCategories';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
    params: {
        category: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params;
    const categorySlug = category.toLowerCase();
    const seoData = seoCategoriesDb.find(c => c.slug === categorySlug) || generateGenericSeoContent(categorySlug);

    const title = seoData.title;
    const description = seoData.description;
    const url = `https://dopelycolors.com/palettes/${categorySlug}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            type: 'website',
            images: [
                {
                    url: 'https://dopelycolors.com/og-default.png', // Fallback, could be dynamic later
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category } = await params;
    const categorySlug = category.toLowerCase();
    const seoData = seoCategoriesDb.find(c => c.slug === categorySlug) || generateGenericSeoContent(categorySlug);

    // Fetch up to 48 palettes for this category (2 pages worth) to ensure the page has massive content
    const fetchResponse = await fetchPalettesAction(0, categorySlug, 'popular');
    // We can just use the first page for initial SSR, then client-side infinite scroll could take over if we used ExploreLayout,
    // but for SEO, a static list of 24-48 is perfect. We'll stick to 24 for speed.
    const palettes = fetchResponse.palettes || [];

    // JSON-LD Structured Data
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': seoData.title,
        'description': seoData.description,
        'url': `https://dopelycolors.com/palettes/${categorySlug}`,
        'mainEntity': {
            '@type': 'ItemList',
            'itemListElement': palettes.map((p, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'url': `https://dopelycolors.com/palette/${p.colors.map((c: string) => c.replace('#', '')).join('-')}`
            }))
        }
    };

    return (
        <DashboardLayout>
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <main className="min-h-screen bg-gray-50 pb-24">
                {/* SEO Hero Content Block */}
                <div className="bg-white border-b border-gray-200 pt-16 pb-20">
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors tracking-widest uppercase mb-8">
                            <ArrowLeft size={16} /> Back to Explore
                        </Link>

                        <div className="max-w-4xl">
                            {/* Critical H1 Tag Injection */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-8">
                                {seoData.title}
                            </h1>

                            {/* Rich SEO Content Injection (300+ words) */}
                            <div
                                className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: seoData.seoContent }}
                            />
                        </div>
                    </div>
                </div>

                {/* Palette Grid */}
                <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Trending in {categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}
                        </h2>
                        <span className="text-sm font-bold text-gray-500 bg-gray-200/50 px-3 py-1 rounded-full">
                            {palettes.length} Palettes
                        </span>
                    </div>

                    {palettes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {palettes.map((palette) => (
                                <PaletteCard key={palette.id} {...palette} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-xl font-bold text-gray-900 mb-2">No palettes found</p>
                            <p className="text-gray-500">We couldn't find any palettes specifically tagged with "{categorySlug}".</p>
                            <Link href="/generate" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                Create the first one
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </DashboardLayout>
    );
}
