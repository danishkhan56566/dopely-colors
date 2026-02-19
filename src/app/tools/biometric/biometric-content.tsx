'use client';

import { useState, useEffect } from 'react';
import { BiometricGuide } from '@/components/content/AdvancedGuides';
import { Fingerprint, Heart, Activity, Brain, Wind, Thermometer, AlertTriangle, Battery, ShieldCheck } from 'lucide-react';
import chroma from 'chroma-js';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

export default function BiometricContent() {
    // Component logic remains the same
    const [stress, setStress] = useState(45);
    const [bpm, setBpm] = useState(72);
    const [history, setHistory] = useState<{ time: number, val: number }[]>([]);

    // Theme Engine
    const getTheme = (s: number) => {
        if (s > 80) return { bg: '#FEF2F2', primary: '#EF4444', status: 'CRITICAL', text: 'text-red-900' };
        if (s > 50) return { bg: '#FFFBEB', primary: '#F59E0B', status: 'ELEVATED', text: 'text-amber-900' };
        return { bg: '#ECFDF5', primary: '#10B981', status: 'OPTIMAL', text: 'text-emerald-900' };
    };

    const theme = getTheme(stress);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setHistory(prev => {
                const noise = (Math.random() - 0.5) * 10;
                const nextVal = Math.max(40, Math.min(180, bpm + noise));
                const newHistory = [...prev, { time: Date.now(), val: nextVal }].slice(-50);
                return newHistory;
            });

            // Drift BPM towards stress target
            const targetBpm = 60 + (stress * 1.2);
            setBpm(curr => Math.round(curr + (targetBpm - curr) * 0.1));

        }, 500);
        return () => clearInterval(interval);
    }, [stress, bpm]);

    return (
        <div className={`min-h-screen transition-colors duration-700 p-6 md:p-10 font-sans`} style={{ backgroundColor: theme.bg }}>

            {/* Header */}
            <header className="max-w-7xl mx-auto mb-12 flex justify-between items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur border border-white/20 shadow-sm text-gray-500">
                        <Fingerprint size={14} /> Medical Grade Simulation
                    </div>
                    <h1 className={cn("text-4xl font-black transition-colors duration-500", theme.text)}>Bio-Adaptive Engine</h1>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="bg-white/50 backdrop-blur p-4 rounded-2xl flex items-center gap-3 border border-white/50">
                        <Battery size={20} className="text-gray-400" />
                        <div className="text-xs font-bold text-gray-500">SENSOR ONLINE<br /><span className="text-green-600">98% BATTERY</span></div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Vitals Monitor */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Main Monitor */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/50 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                    <Heart size={24} className="animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Heart Rate</div>
                                    <div className="text-4xl font-black text-gray-900 tabular-nums">{bpm}</div>
                                </div>
                            </div>
                            <div className={cn("px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                                stress > 80 ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-400")}>
                                {theme.status}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-32 -mx-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <YAxis domain={['auto', 'auto']} hide />
                                    <Area
                                        type="monotone"
                                        dataKey="val"
                                        stroke={theme.primary}
                                        strokeWidth={3}
                                        fill={theme.primary}
                                        fillOpacity={0.1}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white/60 backdrop-blur p-8 rounded-[2.5rem] shadow-lg border border-white/50">
                        <div className="flex items-center gap-3 mb-6">
                            <Wind size={20} className="text-gray-400" />
                            <h3 className="font-bold text-gray-600">Simulate Stress Load</h3>
                        </div>
                        <input
                            type="range"
                            min="0" max="100"
                            value={stress}
                            onChange={(e) => setStress(Number(e.target.value))}
                            className="w-full h-8 bg-gray-200 rounded-full appearance-none cursor-pointer overflow-hidden mb-4"
                            style={{ background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)` }}
                        />
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Resting</span>
                            <span>Attack</span>
                        </div>
                    </div>

                </div>

                {/* Right: Adaptive Review */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px] border-[8px] border-white/40 ring-1 ring-black/5 relative">

                        {/* Overlay for Critical State */}
                        <AnimatePresence>
                            {stress > 80 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-red-500/10 z-20 pointer-events-none mix-blend-multiply"
                                />
                            )}
                        </AnimatePresence>

                        <div className="bg-gray-50 p-8 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xl">🧘</div>
                                <div>
                                    <h2 className="font-bold text-lg text-gray-900">Mindful OS</h2>
                                    <p className="text-xs text-gray-500">v2.0 • Adaptive Mode ON</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                        </div>

                        <div className="p-12 transition-all duration-700" style={{ backgroundColor: stress > 80 ? '#FEF2F2' : '#F9FAFB' }}>

                            <div className="max-w-md mx-auto space-y-6">

                                {/* Primary Card */}
                                <motion.div
                                    layout
                                    className={cn("p-8 rounded-[2rem] shadow-xl text-white transition-colors duration-500 relative overflow-hidden group")}
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    <div className="relative z-10">
                                        <div className="opacity-80 mb-1 text-sm font-medium uppercase tracking-wider">Current Focus</div>
                                        <div className="text-3xl font-black mb-6">
                                            {stress > 80 ? "Breathe Deeply" : "Deep Work"}
                                        </div>

                                        {stress > 80 ? (
                                            <button className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl font-bold w-full hover:bg-white/30 transition-colors">
                                                Start Guided Breathing
                                            </button>
                                        ) : (
                                            <div className="flex gap-2 items-center text-sm font-bold opacity-90">
                                                <ShieldCheck size={18} /> 45m Remaining
                                            </div>
                                        )}
                                    </div>

                                    {/* Background Decor */}
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                </motion.div>

                                {/* Secondary Modules */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                        <div className="text-gray-400 mb-2"><Thermometer size={20} /></div>
                                        <div className="text-2xl font-bold text-gray-900">98.6°</div>
                                        <div className="text-xs text-gray-400 font-bold">STABLE</div>
                                    </div>
                                    <div className={cn("p-6 rounded-[2rem] shadow-sm border border-gray-100 transition-colors", stress > 60 ? "bg-gray-100 opacity-50" : "bg-white")}>
                                        <div className="text-gray-400 mb-2"><Activity size={20} /></div>
                                        <div className="text-2xl font-bold text-gray-900">1,240</div>
                                        <div className="text-xs text-gray-400 font-bold">STEPS</div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto mt-12 mb-20">
                <BiometricGuide />
            </div>
        </div>
    );
}
