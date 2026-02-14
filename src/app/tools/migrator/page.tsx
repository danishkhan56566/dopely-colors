'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArrowRightLeft, FileJson, Apple, Palette, Smartphone } from 'lucide-react';
import chroma from 'chroma-js';
import { toast } from 'sonner';
import { MigratorGuide } from '@/components/content/UtilityGuides';

const SYSTEMS = [
    { id: 'tailwind', name: 'Tailwind CSS', icon: Palette },
    { id: 'material', name: 'Material Design', icon: Smartphone },
    { id: 'apple', name: 'Apple HIG', icon: Apple },
];

export default function MigratorPage() {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [targetSystem, setTargetSystem] = useState('tailwind');

    // Generator Logic
    const generateTokens = (color: string, system: string) => {
        const scale = chroma.scale([
            chroma(color).brighten(2.5),
            color,
            chroma(color).darken(2.5)
        ]).colors(10); // 50-900 or similar

        if (system === 'tailwind') {
            return {
                '50': scale[0],
                '100': scale[1],
                '200': scale[2],
                '300': scale[3],
                '400': scale[4],
                '500': scale[5], // Base
                '600': scale[6],
                '700': scale[7],
                '800': scale[8],
                '900': scale[9],
            };
        }

        if (system === 'material') {
            return {
                'primary': color,
                'onPrimary': '#ffffff',
                'primaryContainer': scale[1],
                'onPrimaryContainer': scale[9],
                'secondary': chroma(color).set('hsl.h', '+30').hex(),
            };
        }

        if (system === 'apple') {
            return {
                'systemBlue': color,
                'systemBlueDark': chroma(color).darken(0.5).hex(),
                'accessibleColor': scale[7],
                'background': '#ffffff',
            };
        }

        return {};
    };

    const tokens = generateTokens(baseColor, targetSystem);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <ArrowRightLeft size={14} /> Migration Assistant
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Design System Migrator</h1>
                    <p className="text-lg text-gray-500">
                        Translate your brand colors into standardized tokens for Tailwind, Material, or Apple platforms.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Input */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Source Brand Color</h3>
                        <div className="flex gap-4 items-center mb-8">
                            <input
                                type="color"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="w-20 h-20 rounded-2xl cursor-pointer bg-transparent"
                            />
                            <div>
                                <div className="text-2xl font-black font-mono">{baseColor}</div>
                                <div className="text-sm text-gray-400">Primary Brand Source</div>
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-4">Target System</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {SYSTEMS.map(sys => (
                                <button
                                    key={sys.id}
                                    onClick={() => setTargetSystem(sys.id)}
                                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${targetSystem === sys.id ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <sys.icon size={20} />
                                    <span className="font-bold">{sys.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Output */}
                    <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <FileJson size={20} /> Token Output
                            </h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
                                    toast.success('Tokens copied to clipboard!');
                                }}
                                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                                Copy JSON
                            </button>
                        </div>

                        <div className="flex-1 bg-black/50 rounded-2xl p-6 font-mono text-sm overflow-y-auto">
                            <pre className="text-green-400">
                                {JSON.stringify(tokens, null, 2)}
                            </pre>
                        </div>

                        {/* Visual Preview of Tokens */}
                        <div className="mt-6 grid grid-cols-5 gap-2">
                            {Object.entries(tokens).slice(0, 10).map(([key, value]) => (
                                <div key={key} title={`${key}: ${value}`} className="aspect-square rounded-lg flex items-center justify-center text-[8px] font-bold text-white/50" style={{ backgroundColor: value as string }}>

                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <MigratorGuide />
            </div>
        </DashboardLayout>
    );
}
