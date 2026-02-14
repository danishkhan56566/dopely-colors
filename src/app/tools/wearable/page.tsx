'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WearableGuide } from '@/components/content/AdvancedGuides';
import { Watch, Sun, Moon, Battery, Zap, Timer, Activity, MessageCircle, MoreHorizontal } from 'lucide-react';
import chroma from 'chroma-js';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Ensure utils are imported for 'cn'

const BANDS = [
    { id: 'silicone-orange', name: 'Solar Flare', color: '#f97316', texture: 'dots' },
    { id: 'silicone-black', name: 'Midnight', color: '#171717', texture: 'dots' },
    { id: 'leather-brown', name: 'Saddle Leather', color: '#78350f', texture: 'leather' },
    { id: 'nylon-olive', name: 'Alpine Loop', color: '#3f6212', texture: 'weave' },
];

const ENVIRONMENTS = [
    { id: 'indoor', name: 'Indoor', brightness: 1, glare: 0 },
    { id: 'outdoor', name: 'Sunlight', brightness: 1.2, glare: 0.4 },
    { id: 'night', name: 'Night', brightness: 0.8, glare: 0 },
];

export default function WearablePage() {
    const [accent, setAccent] = useState('#F59E0B');
    const [bg, setBg] = useState('#000000');
    const [isAOD, setIsAOD] = useState(false);
    const [selectedBand, setSelectedBand] = useState(BANDS[0]);
    const [env, setEnv] = useState(ENVIRONMENTS[0]);

    // Metrics
    const contrast = chroma.contrast(accent, bg); // assuming text is accent on bg
    const isOled = chroma(bg).hex() === '#000000';
    const glanceScore = Math.max(0, 100 - (200 / contrast)); // Higher contrast = faster glance

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-slate-900 pb-20">

                {/* Header */}
                <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
                            <Watch size={14} /> Micro-Display Lab
                        </div>
                        <h1 className="text-4xl font-black text-slate-900">Wearable Optimizer</h1>
                    </div>

                    {/* Metrics Pill */}
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <Zap size={20} className={isOled ? "text-green-500 fill-green-500" : "text-gray-300"} />
                            <div>
                                <div className="text-[10px] uppercase font-bold text-gray-400">Battery Eff.</div>
                                <div className="font-bold text-slate-900">{isOled ? 'Max (OLED)' : 'Standard'}</div>
                            </div>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <Timer size={20} className={contrast > 7 ? "text-green-500" : "text-orange-500"} />
                            <div>
                                <div className="text-[10px] uppercase font-bold text-gray-400">Glance Time</div>
                                <div className="font-bold text-slate-900">{contrast > 7 ? '< 500ms' : '~ 1.2s'}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left: Controls */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* 1. Context Manager */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Environment</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {ENVIRONMENTS.map(e => (
                                    <button
                                        key={e.id}
                                        onClick={() => setEnv(e)}
                                        className={cn(
                                            "p-3 rounded-xl flex flex-col items-center gap-2 transition-all border",
                                            env.id === e.id ? "bg-orange-50 border-orange-200 text-orange-900" : "bg-gray-50 border-transparent hover:bg-gray-100 text-gray-500"
                                        )}
                                    >
                                        {e.id === 'indoor' && <Timer size={18} />}
                                        {e.id === 'outdoor' && <Sun size={18} />}
                                        {e.id === 'night' && <Moon size={18} />}
                                        <span className="text-[10px] font-bold uppercase">{e.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Color Tuner */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Display Colors</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span>Primary Accent</span>
                                        <span className="font-mono text-gray-400">{accent}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setAccent(c)}
                                                className={cn("w-8 h-8 rounded-full border-2 transition-transform hover:scale-110", accent === c ? "border-gray-900" : "border-transparent")}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                        <input type="color" value={accent} onChange={e => setAccent(e.target.value)} className="w-8 h-8 rounded-full overflow-hidden cursor-pointer" />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span>Background</span>
                                        <span className="font-mono text-gray-400">{bg}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setBg('#000000')}
                                            className={cn("px-4 py-2 rounded-lg text-xs font-bold border flex items-center gap-2", bg === '#000000' ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-200")}
                                        >
                                            <Zap size={12} className={bg === '#000000' ? "fill-white" : ""} /> True Black
                                        </button>
                                        <button
                                            onClick={() => setBg('#1F2937')}
                                            className={cn("px-4 py-2 rounded-lg text-xs font-bold border", bg === '#1F2937' ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-900 border-gray-200")}
                                        >
                                            Dark Grey
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Band Studio */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Band Studio</h3>
                            <div className="space-y-2">
                                {BANDS.map(b => (
                                    <button
                                        key={b.id}
                                        onClick={() => setSelectedBand(b)}
                                        className={cn(
                                            "w-full p-2 rounded-xl flex items-center gap-3 border transition-all hover:bg-gray-50",
                                            selectedBand.id === b.id ? "border-orange-200 bg-orange-50 ring-1 ring-orange-200" : "border-transparent"
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: b.color }} />
                                        <span className="text-sm font-bold text-slate-700">{b.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right: Simulator */}
                    <div className="lg:col-span-8 flex items-center justify-center bg-gray-200 rounded-[3rem] min-h-[600px] relative overflow-hidden shadow-inner">

                        {/* Environment Layer */}
                        <div
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{
                                backgroundColor: env.id === 'night' ? '#111' : env.id === 'outdoor' ? '#fff' : '#e5e7eb',
                                opacity: 1
                            }}
                        />
                        {/* Glare Layer */}
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-700 bg-gradient-to-tr from-white/40 to-transparent"
                            style={{ opacity: env.glare }}
                        />

                        {/* Watch Container */}
                        <div className="relative group">

                            {/* Band (Top) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[140px] h-[150px] rounded-t-[40px] -mb-10 z-0 shadow-lg"
                                style={{ backgroundColor: selectedBand.color }} />

                            {/* Band (Bottom) */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[140px] h-[150px] rounded-b-[40px] -mt-10 z-0 shadow-lg"
                                style={{ backgroundColor: selectedBand.color }} />

                            {/* Case */}
                            <div className="relative z-10 w-[240px] h-[280px] bg-[#1a1a1a] rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-[6px] border-[#333] flex items-center justify-center ring-4 ring-black/20">

                                {/* Screen */}
                                <div
                                    className="w-[210px] h-[250px] bg-black rounded-[2.2rem] overflow-hidden relative"
                                    onClick={() => setIsAOD(!isAOD)}
                                >
                                    {/* Display Content */}
                                    <div
                                        className="w-full h-full flex flex-col items-center justify-center transition-all duration-500"
                                        style={{
                                            backgroundColor: bg,
                                            filter: isAOD ? 'brightness(0.3) grayscale(1)' : `brightness(${env.brightness})`,
                                            opacity: isAOD ? 0.8 : 1
                                        }}
                                    >
                                        <div className="text-5xl font-black tabular-nums tracking-tighter" style={{ color: isAOD ? '#fff' : '#fff' }}>
                                            10:09
                                        </div>

                                        {!isAOD && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-4 flex flex-col items-center gap-4 w-full px-6"
                                            >
                                                {/* Complication 1: Rings */}
                                                <div className="relative w-16 h-16 flex items-center justify-center">
                                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                        <circle cx="32" cy="32" r="28" stroke="#333" strokeWidth="6" fill="none" />
                                                        <circle cx="32" cy="32" r="28" stroke={accent} strokeWidth="6" fill="none" strokeDasharray="175" strokeDashoffset="40" strokeLinecap="round" />
                                                        <circle cx="32" cy="32" r="18" stroke="#333" strokeWidth="6" fill="none" />
                                                        <circle cx="32" cy="32" r="18" stroke={chroma(accent).brighten().hex()} strokeWidth="6" fill="none" strokeDasharray="113" strokeDashoffset="30" strokeLinecap="round" />
                                                    </svg>
                                                    <Activity size={16} style={{ color: accent }} />
                                                </div>

                                                {/* Complication 2: Status */}
                                                <div className="flex gap-4 w-full justify-center">
                                                    <div className="bg-white/10 rounded-full p-2">
                                                        <MessageCircle size={16} className="text-white" />
                                                    </div>
                                                    <div className="bg-white/10 rounded-full p-2">
                                                        <Battery size={16} className="text-green-500" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        {isAOD && (
                                            <div className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest">Always On</div>
                                        )}
                                    </div>

                                    {/* Glass Reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-[2.2rem]" />
                                </div>
                            </div>

                        </div>

                        {/* AOD Toggle Hint */}
                        <div className="absolute bottom-8 text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full backdrop-blur">
                            Tap Screen to Toggle AOD
                        </div>

                    </div>

                </main>

                <div className="max-w-7xl mx-auto mt-12 mb-20">
                    <WearableGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
