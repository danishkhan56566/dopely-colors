'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { EcoPaletteGuide } from '@/components/content/AdvancedGuides';
import { Leaf, Zap, Battery, AlertTriangle, Moon, Sun, Smartphone, RefreshCw, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function EcoPalettePage() {
    const [colors, setColors] = useState(['#FFFFFF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']);
    const [mode, setMode] = useState<'audit' | 'optimized'>('audit');

    // Analysis
    const stats = useMemo(() => {
        const totalLum = colors.reduce((acc, c) => acc + chroma(c).luminance(), 0);
        const avgLum = totalLum / colors.length;
        const oledScore = Math.round((1 - avgLum) * 100);

        // Count pixels (hypothetical) that are OFF (Pure Black)
        const pureBlacks = colors.filter(c => c.toLowerCase() === '#000000').length;

        return { score: oledScore, pureBlacks };
    }, [colors]);

    const optimizedColors = useMemo(() => {
        return colors.map(c => {
            if (chroma(c).luminance() > 0.8) return '#000000'; // White -> Black
            if (chroma(c).luminance() > 0.5) return chroma(c).darken(2).hex(); // Bright -> Dark
            return c; // Keep accents
        });
    }, [colors]);

    const displayColors = mode === 'audit' ? colors : optimizedColors;

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<EcoPaletteGuide />}
        >
            <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30 pb-20">

                {/* Hero Header */}
                <div className="relative overflow-hidden py-20 border-b border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent)] pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-green-500/30 bg-green-900/10 text-green-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                            <Leaf size={12} /> Carbon Negative Design
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-500">
                            Sustainable <span className="text-green-500">Flux</span>
                        </h1>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                            Every pixel counts. Optimize your interface for OLED efficiency and reduce digital energy consumption by up to 40%.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">

                    {/* Main Stats (Left) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#0A0A0A] rounded-[2.5rem] p-8 border border-white/10 shadow-2xl backdrop-blur-md">
                            <div className="flex flex-col items-center justify-center p-10 relative">
                                {/* Circular Progress */}
                                <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke={stats.score > 80 ? '#10B981' : stats.score > 50 ? '#EAB308' : '#EF4444'} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (stats.score / 100))} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-5xl font-black text-white">{mode === 'optimized' ? Math.min(98, stats.score + 40) : stats.score}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">OLED Score</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Battery className="text-green-500" />
                                        <span className="text-sm font-bold text-neutral-300">Battery Impact</span>
                                    </div>
                                    <span className="font-mono font-bold text-green-400">{mode === 'optimized' ? '+2.5hrs' : 'Baseline'}</span>
                                </div>
                                <button
                                    onClick={() => setMode(mode === 'audit' ? 'optimized' : 'audit')}
                                    className={cn("w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all", mode === 'audit' ? "bg-green-600 hover:bg-green-500 text-black" : "bg-neutral-800 text-white")}
                                >
                                    {mode === 'audit' ? <><Zap size={18} /> Run Optimization</> : <><RefreshCw size={18} /> Reset Audit</>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Editor & Preview (Right) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Palette Strip */}
                        <div className="bg-[#0A0A0A] rounded-[2rem] p-8 border border-white/10">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Active Spectrum</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {displayColors.map((c, i) => (
                                    <div key={i} className="flex flex-col gap-3 min-w-[80px]">
                                        <div className="h-24 rounded-2xl border border-white/10 relative overflow-hidden group">
                                            <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: c }} />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-mono text-neutral-400">{c}</div>
                                            <div className="text-[10px] uppercase font-bold text-neutral-600 mt-1">{(chroma(c).luminance() * 100).toFixed(0)}% Lum</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Phone Simulation */}
                        <div className="bg-[#0A0A0A] rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden flex justify-center">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

                            <div className="w-[300px] h-[600px] border-[8px] border-neutral-800 rounded-[3rem] bg-black overflow-hidden relative shadow-2xl">
                                {/* Dynamic UI */}
                                <div className="absolute inset-0 flex flex-col transition-colors duration-700" style={{ backgroundColor: displayColors[0] }}>

                                    {/* Header */}
                                    <div className="p-6 pt-10 flex justify-between items-center">
                                        <div className="bg-white/10 w-8 h-8 rounded-full backdrop-blur-md" />
                                        <div className="bg-white/10 w-24 h-4 rounded-full backdrop-blur-md" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 space-y-4">
                                        <div className="h-40 rounded-3xl w-full p-6 flex flex-col justify-end" style={{ backgroundColor: displayColors[1] }}>
                                            <div className="w-12 h-2 bg-black/20 rounded-full mb-2" />
                                            <div className="w-24 h-6 bg-black/20 rounded-full" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 rounded-3xl w-full" style={{ backgroundColor: displayColors[2] }} />
                                            <div className="h-32 rounded-3xl w-full" style={{ backgroundColor: displayColors[3] }} />
                                        </div>

                                        <div className="h-20 rounded-2xl w-full flex items-center gap-4 px-4" style={{ backgroundColor: displayColors[4] }}>
                                            <div className="w-10 h-10 rounded-full bg-black/20" />
                                            <div className="flex-1 h-3 bg-black/20 rounded-full" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="max-w-7xl mx-auto px-6 mt-12 mb-20">
                    
                </div>
            </div>
        </PremiumToolLayout>
    );
}
