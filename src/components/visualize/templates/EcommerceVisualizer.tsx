'use client';

import { Color } from '@/store/usePaletteStore';
import { ShoppingBag, Star, Heart, Menu, Search } from 'lucide-react';
import clsx from 'clsx';

interface TemplateProps {
    colors: Color[];
}

export const EcommerceVisualizer = ({ colors }: TemplateProps) => {
    // Map colors
    const bg = colors[0].hex;
    const cardBg = colors[1].hex;
    const accent = colors[2].hex; // Buy Button
    const highlight = colors[3].hex; // Sale Badge
    const text = colors[4].hex;

    const isDark = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    };

    const textColor = (bgHex: string) => isDark(bgHex) ? '#ffffff' : '#111827';
    const mutedColor = (bgHex: string) => isDark(bgHex) ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';

    return (
        <div className="w-full h-full flex flex-col overflow-auto" style={{ backgroundColor: bg, color: textColor(bg) }}>
            {/* Nav */}
            <nav className="px-8 py-5 border-b sticky top-0 z-10 backdrop-blur-md bg-opacity-90" style={{ borderColor: mutedColor(bg), backgroundColor: bg }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Menu size={24} />
                        <span className="font-bold text-xl tracking-tight">STORE.</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium hidden md:flex">
                        <span>New Arrivals</span>
                        <span>Collections</span>
                        <span>Accessories</span>
                        <span className="text-red-500" style={{ color: highlight }}>Sale</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Search size={20} />
                        <div className="relative">
                            <ShoppingBag size={20} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold text-white" style={{ backgroundColor: accent }}>2</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="px-4 mt-6">
                <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative shadow-xl h-[300px] flex items-center" style={{ backgroundColor: cardBg }}>
                    <div className="w-1/2 p-12 relative z-10">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block" style={{ backgroundColor: highlight, color: textColor(highlight) }}>
                            New Season
                        </span>
                        <h1 className="text-5xl font-bold mb-4" style={{ color: textColor(cardBg) }}>Summer Collection</h1>
                        <p className="mb-8 opacity-80" style={{ color: textColor(cardBg) }}>Discover the new premium aesthetic for your lifestyle.</p>
                        <button className="px-8 py-3 rounded-full font-bold transition-transform hover:scale-105" style={{ backgroundColor: accent, color: textColor(accent) }}>
                            Shop Now
                        </button>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-50">
                        <div className="absolute right-20 top-20 w-32 h-32 rounded-full" style={{ backgroundColor: accent }}></div>
                        <div className="absolute right-40 bottom-10 w-48 h-48 rounded-full mix-blend-multiply" style={{ backgroundColor: highlight }}></div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-6xl mx-auto px-4 py-16 w-full">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Trending Now</h2>
                    <span className="text-sm font-medium border-b border-current pb-0.5 cursor-pointer">View All</span>
                </div>

                <div className="grid grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((item, i) => (
                        <div key={i} className="group">
                            <div className="aspect-[3/4] rounded-2xl mb-4 relative overflow-hidden" style={{ backgroundColor: cardBg }}>
                                <div className="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-white/90 text-black rounded" style={{ display: i === 0 ? 'block' : 'none' }}>
                                    NEW
                                </div>
                                <div className="absolute top-3 right-3 p-2 rounded-full bg-white/50 hover:bg-white text-black transition-colors cursor-pointer opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <Heart size={16} />
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <button className="w-full py-3 rounded-xl font-bold text-sm shadow-lg" style={{ backgroundColor: accent, color: textColor(accent) }}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold mb-1" style={{ color: textColor(bg) }}>Minimalist Tee {item}</h3>
                            <div className="flex items-center justify-between">
                                <span className="opacity-60" style={{ color: textColor(bg) }}>Essential</span>
                                <span className="font-bold" style={{ color: textColor(bg) }}>$45.00</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
