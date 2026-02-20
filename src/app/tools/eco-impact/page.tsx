import { EcoImpactGuide } from '@/components/content/generated_guides/EcoImpactGuide';
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Printer, Leaf, DollarSign, Droplet, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';

export default function EcoImpactPage() {
    const [cmykColors, setCmykColors] = useState(['#EF4444', '#3B82F6', '#10B981']); // RGB input, will treat as approximate

    // CMYK approximation logic
    // Pure Black (K) is cheapest? Or simply calculate "Coverage".
    // Cost Model: 
    // Cyan/Magenta/Yellow = High Cost. Black = Low Cost.
    // White = Free (Paper).

    const analyzePrintCost = (hex: string) => {
        const cmyk = chroma(hex).cmyk(); // returns [c, m, y, k]
        const coverage = cmyk[0] + cmyk[1] + cmyk[2] + cmyk[3]; // Total ink 0-4

        // Hypothetical Cost per cartridge unit
        const cost = (cmyk[0] * 0.04) + (cmyk[1] * 0.04) + (cmyk[2] * 0.04) + (cmyk[3] * 0.02);

        return { cmyk, coverage, cost };
    };

    const totalStats = cmykColors.reduce((acc, c) => {
        const stats = analyzePrintCost(c);
        return {
            cost: acc.cost + stats.cost,
            ink: acc.ink + stats.coverage
        };
    }, { cost: 0, ink: 0 });

    return (
        <PremiumToolLayout
            guide={<EcoImpactGuide />}
            hideHeader={true}
            title="Eco-Friendly Color Calculator"
            description="Measure the estimated OLED screen energy consumption based on the lumens and pixel brightness of your color palette."
            icon={Wand2}
            badgeText="Tool"
        >
            <div className="min-h-screen bg-stone-50 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Leaf size={14} /> Eco & Print
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Print-to-Digital Analyzer</h1>
                    <p className="text-lg text-gray-500">
                        Estimate ink usage, print costs, and environmental impact of your color choices.
                    </p>
                </header>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Printer size={20} /> Palette Input
                        </h3>
                        <div className="space-y-6">
                            {cmykColors.map((c, i) => {
                                const stats = analyzePrintCost(c);
                                return (
                                    <div key={i} className="flex gap-4 items-center">
                                        <input
                                            type="color"
                                            value={c}
                                            onChange={(e) => {
                                                const n = [...cmykColors];
                                                n[i] = e.target.value;
                                                setCmykColors(n);
                                            }}
                                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between font-mono text-sm font-bold mb-1">
                                                <span>{c}</span>
                                                <span className="text-stone-400">
                                                    {(stats.coverage * 100).toFixed(0)}% Ink
                                                </span>
                                            </div>
                                            {/* CMYK Bar */}
                                            <div className="h-2 flex rounded-full overflow-hidden bg-gray-100">
                                                <div className="bg-cyan-400" style={{ width: `${stats.cmyk[0] * 25}%` }} />
                                                <div className="bg-fuchsia-400" style={{ width: `${stats.cmyk[1] * 25}%` }} />
                                                <div className="bg-yellow-400" style={{ width: `${stats.cmyk[2] * 25}%` }} />
                                                <div className="bg-black" style={{ width: `${stats.cmyk[3] * 25}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center">
                            <div className="inline-block p-4 rounded-full bg-green-50 text-green-600 mb-4">
                                <DollarSign size={32} />
                            </div>
                            <div className="text-4xl font-black text-gray-900 mb-1">
                                ${(totalStats.cost * 100).toFixed(2)}
                            </div>
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                Est. Cost per 1k Prints
                            </div>
                            <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-xs mx-auto">
                                Based on average toner coverage pricing. Reducing saturation or using "Eco-Fonts" can save up to 30%.
                            </p>
                        </div>

                        <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl flex items-center gap-6">
                            <Droplet size={40} className="text-blue-400" />
                            <div>
                                <h3 className="font-bold text-lg">Ink Density</h3>
                                <div className="text-3xl font-black mb-1">
                                    {(totalStats.ink * 10).toFixed(0)}ml
                                </div>
                                <div className="text-xs opacity-50">
                                    Volume required for coverage area.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PremiumToolLayout>
    );
}
