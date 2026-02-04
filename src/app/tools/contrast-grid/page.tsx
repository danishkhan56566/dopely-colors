'use client';

import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Grid, Plus, X, Copy, Download } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function ContrastGridPage() {
    const [colors, setColors] = useState([
        { id: '1', hex: '#ffffff', name: 'White' },
        { id: '2', hex: '#0f172a', name: 'Slate 900' },
        { id: '3', hex: '#3b82f6', name: 'Blue 500' },
        { id: '4', hex: '#ef4444', name: 'Red 500' },
        { id: '5', hex: '#22c55e', name: 'Green 500' },
    ]);

    const addColor = () => {
        setColors([...colors, {
            id: Math.random().toString(36),
            hex: chroma.random().hex(),
            name: 'New Color'
        }]);
    };

    const removeColor = (id: string) => {
        if (colors.length <= 2) {
            toast.error('Minimum 2 colors required');
            return;
        }
        setColors(colors.filter(c => c.id !== id));
    };

    const updateColor = (id: string, updates: Partial<{ hex: string; name: string }>) => {
        setColors(colors.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const getContrast = (fg: string, bg: string) => {
        try {
            return chroma.contrast(fg, bg);
        } catch {
            return 0;
        }
    };

    const getScore = (ratio: number) => {
        if (ratio >= 7) return { label: 'AAA', color: 'bg-green-100 text-green-700' };
        if (ratio >= 4.5) return { label: 'AA', color: 'bg-blue-100 text-blue-700' };
        if (ratio >= 3) return { label: 'AA Large', color: 'bg-yellow-100 text-yellow-700' };
        return { label: 'Fail', color: 'bg-red-100 text-red-700' };
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-gray-900 rounded-2xl text-white">
                            <Grid size={32} />
                        </div>
                        Contrast Grid
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Visualize accessibility compliance across your entire palette in one view.
                    </p>
                </div>

                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Controls */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Palette Colors</h3>
                                <button onClick={addColor} className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-lg hover:bg-black transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {colors.map(c => (
                                    <div key={c.id} className="flex gap-2 items-center group">
                                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                            <input type="color" value={c.hex} onChange={(e) => updateColor(c.id, { hex: e.target.value })} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                        </div>
                                        <input
                                            type="text"
                                            value={c.name}
                                            onChange={(e) => updateColor(c.id, { name: e.target.value })}
                                            className="flex-1 min-w-0 px-2 py-1 text-sm border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent"
                                        />
                                        <button onClick={() => removeColor(c.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid Visualization */}
                    <div className="lg:col-span-9">
                        <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 text-left font-bold text-gray-400 text-xs uppercase tracking-wider sticky left-0 bg-white z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Background <span className="text-gray-300">↓</span></th>
                                        {colors.map(c => (
                                            <th key={c.id} className="p-4 min-w-[100px]">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: c.hex }} />
                                                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{c.name}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {colors.map(rowColor => (
                                        <tr key={rowColor.id}>
                                            <td className="p-4 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: rowColor.hex }} />
                                                    <span className="text-xs font-bold text-gray-900">{rowColor.name}</span>
                                                </div>
                                            </td>
                                            {colors.map(colColor => {
                                                const ratio = getContrast(colColor.hex, rowColor.hex);
                                                const score = getScore(ratio);
                                                return (
                                                    <td key={colColor.id} className="p-2 border border-gray-50 align-top">
                                                        <div
                                                            className="w-full aspect-[4/3] rounded-xl flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105"
                                                            style={{ backgroundColor: rowColor.hex }}
                                                        >
                                                            <span className="text-lg font-black" style={{ color: colColor.hex }}>Aa</span>
                                                            <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full", score.color)}>
                                                                {score.label} {ratio.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
