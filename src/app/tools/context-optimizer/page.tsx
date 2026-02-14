'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContextGuide } from '@/components/content/AdvancedGuides';
import { Monitor, Smartphone, Watch, Sun, Moon, Cloud, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const PERSONAS = [
    { id: 'analyst', name: 'Focused Analyst', desc: 'High attention, desktop environment' },
    { id: 'commuter', name: 'Rushed Commuter', desc: 'Distracted, mobile, varying light' },
    { id: 'senior', name: 'Senior User', desc: 'Low vision, needs higher contrast' },
];

const ENVIRONMENTS = [
    { id: 'office', name: 'Dim Office', icon: Cloud, lux: '300 lux', filter: 'brightness(1) contrast(1)' },
    { id: 'outdoor', name: 'Direct Sunlight', icon: Sun, lux: '10,000 lux', filter: 'brightness(1.5) contrast(0.7) saturate(0.6)' },
    { id: 'night', name: 'Night Mode', icon: Moon, lux: '10 lux', filter: 'brightness(0.6) contrast(1.1)' },
];

export default function ContextOptimizerPage() {
    const [env, setEnv] = useState(ENVIRONMENTS[0]);
    const [persona, setPersona] = useState(PERSONAS[1]);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Sample Palette
    const [primary, setPrimary] = useState('#2563eb');
    const [bg, setBg] = useState('#ffffff');

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-neutral-900 text-white font-sans pb-20 selection:bg-indigo-500/30">

                {/* Holodeck Header */}
                <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                            <h1 className="text-xl font-bold tracking-tight">Environment <span className="opacity-50 font-normal">Simulator</span></h1>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                            <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/5">
                                <MapPin size={12} /> {env.name} ({env.lux})
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/5">
                                <User size={12} /> {persona.name}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 mt-6">

                    {/* Left: Control Panel */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Environment Picker */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Ambient Light</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {ENVIRONMENTS.map(e => (
                                    <button
                                        key={e.id}
                                        onClick={() => setEnv(e)}
                                        className={cn("flex items-center gap-3 p-4 rounded-xl border transition-all text-left group", env.id === e.id ? "bg-white text-black border-white" : "bg-neutral-800 border-neutral-800 text-neutral-400 hover:bg-neutral-800/80")}
                                    >
                                        <div className={cn("p-2 rounded-lg", env.id === e.id ? "bg-black/10 text-black" : "bg-black/20 text-neutral-500")}>
                                            <e.icon size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{e.name}</div>
                                            <div className="text-[10px] opacity-60 font-mono">{e.lux}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Persona Picker */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">User Persona</h3>
                            <div className="space-y-2">
                                {PERSONAS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPersona(p)}
                                        className={cn("w-full p-4 rounded-xl border text-left text-xs transition-all", persona.id === p.id ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-neutral-800 hover:border-neutral-700 text-neutral-400")}
                                    >
                                        <div className="font-bold mb-1">{p.name}</div>
                                        <div className="opacity-60 leading-relaxed">{p.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">System Theme</h3>
                            <div className="flex bg-neutral-800 p-1 rounded-xl">
                                <button onClick={() => setTheme('light')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all", theme === 'light' ? "bg-white text-black" : "text-neutral-500")}>Light</button>
                                <button onClick={() => setTheme('dark')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all", theme === 'dark' ? "bg-neutral-700 text-white" : "text-neutral-500")}>Dark</button>
                            </div>
                        </div>

                    </div>

                    {/* Right: Simulation Stage */}
                    <div className="lg:col-span-9 bg-black rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl flex items-center justify-center p-10 min-h-[600px]">

                        {/* Environmental Overlay (Glare/Dim) */}
                        <div className="absolute inset-0 pointer-events-none z-50 transition-all duration-1000" style={{ backdropFilter: env.filter }} />

                        {/* Device Frame */}
                        <div className="w-[375px] h-[812px] bg-neutral-900 rounded-[3.5rem] border-[8px] border-neutral-800 relative shadow-2xl overflow-hidden z-10 group">

                            {/* Device Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

                            {/* Simulated UI */}
                            <div className={cn("h-full w-full flex flex-col transition-colors duration-500", theme === 'dark' ? "bg-black text-white" : "bg-white text-slate-900")}>

                                {/* Header */}
                                <div className="p-6 pt-12 flex justify-between items-center">
                                    <div className="font-black text-xl tracking-tight flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primary }} />
                                        TransitApp
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-neutral-200/20" />
                                </div>

                                {/* Map Area */}
                                <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 opacity-20 animate-ping" style={{ borderColor: primary }} />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: primary }} />

                                    {/* Floating Card */}
                                    <div className={cn("absolute bottom-6 left-6 right-6 p-5 rounded-2xl shadow-xl backdrop-blur-xl border flex flex-col gap-3", theme === 'dark' ? "bg-neutral-900/90 border-white/10" : "bg-white/90 border-black/5")}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">Arriving In</div>
                                                <div className="text-3xl font-black font-mono">12<span className="text-sm opacity-50 ml-1">min</span></div>
                                            </div>
                                            <div className="px-3 py-1 bg-green-500/10 text-green-500 font-bold text-xs rounded-full uppercase">On Time</div>
                                        </div>
                                        <div className="w-full h-1.5 bg-neutral-200/50 rounded-full overflow-hidden">
                                            <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: primary }} />
                                        </div>
                                        <button className="w-full py-3 rounded-xl font-bold text-white shadow-lg mt-2" style={{ backgroundColor: primary }}>
                                            Track Ride
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {/* Persona Adjustments (Simulation of vision/distraction) */}
                            {persona.id === 'senior' && <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none z-30 mix-blend-overlay" />}
                            {persona.id === 'commuter' && <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 pointer-events-none z-30" />} // Simple vibration/glare sim

                        </div>

                    </div>
                </main>

                <div className="max-w-7xl mx-auto px-6 mt-12 mb-20 text-neutral-400">
                    <ContextGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
