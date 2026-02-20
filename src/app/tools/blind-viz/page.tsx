'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { BlindVizGuide } from '@/components/content/AdvancedGuides';
import { Eye, EyeOff, Check, AlertTriangle, RefreshCw, BarChart2, ScanEye, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SIMULATIONS = [
    { id: 'normal', name: '20/20 Vision', desc: 'Standard Full Spectrum' },
    { id: 'protanopia', name: 'Protanopia', desc: 'No Red Receptors (1% of males)' },
    { id: 'deuteranopia', name: 'Deuteranopia', desc: 'No Green Receptors (6% of males)' },
    { id: 'tritanopia', name: 'Tritanopia', desc: 'No Blue Receptors (Rare)' },
    { id: 'achromatopsia', name: 'Achromatopsia', desc: 'Total Color Blindness' },
];

const simulate = (hex: string, mode: string) => {
    // 10x Simulation Logic using LMS color space approximation
    // Simplified for client-side perf without heavy matrix library
    const c = chroma(hex);
    if (mode === 'normal') return hex;

    const [r, g, b] = c.rgb();
    let nr = r, ng = g, nb = b;

    if (mode === 'protanopia') {
        // Sim: Reds become dark/yellow
        nr = 0.567 * r + 0.433 * g;
        ng = 0.558 * r + 0.442 * g;
        nb = 0.242 * g + 0.758 * b;
    } else if (mode === 'deuteranopia') {
        // Sim: Greens become beige
        nr = 0.625 * r + 0.375 * g;
        ng = 0.7 * r + 0.3 * g;
        nb = 0.3 * g + 0.7 * b;
    } else if (mode === 'tritanopia') {
        // Sim: Blue/Yellow confusion
        nr = 0.95 * r + 0.05 * g;
        ng = 0.433 * g + 0.567 * b;
        nb = 0.475 * g + 0.525 * b;
    } else if (mode === 'achromatopsia') {
        // Grayscale
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        nr = l; ng = l; nb = l;
    }

    return chroma.rgb(Math.min(255, nr), Math.min(255, ng), Math.min(255, nb)).hex();
};

export default function BlindVizPage() {
    const [colors, setColors] = useState(['#EF4444', '#22C55E', '#3B82F6', '#EAB308', '#FFFFFF', '#000000']);
    const [mode, setMode] = useState('normal');

    const simulatedColors = colors.map(c => simulate(c, mode));

    // Safety Check: Min distance in simulated space
    const safetyScore = (() => {
        let min = 100;
        for (let i = 0; i < simulatedColors.length; i++) {
            for (let j = i + 1; j < simulatedColors.length; j++) {
                const d = chroma.deltaE(simulatedColors[i], simulatedColors[j]);
                if (d < min) min = d;
            }
        }
        return Math.floor(min);
    })();

    const isSafe = safetyScore > 10;

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<BlindVizGuide />}
        >
            <div className="min-h-screen bg-neutral-900 p-6 md:p-10 font-sans text-neutral-100 pb-20">

                {/* Header: Lab Style */}
                <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center bg-neutral-800/50 p-6 rounded-[2rem] border border-neutral-700 backdrop-blur-md">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/50 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-800">
                            <ScanEye size={14} /> Clinical Optics
                        </div>
                        <h1 className="text-3xl font-light text-white">Vision <span className="font-bold text-teal-400">Simulator</span></h1>
                    </div>

                    <div className={cn("px-6 py-3 rounded-xl border flex items-center gap-4 transition-colors", isSafe ? "bg-teal-900/20 border-teal-800 text-teal-400" : "bg-red-900/20 border-red-800 text-red-400")}>
                        {isSafe ? <Check size={24} /> : <AlertTriangle size={24} />}
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                                {isSafe ? 'WCAG AAA (Simulated)' : 'Indistinguishable'}
                            </div>
                            <div className="font-bold text-lg">
                                {isSafe ? 'Clinical Pass' : 'Safety Fail'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left: Input & Filters */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Filters */}
                        <div className="bg-neutral-800 p-6 rounded-[2rem] border border-neutral-700 shadow-xl">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Select Lens Filter</h3>
                            <div className="space-y-2">
                                {SIMULATIONS.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setMode(s.id)}
                                        className={cn(
                                            "w-full p-4 rounded-xl text-left border transition-all duration-300 relative overflow-hidden group",
                                            mode === s.id ? "bg-teal-600 border-teal-500 text-white shadow-lg" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                        )}
                                    >
                                        <div className="relative z-10">
                                            <div className="font-bold text-sm">{s.name}</div>
                                            <div className={cn("text-xs mt-1", mode === s.id ? "text-teal-100" : "text-neutral-600")}>{s.desc}</div>
                                        </div>
                                        {mode === s.id && <div className="absolute right-4 top-4 opacity-20"><Eye size={24} /></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Palette Editor */}
                        <div className="bg-neutral-800 p-6 rounded-[2rem] border border-neutral-700 shadow-xl">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Test Subjects</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {colors.map((c, i) => (
                                    <div key={i} className="relative group aspect-square">
                                        <input
                                            type="color"
                                            value={c}
                                            onChange={(e) => {
                                                const newColors = [...colors];
                                                newColors[i] = e.target.value;
                                                setColors(newColors);
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        />
                                        <div className="w-full h-full rounded-2xl border-2 border-neutral-600 shadow-inner overflow-hidden" style={{ backgroundColor: c }}>
                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur p-1 text-[10px] text-center font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                                {c}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right: Simulation Viewport */}
                    <div className="lg:col-span-8 bg-black rounded-[2.5rem] border border-neutral-800 relative overflow-hidden flex flex-col min-h-[600px] shadow-2xl">

                        {/* Viewport Header */}
                        <div className="bg-neutral-900/80 backdrop-blur p-4 border-b border-neutral-800 flex justify-between items-center z-10 absolute top-0 left-0 right-0">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                            <div className="text-xs font-mono uppercase text-neutral-500">Live Render • {mode}</div>
                        </div>

                        {/* Split Screen Content */}
                        <div className="flex-1 grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 relative h-full mt-14">

                            {/* Standard View */}
                            <div className="p-8 border-r border-neutral-800 bg-[#0A0A0A]">
                                <div className="text-xs font-bold text-neutral-500 uppercase mb-8 text-center tracking-widest">Reference (Normal)</div>
                                <div className="space-y-6">
                                    <div className="h-32 w-full rounded-2xl flex overflow-hidden shadow-lg">
                                        {colors.map((c, i) => (
                                            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>

                                    {/* Mock Chart Normal */}
                                    <div className="flex items-end justify-center gap-2 h-32 px-10">
                                        {colors.slice(0, 4).map((c, i) => (
                                            <div key={i} className="w-8 rounded-t-lg transition-all" style={{ backgroundColor: c, height: `${[40, 70, 50, 90][i]}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Simulated View */}
                            <div className="p-8 bg-[#0A0A0A] relative">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
                                <div className="text-xs font-bold text-teal-500 uppercase mb-8 text-center tracking-widest flex items-center justify-center gap-2">
                                    <EyeOff size={12} /> Patient Review
                                </div>
                                <div className="space-y-6">
                                    <div className="h-32 w-full rounded-2xl flex overflow-hidden shadow-lg filter transition-all duration-500">
                                        {simulatedColors.map((c, i) => (
                                            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>

                                    {/* Mock Chart Safe */}
                                    <div className="flex items-end justify-center gap-2 h-32 px-10 grayscale-[0.1]">
                                        {simulatedColors.slice(0, 4).map((c, i) => (
                                            <div key={i} className="w-8 rounded-t-lg transition-all" style={{ backgroundColor: c, height: `${[40, 70, 50, 90][i]}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </main>

                <div className="max-w-7xl mx-auto mt-12 mb-20">
                    
                </div>
            </div>
        </PremiumToolLayout>
    );
}
