'use client';

import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart3, ArrowRight, Copy, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function DataVizPalette() {
    const [mode, setMode] = useState<'sequential' | 'diverging' | 'qualitative'>('sequential');
    const [startColor, setStartColor] = useState('#fef08a');
    const [endColor, setEndColor] = useState('#854d0e');
    const [midColor, setMidColor] = useState('#f3f4f6'); // For diverging
    const [steps, setSteps] = useState(8);
    const [interpolation, setInterpolation] = useState<'lch' | 'lab' | 'rgb'>('lch');

    const palette = useMemo(() => {
        try {
            if (mode === 'qualitative') {
                return Array.from({ length: steps }, (_, i) =>
                    chroma.hsl(i * (360 / steps), 0.7, 0.55).hex()
                );
            }

            const colors = mode === 'sequential'
                ? [startColor, endColor]
                : [startColor, midColor, endColor];

            return chroma.scale(colors)
                .mode(interpolation)
                .correctLightness() // Improves perceptual uniformity
                .colors(steps);
        } catch {
            return [];
        }
    }, [startColor, endColor, midColor, steps, mode, interpolation]);

    const copyAll = () => {
        navigator.clipboard.writeText(JSON.stringify(palette, null, 2));
        toast.success("Copied Color Array");
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <BarChart3 size={32} />
                        </div>
                        Data Viz Palette
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Generate perceptually uniform color scales optimized for charts, maps, and data visualization.
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">

                            {/* Mode Selection */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Scale Type</label>
                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setMode('sequential')}
                                        className={clsx("flex-1 py-2 rounded-lg text-sm font-bold transition-all", mode === 'sequential' ? "bg-white shadow-sm text-black" : "text-gray-500")}
                                    >
                                        Sequential
                                    </button>
                                    <button
                                        onClick={() => setMode('diverging')}
                                        className={clsx("flex-1 py-2 rounded-lg text-sm font-bold transition-all", mode === 'diverging' ? "bg-white shadow-sm text-black" : "text-gray-500")}
                                    >
                                        Diverging
                                    </button>
                                    <button
                                        onClick={() => setMode('qualitative')}
                                        className={clsx("flex-1 py-2 rounded-lg text-sm font-bold transition-all", mode === 'qualitative' ? "bg-white shadow-sm text-black" : "text-gray-500")}
                                    >
                                        Qualitative
                                    </button>
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Start Color (Low)</label>
                                    <div className="flex gap-2">
                                        <input type="color" value={startColor} onChange={(e) => setStartColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                                        <input type="text" value={startColor} onChange={(e) => setStartColor(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                    </div>
                                </div>

                                {mode === 'diverging' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Mid Color (Neutral)</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={midColor} onChange={(e) => setMidColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                                            <input type="text" value={midColor} onChange={(e) => setMidColor(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">End Color (High)</label>
                                    <div className="flex gap-2">
                                        <input type="color" value={endColor} onChange={(e) => setEndColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                                        <input type="text" value={endColor} onChange={(e) => setEndColor(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Steps */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Data Classes</label>
                                    <span className="text-sm font-bold bg-gray-100 px-2 rounded">{steps}</span>
                                </div>
                                <input
                                    type="range"
                                    min="3"
                                    max="20"
                                    value={steps}
                                    onChange={(e) => setSteps(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Interpolation */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Interpolation Mode</label>
                                <div className="flex gap-2">
                                    {(['lch', 'lab', 'rgb'] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setInterpolation(m)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all",
                                                interpolation === m ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">LCH/LAB results in more perceptually uniform gradients.</p>
                            </div>

                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Bar Chart Preview */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col justify-end">
                            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest">Preview Context</h3>
                            <div className="flex items-end gap-2 md:gap-4 h-[300px]">
                                {palette.map((c, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-t-lg transition-all hover:opacity-90 relative group"
                                        style={{
                                            backgroundColor: c,
                                            height: `${20 + ((i + 1) / steps) * 70}%` // Random-ish growing height
                                        }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs font-bold px-2 py-1 rounded-lg">
                                            {c}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scale Strip */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900">Generated Palette</h3>
                                <button onClick={copyAll} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <Copy size={14} /> Copy JSON
                                </button>
                            </div>
                            <div className="flex h-16 rounded-xl overflow-hidden shadow-inner ring-1 ring-black/5">
                                {palette.map((c, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex items-center justify-center group cursor-pointer hover:flex-[1.5] transition-all duration-300"
                                        style={{ backgroundColor: c }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(c);
                                            toast.success(`Copied ${c}`);
                                        }}
                                    >
                                        <span className="text-[10px] font-mono text-white/90 opacity-0 group-hover:opacity-100 mix-blend-difference font-bold rotate-90 md:rotate-0 whitespace-nowrap">
                                            {c}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
