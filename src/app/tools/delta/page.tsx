'use client';

import { useState } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Ruler, RefreshCw, Info } from 'lucide-react';
import { DeltaGuide } from '@/components/content/DevGuides';
import clsx from 'clsx';

export default function DeltaECalculator() {
    const [colorA, setColorA] = useState('#3b82f6');
    const [colorB, setColorB] = useState('#2563eb');

    const getDeltaE = () => {
        try {
            return chroma.deltaE(colorA, colorB);
        } catch {
            return 0;
        }
    };

    const delta = getDeltaE();
    const cleanDelta = delta.toFixed(2);

    const getInterpretation = (d: number) => {
        if (d < 1) return { title: 'Indistinguishable', desc: 'The human eye cannot perceive the difference.', color: 'text-green-600' };
        if (d < 2) return { title: 'Perceptible', desc: 'Difference is observable through close observation.', color: 'text-green-500' };
        if (d < 10) return { title: 'Observable', desc: 'Difference is perceptible at a glance.', color: 'text-yellow-600' };
        if (d < 49) return { title: 'Opposite', desc: 'Colors are more opposite than similar.', color: 'text-orange-600' };
        return { title: 'Different', desc: 'Colors are completely different.', color: 'text-red-600' };
    };

    const interp = getInterpretation(delta);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                            <Ruler size={32} />
                        </div>
                        Color Distance Calculator
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Measure perceptual difference (Delta E) between two colors to ensure distinction.
                    </p>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Inputs */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
                        {/* Color A */}
                        <div className="group">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex justify-between">
                                Reference Color (A)
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">Lab: {chroma(colorA).lab().map(n => n.toFixed(0)).join(', ')}</span>
                            </label>
                            <div className="flex gap-4 items-center">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                                    <input type="color" value={colorA} onChange={(e) => setColorA(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                </div>
                                <div className="flex-1">
                                    <input type="text" value={colorA} onChange={(e) => setColorA(e.target.value)} className="w-full text-2xl font-black text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-purple-500 outline-none uppercase font-mono" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="h-px bg-gray-100 w-full" />
                            <div className="px-4 text-gray-300">VS</div>
                            <div className="h-px bg-gray-100 w-full" />
                        </div>

                        {/* Color B */}
                        <div className="group">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex justify-between">
                                Comparison Color (B)
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">Lab: {chroma(colorB).lab().map(n => n.toFixed(0)).join(', ')}</span>
                            </label>
                            <div className="flex gap-4 items-center">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                                    <input type="color" value={colorB} onChange={(e) => setColorB(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                </div>
                                <div className="flex-1">
                                    <input type="text" value={colorB} onChange={(e) => setColorB(e.target.value)} className="w-full text-2xl font-black text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-purple-500 outline-none uppercase font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="flex flex-col items-center justify-center text-center space-y-8">
                        <div className="relative w-64 h-64">
                            {/* Visual Rings */}
                            <div className="absolute inset-0 rounded-full border-[20px] border-l-transparent animate-spin-slow opacity-20" style={{ borderColor: colorA, borderLeftColor: 'transparent' }} />
                            <div className="absolute inset-4 rounded-full border-[20px] border-r-transparent animate-reverse-spin opacity-20" style={{ borderColor: colorB, borderRightColor: 'transparent' }} />

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Delta E</span>
                                <span className={clsx("text-6xl font-black tracking-tighter", interp.color)}>
                                    {cleanDelta}
                                </span>
                            </div>
                        </div>

                        <div className="max-w-xs">
                            <h3 className={clsx("text-2xl font-bold mb-2", interp.color)}>{interp.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {interp.desc}
                            </p>
                        </div>

                        <div className="bg-blue-50 text-blue-800 px-6 py-4 rounded-2xl text-left text-sm flex gap-3">
                            <Info size={20} className="shrink-0 mt-0.5" />
                            <p>
                                Delta E (CIE76/Lab) measures the distance between two colors in a 3D perceptually uniform space. Lower is closer.
                            </p>
                        </div>
                    </div>

                </div>
                <DeltaGuide />
            </div>
            <style jsx>{`
                @keyframes spin-slow { to { transform: rotate(360deg); } }
                @keyframes reverse-spin { to { transform: rotate(-360deg); } }
                .animate-spin-slow { animation: spin-slow 10s linear infinite; }
                .animate-reverse-spin { animation: reverse-spin 12s linear infinite; }
            `}</style>
        </DashboardLayout>
    );
}
