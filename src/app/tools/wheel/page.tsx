'use client';

import { useState, useMemo, useEffect } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Copy, RefreshCw, Layers } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function ColorHarmonyWheel() {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [harmony, setHarmony] = useState<'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic'>('complementary');
    const [rotation, setRotation] = useState(0); // For manual rotation shift if needed

    const harmonies = useMemo(() => {
        try {
            const base = chroma(baseColor);
            let colors: string[] = [];

            switch (harmony) {
                case 'complementary':
                    colors = [base.hex(), base.set('hsl.h', base.get('hsl.h') + 180).hex()];
                    break;
                case 'analogous':
                    colors = [
                        base.set('hsl.h', base.get('hsl.h') - 30).hex(),
                        base.hex(),
                        base.set('hsl.h', base.get('hsl.h') + 30).hex()
                    ];
                    break;
                case 'triadic':
                    colors = [
                        base.hex(),
                        base.set('hsl.h', base.get('hsl.h') + 120).hex(),
                        base.set('hsl.h', base.get('hsl.h') + 240).hex()
                    ];
                    break;
                case 'split-complementary':
                    colors = [
                        base.hex(),
                        base.set('hsl.h', base.get('hsl.h') + 150).hex(),
                        base.set('hsl.h', base.get('hsl.h') + 210).hex()
                    ];
                    break;
                case 'tetradic':
                    colors = [
                        base.hex(),
                        base.set('hsl.h', base.get('hsl.h') + 90).hex(),
                        base.set('hsl.h', base.get('hsl.h') + 180).hex(),
                        base.set('hsl.h', base.get('hsl.h') + 270).hex()
                    ];
                    break;
                case 'monochromatic':
                    // Chroma scale for monochromatic
                    colors = chroma.scale([base.brighten(2), base.darken(2)]).colors(5);
                    break;
                default:
                    colors = [base.hex()];
            }
            return colors;
        } catch (e) {
            return ['#000000'];
        }
    }, [baseColor, harmony]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text}`);
    };

    // Wheel Visualization Code (Canvas or SVG)
    // We'll use a simplified SVG representation
    const WheelViz = () => {
        const radius = 100;
        const center = 120;

        // Render Color Dots for the active harmony
        const dots = harmonies.map((c, i) => {
            const hue = chroma(c).get('hsl.h') || 0;
            // Convert Hue to Angle (0-360) -> Radians
            // SVG coordinate system: 0 is right (3 o'clock). Hue 0 is usually Red (0 deg).
            // We align Hue 0 to top? Or standard math.
            const angle = (hue - 90) * (Math.PI / 180); // -90 to start at top
            const x = center + radius * 0.8 * Math.cos(angle);
            const y = center + radius * 0.8 * Math.sin(angle);
            return (
                <g key={i}>
                    <line x1={center} y1={center} x2={x} y2={y} stroke="black" strokeOpacity="0.1" strokeWidth="2" />
                    <circle cx={x} cy={y} r={12} fill={c} stroke="white" strokeWidth="3" className="drop-shadow-md hover:scale-125 transition-transform origin-center cursor-pointer" onClick={() => copyToClipboard(c)} />
                </g>
            );
        });

        // Background Wheel Gradient
        return (
            <div className="relative w-60 h-60 mx-auto">
                <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl rounded-full">
                    {/* Conic Gradient approximation using multiple paths or foreign object with CSS */}
                    <defs>
                        <radialGradient id="wheelShine">
                            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <foreignObject x="0" y="0" width="240" height="240" className="rounded-full overflow-hidden">
                        <div className="w-full h-full rounded-full" style={{
                            background: 'conic-gradient(from 0deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'
                        }}></div>
                    </foreignObject>

                    {/* Inner White Cutout for donut effect */}
                    <circle cx="120" cy="120" r="40" fill="white" />

                    {/* Active Harmony Dots */}
                    {dots}

                    {/* Center Base Color */}
                    <circle cx="120" cy="120" r="30" fill={baseColor} stroke="white" strokeWidth="4" className="shadow-inner" />
                </svg>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                            <RefreshCw size={32} />
                        </div>
                        Color Harmony Wheel
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Visualize color relationships and generate harmonized palettes based on color theory.
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Controls & Wheel */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col items-center">
                            <WheelViz />

                            <div className="w-full mt-8 space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Base Color</label>
                                    <div className="flex gap-3">
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                                            <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                        </div>
                                        <input
                                            type="text"
                                            value={baseColor}
                                            onChange={(e) => setBaseColor(e.target.value)}
                                            className="flex-1 px-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-sm uppercase"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Harmony Rule</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'complementary', label: 'Complementary' },
                                            { id: 'analogous', label: 'Analogous' },
                                            { id: 'triadic', label: 'Triadic' },
                                            { id: 'split-complementary', label: 'Split Comp' },
                                            { id: 'tetradic', label: 'Tetradic' },
                                            { id: 'monochromatic', label: 'Monochromatic' },
                                        ].map(h => (
                                            <button
                                                key={h.id}
                                                onClick={() => setHarmony(h.id as any)}
                                                className={clsx(
                                                    "px-3 py-2 rounded-lg text-xs font-bold text-left transition-all",
                                                    harmony === h.id ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                )}
                                            >
                                                {h.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[500px] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900 text-xl capitalize">{harmony.replace('-', ' ')} Palette</h3>
                                <button onClick={() => copyToClipboard(harmonies.join(', '))} className="text-sm font-bold text-purple-600 hover:underline">Copy All</button>
                            </div>

                            <div className="flex-1 flex flex-col gap-4">
                                {harmonies.map((c, i) => (
                                    <div key={i} className="flex-1 flex rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-transform hover:scale-[1.02]">
                                        <div
                                            className="w-32 h-full relative"
                                            style={{ backgroundColor: c }}
                                        />
                                        <div className="flex-1 p-4 flex items-center justify-between bg-white pl-6">
                                            <div>
                                                <div className="font-mono font-bold text-lg text-gray-900 uppercase">{c}</div>
                                                <div className="text-xs text-gray-400 font-medium">
                                                    HSL: {Math.round(chroma(c).get('hsl.h'))}°, {Math.round(chroma(c).get('hsl.s') * 100)}%, {Math.round(chroma(c).get('hsl.l') * 100)}%
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(c)}
                                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors"
                                            >
                                                <Copy size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Context */}
                            <div className="mt-8 p-4 bg-purple-50 rounded-xl text-sm text-purple-800 leading-relaxed">
                                <strong>Tip:</strong> {
                                    harmony === 'complementary' ? "Good for high contrast and vibrant designs. Use sparingly." :
                                        harmony === 'analogous' ? "Serene and comfortable designs. Often found in nature." :
                                            harmony === 'triadic' ? "Balanced and vibrant. Let one color dominate." :
                                                "Explore different combinations for your brand."
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
