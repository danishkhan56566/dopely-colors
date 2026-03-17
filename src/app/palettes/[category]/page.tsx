import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PaletteCard } from '@/components/explore/PaletteCard';
import { fetchPalettesAction } from '@/app/explore/actions';
import { seoCategoriesDb, generateGenericSeoContent } from '@/data/seoCategories';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ArrowRight, Tag } from 'lucide-react';

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
                {/* AI-Powered Generation CTA - (Competitive Edge over Color Hunt) */}
                <div className="max-w-7xl mx-auto px-6 md:px-10 mb-20">
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-purple-500/20">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse" />
                        
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                                    <Sparkles size={14} className="fill-white" />
                                    AI-Driven Intentionality
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                                    Can't find the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-yellow-200">{categorySlug}</span> palette?
                                </h2>
                                <p className="text-xl text-indigo-100 font-medium leading-relaxed mb-8 opacity-90">
                                    Our AI understand the psychology of "{categorySlug}" colors. Tell our engine about your project, and we'll build a unique, accessible system just for you.
                                </p>
                                <Link 
                                    href={`/ai?q=A top-tier ${categorySlug} palette for a modern project`}
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black text-lg hover:scale-105 transition-transform shadow-xl"
                                >
                                    Generate with AI <ArrowRight size={20} />
                                </Link>
                            </div>
                            <div className="hidden md:block">
                                <div className="bg-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/20 relative rotate-2 scale-105">
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-12 w-full bg-white/5 rounded-xl animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Categories (SEO Cross-Linking) */}
                <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 border-t border-gray-100 pt-20">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <Tag size={20} className="text-indigo-600" />
                        Related Color Vibes
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {seoCategoriesDb
                            .filter(c => c.slug !== categorySlug)
                            .slice(0, 12)
                            .map(cat => (
                                <Link 
                                    key={cat.slug}
                                    href={`/palettes/${cat.slug}`}
                                    className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-lg transition-all"
                                >
                                    {cat.title.replace(' Palettes', '')}
                                </Link>
                            ))}
                    </div>
                </div>
        </DashboardLayout>
    );
}
