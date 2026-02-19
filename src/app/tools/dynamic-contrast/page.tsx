'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DynamicContrastGuide } from '@/components/content/AdvancedGuides';
import { Type, Eye, CheckCircle2, AlertTriangle, Wand2, Sun, FileText, Layers } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const metadata = {
    title: 'Dynamic Contrast Checker - Advanced Legibility Testing | Dopely Colors',
    description: 'Test text legibility against different backgrounds, font weights, and environmental conditions (glare, texture). Beyond standard WCAG checking.',
    alternates: {
        canonical: '/tools/dynamic-contrast',
    },
};

export default function DynamicContrastPage() {
    // State
    const [fg, setFg] = useState('#1e293b');
    const [bg, setBg] = useState('#ffffff');
    const [fontSize, setFontSize] = useState(16);
    const [fontWeight, setFontWeight] = useState(400); // 100-900
    const [textureMode, setTextureMode] = useState(false);
    const [glareMode, setGlareMode] = useState(false);

    // Analysis
    const ratio = chroma.contrast(fg, bg);
    const score = ratio.toFixed(2);

    // WCAG Levels based on size/weight logic (simplified)
    // Large text (18pt+ or 14pt+ bold) needs 3:1 for AA. Normal needs 4.5:1.
    const isLarge = fontSize >= 24 || (fontSize >= 18.5 && fontWeight >= 700);
    const targetAA = isLarge ? 3.0 : 4.5;
    const targetAAA = isLarge ? 4.5 : 7.0;

    const status = ratio >= targetAAA ? 'AAA' : ratio >= targetAA ? 'AA' : 'Fail';

    // Auto Fixer
    const autoFix = () => {
        let newFg = fg;
        let bestRatio = chroma.contrast(newFg, bg);
        let safety = 0;

        // Loop to darken/lighten until we hit targetAAA
        const isDarkSearch = chroma(bg).luminance() > 0.5;

        while (bestRatio < targetAAA && safety < 100) {
            newFg = isDarkSearch ? chroma(newFg).darken(0.05).hex() : chroma(newFg).brighten(0.05).hex();
            bestRatio = chroma.contrast(newFg, bg);
            safety++;
        }
        setFg(newFg);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">

                {/* Header */}
                <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-stone-900 text-white rounded-lg">
                                <Type size={20} />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">Legibility <span className="text-stone-400 font-light">Quantum</span></h1>
                        </div>
                        <div className="flex bg-stone-100 p-1 rounded-lg">
                            <div className="px-3 py-1 text-xs font-bold uppercase text-stone-500">WCAG 2.1</div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-px bg-stone-200 border border-stone-200 mt-6 rounded-[2rem] overflow-hidden shadow-sm">

                    {/* Left: Input Lab */}
                    <div className="lg:col-span-4 bg-white p-8 lg:p-10 flex flex-col gap-8">

                        <div>
                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Typography DNA</h3>

                            <div className="space-y-6">
                                {/* Font Size */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold flex items-center gap-2"><Type size={14} /> Size (px)</label>
                                        <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded">{fontSize}px</span>
                                    </div>
                                    <input type="range" min="12" max="72" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-stone-900 h-1.5 bg-stone-100 rounded-lg cursor-pointer" />
                                </div>

                                {/* Font Weight */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold flex items-center gap-2"><Layers size={14} /> Weight</label>
                                        <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded">{fontWeight}</span>
                                    </div>
                                    <input type="range" min="100" max="900" step="100" value={fontWeight} onChange={e => setFontWeight(Number(e.target.value))} className="w-full accent-stone-900 h-1.5 bg-stone-100 rounded-lg cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-stone-100 pt-8">
                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Color Matrix</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-stone-400 uppercase mb-2 block">Foreground (Text)</label>
                                    <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200 focus-within:ring-2 ring-stone-900/10">
                                        <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                                        <input type="text" value={fg} onChange={e => setFg(e.target.value)} className="flex-1 bg-transparent font-mono font-bold text-sm outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-stone-400 uppercase mb-2 block">Background</label>
                                    <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200 focus-within:ring-2 ring-stone-900/10">
                                        <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                                        <input type="text" value={bg} onChange={e => setBg(e.target.value)} className="flex-1 bg-transparent font-mono font-bold text-sm outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button onClick={autoFix} className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg shadow-stone-900/20">
                                <Wand2 size={16} /> Auto-Fix Contrast
                            </button>
                        </div>

                    </div>

                    {/* Right: Simulation */}
                    <div className="lg:col-span-8 bg-stone-50 p-8 lg:p-10 flex flex-col relative overflow-hidden">

                        {/* Simulation Viewport */}
                        <div
                            className="flex-1 rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-10 relative overflow-hidden transition-colors duration-500"
                            style={{ backgroundColor: bg }}
                        >
                            {/* Texture Overlay */}
                            {textureMode && (
                                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
                            )}
                            {/* Glare Overlay */}
                            {glareMode && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />
                            )}

                            <motion.div
                                layout
                                className="text-center max-w-2xl relative z-10"
                                style={{ color: fg, fontFamily: 'Inter, sans-serif' }}
                            >
                                <motion.h2
                                    className="leading-tight mb-4"
                                    style={{ fontSize: `${fontSize * 2}px`, fontWeight }}
                                >
                                    The quick brown fox jumps over the lazy dog.
                                </motion.h2>
                                <motion.p
                                    className="opacity-80"
                                    style={{ fontSize: `${fontSize}px`, fontWeight: Math.max(100, fontWeight - 200) }}
                                >
                                    Legibility is the foundation of interface design. Without contrast, there is no signal, only noise.
                                </motion.p>
                            </motion.div>

                            {/* Status Badge */}
                            <div className="absolute top-6 right-6 flex gap-2">
                                <div className={cn("px-4 py-2 rounded-full font-black text-sm border shadow-sm flex items-center gap-2",
                                    status === 'Fail' ? "bg-red-50 text-red-600 border-red-200" :
                                        status === 'AA' ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                                            "bg-green-50 text-green-600 border-green-200"
                                )}>
                                    {status === 'Fail' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                                    {status} ({score}:1)
                                </div>
                            </div>
                        </div>

                        {/* Environment Toggles */}
                        <div className="mt-8 flex gap-4 justify-center">
                            <button onClick={() => setTextureMode(!textureMode)} className={cn("px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border transition-colors", textureMode ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-500 border-stone-200")}>
                                <FileText size={16} /> Texture Test
                            </button>
                            <button onClick={() => setGlareMode(!glareMode)} className={cn("px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border transition-colors", glareMode ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-500 border-stone-200")}>
                                <Sun size={16} /> Solar Glare
                            </button>
                        </div>
                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-6 mt-12 mb-20">
                    <DynamicContrastGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
