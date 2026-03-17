import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getSystematicColors } from '@/lib/color-utils';
import Link from 'next/link';
import { Metadata } from 'next';
import { Search, Palette, Grid, List } from 'lucide-react';

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
    title: 'Color Library: Browse Named Colors & Hex Codes - Dopely Colors',
    description: 'Explore our massive library of named colors. Find Hex, RGB, and HSL codes for thousands of shades from Crimson to Azure. Perfect for designers and developers.',
    alternates: {
        canonical: 'https://dopelycolors.com/colors',
    },
};

export default async function ColorsIndexPage() {
    const allColors = getSystematicColors();
    
    // Group colors by first letter for better organization
    const groups: Record<string, typeof allColors> = {};
    allColors.forEach(color => {
        const firstLetter = color.name[0].toUpperCase();
        if (!groups[firstLetter]) groups[firstLetter] = [];
        groups[firstLetter].push(color);
    });

    const alphabet = Object.keys(groups).sort();

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB] py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
                            <Palette size={16} />
                            <span>The Ultimate Color Database</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-none">
                            Massive <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Color Library</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium leading-relaxed">
                            Browse through our collection of {allColors.length}+ curated color names. Get precise codes for branding, UI design, and digital art.
                        </p>
                    </div>

                    {/* Quick Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-16">
                        {alphabet.map(letter => (
                            <a 
                                key={letter} 
                                href={`#letter-${letter}`}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl font-bold text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                            >
                                {letter}
                            </a>
                        ))}
                    </div>

                    {/* Alphabetical Grid */}
                    <div className="space-y-20">
                        {alphabet.map(letter => (
                            <section key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-4xl font-black text-gray-900">{letter}</h2>
                                    <div className="flex-1 h-px bg-gray-100" />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {groups[letter].map(color => (
                                        <Link 
                                            key={color.hex} 
                                            href={`/colors/${color.hex.replace('#', '').toUpperCase()}`}
                                            className="group relative bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                                        >
                                            <div 
                                                className="w-full aspect-square rounded-xl shadow-inner border border-black/5 mb-3"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{color.name}</div>
                                            <div className="text-[10px] font-mono font-black text-gray-300 uppercase mt-1">{color.hex}</div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* SEO Footer Content */}
                    <div className="mt-32 pt-20 border-t border-gray-100 prose prose-slate max-w-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Why use a color library?</h3>
                                <p className="text-gray-500 text-lg leading-relaxed mt-4 font-medium">
                                    Choosing the right color name is more than just aesthetics; it&apos;s about communication. Whether you&apos;re specifying a brand identity or discussing design revisions, using standardized names like &quot;Alabaster&quot; or &quot;Midnight Blue&quot; ensures everyone is on the same page. Our database maps these names to exact Hex, RGB, and CMYK values for technical precision.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">How we name colors</h3>
                                <p className="text-gray-500 text-lg leading-relaxed mt-4 font-medium">
                                    Our systematic naming convention combines traditional art world names with modern digital standards. We use the Delta-E 2000 algorithm to find the absolute nearest named neighbor for any hex code, ensuring that even the most obscure shades have a descriptive, human-readable identifier.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
