'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sun, Monitor, Projector, Book, Smartphone } from 'lucide-react';
import chroma from 'chroma-js';
import { motion } from 'framer-motion';

const LIGHTING_MODES = [
    { id: 'standard', name: 'Standard LCD', icon: Monitor, filter: 'none', desc: 'Typical sRGB monitor output.' },
    { id: 'oled', name: 'Vibrant OLED', icon: Smartphone, filter: 'saturate(1.2) contrast(1.1)', desc: 'High saturation and infinite contrast.' },
    { id: 'eink', name: 'E-Ink / Paper', icon: Book, filter: 'grayscale(100%) contrast(1.2) brightness(0.9)', desc: 'Monochrome high-contrast reflection.' },
    { id: 'projector', name: 'Projector', icon: Projector, filter: 'brightness(1.1) contrast(0.8) blur(0.5px)', desc: 'Washed out darker tones, light bleed.' },
    { id: 'blue-light', name: 'Night Shift', icon: Sun, filter: 'sepia(0.5) hue-rotate(-10deg) saturate(1.5)', desc: 'Blue light filter enabled (Warmer).' },
];

export default function LightingSimPage() {
    const [palette, setPalette] = useState(['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']);
    const [mode, setMode] = useState(LIGHTING_MODES[0]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
                        <Sun size={14} /> Hardware Simulation
                    </div>
                    <h1 className="text-4xl font-black mb-4">Lighting & Tech Simulator</h1>
                    <p className="text-lg text-gray-400">
                        Test how your colors render on different display technologies, from E-Ink readers to washed-out projectors.
                    </p>
                </header>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {LIGHTING_MODES.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m)}
                                className={`w-full p-4 rounded-xl border flex items-start gap-4 transition-all text-left ${mode.id === m.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                            >
                                <m.icon size={20} className="shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-bold text-sm">{m.name}</div>
                                    <div className="text-[10px] opacity-60 mt-1 leading-tight">{m.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-3">
                        <div className="bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[500px] flex flex-col">

                            {/* Toolbar */}
                            <div className="bg-white/5 border-b border-white/5 p-4 flex gap-4">
                                {palette.map((c, i) => (
                                    <input
                                        key={i}
                                        type="color"
                                        value={c}
                                        onChange={(e) => {
                                            const newP = [...palette];
                                            newP[i] = e.target.value;
                                            setPalette(newP);
                                        }}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                    />
                                ))}
                            </div>

                            {/* Simulated Screen */}
                            <div className="flex-1 p-10 flex items-center justify-center relative overlow-hidden">
                                {/* The Filter Layer */}
                                <div
                                    className="absolute inset-0 z-10 pointer-events-none transition-all duration-500 bg-white/0"
                                    style={{
                                        backdropFilter: mode.filter,
                                        WebkitBackdropFilter: mode.filter
                                    }}
                                />

                                {/* E-Ink Texture Overlay */}
                                {mode.id === 'eink' && (
                                    <div className="absolute inset-0 z-20 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none mix-blend-multiply" />
                                )}

                                {/* Content */}
                                <div className="max-w-lg w-full bg-white text-black rounded-xl overflow-hidden shadow-lg transform transition-transform duration-500 scale-100">
                                    <div className="h-32" style={{ backgroundColor: palette[0] }} />
                                    <div className="p-6">
                                        <div className="flex gap-2 mb-4">
                                            <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: palette[1] }}>New</span>
                                            <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: palette[2] }}>Active</span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">Interface Preview</h2>
                                        <p className="text-gray-500 mb-6">
                                            This is how your content aims to look. The simulation layer above alters the rendering to match hardware characteristics.
                                        </p>
                                        <div className="flex gap-4">
                                            <button className="flex-1 py-3 rounded-lg font-bold text-white" style={{ backgroundColor: palette[4] }}>
                                                Primary Action
                                            </button>
                                            <button className="flex-1 py-3 rounded-lg font-bold border-2" style={{ borderColor: palette[3], color: palette[3] }}>
                                                Secondary
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="bg-white/5 border-t border-white/5 p-4 text-xs font-mono text-center opacity-50">
                                Simulated Output: {mode.filter}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
