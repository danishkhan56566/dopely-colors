'use client';

import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Code2, Copy, Plus, Trash2, Download } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

type TokenSet = {
    id: string;
    name: string;
    baseColor: string;
};

export default function DesignTokenGenerator() {
    const [sets, setSets] = useState<TokenSet[]>([
        { id: '1', name: 'primary', baseColor: '#3b82f6' },
        { id: '2', name: 'secondary', baseColor: '#10b981' },
        { id: '3', name: 'neutral', baseColor: '#64748b' },
    ]);
    const [activeTab, setActiveTab] = useState<'css' | 'tailwind' | 'scss' | 'json' | 'w3c'>('css');

    const generateScale = (color: string) => {
        try {
            // Generate 50-950 scale (11 steps roughly)
            // Strategy: White -> Color -> Black
            const scale = chroma.scale(['white', color, 'black']).mode('lch').colors(21);
            // Selected indices to match Tailwind roughly: 50, 100, 200... 900, 950
            // 0=white, 10=color, 20=black
            // We map manually for better distribution
            return {
                50: scale[1],
                100: scale[3],
                200: scale[5],
                300: scale[7],
                400: scale[9],
                500: scale[10], // Base
                600: scale[12],
                700: scale[14],
                800: scale[16],
                900: scale[18],
                950: scale[19],
            };
        } catch (e) {
            return {};
        }
    };

    const generatedTokens = useMemo(() => {
        const result: Record<string, any> = {};
        sets.forEach(set => {
            result[set.name] = generateScale(set.baseColor);
        });
        return result;
    }, [sets]);

    const codeOutput = useMemo(() => {
        if (activeTab === 'json') return JSON.stringify(generatedTokens, null, 2);

        if (activeTab === 'w3c') {
            const w3cTokens: any = { color: { global: {} } };
            Object.entries(generatedTokens).forEach(([name, scale]: [string, any]) => {
                w3cTokens.color.global[name] = {};
                Object.entries(scale).forEach(([step, hex]: [string, any]) => {
                    w3cTokens.color.global[name][step] = {
                        $value: hex,
                        $type: 'color'
                    };
                });
            });
            return JSON.stringify(w3cTokens, null, 2);
        }

        if (activeTab === 'tailwind') {
            return `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(generatedTokens, null, 8).replace(/"/g, "'").replace(/}$/, "      }")}\n    }\n  }\n}`;
        }

        if (activeTab === 'css') {
            let css = ':root {\n';
            Object.entries(generatedTokens).forEach(([name, scale]: [string, any]) => {
                Object.entries(scale).forEach(([step, hex]: [string, any]) => {
                    css += `  --${name}-${step}: ${hex};\n`;
                });
                css += '\n';
            });
            css += '}';
            return css;
        }

        if (activeTab === 'scss') {
            let scss = '';
            Object.entries(generatedTokens).forEach(([name, scale]: [string, any]) => {
                Object.entries(scale).forEach(([step, hex]: [string, any]) => {
                    scss += `$${name}-${step}: ${hex};\n`;
                });
                scss += '\n';
            });
            return scss;
        }

        return '';
    }, [generatedTokens, activeTab]);

    const copyCode = () => {
        navigator.clipboard.writeText(codeOutput);
        toast.success(`Copied ${activeTab.toUpperCase()} tokens`);
    };

    const updateSet = (id: string, updates: Partial<TokenSet>) => {
        setSets(sets.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addSet = () => {
        const id = Math.random().toString(36).substr(2, 9);
        setSets([...sets, { id, name: 'brand', baseColor: chroma.random().hex() }]);
    };

    const removeSet = (id: string) => {
        setSets(sets.filter(s => s.id !== id));
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                            <Code2 size={32} />
                        </div>
                        Design Token Generator
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Turn brand colors into complete design systems. Export for Tailwind, CSS, SCSS, or JSON.
                    </p>
                </div>

                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Configuration */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Color Sets</h3>
                                <button onClick={addSet} className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1">
                                    <Plus size={14} /> Add Scale
                                </button>
                            </div>

                            <div className="space-y-4">
                                {sets.map(set => (
                                    <div key={set.id} className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all bg-gray-50/50 group">
                                        <div className="flex gap-4 items-start">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-200 shrink-0">
                                                <input type="color" value={set.baseColor} onChange={(e) => updateSet(set.id, { baseColor: e.target.value })} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="text"
                                                    value={set.name}
                                                    onChange={(e) => updateSet(set.id, { name: e.target.value })}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold placeholder-gray-300 focus:outline-none focus:border-indigo-300"
                                                    placeholder="e.g. primary"
                                                />
                                                <input
                                                    type="text"
                                                    value={set.baseColor}
                                                    onChange={(e) => updateSet(set.id, { baseColor: e.target.value })}
                                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-xs uppercase text-gray-500"
                                                />
                                            </div>
                                            <button onClick={() => removeSet(set.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Code Output */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Visual Preview of Scales */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
                            <div className="min-w-[500px] space-y-4">
                                {Object.entries(generatedTokens).map(([name, scale]: [string, any]) => (
                                    <div key={name} className="flex gap-1">
                                        <div className="w-24 text-xs font-bold text-gray-500 py-2">{name}</div>
                                        <div className="flex-1 flex rounded-lg overflow-hidden">
                                            {Object.entries(scale).map(([step, hex]: [string, any]) => (
                                                <div
                                                    key={step}
                                                    className="flex-1 h-10 hover:flex-[1.5] transition-all relative group"
                                                    style={{ backgroundColor: hex }}
                                                    title={`${name}-${step}: ${hex}`}
                                                >
                                                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono opacity-0 group-hover:opacity-100 bg-black/20 text-white backdrop-blur-[1px]">
                                                        {step}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Code Block */}
                        <div className="bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 flex flex-col min-h-[400px]">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#252525]">
                                <div className="flex gap-2">
                                    {['css', 'tailwind', 'scss', 'json', 'w3c'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors",
                                                activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-white/5"
                                            )}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={copyCode} className="flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white transition-colors">
                                    <Copy size={14} /> Copy Code
                                </button>
                            </div>

                            {/* Editor */}
                            <div className="flex-1 p-6 overflow-auto">
                                <pre className="font-mono text-sm leading-relaxed text-[#d4d4d4]">
                                    <code>{codeOutput}</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
