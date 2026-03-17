import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchPalettesAction } from '@/app/explore/actions';
import { PaletteCard } from '@/components/explore/PaletteCard';
import { Metadata } from 'next';
import { TrendingUp, Sparkles, Calendar } from 'lucide-react';

export const revalidate = 3600; // Cache for 1 hour

export const metadata: Metadata = {
    title: 'Trending Color Palettes 2024 - Top 10 Today - Dopely Colors',
    description: 'Discover the most popular color palettes of the day. Handpicked by the design community and trending now in UI/UX, branding, and digital art.',
    alternates: {
        canonical: 'https://dopelycolors.com/trends',
    },
};

export default async function TrendsPage() {
    // Fetch Top 10 Initial Palettes (ISR)
    // Using the same action from explore but with a 'popular' filter
    const { palettes } = await fetchPalettesAction(0, 'all', 'popular');
    const top10 = palettes.slice(0, 10);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB] py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">
                                <Sparkles size={16} />
                                <span>Daily Inspiration</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-none">
                                Trending Color <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Palettes</span>
                            </h1>
                            <p className="text-xl text-gray-500 leading-relaxed font-medium">
                                Stay ahead of the curve with today&apos;s most popular color combinations. Curated based on community interaction and design trends.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm self-start md:self-auto">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Updated</div>
                                <div className="text-sm font-bold text-gray-900">Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            </div>
                        </div>
                    </div>

                    {/* Palette Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {top10.map((palette, index) => (
                            <div key={palette.id} className="relative group">
                                {/* Rank Badge */}
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center font-black text-gray-900 shadow-md z-10 scale-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    {index + 1}
                                </div>
                                <PaletteCard 
                                    id={palette.id}
                                    colors={palette.colors}
                                    likes={palette.likes}
                                    createdAt={palette.date || palette.createdAt}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Footer SEO Content */}
                    <div className="mt-24 pt-16 border-t border-gray-100 max-w-4xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">How are trending palettes calculated?</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Our "Trending" algorithm monitors community engagement across the globe. We calculate scores based on high-intent actions like saves, exports, and contrast checks. This ensures that the palettes you see here are not only beautiful but are being actively used in real-world professional projects.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Design Trends</h3>
                                <p className="text-gray-500">Discover palettes for Minimalist, Cyberpunk, and Material Design systems updated every hour.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Accessibility Focused</h3>
                                <p className="text-gray-500">We prioritize color schemes that pass WCAG accessibility standards to promote inclusive design.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
