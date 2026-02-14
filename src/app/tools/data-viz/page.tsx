'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataVizGuide } from '@/components/content/AdvancedGuides';
import { BarChart3, PieChart, Activity, Grip, Eye, RefreshCw, Copy } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { BarChart, Bar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';

const SAMPLE_DATA = Array.from({ length: 12 }, (_, i) => ({
    name: `Group ${String.fromCharCode(65 + i)}`,
    value: Math.floor(Math.random() * 100) + 20,
    value2: Math.floor(Math.random() * 80) + 10
}));

export default function DataVizPage() {
    const [mode, setMode] = useState<'sequential' | 'diverging' | 'qualitative'>('sequential');
    const [startColor, setStartColor] = useState('#3b82f6');
    const [endColor, setEndColor] = useState('#1e40af');
    const [steps, setSteps] = useState(6);
    const [blindnessSim, setBlindnessSim] = useState<'none' | 'protanopia' | 'deuteranopia'>('none');

    const palette = useMemo(() => {
        let colors = [];
        if (mode === 'sequential') {
            colors = chroma.scale([startColor, endColor]).mode('lch').colors(steps);
        } else if (mode === 'diverging') {
            colors = chroma.scale([startColor, '#f3f4f6', endColor]).mode('lch').colors(steps);
        } else {
            // Qualitative: Distinguishable hues
            colors = chroma.scale([startColor, endColor, '#ec4899', '#f59e0b', '#10b981'])
                .mode('lch').colors(steps);
        }
        return colors;
    }, [mode, startColor, endColor, steps]);

    // Apply simulation
    const displayColors = useMemo(() => {
        if (blindnessSim === 'none') return palette;
        // Simple Sim
        return palette.map(c => {
            const [r, g, b] = chroma(c).rgb();
            let nr = r, ng = g, nb = b;
            if (blindnessSim === 'protanopia') {
                nr = 0.567 * r + 0.433 * g; ng = 0.558 * r + 0.442 * g; nb = 0.242 * g + 0.758 * b;
            } else if (blindnessSim === 'deuteranopia') {
                nr = 0.625 * r + 0.375 * g; ng = 0.7 * r + 0.3 * g; nb = 0.3 * g + 0.7 * b;
            }
            return chroma.rgb(nr, ng, nb).hex();
        });

    }, [palette, blindnessSim]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-neutral-900 text-neutral-100 pb-20 font-sans">

                {/* Header */}
                <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="text-indigo-500" />
                                Data Story <span className="opacity-50 font-light">Laboratory</span>
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setBlindnessSim(blindnessSim === 'none' ? 'deuteranopia' : 'none')} className={cn("p-2 rounded-lg border text-xs font-bold uppercase transition-all flex items-center gap-2", blindnessSim !== 'none' ? "bg-indigo-900/50 border-indigo-500 text-indigo-400" : "border-neutral-700 text-neutral-500")}>
                                <Eye size={14} /> {blindnessSim === 'none' ? 'Simulate Blindness' : 'Simulation Active'}
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 mt-6">

                    {/* Left: Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-neutral-800/50 p-6 rounded-3xl border border-neutral-700">

                            {/* Mode Switch */}
                            <div className="flex bg-neutral-900 p-1 rounded-xl mb-8">
                                {['sequential', 'diverging', 'qualitative'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m as any)}
                                        className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all", mode === m ? "bg-indigo-600 text-white shadow-lg" : "text-neutral-500 hover:text-white")}
                                    >
                                        {m.slice(0, 3)}
                                    </button>
                                ))}
                            </div>

                            {/* Colors */}
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase mb-2 block">Start Node</label>
                                    <div className="flex gap-2 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                                        <input type="color" value={startColor} onChange={(e) => setStartColor(e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
                                        <input type="text" value={startColor} onChange={(e) => setStartColor(e.target.value)} className="bg-transparent text-sm font-mono text-neutral-300 w-full outline-none py-1" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase mb-2 block">End Node</label>
                                    <div className="flex gap-2 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                                        <input type="color" value={endColor} onChange={(e) => setEndColor(e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
                                        <input type="text" value={endColor} onChange={(e) => setEndColor(e.target.value)} className="bg-transparent text-sm font-mono text-neutral-300 w-full outline-none py-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="mb-6">
                                <div className="flex justify-between text-xs font-bold text-neutral-400 mb-2">
                                    <span>Data Classes</span>
                                    <span className="text-white">{steps}</span>
                                </div>
                                <input type="range" min="3" max="12" value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                            </div>

                            {/* Generated List */}
                            <div className="space-y-1">
                                {displayColors.map((c, i) => (
                                    <div key={i} className="flex gap-3 items-center group cursor-pointer" onClick={() => { navigator.clipboard.writeText(c); toast.success('Copied!'); }}>
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                                        <span className="text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">{c}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Right: Charts */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 1. Bar Chart */}
                        <div className="bg-neutral-800/50 p-6 rounded-3xl border border-neutral-700 h-[300px] relative">
                            <div className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                <BarChart3 size={14} /> Revenue Mix
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SAMPLE_DATA} margin={{ top: 50, right: 0, left: -20, bottom: 0 }}>
                                    <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', color: '#fff', borderRadius: '8px' }} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                                        {SAMPLE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={displayColors[index % displayColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 2. Grid / Area */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-neutral-800/50 p-6 rounded-3xl border border-neutral-700 h-[250px] relative">
                                <div className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                    <Grip size={14} /> Heatmap
                                </div>
                                <div className="h-full w-full grid grid-cols-4 gap-1 pt-8 content-center">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div key={i} className="rounded" style={{ backgroundColor: displayColors[i % displayColors.length], opacity: Math.random() + 0.2 }} />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-neutral-800/50 p-6 rounded-3xl border border-neutral-700 h-[250px] relative">
                                <div className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                    <PieChart size={14} /> Distribution
                                </div>
                                <div className="h-full w-full flex items-center justify-center pt-4">
                                    {/* CSS Pie Chart Mockup */}
                                    <div className="w-32 h-32 rounded-full border-[16px] relative" style={{ borderColor: displayColors[0] }}>
                                        <div className="absolute inset-0 border-[16px] rounded-full" style={{ borderColor: displayColors[1], clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }} />
                                        <div className="absolute inset-0 border-[16px] rounded-full" style={{ borderColor: displayColors[2], clipPath: 'polygon(50% 50%, 0 100%, 0 0)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-6 mt-12 mb-20">
                    <DataVizGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
