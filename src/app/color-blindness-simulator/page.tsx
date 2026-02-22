'use client';

import { useState } from 'react';
import { Eye, Info, CheckCircle2 } from 'lucide-react';

const PALETTES_EXAMPLES = [
    ['#FF5F6D', '#FFC371'],
    ['#2193b0', '#6dd5ed'],
    ['#ee9ca7', '#ffdde1'],
    ['#00b09b', '#96c93d'],
    ['#4facfe', '#00f2fe'],
];

const BLINDNESS_TYPES = [
    { id: 'normal', name: 'Normal Vision', desc: 'Full color perception' },
    { id: 'protanopia', name: 'Protanopia', desc: 'Red-blind (1% of males)' },
    { id: 'deuteranopia', name: 'Deuteranopia', desc: 'Green-blind (1% of males)' },
    { id: 'tritanopia', name: 'Tritanopia', desc: 'Blue-blind (<1% of population)' },
    { id: 'achromatopsia', name: 'Achromatopsia', desc: 'Total color-blindness' },
];

export default function ColorBlindnessSimulator() {
    const [selectedType, setSelectedType] = useState('normal');
    const [colors, setColors] = useState(PALETTES_EXAMPLES[0]);

    // Simple filters for CSS to simulate color blindness
    const getFilter = (type: string) => {
        switch (type) {
            case 'protanopia': return 'grayscale(0.1) sepia(0.3) saturate(0.8) hue-rotate(-20deg)';
            case 'deuteranopia': return 'grayscale(0.1) sepia(0.3) saturate(0.8) hue-rotate(20deg)';
            case 'tritanopia': return 'grayscale(0.1) saturate(0.7) hue-rotate(180deg)';
            case 'achromatopsia': return 'grayscale(1)';
            default: return 'none';
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-4">
                        <Eye className="w-4 h-4" /> Accessibility Tool
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Color <span className="text-blue-600">Blindness</span> Simulator
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Test your designs and color palettes for accessibility. Over 8% of men see colors differently—ensure your UI works for everyone.
                    </p>
                </header>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Simulation Type</h2>
                            <div className="space-y-3">
                                {BLINDNESS_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${selectedType === type.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-bold">{type.name}</div>
                                            <div className="text-xs opacity-70">{type.desc}</div>
                                        </div>
                                        {selectedType === type.id && <CheckCircle2 className="w-5 h-5" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5" /> Why test this?
                            </h3>
                            <p className="text-blue-100 text-sm leading-relaxed mb-4">
                                Protanopia and Deuteranopia make it difficult to distinguish between red and green. If your UI relies solely on these colors for "Success" and "Error" states, color-blind users may not perceive the difference.
                            </p>
                            <p className="text-blue-100 text-sm leading-relaxed font-bold">
                                Always use icons + text in addition to color.
                            </p>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-8 right-8 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Rendering: {BLINDNESS_TYPES.find(t => t.id === selectedType)?.name}
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                                Live Simulation Area
                            </h3>

                            <div
                                className="transition-all duration-500 ease-in-out"
                                style={{ filter: getFilter(selectedType) }}
                            >
                                {/* Palette Preview */}
                                <div className="flex h-32 rounded-2xl overflow-hidden shadow-2xl mb-12">
                                    {colors.map((c, i) => (
                                        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                                    ))}
                                </div>

                                {/* UI Example */}
                                <div className="space-y-6 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Example Dashboard UI</h4>
                                    <div className="flex gap-4">
                                        <div className="h-4 w-24 bg-red-500 rounded" />
                                        <div className="h-4 w-24 bg-green-500 rounded" />
                                        <div className="h-4 w-24 bg-blue-500 rounded" />
                                    </div>
                                    <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                                    <div className="flex justify-between items-center">
                                        <div className="h-10 w-32 bg-blue-600 rounded-xl" />
                                        <div className="flex gap-2">
                                            <div className="h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded-full" />
                                            <div className="h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {PALETTES_EXAMPLES.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => setColors(p)}
                                    className="h-16 flex rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all shadow-sm"
                                >
                                    {p.map((c, j) => (
                                        <div key={j} className="flex-1" style={{ backgroundColor: c }} />
                                    ))}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
