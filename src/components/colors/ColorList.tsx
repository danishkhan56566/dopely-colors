'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tag, Search, Copy, Sparkles, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Color {
    name: string;
    hex: string;
}

export function ColorList({ initialColors }: { initialColors: Color[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Sort logic could go here, for now just filter
    const filteredColors = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return initialColors;

        return initialColors.filter(c =>
            (c.name && c.name.toLowerCase().includes(term)) ||
            (c.hex && c.hex.toLowerCase().includes(term))
        );
    }, [initialColors, searchTerm]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text}`);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white text-neutral-900 selection:bg-indigo-100">
                {/* Hero / Header Section */}
                <div className="relative pt-24 pb-12 px-6 md:px-12 overflow-hidden bg-neutral-50/50">
                    <div className="relative z-10 max-w-7xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200 shadow-sm text-xs font-bold uppercase tracking-widest text-indigo-500">
                            <Sparkles size={12} className="text-indigo-500" /> Color Encyclopedia
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-neutral-900">
                            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">Perfect Shade</span>.
                        </h1>
                        <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                            Explore thousands of named colors, curated and generated with diverse psychology and usage characteristics.
                        </p>
                    </div>
                </div>

                {/* Sticky Search Bar */}
                <div className="sticky top-4 z-50 px-6 max-w-2xl mx-auto mb-16">
                    <div className="bg-white/80 backdrop-blur-xl border border-neutral-200 rounded-full shadow-xl shadow-black/5 p-2 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50">
                        <div className="pl-4 text-neutral-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search colors (e.g. Cosmic Blue, #7F00FF)..."
                            className="flex-1 bg-transparent border-none text-neutral-900 placeholder-neutral-400 focus:ring-0 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors">
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 pb-24">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
                        {filteredColors.length === 0 ? (
                            <div className="col-span-full py-32 text-center text-neutral-400">
                                <div className="inline-block p-6 rounded-full bg-neutral-100 mb-4">
                                    <Search size={32} />
                                </div>
                                <p className="text-xl font-medium">No unique colors found matching "{searchTerm}"</p>
                            </div>
                        ) : filteredColors.map((color) => (
                            <Link
                                key={color.hex}
                                href={`/colors/${color.hex.replace('#', '')}/about`}
                                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-neutral-100 hover:border-neutral-200 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
                            >
                                {/* Color Block */}
                                <div
                                    className="absolute inset-0 bottom-[30%] transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundColor: color.hex }}
                                />

                                {/* Content Overlay */}
                                <div className="absolute inset-x-0 bottom-0 top-[60%] bg-white p-5 flex flex-col justify-between border-t border-neutral-100 group-hover:bg-neutral-50 transition-colors">

                                    <div>
                                        <h3 className="font-bold text-neutral-900 text-lg leading-tight truncate pr-2" title={color.name}>
                                            {color.name}
                                        </h3>
                                        <p className="text-xs font-mono text-neutral-400 mt-1">{color.hex}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                copyToClipboard(color.hex);
                                            }}
                                            className="text-neutral-500 hover:text-neutral-900 hover:scale-110 transition-transform"
                                        >
                                            <Copy size={16} />
                                        </button>
                                        <ArrowUpRight size={16} className="text-neutral-300 group-hover:text-neutral-400" />
                                    </div>
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
