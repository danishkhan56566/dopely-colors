'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Eye, Check, X, RefreshCw, ArrowRight, Sun, Moon } from 'lucide-react';
import chroma from 'chroma-js';
import { motion } from 'framer-motion';

export default function DynamicContrastPage() {
    const [fg, setFg] = useState('#a2a2a2');
    const [bg, setBg] = useState('#ffffff');
    const [targetRatio, setTargetRatio] = useState(4.5); // 4.5 for AA, 7.0 for AAA

    // Computed Contrast
    const contrast = useMemo(() => {
        try {
            return chroma.contrast(fg, bg);
        } catch (e) {
            return 0;
        }
    }, [fg, bg]);

    const rating = contrast >= 7 ? 'AAA' : contrast >= 4.5 ? 'AA' : contrast >= 3 ? 'AA Large' : 'Fail';
    const isPassing = contrast >= targetRatio;

    // Fix Logic
    const fixContrast = (mode: 'fg' | 'bg') => {
        let fixedColor = mode === 'fg' ? fg : bg;
        const otherColor = mode === 'fg' ? bg : fg;
        let iter = 0;

        // Iteratively lighten or darken until it passes
        // Heuristic: If contrast is low, try pushing luminance away from the other color
        const otherLum = chroma(otherColor).luminance();
        const step = otherLum > 0.5 ? -0.05 : 0.05; // Darken if other is light, lighten if other is dark

        while (chroma.contrast(fixedColor, otherColor) < targetRatio && iter < 100) {
            try {
                if (otherLum > 0.5) {
                    fixedColor = chroma(fixedColor).darken(0.1).hex();
                } else {
                    fixedColor = chroma(fixedColor).brighten(0.1).hex();
                }
            } catch (e) { break; }
            iter++;
        }

        if (mode === 'fg') setFg(fixedColor);
        else setBg(fixedColor);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center">

                <header className="max-w-3xl w-full text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Eye size={14} /> Accessibility Suite
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Dynamic Contrast Adjuster</h1>
                    <p className="text-gray-500 text-lg">
                        Real-time accessibility repair. If your colors don't meet WCAG standards,
                        we'll mathematically adjust them for you while keeping the hue as close as possible.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">

                    {/* Controls */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-8">

                        {/* Selection */}
                        <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setTargetRatio(4.5)}
                                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${targetRatio === 4.5 ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                AA (Normal Text)
                            </button>
                            <button
                                onClick={() => setTargetRatio(7.0)}
                                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${targetRatio === 7.0 ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                AAA (High Contrast)
                            </button>
                        </div>

                        {/* Colors */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Foreground (Text)</label>
                                <div className="flex gap-4">
                                    <input
                                        type="color"
                                        value={fg}
                                        onChange={(e) => setFg(e.target.value)}
                                        className="w-14 h-14 rounded-xl cursor-pointer border-none bg-transparent"
                                    />
                                    <input
                                        type="text"
                                        value={fg}
                                        onChange={(e) => setFg(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 font-mono font-bold text-gray-700 uppercase focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                    <button
                                        onClick={() => fixContrast('fg')}
                                        className="px-4 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2"
                                        title="Adjust Text Color to Pass"
                                    >
                                        <RefreshCw size={18} /> Fix
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <ArrowRight className="text-gray-300 rotate-90 lg:rotate-0" />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Background</label>
                                <div className="flex gap-4">
                                    <input
                                        type="color"
                                        value={bg}
                                        onChange={(e) => setBg(e.target.value)}
                                        className="w-14 h-14 rounded-xl cursor-pointer border-none bg-transparent"
                                    />
                                    <input
                                        type="text"
                                        value={bg}
                                        onChange={(e) => setBg(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 font-mono font-bold text-gray-700 uppercase focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                    <button
                                        onClick={() => fixContrast('bg')}
                                        className="px-4 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2"
                                        title="Adjust Background Color to Pass"
                                    >
                                        <RefreshCw size={18} /> Fix
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Preview */}
                    <div className="flex flex-col gap-6">

                        {/* Score Card */}
                        <motion.div
                            layout
                            className={`p-8 rounded-3xl border-2 flex items-center justify-between shadow-lg ${isPassing ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
                        >
                            <div>
                                <div className="text-5xl font-black mb-1">{contrast.toFixed(2)}</div>
                                <div className="font-bold opacity-70 uppercase tracking-wider">{rating} Rating</div>
                            </div>
                            <div className={`p-4 rounded-full ${isPassing ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                {isPassing ? <Check size={32} strokeWidth={3} /> : <X size={32} strokeWidth={3} />}
                            </div>
                        </motion.div>

                        {/* Live Demo */}
                        <div
                            className="flex-1 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center transition-colors duration-300 min-h-[300px]"
                            style={{ backgroundColor: bg, color: fg }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Hello World.</h2>
                            <p className="text-lg md:text-xl opacity-90 max-w-sm leading-relaxed">
                                This is how your text looks properly.
                                Accessibility is not just a feature, it's a necessity.
                            </p>

                            <div className="mt-8 flex gap-4">
                                <button className="px-6 py-3 rounded-full font-bold opacity-90 hover:opacity-100 transition-opacity" style={{ backgroundColor: fg, color: bg }}>
                                    Primary Button
                                </button>
                                <button className="px-6 py-3 rounded-full font-bold border-2 opacity-90 hover:opacity-100 transition-opacity" style={{ borderColor: fg }}>
                                    Secondary
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
