'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Eye, EyeOff, Check, AlertTriangle, RefreshCw, PieChart } from 'lucide-react';
import chroma from 'chroma-js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';

// Color Blindness Simulation Matrix (Approximate)
// Using chroma-js or simple matrix logic? 
// Actually chroma-js doesn't have built-in CVD sim in the base lib typically without plugin.
// I'll use a simplified simulation logic for the "Preview".
// Or better, just swap palettes to "Simulated" versions if I had a library.
// For now, I will use a key heuristic: "Avoid Red/Green".
// AND I will use a basic distinctness checker.

const SIMULATIONS = [
    { id: 'normal', name: 'Normal Vision', desc: 'Standard full spectrum' },
    { id: 'protanopia', name: 'Protanopia (Red-Blind)', desc: 'Reds look like mud/yellow' },
    { id: 'deuteranopia', name: 'Deuteranopia (Green-Blind)', desc: 'Greens look beige' },
    { id: 'tritanopia', name: 'Tritanopia (Blue-Blind)', desc: 'Blue/Yellow confusion' },
    { id: 'grayscale', name: 'Achromatopsia', desc: 'Complete color blindness' },
];

// Simplified simulation function (for visual approximation only)
// Source: Color Matrix approximations
const simulateColor = (hex: string, mode: string) => {
    const rgb = chroma(hex).rgb();
    const [r, g, b] = rgb;
    let newR = r, newG = g, newB = b;

    if (mode === 'protanopia') {
        newR = 0.567 * r + 0.433 * g + 0 * b;
        newG = 0.558 * r + 0.442 * g + 0 * b;
        newB = 0 * r + 0.242 * g + 0.758 * b;
    } else if (mode === 'deuteranopia') {
        newR = 0.625 * r + 0.375 * g + 0 * b;
        newG = 0.7 * r + 0.3 * g + 0 * b;
        newB = 0 * r + 0.3 * g + 0.7 * b;
    } else if (mode === 'tritanopia') {
        newR = 0.95 * r + 0.05 * g + 0 * b;
        newG = 0 * r + 0.433 * g + 0.567 * b;
        newB = 0 * r + 0.475 * g + 0.525 * b;
    } else if (mode === 'grayscale') {
        const avg = (r + g + b) / 3;
        newR = avg; newG = avg; newB = avg;
    }

    return chroma.rgb(Math.min(255, newR), Math.min(255, newG), Math.min(255, newB)).hex();
};

const CHART_DATA = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 200 },
];

// Curated "Safe" Palettes
const SAFE_PALETTES = [
    { name: 'IBM Design', colors: ['#648fff', '#785ef0', '#dc267f', '#fe6100', '#ffb000'] },
    { name: 'Wong (Nature)', colors: ['#e69f00', '#56b4e9', '#009e73', '#f0e442', '#0072b2'] },
    { name: 'High Contrast', colors: ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'] }, // Terrible example, for demonstration of "Bad"
];

export default function AccessVizPage() {
    const [colors, setColors] = useState(['#ef4444', '#22c55e', '#3b82f6', '#eab308']); // Default (Red, Green, Blue, Yellow - Common bad mix)
    const [simMode, setSimMode] = useState('normal');

    // Simulate the current palette
    const simulatedColors = colors.map(c => simulateColor(c, simMode));

    // Analysis
    const isSafe = (() => {
        // Check Delta E between all pairs in simulated mode
        let minDistance = 100;
        for (let i = 0; i < simulatedColors.length; i++) {
            for (let j = i + 1; j < simulatedColors.length; j++) {
                const dist = chroma.deltaE(simulatedColors[i], simulatedColors[j]);
                if (dist < minDistance) minDistance = dist;
            }
        }
        return minDistance > 10; // Threshold for distinguishability
    })();

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <EyeOff size={14} /> Accessibility First
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Accessible Data Visualization</h1>
                    <p className="text-gray-500 text-lg">
                        Ensure your charts are readable by everyone.
                        Simulate color blindness and switch to safe, distinct palettes.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Controls */}
                    <div className="space-y-6">
                        {/* Palette Editor */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Current Palette</h3>
                            <div className="space-y-3">
                                {colors.map((c, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            type="color"
                                            value={c}
                                            onChange={(e) => {
                                                const newColors = [...colors];
                                                newColors[i] = e.target.value;
                                                setColors(newColors);
                                            }}
                                            className="h-10 w-10 rounded-lg cursor-pointer border-none bg-transparent"
                                        />
                                        <div className="flex-1 flex flex-col justify-center px-2">
                                            <span className="font-mono text-sm uppercase">{c}</span>
                                            <span className="text-xs text-xs text-gray-400">Sim: {simulatedColors[i]}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <h4 className="font-bold text-gray-900 mb-4 text-sm">Quick Safe Presets</h4>
                            <div className="space-y-2">
                                {SAFE_PALETTES.slice(0, 2).map(p => (
                                    <button
                                        key={p.name}
                                        onClick={() => setColors(p.colors.slice(0, 4))}
                                        className="w-full p-3 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 flex items-center justify-between group transition-all"
                                    >
                                        <span className="font-bold text-sm text-gray-600 group-hover:text-teal-700">{p.name}</span>
                                        <div className="flex gap-1">
                                            {p.colors.slice(0, 4).map(c => (
                                                <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Simulation Toggles */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Vision Simulation</h3>
                            <div className="space-y-2">
                                {SIMULATIONS.map(sim => (
                                    <button
                                        key={sim.id}
                                        onClick={() => setSimMode(sim.id)}
                                        className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all ${simMode === sim.id ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {sim.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Status Banner */}
                        <div className={`p-4 rounded-2xl flex items-center gap-3 border ${isSafe ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {isSafe ? <Check size={24} /> : <AlertTriangle size={24} />}
                            <div>
                                <h4 className="font-bold">{isSafe ? 'Distinguishable Palette' : 'Accessibility Risk Detected'}</h4>
                                <p className="text-sm opacity-80">
                                    {isSafe
                                        ? `Colors remain distinct in ${SIMULATIONS.find(s => s.id === simMode)?.name} mode.`
                                        : `Some colors are too similar in ${SIMULATIONS.find(s => s.id === simMode)?.name} mode. Try adjusting or using a preset.`
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-8 text-center uppercase tracking-widest opacity-50">
                                Simulated Preview ({SIMULATIONS.find(s => s.id === simMode)?.name})
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={CHART_DATA}>
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                            {CHART_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={simulatedColors[index % simulatedColors.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>

                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={CHART_DATA}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {CHART_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={simulatedColors[index % simulatedColors.length]} />
                                            ))}
                                        </Pie>
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl text-blue-900 text-sm">
                            <strong>Tip:</strong> The goal isn't just to make colors different, but to ensure
                            sufficient contrast (Lightness difference) so they can be distinguished even in Grayscale.
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
