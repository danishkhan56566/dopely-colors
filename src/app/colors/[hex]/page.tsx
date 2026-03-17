import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getNearestColorName, getColorPsychology, getSimilarColors, getLibraryMatches, getFullConversions } from '@/lib/color-utils';
import chroma from 'chroma-js';
import { Metadata } from 'next';
import Link from 'next/link';
import { Copy, Heart, Share2, Info, Palette, ShieldCheck, Zap } from 'lucide-react';

export const revalidate = 86400; // 24 hours

type Props = {
    params: Promise<{ hex: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { hex: rawHex } = await params;
    const hex = '#' + rawHex.toUpperCase();
    
    if (!chroma.valid(hex)) {
        return { title: 'Invalid Color' };
    }

    const name = getNearestColorName(hex);
    const color = chroma(hex);
    const rgb = color.rgb().join(', ');
    const hsl = color.hsl().map((v, i) => i === 0 ? Math.round(v) : Math.round(v * 100) + '%').join(', ');
    const cmyk = color.cmyk().map(v => Math.round(v * 100) + '%').join(', ');

    return {
        title: `${name} Color (${hex}): Hex, RGB, HSL, CMYK, & Palettes | Dopely Colors`,
        description: `Everything you need to know about ${name} color (${hex}). Get RGB, HSL, CMYK conversions, matching palettes, color psychology, and interior design codes (RAL, Pantone).`,
        openGraph: {
            title: `${name} Color Details`,
            description: `Explore ${name} (${hex}) color codes and palettes.`,
            images: [`/api/og/color?hex=${rawHex}`],
        },
        alternates: {
            canonical: `https://dopelycolors.com/colors/${rawHex}`,
        }
    };
}

export default async function ColorPage({ params }: Props) {
    const { hex: rawHex } = await params;
    const hex = '#' + rawHex.toUpperCase();
    
    if (!chroma.valid(hex)) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <h1 className="text-2xl font-bold">Invalid Color Code</h1>
                </div>
            </DashboardLayout>
        );
    }

    const name = getNearestColorName(hex);
    const conversionsData = getFullConversions(hex);
    const psychology = getColorPsychology(hex);
    const similar = getSimilarColors(hex);
    const libraryMatches = getLibraryMatches(hex);

    const conversions = [
        { label: 'HEX', value: hex },
        { label: 'RGB', value: `rgb(${conversionsData.rgb})` },
        { label: 'HSL', value: `hsl(${conversionsData.hsl})` },
        { label: 'CMYK', value: `cmyk(${conversionsData.cmyk})` },
        { label: 'LAB', value: `lab(${conversionsData.lab})` },
        { label: 'XYZ', value: `xyz(${conversionsData.xyz})` },
        { label: 'LUV', value: `luv(${conversionsData.luv})` },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB] py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
                        {/* 1. Large Color Preview */}
                        <div className="space-y-6">
                            <div 
                                className="w-full aspect-[4/3] rounded-3xl shadow-2xl border border-white flex flex-col items-center justify-center text-white"
                                style={{ backgroundColor: hex }}
                            >
                                <h1 className="text-5xl md:text-7xl font-black drop-shadow-lg uppercase">{hex}</h1>
                                <p className="text-xl md:text-2xl font-bold opacity-90 tracking-widest uppercase mt-4">{name}</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <button className="flex-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 font-bold text-gray-900">
                                    <Heart size={20} className="text-red-500" /> Save Color
                                </button>
                                <button className="flex-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 font-bold text-gray-900">
                                    <Share2 size={20} className="text-blue-500" /> Share
                                </button>
                            </div>
                        </div>

                        {/* 2. Key Conversions */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                < Zap size={120} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <Copy size={24} className="text-blue-600" /> Color Conversions
                            </h2>
                            <div className="space-y-6">
                                {conversions.map((conv) => (
                                    <div key={conv.label} className="flex items-center justify-between group">
                                        <div>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{conv.label}</span>
                                            <div className="text-lg font-bold text-gray-900">{conv.value}</div>
                                        </div>
                                        <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section: Psychology & Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Info size={24} className="text-purple-600" /> Color Psychology of {name}
                            </h2>
                            <div className="space-y-6 text-gray-600 leading-relaxed font-medium">
                                <p>{psychology.description}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {psychology.psychology.traits.slice(0, 2).map((trait) => (
                                        <div key={trait.name} className="bg-gray-50 p-4 rounded-2xl">
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">{trait.name}</div>
                                            <div className="text-gray-900 font-bold">{trait.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <ShieldCheck size={20} className="text-green-600" /> Standards
                            </h2>
                            <div className="space-y-4">
                                {libraryMatches.map((match) => (
                                    <div key={match.library} className="border-b border-gray-50 pb-4 last:border-0">
                                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{match.library} Match</div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-bold text-gray-900">{match.name}</span>
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{match.matchPercent}% Match</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1 font-mono">{match.code}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section: Similar Colors */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <Palette size={24} className="text-orange-500" /> Similar Shades & Tones
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                            {similar.map((s) => (
                                <Link 
                                    key={s.hex} 
                                    href={`/colors/${s.hex.replace('#', '')}`}
                                    className="group"
                                >
                                    <div 
                                        className="h-32 w-full rounded-2xl mb-3 shadow-sm group-hover:shadow-lg transition-all border border-white"
                                        style={{ backgroundColor: s.hex }}
                                    />
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{s.hex}</div>
                                    <div className="text-xs text-gray-400 font-medium truncate">{s.name}</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* SEO Footer */}
                    <div className="bg-gray-100 rounded-3xl p-12 text-center">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Need a full palette for {name}?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto mb-8 font-medium">
                            Explore thousands of professional color combinations featuring {hex}. Perfect for UI design, branding, and digital illustration.
                        </p>
                        <Link 
                            href={`/explore?q=${name}`}
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all"
                        >
                            Explore {name} Palettes
                        </Link>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
