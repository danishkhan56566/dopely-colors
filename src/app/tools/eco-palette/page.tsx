'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Leaf, Battery, Zap, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import chroma from 'chroma-js';

// --- LOGIC ---

// Calculate relative luminance (perceptual brightness)
// 0 = Black (OLED Off), 1 = White (Full Power)
const getLuminance = (hex: string) => {
    try {
        return chroma(hex).luminance();
    } catch (e) {
        return 0;
    }
};

// Calculate Energy Score (0-100) where 100 is best (Most energy saved)
const calculateEnergyScore = (colors: string[]) => {
    const totalLum = colors.reduce((acc, hex) => acc + getLuminance(hex), 0);
    const avgLum = totalLum / colors.length;
    // Lower luminance = Higher score. 
    // Invert: 1 - lum. Then map to 0-100.
    return Math.round((1 - avgLum) * 100);
};

// --- COMPONENTS ---

function Speedometer({ score }: { score: number }) {
    // 180 degree arc
    // red (0) -> yellow (50) -> green (100)

    return (
        <div className="relative w-64 h-32 flex justify-center overflow-hidden">
            {/* Background Arc */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[20px] border-gray-100 border-b-0 border-l-0 border-r-0" />

            {/* Colored Arc (SVG for gradient path) */}
            <svg viewBox="0 0 100 50" className="w-full h-full absolute top-0 left-0">
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                <motion.path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke={score > 80 ? '#22c55e' : score > 50 ? '#eab308' : '#ef4444'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="126" // Approx length of arc
                    strokeDashoffset={126 - (126 * (score / 100))}
                    initial={{ strokeDashoffset: 126 }}
                    animate={{ strokeDashoffset: 126 - (126 * (score / 100)) }}
                    transition={{ duration: 1, type: 'spring' }}
                />
            </svg>

            {/* Needle / Score Text */}
            <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-4xl font-black text-gray-900">{score}</span>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Eco Score</span>
            </div>
        </div>
    );
}

function PixelGrid({ colors }: { colors: string[] }) {
    // Visualize how pixels turn off. We'll simulate a 10x10 grid for each color.
    return (
        <div className="flex gap-4 opacity-50">
            {colors.map((c, i) => {
                const lum = getLuminance(c);
                const isActive = lum > 0.05; // OLED pixels turn off completely at true black #000
                // Simulate "brightness" by opacity of the pixel
                return (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div
                            className="w-12 h-12 grid grid-cols-4 gap-0.5 p-1 bg-black rounded"
                            title={`Luminance: ${(lum * 100).toFixed(0)}%`}
                        >
                            {Array.from({ length: 16 }).map((_, j) => (
                                <div
                                    key={j}
                                    className="rounded-[1px]"
                                    style={{
                                        backgroundColor: c,
                                        opacity: Math.random() > 0.5 ? 1 : 0.9 // Subtle flicker simulation 
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}


export default function EcoPalettePage() {
    const [palette, setPalette] = useState([
        '#1a1a1a', // Dark Grey
        '#2d3748', // Navy
        '#48bb78', // Eco Green
        '#000000', // True Black
        '#ffffff'  // White (Checking impact)
    ]);

    const score = useMemo(() => calculateEnergyScore(palette), [palette]);

    // Impact Calc
    const batterySaved = Math.round((score / 100) * 35); // Imagine saving 35% battery vs pure white
    const co2Saved = (score * 0.42).toFixed(1); // Mock CO2 stat

    const updateColor = (index: number, newColor: string) => {
        const newPalette = [...palette];
        newPalette[index] = newColor;
        setPalette(newPalette);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white p-6 md:p-10 max-w-7xl mx-auto">
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Leaf size={14} /> Sustainability Focus
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        OLED Energy Analyzer
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Measure the energy impact of your color palette. Darker colors on OLED screens turn off pixels, saving massive amounts of battery and reducing carbon footprint.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Score Card */}
                    <div className="md:col-span-1 bg-gray-50 rounded-3xl p-8 flex flex-col items-center justify-center border border-gray-100">
                        <Speedometer score={score} />

                        <div className="mt-8 space-y-4 w-full">
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Battery size={20} /></div>
                                    <span className="font-bold text-gray-700">Battery Extension</span>
                                </div>
                                <span className="font-black text-green-600">+{batterySaved}%</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Zap size={20} /></div>
                                    <span className="font-bold text-gray-700">Est. Power Draw</span>
                                </div>
                                <span className="font-bold text-gray-900">{100 - score}W</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 text-green-800 text-sm rounded-xl flex gap-3 leading-relaxed">
                            <Info className="shrink-0 mt-0.5" size={16} />
                            If 10,000 users used this theme daily, you would save approx <strong>{co2Saved}kg</strong> of CO2 per year.
                        </div>
                    </div>

                    {/* Palette Editor */}
                    <div className="md:col-span-2 space-y-8">

                        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl shadow-gray-100/50">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Active Palette</h3>
                                <button onClick={() => setPalette(['#000000', '#111111', '#222222', '#333333', '#444444'])} className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
                                    <RefreshCw size={14} /> Optimize All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {palette.map((color, i) => {
                                    const lum = getLuminance(color);
                                    const isBad = lum > 0.7; // Warning for very bright colors
                                    return (
                                        <div key={i} className="flex items-center gap-4 group">
                                            {/* Input */}
                                            <div className="flex-1 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100 group-focus-within:border-green-400 transition-colors">
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => updateColor(i, e.target.value)}
                                                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={color}
                                                    onChange={(e) => updateColor(i, e.target.value)}
                                                    className="font-mono font-bold text-gray-700 bg-transparent outline-none w-24 uppercase"
                                                />
                                            </div>

                                            {/* Metris */}
                                            <div className="flex-1">
                                                <div className="flex justify-between text-xs mb-1 font-semibold text-gray-500">
                                                    <span>Luminance</span>
                                                    <span>{(lum * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${lum > 0.5 ? 'bg-red-400' : 'bg-green-400'}`} style={{ width: `${lum * 100}%` }}></div>
                                                </div>
                                            </div>

                                            {/* Warnings */}
                                            <div className="w-8 flex justify-center">
                                                {isBad && (
                                                    <div className="text-red-400" title="High power consumption">
                                                        <AlertTriangle size={18} />
                                                    </div>
                                                )}
                                                {color.toLowerCase() === '#000000' && (
                                                    <div className="text-green-500" title="Zero Energy (Pixel Off)">
                                                        <Leaf size={18} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Visualizer */}
                        <div className="p-8 bg-black rounded-3xl text-white">
                            <h3 className="text-lg font-bold mb-4 opacity-80">OLED Pixel Simulator</h3>
                            <div className="flex items-center justify-between">
                                <PixelGrid colors={palette} />
                                <div className="text-right text-sm text-gray-500">
                                    <p>Brighter pixels = <span className="text-white">More Power</span></p>
                                    <p>Black pixels = <span className="text-gray-700">Off</span></p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
