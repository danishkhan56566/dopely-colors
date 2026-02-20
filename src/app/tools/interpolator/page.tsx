'use client';

import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Network, Copy, ArrowRight, Spline, Wand2 } from 'lucide-react';
import { InterpolatorGuide } from '@/components/content/UtilityGuides';
import { toast } from 'sonner';


export default function InterpolatorTool() {
    const [startColor, setStartColor] = useState('#fef08a');
    const [endColor, setEndColor] = useState('#854d0e');
    const [midColor, setMidColor] = useState('');
    const [steps, setSteps] = useState(10);
    const [mode, setMode] = useState<'lch' | 'lab' | 'rgb' | 'hsl' | 'bezier'>('lch');

    const scale = useMemo(() => {
        try {
            if (mode === 'bezier') {
                const colors = midColor ? [startColor, midColor, endColor] : [startColor, endColor];
                return chroma.bezier(colors).scale().colors(steps);
            }

            const colors = midColor ? [startColor, midColor, endColor] : [startColor, endColor];
            return chroma.scale(colors).mode(mode).colors(steps);
        } catch {
            return [];
        }
    }, [startColor, endColor, midColor, steps, mode]);

    const copyAll = () => {
        navigator.clipboard.writeText(JSON.stringify(scale));
        toast.success("Copied Array");
    };

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<InterpolatorGuide />}
        >
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
                            <Spline size={32} />
                        </div>
                        Color Scale Master
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Create smooth, perceptually uniform color bridges using interpolation and Bezier curves.
                    </p>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* Controls */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Interpolation Mode</label>
                                <div className="flex flex-wrap gap-2">
                                    {['lch', 'lab', 'rgb', 'hsl', 'bezier'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMode(m as any)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${mode === m ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Start Color</label>
                                    <div className="flex gap-2">
                                        <input type="color" value={startColor} onChange={(e) => setStartColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                                        <input type="text" value={startColor} onChange={(e) => setStartColor(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block flex justify-between">
                                        Mid Color (Control Point)
                                        <span className="text-[10px] text-gray-400 cursor-pointer hover:text-red-500" onClick={() => setMidColor('')}>Clear</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input type="color" value={midColor || '#888888'} onChange={(e) => setMidColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                                        <input type="text" value={midColor} placeholder="Optional" onChange={(e) => setMidColor(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">End Color</label>
                                    <div className="flex gap-2">
                                        <input type="color" value={endColor} onChange={(e) => setEndColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                                        <input type="text" value={endColor} onChange={(e) => setEndColor(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Steps: {steps}</label>
                                <input type="range" min="3" max="50" value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg accent-pink-600" />
                            </div>

                        </div>
                    </div>

                    {/* Preview */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm min-h-[300px] flex flex-col justify-center">
                            <div className="flex h-32 rounded-2xl overflow-hidden shadow-inner ring-1 ring-black/5">
                                {scale.map((hex, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 group relative transition-all hover:flex-[2]"
                                        style={{ backgroundColor: hex }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(hex);
                                            toast.success(`Copied ${hex}`);
                                        }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-black/50 text-white text-[10px] font-mono px-1 py-0.5 rounded backdrop-blur-sm -rotate-90 md:rotate-0 whitespace-nowrap">
                                                {hex}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Usage</h4>
                                    <div className="flex gap-2">
                                        <button onClick={copyAll} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold shadow-sm hover:scale-105 transition-transform">
                                            JSON
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </PremiumToolLayout>
    );
}
