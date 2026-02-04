'use client';

import { useState } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Layers, Copy, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

export default function ShadowGenerator() {
    const [color, setColor] = useState('#000000');
    const [layers, setLayers] = useState(6);
    const [finalAlpha, setFinalAlpha] = useState(0.07);
    const [yOffset, setYOffset] = useState(100);
    const [blurRadius, setBlurRadius] = useState(80);
    const [spread, setSpread] = useState(-20);
    const [reverse, setReverse] = useState(false); // Inner shadow? No, typically just curve direction.

    const generateShadows = () => {
        const shadows = [];
        for (let i = 1; i <= layers; i++) {
            const progress = i / layers;
            // Ease-in curve for smooth stacking
            const y = Math.round(yOffset * progress);
            const blur = Math.round(blurRadius * progress);
            // Non-linear opacity for realistic falloff
            const alpha = +(finalAlpha * (1 - Math.pow(progress - 1, 2))).toFixed(3);
            // Better algorithm: Easing function
            // Let's use a standard polynomial ease for more "Google/Apple" feel
            const ease = (t: number) => t * t; // Quadratic

            const currentY = Math.round(yOffset * ease(progress));
            const currentBlur = Math.round(blurRadius * ease(progress));
            const currentAlpha = +(finalAlpha * (1 - ease(progress)) + (finalAlpha / layers)).toFixed(3); // heuristic

            shadows.push(`0 ${currentY}px ${currentBlur}px ${spread * ease(progress)}px ${chroma(color).alpha(currentAlpha).css()}`);
        }
        return shadows.join(',\n  ');
    };

    const shadowCSS = `box-shadow: \n  ${generateShadows()};`;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                            <Layers size={32} />
                        </div>
                        Smooth Shadow Generator
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Create beautiful, layered, hyper-realistic shadows using curve-based stacking.
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* Controls */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Shadow Color</label>
                                <div className="flex gap-2">
                                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex justify-between">Layers <span>{layers}</span></label>
                                <input type="range" min="1" max="10" value={layers} onChange={(e) => setLayers(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg accent-indigo-600" />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex justify-between">Final Opacity <span>{Math.round(finalAlpha * 100)}%</span></label>
                                <input type="range" min="0.01" max="1" step="0.01" value={finalAlpha} onChange={(e) => setFinalAlpha(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg accent-indigo-600" />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex justify-between">Vertical Distance <span>{yOffset}px</span></label>
                                <input type="range" min="0" max="200" value={yOffset} onChange={(e) => setYOffset(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg accent-indigo-600" />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex justify-between">Blur Radius <span>{blurRadius}px</span></label>
                                <input type="range" min="0" max="300" value={blurRadius} onChange={(e) => setBlurRadius(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg accent-indigo-600" />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex justify-between">Spread <span>{spread}px</span></label>
                                <input type="range" min="-100" max="100" value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg accent-indigo-600" />
                            </div>

                        </div>
                    </div>

                    {/* Preview */}
                    <div className="md:col-span-8 space-y-8">
                        <div className="bg-gray-50 flex items-center justify-center min-h-[500px] border border-gray-200 rounded-[2rem] overflow-hidden relative">
                            {/* Background Grid */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                            <div
                                className="w-48 h-48 bg-white rounded-3xl transition-all duration-300"
                                style={{ boxShadow: generateShadows() }}
                            />
                        </div>

                        {/* Code */}
                        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg relative group">
                            <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap">{shadowCSS}</pre>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(shadowCSS);
                                    toast.success("Copied CSS");
                                }}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
