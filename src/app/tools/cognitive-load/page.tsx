'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Brain, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import chroma from 'chroma-js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CognitiveLoadPage() {
    // Default palette: A bit messy to show the effect
    const [colors, setColors] = useState([
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#000000'
    ]);

    // --- LOGIC ---

    const analysis = useMemo(() => {
        let score = 0;
        let warnings = [];

        // 1. Quantity Penalty
        if (colors.length > 5) {
            score += (colors.length - 5) * 10;
            warnings.push("Too many distinct colors can overwhelm working memory.");
        }

        // 2. Vibration Penalty (Simultaneous Contrast)
        // Check for clashing colors (high saturation, opposite hues)
        let vibrationScore = 0;
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const c1 = chroma(colors[i]);
                const c2 = chroma(colors[j]);
                if (c1.get('hsl.s') > 0.8 && c2.get('hsl.s') > 0.8) {
                    // Check hue distance
                    const diff = Math.abs(c1.get('hsl.h') - c2.get('hsl.h'));
                    if (diff > 150 && diff < 210) { // Complementary clash
                        vibrationScore += 15;
                    }
                }
            }
        }
        if (vibrationScore > 0) {
            score += vibrationScore;
            warnings.push("High saturation contrast detected (Visual Vibration).");
        }

        // 3. Luminance Variance
        const luminances = colors.map(c => chroma(c).luminance());
        const lumRange = Math.max(...luminances) - Math.min(...luminances);
        if (lumRange < 0.3) {
            score += 20;
            warnings.push("Low luminance range makes hierarchy difficult.");
        }

        // Normalize 0-100
        score = Math.min(100, Math.max(0, score));
        return { score, warnings };
    }, [colors]);

    const chartData = colors.map((c, i) => ({
        name: `Color ${i + 1}`,
        attention: chroma(c).get('hsl.s') * 100 + (1 - chroma(c).luminance()) * 50, // Heuristic: Bright + Sat = High Attention
        color: c
    }));

    const updateColor = (index: number, val: string) => {
        const newColors = [...colors];
        newColors[index] = val;
        setColors(newColors);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Brain size={14} /> Cognitive Science
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Cognitive Load Analyzer</h1>
                    <p className="text-gray-500 text-lg">
                        Quantify how much "brain power" your color palette consumes.
                        Complex, vibrating, or low-contrast palettes increase cognitive load and reduce user performance.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Input Area */}
                    <div className="lg:col-span-1 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Input Palette</h3>
                        <div className="space-y-3">
                            {colors.map((c, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        type="color"
                                        value={c}
                                        onChange={(e) => updateColor(i, e.target.value)}
                                        className="h-10 w-10 rounded-lg cursor-pointer border-none bg-transparent"
                                    />
                                    <input
                                        type="text"
                                        value={c}
                                        onChange={(e) => updateColor(i, e.target.value)}
                                        className="flex-1 px-3 rounded-lg border border-gray-200 font-mono text-sm uppercase"
                                    />
                                    <button
                                        onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                                        className="text-gray-400 hover:text-red-500 px-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setColors([...colors, '#808080'])}
                                className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100"
                            >
                                + Add Color
                            </button>
                        </div>
                    </div>

                    {/* Analysis Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Score */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Complexity Score</div>
                                <div className={`text-6xl font-black mb-2 ${analysis.score > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                    {analysis.score}<span className="text-2xl text-gray-300">/100</span>
                                </div>
                                <div className="text-sm text-gray-500 font-medium">
                                    {analysis.score > 70 ? 'High Load (Stressful)' : analysis.score > 30 ? 'Moderate Load' : 'Minimal Load (Calm)'}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Info size={16} /> Analysis Report
                                </h4>
                                {analysis.warnings.length === 0 ? (
                                    <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
                                        <CheckCircle size={20} />
                                        <span>No cognitive risks detected. Good hierarchy and balance.</span>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {analysis.warnings.map((w, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 bg-red-50 p-3 rounded-xl">
                                                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[300px]">
                            <h4 className="font-bold text-gray-900 mb-4">Attention Heatmap</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="attention" radius={[8, 8, 8, 8]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#00000020" strokeWidth={1} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
