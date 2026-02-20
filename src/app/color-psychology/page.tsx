import { Metadata } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { colorPsychologyDb } from '@/data/colorPsychology';
import { Brain, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Color Psychology & Symbolism Guide | Dopely Colors',
    description: 'Unlock the powerful impact of color psychology on mood, behavior, and marketing. Dive deep into the meaning, traits, and symbolism of every core color.',
    alternates: {
        canonical: '/color-psychology',
    },
};

export default function ColorPsychologyIndex() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <header className="relative py-24 md:py-32 overflow-hidden bg-gray-900 text-white">
                    <div className="absolute inset-0 z-0">
                        {/* Abstract Background Gradient */}
                        <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-bold uppercase tracking-widest mb-6">
                            <Brain size={14} className="text-purple-300" />
                            <span className="text-gray-200">The Ultimate Hub</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                            The Psychology <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">of Color</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Discover how color drives human emotion, influences purchasing decisions, and shapes cultural symbolism. A complete guide for designers and marketers.
                        </p>
                    </div>
                </header>

                {/* Grid Section */}
                <main className="max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {colorPsychologyDb.map((color) => {
                            // Determine text colors based on the background color for visibility
                            const isLight = ['yellow', 'white'].includes(color.slug);
                            const textColor = isLight ? 'text-gray-900' : 'text-white';
                            const mutedTextColor = isLight ? 'text-gray-700' : 'text-white/80';
                            const borderColor = isLight ? 'border-gray-900/10' : 'border-white/10';

                            // Special case for white to add a border so it doesn't bleed into the background
                            const specialBorder = color.slug === 'white' ? 'border-gray-200 border-2' : '';

                            return (
                                <Link
                                    key={color.slug}
                                    href={`/color-psychology/${color.slug}`}
                                    className={`group rounded-[2rem] p-8 lg:p-10 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 shadow-xl hover:shadow-2xl flex flex-col h-[400px] relative overflow-hidden ${specialBorder}`}
                                    style={{ backgroundColor: color.hex }}
                                >
                                    {/* Grain Overlay for Texture */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="mb-auto">
                                            <h2 className={`text-4xl font-black mb-3 ${textColor} capitalize tracking-tight`}>{color.name}</h2>
                                            <p className={`text-lg font-medium leading-snug ${mutedTextColor} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}>
                                                {color.shortDescription}
                                            </p>
                                        </div>

                                        <div className={`mt-auto pt-6 border-t ${borderColor} flex items-center justify-between`}>
                                            <span className={`text-sm font-bold uppercase tracking-widest ${textColor} group-hover:translate-x-2 transition-transform duration-300`}>
                                                Read Guide
                                            </span>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isLight ? 'bg-gray-900/5 group-hover:bg-gray-900/10' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                                <ArrowRight size={20} className={textColor} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </main>

                {/* Simple Footer Callout */}
                <section className="bg-gray-50 py-24 text-center px-6 border-t border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Want to apply these colors?</h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
                        Use the Dopely Colors generator to build mathematically perfect, accessible color systems based on these psychological profiles.
                    </p>
                    <Link href="/generator" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/30">
                        Launch Generator <ArrowRight size={18} className="ml-2" />
                    </Link>
                </section>
            </div>
        </DashboardLayout>
    );
}
