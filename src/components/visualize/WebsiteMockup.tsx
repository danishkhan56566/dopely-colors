'use client';

import { Color } from '@/store/usePaletteStore';
import { ArrowRight, Layers, PieChart, BarChart3, Search, Bell } from 'lucide-react';
import chroma from 'chroma-js';
import clsx from 'clsx';

interface WebsiteMockupProps {
    colors: Color[];
    isInteractive?: boolean; // If true, we might show more hover effects or direct editing triggers
}

export const WebsiteMockup = ({ colors, isInteractive = false }: WebsiteMockupProps) => {
    // 0: Text
    // 1: Background
    // 2: Primary
    // 3: Secondary
    // 4: Accent

    const cText = colors[0].hex;
    const cBg = colors[1].hex;
    const cPrim = colors[2].hex;
    const cSec = colors[3].hex;
    const cAcc = colors[4].hex;

    // Helper for text on colorful buttons
    const textOnPrim = chroma.contrast(cPrim, '#ffffff') > 3 ? '#ffffff' : '#000000';
    const textOnAcc = chroma.contrast(cAcc, '#ffffff') > 3 ? '#ffffff' : '#000000';

    return (
        <div className="w-full h-full bg-white text-sans overflow-y-auto no-scrollbar pb-32" style={{ backgroundColor: cBg, color: cText }}>
            {/* Header */}
            {/* Header Removed as per request */}


            {/* HERO SECTION */}
            <header className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
                        Visualize your <br />
                        <span style={{ color: cPrim }}>color palette</span> <br />
                        in real-time.
                    </h1>
                    <p className="text-xl md:text-2xl leading-relaxed opacity-80 max-w-lg">
                        See how your colors interact on a real website layout.
                        Press <code className="px-2 py-1 rounded text-base mx-1" style={{ backgroundColor: cSec, color: cBg }}>Spacebar</code>
                        to generate new vibes instantly.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            className="px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2"
                            style={{ backgroundColor: cPrim, color: textOnPrim }}
                        >
                            Start Exploring <ArrowRight size={20} />
                        </button>
                        <button
                            className="px-8 py-4 rounded-xl font-bold text-lg border-2 hover:bg-black/5 transition-colors"
                            style={{ borderColor: cSec, color: cText }}
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                {/* HERO VISUAL / DASHBOARD MOCK */}
                <div className="relative isolate">
                    <div
                        className="absolute inset-0 -z-10 bg-gradient-to-tr from-transparent to-white/10 opacity-50 blur-3xl rounded-full"
                        style={{ background: `linear-gradient(to top right, ${cSec}, ${cAcc})`, filter: 'blur(60px)', opacity: 0.3 }}
                    />

                    <div
                        className="rounded-2xl shadow-2xl overflow-hidden border border-black/5"
                        style={{ backgroundColor: chroma(cBg).brighten(0.5).css() }} // Slightly lighter/diff than bg
                    >
                        {/* Fake Browser Toolbar */}
                        <div className="h-8 flex items-center gap-2 px-4 border-b border-black/5" style={{ backgroundColor: chroma(cSec).alpha(0.1).css() }}>
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <div className="ml-4 h-4 w-64 rounded-full opacity-20" style={{ backgroundColor: cText }} />
                        </div>

                        {/* Dashboard Content */}
                        <div className="p-6 grid gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">Dashboard Overview</h3>
                                <div className="flex gap-2">
                                    <Search size={18} className="opacity-50" />
                                    <Bell size={18} className="opacity-50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="p-4 rounded-xl shadow-sm" style={{ backgroundColor: cBg }}>
                                        <div className="text-sm opacity-60 mb-1">Metric {i}</div>
                                        <div className="text-2xl font-bold" style={{ color: i === 3 ? cAcc : cText }}>
                                            {84 * i}%
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-48 rounded-xl p-4 flex items-end gap-2 justify-between" style={{ backgroundColor: cBg }}>
                                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-full rounded-t-md transition-all duration-500"
                                        style={{
                                            height: `${h}%`,
                                            backgroundColor: i === 6 ? cAcc : cSec,
                                            opacity: i === 6 ? 1 : 0.6
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* FEATURE CARDS */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="font-bold tracking-widest uppercase text-sm mb-4 block" style={{ color: cAcc }}>Why Us?</span>
                    <h2 className="text-4xl font-bold mb-4">Everything you need.</h2>
                    <p className="max-w-2xl mx-auto opacity-70">
                        Our platform provides the best tools to visualize and export your color palettes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Layers, title: "Organized Layers", desc: "Keep your design system clean and scalable." },
                        { icon: PieChart, title: "Smart Analytics", desc: "Track color usage and accessibility scores." },
                        { icon: BarChart3, title: "Export Ready", desc: "Copy CSS codes with a single click." }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-3xl border transition-all hover:-translate-y-2 hover:shadow-xl"
                            style={{
                                backgroundColor: chroma(cBg).brighten(0.2).css(), // Subtle card bg
                                borderColor: chroma(cText).alpha(0.05).css()
                            }}
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                style={{ backgroundColor: cSec, color: cBg }}
                            >
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                            <p className="leading-relaxed opacity-70">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
