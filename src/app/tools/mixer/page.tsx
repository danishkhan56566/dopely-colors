'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RefreshCw, Copy, ArrowRight, Blend } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { MixerGuide } from '@/components/content/ScienceGuides';

function ColorMixerContent() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view');
    const stepsRef = useRef<HTMLDivElement>(null);

    const [color1, setColor1] = useState('#3b82f6');
    const [color2, setColor2] = useState('#ec4899');
    const [ratio, setRatio] = useState(50);
    const [mode, setMode] = useState<'rgb' | 'lch' | 'lab' | 'hsl'>('lch');
    const [steps, setSteps] = useState(11);

    useEffect(() => {
        if (view === 'steps' && stepsRef.current) {
            stepsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [view]);

    const mixedColor = useMemo(() => {
        try {
            return chroma.mix(color1, color2, ratio / 100, mode).hex();
        } catch (e) {
            return '#000000';
        }
    }, [color1, color2, ratio, mode]);

    const palette = useMemo(() => {
        try {
            return chroma.scale([color1, color2]).mode(mode).colors(steps);
        } catch (e) {
            return [];
        }
    }, [color1, color2, steps, mode]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text}`);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                            <Blend size={32} />
                        </div>
                        Color Mixer
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Digitally mix two colors to find the perfect midpoint or generate a smooth gradient scale between them.
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            {/* Color 1 */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Color 1 (Start)</label>
                                <div className="flex gap-3">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                                        <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                    </div>
                                    <input
                                        type="text"
                                        value={color1}
                                        onChange={(e) => setColor1(e.target.value)}
                                        className="flex-1 px-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            {/* Color 2 */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Color 2 (End)</label>
                                <div className="flex gap-3">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                                        <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                    </div>
                                    <input
                                        type="text"
                                        value={color2}
                                        onChange={(e) => setColor2(e.target.value)}
                                        className="flex-1 px-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Mixing Mode (Interpolation)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['rgb', 'lch', 'lab', 'hsl'] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMode(m)}
                                            className={clsx(
                                                "py-2 rounded-lg text-xs font-bold uppercase transition-all",
                                                mode === m ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="lg:col-span-8 flex flex-col gap-8">

                        {/* Interactive Mixer */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Interactive Mix</h3>
                                <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded-md">{ratio}% Color 2</span>
                            </div>

                            <div className="h-40 rounded-2xl relative shadow-inner border border-black/5 overflow-hidden flex">
                                <div className="w-1/2 h-full absolute left-0 top-0 transition-colors duration-300" style={{ backgroundColor: color1 }} />
                                <div className="w-1/2 h-full absolute right-0 top-0 transition-colors duration-300" style={{ backgroundColor: color2 }} />

                                {/* Center Mix Dot */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className="w-24 h-24 rounded-full shadow-2xl border-4 border-white flex items-center justify-center transition-colors duration-100 z-10"
                                        style={{ backgroundColor: mixedColor }}
                                    >
                                        <button onClick={() => copyToClipboard(mixedColor)} className="opacity-0 hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-md p-2 rounded-full text-white">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 px-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={ratio}
                                    onChange={(e) => setRatio(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                                <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                                    <span>{color1}</span>
                                    <span>{color2}</span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown Steps */}
                        <div ref={stepsRef} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Gradient Steps</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-400">Steps: {steps}</span>
                                    <input
                                        type="range"
                                        min="3"
                                        max="20"
                                        value={steps}
                                        onChange={(e) => setSteps(Number(e.target.value))}
                                        className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-11 gap-2">
                                {palette.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => copyToClipboard(c)}
                                        className="aspect-square rounded-xl shadow-sm border border-black/5 hover:scale-110 hover:shadow-md transition-all relative group"
                                        style={{ backgroundColor: c }}
                                        title={c}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Copy size={12} className={chroma(c).luminance() > 0.5 ? "text-black/50" : "text-white/50"} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
                <MixerGuide />
            </div>
        </DashboardLayout>
    );
}

export default function ColorMixerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>}>
            <ColorMixerContent />
        </Suspense>
    );
}
