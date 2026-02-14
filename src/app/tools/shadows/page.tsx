'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ShadowsGuide } from '@/components/content/AdvancedGuides';
import { Layers, Sun, Moon, Wand2, Copy, Move, Zap, RotateCcw } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ShadowsPage() {
    // State
    const [color, setColor] = useState('#6366f1');
    const [bgColor, setBgColor] = useState('#f8fafc');
    const [lightAngle, setLightAngle] = useState(45); // Degrees
    const [lightDistance, setLightDistance] = useState(20);
    const [elevation, setElevation] = useState(4); // 1-5 scale
    const [isColored, setIsColored] = useState(true);
    const [ambient, setAmbient] = useState(true);

    // Physics Engine
    const shadowCSS = useMemo(() => {
        // Convert polar to cartesian for light direction
        const rad = (lightAngle * Math.PI) / 180;
        const xDir = Math.cos(rad);
        const yDir = Math.sin(rad);

        const layers = [];
        const baseColor = chroma(color);
        const shadowColor = isColored ? baseColor.darken(1).saturate(1) : chroma('#000');

        // Generate layers based on elevation
        // Logic: Higher elevation = more layers, larger spread, lower opacity
        const numLayers = Math.max(2, elevation + 1);

        for (let i = 1; i <= numLayers; i++) {
            const step = i / numLayers; // 0 to 1

            // Physics Simulation
            const y = Math.round((yDir * lightDistance * elevation * 0.5) * step * step);
            const x = Math.round((xDir * lightDistance * elevation * 0.5) * step * step);
            const blur = Math.round((elevation * 10) * step);
            const spread = Math.round((elevation * -2) * (1 - step));
            const opacity = (0.5 / elevation) * (1 - step) + 0.02; // Decay

            const css = `${x}px ${y}px ${blur}px ${spread}px ${shadowColor.alpha(opacity).css()}`;
            layers.push(css);
        }

        // Add Ambient Occlusion layer (tight, dark, grounded)
        if (ambient) {
            const aoOpacity = 0.1 + (elevation * 0.02);
            layers.unshift(`0px ${elevation}px ${elevation * 2}px 0px ${shadowColor.alpha(aoOpacity).css()}`);
        }

        return layers.join(', ');
    }, [color, lightAngle, lightDistance, elevation, isColored, ambient]);

    // Presets
    const presets = [
        { name: 'Flat', elev: 0 },
        { name: 'Float', elev: 2 },
        { name: 'Lift', elev: 4 },
        { name: 'Soar', elev: 8 },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

                {/* Header */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
                                <Layers size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Atmosphere <span className="text-slate-400 font-light">Lab</span></h1>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`box-shadow: ${shadowCSS};`);
                                    toast.success("CSS Copied!");
                                }}
                                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <Copy size={14} /> Copy CSS
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 mt-6">

                    {/* Left: Controls */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Elevation & Presets */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Elevation (Z-Index)</h3>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">{elevation}px</span>
                            </div>
                            <input
                                type="range" min="0" max="12" step="1"
                                value={elevation} onChange={(e) => setElevation(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-6"
                            />
                            <div className="grid grid-cols-4 gap-2">
                                {presets.map(p => (
                                    <button
                                        key={p.name}
                                        onClick={() => setElevation(p.elev)}
                                        className={cn("py-2 rounded-lg text-xs font-bold transition-all border", elevation === p.elev ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300")}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Light Source (Sun Dial) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Sun size={14} /> Light Source
                            </h3>

                            {/* Radial Control Mockup */}
                            <div className="relative w-48 h-48 mx-auto rounded-full border-2 border-slate-100 bg-slate-50 mb-6 flex items-center justify-center shadow-inner">
                                <div className="absolute inset-0 rounded-full border border-slate-200 border-dashed opacity-50" />

                                {/* The "Object" center */}
                                <div className="w-8 h-8 bg-slate-300 rounded-lg shadow-sm z-10" />

                                {/* The Sun Dial Knob */}
                                <div
                                    className="absolute w-6 h-6 bg-yellow-400 rounded-full shadow-md border-2 border-white cursor-pointer hover:scale-110 transition-transform z-20"
                                    style={{
                                        transform: `rotate(${lightAngle}deg) translate(${lightDistance * 2}px) rotate(-${lightAngle}deg)`, // Simple orbit logic
                                        left: 'calc(50% - 12px)',
                                        top: 'calc(50% - 12px)'
                                    }}
                                // In a real app, drag logic here. For now, we simulate with sliders.
                                />

                                {/* Ray Helpers */}
                                <div className="absolute w-full h-[1px] bg-yellow-400/20" style={{ transform: `rotate(${lightAngle}deg)` }} />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">Angle</div>
                                    <input type="range" min="0" max="360" value={lightAngle} onChange={e => setLightAngle(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-yellow-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">Distance</div>
                                    <input type="range" min="0" max="50" value={lightDistance} onChange={e => setLightDistance(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-yellow-500" />
                                </div>
                            </div>
                        </div>

                        {/* Color & Tint */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Environment</h3>
                                <button onClick={() => setIsColored(!isColored)} className={cn("text-[10px] font-bold uppercase px-2 py-1 rounded border transition-colors", isColored ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "text-slate-400 border-slate-200")}>
                                    {isColored ? 'Colored Shadows' : 'Grayscale'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Object Color</label>
                                    <div className="flex items-center gap-2 group">
                                        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                                        <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full text-xs font-mono font-bold text-slate-600 outline-none uppercase bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Background</label>
                                    <div className="flex items-center gap-2 group">
                                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                                        <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full text-xs font-mono font-bold text-slate-600 outline-none uppercase bg-transparent" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* Right: Viewport */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* 3D Viewport */}
                        <div
                            className="flex-1 min-h-[500px] rounded-3xl border border-slate-200 shadow-inner flex items-center justify-center relative overflow-hidden transition-colors duration-500"
                            style={{ backgroundColor: bgColor }}
                        >
                            {/* Grid overlay */}
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                            {/* The Floating Object */}
                            <motion.div
                                className="w-48 h-48 rounded-[2rem] flex items-center justify-center relative z-10 cursor-pointer"
                                style={{
                                    backgroundColor: color,
                                    boxShadow: shadowCSS
                                }}
                                drag
                                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="text-white/50 mix-blend-overlay">
                                    <Move size={32} />
                                </div>
                            </motion.div>

                            {/* Info Badge */}
                            <div className="absolute bottom-6 left-6 flex gap-2">
                                <div className="px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-xs font-bold text-slate-500 border border-slate-100 flex items-center gap-2">
                                    <Zap size={12} className="text-yellow-500" />
                                    {shadowCSS.split(',').length} Layers
                                </div>
                            </div>

                        </div>

                        {/* Code Output */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-xs shadow-xl flex flex-col gap-4 relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { navigator.clipboard.writeText(`box-shadow: ${shadowCSS};`); toast.success('Copied!'); }} className="p-2 hover:bg-white/10 rounded-lg text-white">
                                    <Copy size={16} />
                                </button>
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Generated CSS</div>
                            <div className="break-all leading-relaxed opacity-80 select-all">
                                box-shadow: {shadowCSS};
                            </div>
                        </div>

                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-6 mt-12 mb-20">
                    <ShadowsGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
