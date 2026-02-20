'use client';

import { useState, useMemo, useEffect } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Copy, RefreshCw, Layers, CheckCircle2, Wand2 } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { WheelGuide } from '@/components/content/ScienceGuides';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColorHarmonyWheel() {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [harmony, setHarmony] = useState<'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic'>('complementary');

    // Ensure we have a valid hex, fallback otherwise
    const validBaseColor = useMemo(() => {
        try {
            return chroma.valid(baseColor) ? chroma(baseColor).hex() : '#3b82f6';
        } catch {
            return '#3b82f6';
        }
    }, [baseColor]);

    const harmonies = useMemo(() => {
        try {
            const base = chroma(validBaseColor);
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
                    colors = chroma.scale([base.brighten(1.5), base.darken(1.5)]).colors(5);
                    break;
                default:
                    colors = [base.hex()];
            }
            return colors;
        } catch (e) {
            return ['#000000'];
        }
    }, [validBaseColor, harmony]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.custom((t) => (
            <div className="bg-[#111] border border-white/10 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-white" />
                </div>
                <span className="font-medium text-sm">Copied {text}</span>
            </div>
        ), { duration: 2000 });
    };

    // Advanced SVG Wheel Visualization
    const WheelViz = () => {
        const radius = 100;
        const center = 120;

        // Render Color Dots for the active harmony
        const dots = harmonies.map((c, i) => {
            const hue = chroma(c).get('hsl.h') || 0;
            // Convert Hue to Angle (0-360) -> Radians
            // SVG coordinate system: 0 is right (3 o'clock).
            // We align Hue 0 (Red) to top by subtracting 90.
            const angle = (hue - 90) * (Math.PI / 180);
            const x = center + radius * 0.8 * Math.cos(angle);
            const y = center + radius * 0.8 * Math.sin(angle);

            // Highlight base color slightly larger
            const isBase = (i === 0 && harmony !== 'analogous' && harmony !== 'monochromatic') ||
                (i === 1 && harmony === 'analogous') ||
                (i === 2 && harmony === 'monochromatic');

            return (
                <g key={`${c}-${i}`} className="transition-all duration-500 ease-out">
                    <line x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
                    <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                        cx={x}
                        cy={y}
                        r={isBase ? 16 : 12}
                        fill={c}
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="3"
                        className="drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer hover:stroke-white transition-all"
                        onClick={() => copyToClipboard(c)}
                    />
                </g>
            );
        });

        return (
            <div className="relative w-72 h-72 mx-auto group perspective-[1000px]">
                <motion.svg
                    viewBox="0 0 240 240"
                    className="w-full h-full drop-shadow-2xl rounded-full relative z-10 transition-transform duration-700 ease-out preserve-3d group-hover:rotate-x-12 group-hover:-rotate-y-12"
                >
                    {/* Dark inner glow for depth */}
                    <defs>
                        <filter id="innerGlow">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                            <feFlood floodColor="black" floodOpacity="0.5" />
                            <feComposite in2="shadowDiff" operator="in" />
                            <feComposite in2="SourceGraphic" operator="over" />
                        </filter>
                    </defs>

                    {/* Conic Gradient Base */}
                    <foreignObject x="0" y="0" width="240" height="240" className="rounded-full overflow-hidden shadow-2xl">
                        <div className="w-full h-full rounded-full opacity-90 shadow-inner" style={{
                            background: 'conic-gradient(from 0deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
                            filter: 'saturate(1.2)'
                        }}></div>
                    </foreignObject>

                    {/* Inner Cutout (Donut hole) matching dark theme */}
                    <circle cx="120" cy="120" r="45" fill="#111" stroke="rgba(255,255,255,0.05)" strokeWidth="1" filter="url(#innerGlow)" />

                    {/* Base Color Glow in center */}
                    <circle cx="120" cy="120" r="35" fill={validBaseColor} opacity="0.1" filter="blur(10px)" />

                    {/* Lines connecting center to dots */}
                    {dots}

                    {/* Center Base Color Dot */}
                    <motion.circle
                        layoutId="centerDot"
                        cx="120"
                        cy="120"
                        r="25"
                        fill={validBaseColor}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="3"
                        className="shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                    />
                </motion.svg>

                {/* Decorative outer ring */}
                <div className="absolute inset-[-10px] rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-[-20px] rounded-full border border-white/5 pointer-events-none opacity-50" />
            </div>
        );
    };

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<WheelGuide />}
        >
            {/* Dynamic Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0a0a0b] transition-colors duration-1000" style={{ backgroundColor: chroma(validBaseColor).darken(4).hex() }}>
                <div
                    className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-20 transition-colors duration-1000 mix-blend-screen"
                    style={{ backgroundColor: harmonies[0] }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-20 transition-colors duration-1000 mix-blend-screen"
                    style={{ backgroundColor: harmonies[harmonies.length - 1] }}
                />
            </div>

            <div className="min-h-screen flex flex-col items-center p-6 md:p-10 relative z-10 w-full max-w-7xl mx-auto">
                <header className="text-center max-w-3xl mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-6 backdrop-blur-md"
                    >
                        <RefreshCw size={14} className="text-blue-400" />
                        Theory Lab
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Color Harmony Wheel
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Visualize relationships and generate mathematically perfect palettes based on classic color theory.
                    </p>
                </header>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Controls & Visualizer */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center"
                        >
                            <WheelViz />

                            <div className="w-full mt-10 space-y-8">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Base Seed Color</label>
                                    <div className="flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 gap-2 shadow-inner">
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/20 shrink-0">
                                            <input
                                                type="color"
                                                value={validBaseColor}
                                                onChange={(e) => setBaseColor(e.target.value)}
                                                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={baseColor}
                                            onChange={(e) => setBaseColor(e.target.value)}
                                            className="w-full bg-transparent border-none text-white font-mono text-lg uppercase outline-none px-4"
                                            placeholder="#3B82F6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Harmony Rule</label>
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
                                                    "px-4 py-3 rounded-xl text-xs font-bold text-center transition-all duration-300 relative overflow-hidden group",
                                                    harmony === h.id
                                                        ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                                        : "bg-black/20 text-gray-400 hover:bg-white/5 border border-transparent"
                                                )}
                                            >
                                                {harmony === h.id && (
                                                    <motion.div
                                                        layoutId="activeHarmony"
                                                        className="absolute inset-0 bg-white/5"
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                <span className="relative z-10">{h.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Results / Palette Cards */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl min-h-[600px] flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="font-bold text-white text-2xl capitalize tracking-tight">{harmony.replace('-', ' ')}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{harmonies.length} colors generated</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(harmonies.join(', '))}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold transition-all border border-white/10 hover:scale-105 active:scale-95"
                                >
                                    <Copy size={14} />
                                    Copy Palette
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col gap-4">
                                <AnimatePresence mode="popLayout">
                                    {harmonies.map((c, i) => {
                                        let hsl;
                                        try {
                                            hsl = chroma(c).hsl();
                                        } catch {
                                            hsl = [0, 0, 0];
                                        }

                                        return (
                                            <motion.div
                                                key={`${c}-${harmony}-${i}`}
                                                layout
                                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                                className="flex h-24 rounded-2xl overflow-hidden shadow-lg border border-white/5 group relative bg-black/20 hover:bg-white/5 transition-colors"
                                            >
                                                {/* Color Swatch */}
                                                <div
                                                    className="w-32 md:w-48 h-full relative shrink-0 transition-transform duration-500 group-hover:scale-105"
                                                    style={{ backgroundColor: c }}
                                                />

                                                {/* Info Block */}
                                                <div className="flex-1 p-5 flex items-center justify-between pl-6 overflow-hidden">
                                                    <div>
                                                        <div className="font-mono font-bold text-xl text-white uppercase tracking-wider">{c}</div>
                                                        <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest hidden md:block">
                                                            HSL: {Math.round(hsl[0] || 0)}°, {Math.round((hsl[1] || 0) * 100)}%, {Math.round((hsl[2] || 0) * 100)}%
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(c)}
                                                        className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95 shrink-0"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Contextual Tip */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4"
                            >
                                <div className="mt-0.5">
                                    <Layers size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-300 mb-1">Harmony Insight</h4>
                                    <p className="text-sm text-blue-200/70 leading-relaxed">
                                        {
                                            harmony === 'complementary' ? "High contrast and vibrant. Use the main color for background/large areas and the complement for accents or calls to action." :
                                                harmony === 'analogous' ? "Serene and comfortable. These colors naturally match well. Ensure enough contrast when choosing text colors." :
                                                    harmony === 'triadic' ? "Balanced but highly vibrant. To use effectively, let one color dominate and use the other two for accent." :
                                                        harmony === 'split-complementary' ? "Strong visual contrast similar to complementary, but with less tension. Good for beginners." :
                                                            harmony === 'tetradic' ? "Rich and complex. Forms a rectangle on the wheel. Works best if you let one color be dominant." :
                                                                "Clean and elegant. Different shades of the same hue create a cohesive, minimalist aesthetic."
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-20 w-full max-w-5xl mx-auto">
                    
                </div>
            </div>
        </PremiumToolLayout>
    );
}
