'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RefreshCw, Copy, ArrowRight, Blend, Sparkles, Wand2, Info, CheckCircle2, FlaskConical, Share2, Download, Code } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { MixerGuide } from '@/components/content/ScienceGuides';
import { motion, AnimatePresence } from 'framer-motion';

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
        toast.success(`Copied to clipboard!`);
    };

    const copyGradient = () => {
        const css = `linear-gradient(to right, ${color1}, ${color2})`;
        navigator.clipboard.writeText(css);
        toast.success("CSS Gradient copied!");
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col items-center relative overflow-hidden font-sans">

                {/* Immersive Background Auras */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            background: [
                                `radial-gradient(circle at 20% 20%, ${color1}20 0%, transparent 50%)`,
                                `radial-gradient(circle at 30% 30%, ${color1}20 0%, transparent 60%)`,
                                `radial-gradient(circle at 20% 20%, ${color1}20 0%, transparent 50%)`,
                            ]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            background: [
                                `radial-gradient(circle at 80% 80%, ${color2}20 0%, transparent 50%)`,
                                `radial-gradient(circle at 70% 70%, ${color2}20 0%, transparent 60%)`,
                                `radial-gradient(circle at 80% 80%, ${color2}20 0%, transparent 50%)`,
                            ]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 blur-[120px]"
                    />
                </div>

                <div className="w-full max-w-[1700px] px-6 py-16 relative z-10 space-y-16">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-left space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                            >
                                <Sparkles size={14} className="text-blue-400" /> Color Science Studio
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-black tracking-tight"
                            >
                                Color <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 text-outline">Mixer</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-gray-400 max-w-xl"
                            >
                                Blend two colors into perfection using advanced perceptual interpolation.
                            </motion.p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={copyGradient}
                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-white/80"
                            >
                                <Code size={18} /> Copy CSS
                            </button>
                            <button
                                className="px-6 py-3 bg-white text-black rounded-2xl font-black flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
                            >
                                <Share2 size={18} /> Share Studio
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                        {/* Control Panel (4 cols) */}
                        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                            <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl ring-1 ring-white/5 space-y-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-8">Base Ingredients</h3>

                                <div className="space-y-6">
                                    {/* Color 1 */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Start Color</label>
                                        <div className="flex gap-4 items-center bg-black/40 p-4 rounded-3xl border border-white/5">
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-black/40 shadow-xl shrink-0">
                                                <input
                                                    type="color"
                                                    value={color1}
                                                    onChange={(e) => setColor1(e.target.value)}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <input
                                                    type="text"
                                                    value={color1}
                                                    onChange={(e) => setColor1(e.target.value)}
                                                    className="w-full bg-transparent border-none text-white font-bold p-0 text-base focus:ring-0 uppercase font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Color 2 */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">End Color</label>
                                        <div className="flex gap-4 items-center bg-black/40 p-4 rounded-3xl border border-white/5">
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-black/40 shadow-xl shrink-0">
                                                <input
                                                    type="color"
                                                    value={color2}
                                                    onChange={(e) => setColor2(e.target.value)}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <input
                                                    type="text"
                                                    value={color2}
                                                    onChange={(e) => setColor2(e.target.value)}
                                                    className="w-full bg-transparent border-none text-white font-bold p-0 text-base focus:ring-0 uppercase font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Mixing Protocol</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['rgb', 'lch', 'lab', 'hsl'] as const).map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setMode(m)}
                                                className={clsx(
                                                    "py-3 rounded-xl font-bold transition-all border text-sm",
                                                    mode === m
                                                        ? "bg-white text-black border-white shadow-lg"
                                                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                                                )}
                                            >
                                                {m.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visualization (8 cols) */}
                        <div className="lg:col-span-12 xl:col-span-8 space-y-8">

                            {/* Mixing Studio View */}
                            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Mixing Chamber</h3>
                                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs font-bold text-white/80">
                                        RATIO: {ratio}%
                                    </div>
                                </div>

                                <div className="relative h-80 w-full rounded-[2.5rem] overflow-hidden flex items-center justify-center bg-black/40 border border-white/5">

                                    {/* Dual Side Colors */}
                                    <motion.div
                                        animate={{ width: `${100 - ratio}%` }}
                                        className="h-full absolute left-0 top-0 transition-colors duration-500 opacity-20"
                                        style={{ backgroundColor: color1 }}
                                    />
                                    <motion.div
                                        animate={{ width: `${ratio}%` }}
                                        className="h-full absolute right-0 top-0 transition-colors duration-500 opacity-20"
                                        style={{ backgroundColor: color2 }}
                                    />

                                    {/* Focal Mix Point */}
                                    <div className="relative z-20 flex flex-col items-center gap-6">
                                        <motion.div
                                            animate={{
                                                backgroundColor: mixedColor,
                                                boxShadow: `0 0 80px ${mixedColor}40, 0 0 20px ${mixedColor}20`,
                                                scale: [1, 1.02, 1]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-48 h-48 rounded-full border-8 border-white shadow-2xl flex items-center justify-center relative group/mix overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/mix:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <button
                                                    onClick={() => copyToClipboard(mixedColor)}
                                                    className="p-4 bg-white text-black rounded-full scale-0 group-hover/mix:scale-100 transition-transform duration-300 shadow-xl"
                                                >
                                                    <Copy size={24} />
                                                </button>
                                            </div>
                                            <FlaskConical size={48} className={clsx("opacity-20", chroma(mixedColor).luminance() > 0.5 ? "text-black" : "text-white")} />
                                        </motion.div>
                                        <div className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 font-mono font-black text-xl tracking-tighter shadow-2xl">
                                            {mixedColor.toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 px-2 space-y-6">
                                    <div className="relative h-4 rounded-full bg-black/40 border border-white/5 overflow-hidden">
                                        <motion.div
                                            animate={{ left: `${ratio}%` }}
                                            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
                                        />
                                        <div
                                            className="absolute inset-0"
                                            style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={ratio}
                                        onChange={(e) => setRatio(Number(e.target.value))}
                                        className="w-full absolute inset-0 opacity-0 cursor-pointer h-16 mt-[-32px]"
                                    />
                                    <div className="flex justify-between text-[10px] font-black uppercase text-white/30 tracking-widest px-1">
                                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: color1 }} /> {color1}</span>
                                        <span className="flex items-center gap-2">{color2} <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color2 }} /></span>
                                    </div>
                                </div>
                            </div>

                            {/* Gradient Breakdown */}
                            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Molecular Scale</h3>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs font-black uppercase text-white/40 tracking-widest">Resolution: {steps}</span>
                                        <input
                                            type="range"
                                            min="3"
                                            max="20"
                                            value={steps}
                                            onChange={(e) => setSteps(Number(e.target.value))}
                                            className="w-32 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 xl:grid-cols-11 gap-3">
                                    <AnimatePresence mode="popLayout">
                                        {palette.map((c, i) => (
                                            <motion.button
                                                layout
                                                key={`scale-${c}-${i}`}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ delay: i * 0.02 }}
                                                onClick={() => copyToClipboard(c)}
                                                className="aspect-[4/5] rounded-2xl shadow-xl ring-2 ring-black/40 hover:scale-[1.15] hover:z-20 transition-all relative group overflow-hidden border border-white/5"
                                                style={{ backgroundColor: c }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-[8px] font-black uppercase tracking-tight">
                                                    <Copy size={12} className="mb-1" />
                                                    {c}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <MixerGuide />

                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.02);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }
                    .text-outline {
                        -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
                    }
                    input[type='range']::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 20px;
                        height: 20px;
                        background: white;
                        border-radius: 50%;
                        cursor: pointer;
                        box-shadow: 0 0 20px rgba(255,255,255,0.4);
                        border: 4px solid #000;
                    }
                `}</style>
            </div>
        </DashboardLayout>
    );
}

export default function ColorMixerWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0b]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
            </div>
        </div>}>
            <ColorMixerContent />
        </Suspense>
    );
}
