'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Layers, Copy, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { GlassGuide } from '@/components/content/GenerativeGuides';

export default function GlassmorphismGenerator() {
    const [color, setColor] = useState('#ffffff');
    const [opacity, setOpacity] = useState(20);
    const [blur, setBlur] = useState(16);
    const [saturation, setSaturation] = useState(180);
    const [radius, setRadius] = useState(12);
    const [outline, setOutline] = useState(1);
    const [outlineOpacity, setOutlineOpacity] = useState(30);

    // Convert hex to rgba
    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    };

    const generateCSS = () => {
        const rgb = hexToRgb(color);
        return `
/* Glassmorphism Effect */
.glass {
  background: rgba(${rgb}, ${opacity / 100});
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  border-radius: ${radius}px;
  border: ${outline}px solid rgba(255, 255, 255, ${outlineOpacity / 100});
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
        `.trim();
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateCSS());
        toast.success("Copied CSS");
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-cyan-100 rounded-2xl text-cyan-600">
                            <Layers size={32} />
                        </div>
                        Glassmorphism Optimizer
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Generate the perfect frosted glass effect for your UI.
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">

                            {/* Color */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Glass Color</label>
                                <div className="flex gap-2">
                                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                </div>
                            </div>

                            {/* Sliders */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Opacity</label>
                                        <span className="text-xs font-bold">{opacity}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-cyan-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Blur</label>
                                        <span className="text-xs font-bold">{blur}px</span>
                                    </div>
                                    <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-cyan-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Saturation</label>
                                        <span className="text-xs font-bold">{saturation}%</span>
                                    </div>
                                    <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-cyan-500" />
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between mb-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Border Outline</label>
                                        <span className="text-xs font-bold">{outline}px</span>
                                    </div>
                                    <input type="range" min="0" max="5" value={outline} onChange={(e) => setOutline(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-cyan-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Border Opacity</label>
                                        <span className="text-xs font-bold">{outlineOpacity}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={outlineOpacity} onChange={(e) => setOutlineOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-cyan-500" />
                                </div>
                            </div>

                            <button onClick={copyCode} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors">
                                <Copy size={16} /> Copy CSS
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-8">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-gray-900">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob" />
                                <div className="absolute bottom-0 -right-10 w-96 h-96 bg-yellow-500 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-2000" />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-4000" />
                                <img
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                                    className="w-full h-full object-cover opacity-50"
                                    alt="Background"
                                />
                            </div>

                            {/* Glass Card */}
                            <div
                                className="relative z-10 w-96 p-8 flex flex-col items-center text-center gap-4 transition-all duration-200"
                                style={{
                                    backgroundColor: `rgba(${hexToRgb(color)}, ${opacity / 100})`,
                                    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                                    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                                    borderRadius: `${radius}px`,
                                    border: `${outline}px solid rgba(255, 255, 255, ${outlineOpacity / 100})`,
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-sm">
                                    <Layers size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white drop-shadow-sm">Glassmorphism</h2>
                                <p className="text-white/80 text-sm leading-relaxed drop-shadow-sm">
                                    The frosted glass effect adds depth and visual hierarchy to your interface while maintaining context.
                                </p>
                                <button className="mt-2 px-6 py-2 bg-white text-black font-bold rounded-lg shadow-lg hover:scale-105 transition-transform">
                                    Action
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <GlassGuide />
            </div>
        </DashboardLayout>
    );
}
