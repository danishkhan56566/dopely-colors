'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MultiVariableGuide } from '@/components/content/UtilityGuides';
import { Combine, RefreshCw, Info } from 'lucide-react';
import chroma from 'chroma-js';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Generate dummy multi-variate data
const generateData = (count = 50) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // Variable 1 (e.g. Temperature)
        y: Math.random() * 100, // Variable 2 (e.g. Pressure)
        z: Math.random() * 100, // Variable 3 (e.g. Density)
    }));
};

export default function MultiVariablePage() {
    const [data, setData] = useState(generateData(100));

    // Mapping Configuration
    const [hueVar, setHueVar] = useState<'x' | 'y' | 'z'>('x');
    const [satVar, setSatVar] = useState<'x' | 'y' | 'z' | 'none'>('y');
    const [lightVar, setLightVar] = useState<'x' | 'y' | 'z' | 'none'>('none');

    // Color Scale Logic
    const getColor = (point: { x: number, y: number, z: number }) => {
        // Normalize 0-100 to 0-1
        const xNorm = point.x / 100;
        const yNorm = point.y / 100;
        const zNorm = point.z / 100;

        const vars: Record<string, number> = { x: xNorm, y: yNorm, z: zNorm, none: 0.5 };

        // 1. Hue (0-360)
        // Map 0-1 to a portion of the color wheel (e.g. Blue through Red)
        // Let's do full spectrum for X
        const h = vars[hueVar] * 300; // 0 to 300 (Red to Purple)

        // 2. Saturation (0-1)
        const s = satVar === 'none' ? 0.8 : 0.2 + (vars[satVar] * 0.8);

        // 3. Lightness (0-1)
        // Invert so higher value = lighter? Or darker? 
        // Usually darker = more intense. Let's say Lightness 0.9 (light) to 0.3 (dark)
        const l = lightVar === 'none' ? 0.5 : 0.9 - (vars[lightVar] * 0.6);

        return chroma.hsl(h, s, l).hex();
    };

    const colorizedData = useMemo(() => {
        return data.map(point => ({
            ...point,
            fill: getColor(point)
        }));
    }, [data, hueVar, satVar, lightVar]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Combine size={14} /> Data Visualization
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Multi-Variable Encoder</h1>
                    <p className="text-gray-500 text-lg">
                        Encode complex datasets into color. Map different data variables (X, Y, Z)
                        to color dimensions (Hue, Saturation, Lightness) to reveal hidden patterns.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Controls */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Mapping Strategy
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                    Hue (Color)
                                </label>
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                                    {['x', 'y', 'z'].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setHueVar(v as any)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${hueVar === v ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                        >
                                            Var {v.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Best for categorical or primary linear data.</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                    Saturation (Intensity)
                                </label>
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                                    {['x', 'y', 'z', 'none'].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setSatVar(v as any)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${satVar === v ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                        >
                                            {v === 'none' ? 'Off' : v.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Use for confidence or magnitude.</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                    Lightness (Value)
                                </label>
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                                    {['x', 'y', 'z', 'none'].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setLightVar(v as any)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${lightVar === v ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                        >
                                            {v === 'none' ? 'Off' : v.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Use for density or secondary magnitude.</p>
                            </div>

                            <button
                                onClick={() => setData(generateData(100))}
                                className="w-full py-3 border border-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
                            >
                                <RefreshCw size={18} /> Regenerate Data
                            </button>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900">Variables Plot (X vs Y)</h3>
                            <div className="flex gap-4 text-xs font-mono opacity-50">
                                <span>X: {hueVar === 'x' ? 'Hue' : satVar === 'x' ? 'Sat' : lightVar === 'x' ? 'Light' : 'Pos Only'}</span>
                                <span>Y: {hueVar === 'y' ? 'Hue' : satVar === 'y' ? 'Sat' : lightVar === 'y' ? 'Light' : 'Pos Only'}</span>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <XAxis type="number" dataKey="x" name="Var X" unit="" stroke="#e2e8f0" tick={{ fill: '#94a3b8' }} />
                                <YAxis type="number" dataKey="y" name="Var Y" unit="" stroke="#e2e8f0" tick={{ fill: '#94a3b8' }} />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Var Z" />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                                                    <div className="w-full h-2 rounded mb-2" style={{ backgroundColor: data.fill }} />
                                                    <p className="font-bold text-gray-900">Data Point #{data.id}</p>
                                                    <p className="text-xs text-gray-500 font-mono">X: {data.x.toFixed(1)}</p>
                                                    <p className="text-xs text-gray-500 font-mono">Y: {data.y.toFixed(1)}</p>
                                                    <p className="text-xs text-gray-500 font-mono">Z: {data.z.toFixed(1)}</p>
                                                    <p className="text-xs text-gray-500 font-mono mt-2">{data.fill}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Scatter name="Data" data={colorizedData} fill="#8884d8">
                                    {colorizedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} stroke={chroma(entry.fill).darken(1).hex()} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* Explanation */}
                <div className="max-w-4xl mx-auto mt-12 bg-blue-50 p-8 rounded-3xl flex gap-6 items-start text-blue-900">
                    <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm shrink-0">
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Why encode data into color?</h4>
                        <p className="opacity-80 leading-relaxed">
                            Standard charts typically use position (X/Y) to show relationships.
                            By encoding a 3rd or 4th variable into Color (Hue) and Intensity (Saturation),
                            you can visualize higher-dimensional data on a 2D screen.
                            This is crucial for identifying clusters in complex datasets like user cohorts,
                            scientific measurements, or financial portfolios.
                        </p>
                    </div>
                </div>

                <MultiVariableGuide />
            </div>
        </DashboardLayout>
    );
}
