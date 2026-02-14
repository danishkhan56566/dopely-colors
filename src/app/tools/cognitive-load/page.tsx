'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CognitiveLoadGuide } from '@/components/content/AdvancedGuides';
import { Brain, Cpu, Zap, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CognitiveLoadPage() {
    const [colors, setColors] = useState([
        '#EF4444', '#22C55E', '#3B82F6', '#FFFF00', '#000000', '#FFFFFF'
    ]);

    // Analysis Logic
    const analysis = useMemo(() => {
        let score = 0;
        let warnings = [];

        // 1. Quantity Base
        score += colors.length * 3;
        if (colors.length > 5) warnings.push("Palette exceeds 5 colors (Working Memory Risk)");

        // 2. Saturation Vibration
        colors.forEach((c1, i) => {
            colors.forEach((c2, j) => {
                if (i !== j) {
                    const s1 = chroma(c1).get('hsl.s');
                    const s2 = chroma(c2).get('hsl.s');
                    const l1 = chroma(c1).luminance();
                    const l2 = chroma(c2).luminance();

                    // Vibration: High Sat + Similar Lum
                    if (s1 > 0.7 && s2 > 0.7 && Math.abs(l1 - l2) < 0.2) {
                        score += 5;
                        if (!warnings.includes("Visual Vibration identified (High Saturation Conflict)")) {
                            warnings.push("Visual Vibration identified (High Saturation Conflict)");
                        }
                    }
                }
            });
        });

        const finalScore = Math.min(100, Math.max(0, score));
        return { score: finalScore, warnings };
    }, [colors]);

    const heatmapData = colors.map((c, i) => ({
        name: `Color ${i}`,
        weight: (chroma(c).get('hsl.s') * 50) + ((1 - chroma(c).luminance()) * 50),
        hex: c
    })).sort((a, b) => b.weight - a.weight);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#020617] p-6 md:p-10 font-mono text-slate-300 pb-20">

                {/* Header: Cyber/System Style */}
                <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-indigo-900/30 pb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2 border border-indigo-500/20 rounded">
                            <Brain size={12} /> Neuro-Analytics
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Focus Engine <span className="text-indigo-500">v3.0</span></h1>
                    </div>

                    <div className="flex gap-6">
                        <div className="text-right">
                            <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">System Load</div>
                            <div className={cn("text-2xl font-bold flex items-center justify-end gap-2", analysis.score > 50 ? "text-red-500" : "text-emerald-500")}>
                                <Cpu size={20} /> {analysis.score}%
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Entropy</div>
                            <div className="text-2xl font-bold text-slate-100 flex items-center justify-end gap-2">
                                <Activity size={20} /> {colors.length} <span className="text-sm text-slate-600">nodes</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left: Input Nodes */}
                    <div className="lg:col-span-4 bg-[#0F172A] border border-indigo-900/20 rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap size={14} /> Active Signals
                        </h3>

                        <div className="space-y-3">
                            {colors.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 bg-[#1E293B] p-2 rounded-lg border border-transparent hover:border-indigo-500/50 transition-colors group">
                                    <div className="relative w-10 h-10 rounded border border-white/10 overflow-hidden" style={{ backgroundColor: c }}>
                                        <input
                                            type="color"
                                            value={c}
                                            onChange={(e) => {
                                                const n = [...colors];
                                                n[i] = e.target.value;
                                                setColors(n);
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex-1 font-mono text-xs text-slate-400 group-hover:text-white">
                                        {c}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                        {(chroma(c).get('hsl.s') * 100).toFixed(0)}% SAT
                                    </div>
                                    <button
                                        onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                                        className="text-slate-600 hover:text-red-400 transition-colors px-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => setColors([...colors, '#64748B'])}
                                className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-500 text-xs font-bold hover:bg-slate-800 hover:text-white transition-all uppercase tracking-wider"
                            >
                                + Inject Node
                            </button>
                        </div>
                    </div>

                    {/* Right: Viz Area */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* 1. Attention Heatmap */}
                        <div className="bg-[#0F172A] border border-indigo-900/20 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Activity size={120} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">Attention Heatmap</h3>
                            <p className="text-sm text-slate-500 mb-8 max-w-lg">
                                Visual hierarchy prediction based on chromatic weight. The eye naturally moves from highest weight (left) to lowest (right).
                            </p>

                            <div className="h-40 w-full mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={heatmapData}>
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', color: '#fff' }}
                                        />
                                        <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
                                            {heatmapData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.hex} strokeWidth={index === 0 ? 2 : 0} stroke="#fff" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-600 tracking-widest border-t border-slate-800 pt-4">
                                <span>Primary Focus</span>
                                <span>Background / Noise</span>
                            </div>
                        </div>

                        {/* 2. Diagnostics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Warnings */}
                            <div className="bg-[#1E293B] rounded-2xl p-6 border-l-4 border-l-red-500">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-red-500" /> Friction Points
                                </h4>
                                {analysis.warnings.length > 0 ? (
                                    <ul className="space-y-2">
                                        {analysis.warnings.map(w => (
                                            <li key={w} className="text-xs text-red-200 bg-red-500/10 p-2 rounded block">
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-sm text-slate-500 italic">No critical issues detected.</div>
                                )}
                            </div>

                            {/* Optimization */}
                            <div className="bg-[#1E293B] rounded-2xl p-6 border-l-4 border-l-emerald-500">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-500" /> Optimization
                                </h4>
                                <div className="text-sm text-slate-400 space-y-2">
                                    <p>• Maximize luminance contrast between text and background.</p>
                                    <p>• Use your #1 heatmap color strictly for Call-to-Actions.</p>
                                    <p>• Reduce saturation of background elements to &lt; 10%.</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </main>

                <div className="max-w-7xl mx-auto mt-20 px-6">
                    <CognitiveLoadGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
