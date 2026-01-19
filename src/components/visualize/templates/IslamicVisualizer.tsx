'use client';

import { Color } from '@/store/usePaletteStore';
import { Moon, Calendar, BookOpen, Compass, Menu } from 'lucide-react';
import clsx from 'clsx';

interface TemplateProps {
    colors: Color[];
}

export const IslamicVisualizer = ({ colors }: TemplateProps) => {
    // Map colors
    const bg = colors[0].hex; // Deep background (often dark or cream)
    const cardBg = colors[1].hex; // Card surface
    const primary = colors[2].hex; // Gold/Green accent
    const secondary = colors[3].hex; // Helper
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
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-100">
            {/* Phone Frame */}
            <div className="w-[375px] h-[750px] shadow-2xl rounded-[40px] overflow-hidden border-[8px] border-gray-900 bg-black relative">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-20"></div>

                {/* Content */}
                <div className="w-full h-full flex flex-col" style={{ backgroundColor: bg, color: textColor(bg) }}>

                    {/* Header */}
                    <div className="pt-14 px-6 flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium opacity-70 uppercase tracking-widest">Dhul Hijjah 12</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold font-serif">Mecca, SA</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: cardBg }}>
                            <Menu size={20} style={{ color: textColor(cardBg) }} />
                        </div>
                    </div>

                    {/* Prayer Card */}
                    <div className="mx-6 p-6 rounded-3xl mb-8 relative overflow-hidden shadow-lg" style={{ backgroundColor: primary }}>
                        <div className="relative z-10 text-white">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium opacity-80">Next Prayer</span>
                                    <span className="text-3xl font-bold">Asr</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-medium opacity-80">Time Remaining</span>
                                    <span className="text-xl font-bold block">00:45:12</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                                <Moon size={24} />
                                <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-white rounded-full"></div>
                                </div>
                                <span className="font-bold text-sm">3:45 PM</span>
                            </div>
                        </div>

                        {/* Pattern Overlay */}
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 opacity-10">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M37.8,-42.6C48.5,-31.1,56.1,-18.2,58.7,-3.9C61.3,10.4,59,26.1,49.2,36.9C39.4,47.7,22.1,53.6,5.6,53C-11,52.3,-21.9,45,-33.5,35.5C-45.1,26,-57.4,14.3,-60.1,0.2C-62.8,-13.9,-55.9,-30.4,-44.6,-41.8C-33.3,-53.2,-17.6,-59.5,-2.9,-59.1C11.8,-58.8,27.1,-54.1,37.8,-42.6Z" transform="translate(100 100)" />
                            </svg>
                        </div>
                    </div>

                    {/* Daily Verse */}
                    <div className="mx-6 flex-1 bg-white rounded-t-[40px] p-8 space-y-6" style={{ backgroundColor: cardBg }}>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg" style={{ color: textColor(cardBg) }}>Daily Verse</h3>
                            <BookOpen size={20} style={{ color: mutedColor(cardBg) }} />
                        </div>

                        <div className="text-center space-y-4 py-4">
                            <p className="font-serif text-2xl leading-loose" style={{ color: primary }}>
                                ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
                            </p>
                            <p className="text-sm leading-relaxed opacity-70" style={{ color: textColor(cardBg) }}>
                                All praise is due to Allah, Lord of the worlds.
                            </p>
                            <span className="text-xs font-bold uppercase tracking-wider block mt-4" style={{ color: secondary }}>
                                Al-Fatiha 1:2
                            </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {[
                                { icon: Calendar, label: 'Hijri Calendar' },
                                { icon: Compass, label: 'Qibla Finder' }
                            ].map((action, i) => (
                                <div key={i} className="p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer" style={{ backgroundColor: bg, border: `1px solid ${secondary}20` }}>
                                    <action.icon size={24} style={{ color: primary }} />
                                    <span className="text-xs font-bold" style={{ color: textColor(bg) }}>{action.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
