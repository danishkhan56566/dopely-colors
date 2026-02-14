'use client';

import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Printer, Copy, Droplet } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { TonerGuide } from '@/components/content/ScienceGuides';

export default function ColorTonerPage() {
    const [color, setColor] = useState('#3b82f6');
    const [steps, setSteps] = useState(12);

    const generateScale = (target: string) => {
        try {
            return chroma.scale([color, target]).mode('lch').colors(steps + 1).slice(0, steps); // exclude the final extreme (white/black) slightly? No, keeping typical scale logic.
            // Actually standard tints/shades usually are color -> white.
            // Let's do color -> white but keep color as first.
            return chroma.scale([color, target]).mode('lch').colors(steps);
        } catch (e) {
            return [];
        }
    };

    const tints = useMemo(() => generateScale('#ffffff'), [color, steps]);
    const shades = useMemo(() => generateScale('#000000'), [color, steps]);
    const tones = useMemo(() => generateScale('#808080'), [color, steps]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text}`);
    };

    const ToneRow = ({ title, colors, desc }: { title: string, colors: string[], desc: string }) => (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
            </div>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {colors.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => copyToClipboard(c)}
                        className="group aspect-square rounded-xl shadow-sm border border-black/5 hover:scale-110 hover:shadow-md transition-all relative overflow-hidden"
                        style={{ backgroundColor: c }}
                        title={c}
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 backdrop-blur-[1px]">
                            <Copy size={14} className="text-white drop-shadow-md" />
                        </div>
                        <span className="absolute bottom-1 right-1 text-[8px] font-mono opacity-0 group-hover:opacity-100 text-white drop-shadow-md transition-opacity">
                            {c}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <Printer size={32} />
                        </div>
                        Color Toner
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Generate comprehensive tints, shades, and tones for any color to build cohesive palettes.
                    </p>
                </div>

                <div className="w-full max-w-5xl space-y-8">

                    {/* Controls */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-4 flex-1 w-full">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-gray-200 shrink-0">
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Base Color</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 font-mono text-lg font-bold uppercase transition-colors focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 flex-1 w-full">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Quantity ({steps})</label>
                                <input
                                    type="range"
                                    min="5"
                                    max="20"
                                    value={steps}
                                    onChange={(e) => setSteps(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <ToneRow title="Tints" colors={tints} desc="Mixed with White (Lightness ↑)" />
                        <ToneRow title="Shades" colors={shades} desc="Mixed with Black (Lightness ↓)" />
                        <ToneRow title="Tones" colors={tones} desc="Mixed with Gray (Saturation ↓)" />
                    </div>
                </div>
                <TonerGuide />
            </div>
        </DashboardLayout>
    );
}
