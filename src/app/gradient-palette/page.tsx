'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Palette, ArrowRight, Download, Share2, Copy, RefreshCw, Layers, Sparkles } from 'lucide-react';
import chroma from 'chroma-js';
import { toast } from 'sonner';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { ExportModal } from '@/components/ExportModal';

const HexColorPicker = dynamic(() => import('react-colorful').then(mod => mod.HexColorPicker), { ssr: false });

export default function GradientPalettePage() {
    const [color1, setColor1] = useState('#0fb9b1');
    const [color2, setColor2] = useState('#4b7bec');
    const [steps, setSteps] = useState(7);
    const [palette, setPalette] = useState<string[]>([]);
    const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(null);
    const [isExportOpen, setIsExportOpen] = useState(false);

    useEffect(() => {
        try {
            const generated = chroma.scale([color1, color2]).mode('lch').colors(steps);
            setPalette(generated);
        } catch (e) {
            console.error(e);
        }
    }, [color1, color2, steps]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text}`);
    };

    const reversePalette = () => {
        setColor1(color2);
        setColor2(color1);
    };

    const randomizeColors = () => {
        setColor1(chroma.random().hex());
        setColor2(chroma.random().hex());
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                                <Layers size={14} />
                                <span>Gradient Palette Generator</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                Create smooth color transitions.
                            </h1>
                            <p className="text-gray-500 font-medium">
                                Generate a stepped palette between two colors using LCH interpolation for perceptually uniform results.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={randomizeColors} className="p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 shadow-sm transition-all text-gray-600 hover:text-indigo-600">
                                <RefreshCw size={20} />
                            </button>
                            <button
                                onClick={() => setIsExportOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                <Download size={18} /> Export
                            </button>
                        </div>
                    </div>

                    {/* Main Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
                        {/* Sidebar Controls */}
                        <div className="lg:col-span-3 space-y-6 overflow-y-auto no-scrollbar pr-2">
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
                                {/* Pickers */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Start Color</label>
                                        <div
                                            className="h-16 rounded-2xl shadow-inner border-2 border-white cursor-pointer group relative overflow-hidden"
                                            style={{ backgroundColor: color1 }}
                                            onClick={() => setActivePicker(activePicker === 'start' ? null : 'start')}
                                        >
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <span className="text-white font-mono font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm">{color1}</span>
                                            </div>
                                        </div>
                                        {activePicker === 'start' && (
                                            <div className="mt-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                                <HexColorPicker color={color1} onChange={setColor1} className="!w-full" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-center -my-2">
                                        <button
                                            onClick={reversePalette}
                                            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all active:rotate-180"
                                        >
                                            <RefreshCw size={16} />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">End Color</label>
                                        <div
                                            className="h-16 rounded-2xl shadow-inner border-2 border-white cursor-pointer group relative overflow-hidden"
                                            style={{ backgroundColor: color2 }}
                                            onClick={() => setActivePicker(activePicker === 'end' ? null : 'end')}
                                        >
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <span className="text-white font-mono font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm">{color2}</span>
                                            </div>
                                        </div>
                                        {activePicker === 'end' && (
                                            <div className="mt-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                                <HexColorPicker color={color2} onChange={setColor2} className="!w-full" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Steps */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Steps</label>
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm">{steps}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="3"
                                        max="20"
                                        value={steps}
                                        onChange={(e) => setSteps(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] text-white shadow-lg">
                                <Sparkles size={24} className="mb-4 opacity-50" />
                                <h4 className="font-bold mb-2">Pro Tip</h4>
                                <p className="text-sm text-white/80 leading-relaxed font-medium">
                                    We use LCH interpolation to ensure the gradients don't lose saturation in the middle steps.
                                </p>
                            </div>
                        </div>

                        {/* Main Visualizer */}
                        <div className="lg:col-span-9 flex flex-col gap-6">
                            <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row">
                                {palette.map((color, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 group relative cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        onClick={() => copyToClipboard(color)}
                                    >
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-4">
                                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg mb-2 text-gray-900 scale-90 group-hover:scale-100 transition-transform">
                                                <Copy size={20} />
                                            </div>
                                            <span className="text-white font-mono font-black text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{color}</span>
                                        </div>
                                        {/* Position Indicator */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-bold text-[10px] uppercase tracking-widest text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Step {i + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Hex List */}
                            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-wrap gap-3">
                                {palette.map((color, i) => (
                                    <button
                                        key={i}
                                        onClick={() => copyToClipboard(color)}
                                        className="px-4 py-2 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100 rounded-xl font-mono text-sm font-bold text-gray-600 hover:text-indigo-600 transition-all flex items-center gap-2"
                                    >
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                colors={palette.map((hex, i) => ({ id: i.toString(), hex, isLocked: false }))}
                initialFormat="css"
            />
        </DashboardLayout>
    );
}
