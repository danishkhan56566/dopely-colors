'use client';

import { useState } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Pointer, Copy, Code2 } from 'lucide-react';
import { toast } from 'sonner';

export default function StateGenerator() {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [style, setStyle] = useState<'solid' | 'outline' | 'ghost'>('solid');

    // Generate states
    const generateStates = (hex: string) => {
        try {
            const root = chroma(hex);
            return {
                base: hex,
                hover: root.darken(0.3).hex(),
                active: root.darken(0.6).hex(),
                disabled: root.desaturate(2).alpha(0.5).css(),
                focus: root.alpha(0.3).css(), // For ring
                text: root.luminance() > 0.5 ? '#000' : '#fff'
            };
        } catch {
            return { base: hex, hover: hex, active: hex, disabled: hex, focus: hex, text: '#fff' };
        }
    };

    const states = generateStates(baseColor);

    const generateCode = () => {
        if (style === 'solid') {
            return `
/* ${baseColor} Solid States */
.btn-primary {
  background-color: ${states.base};
  color: ${states.text};
}
.btn-primary:hover {
  background-color: ${states.hover};
}
.btn-primary:active {
  background-color: ${states.active};
}
.btn-primary:disabled {
  background-color: ${states.disabled};
  cursor: not-allowed;
}
.btn-primary:focus-visible {
  outline: 2px solid ${states.base};
  outline-offset: 2px;
  box-shadow: 0 0 0 4px ${states.focus};
}`;
        }
        return `/* Code for ${style} coming soon */`;
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateCode().trim());
        toast.success("Copied CSS");
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <Pointer size={32} />
                        </div>
                        State Shade Generator
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Automatically generate accessible interaction states (hover, active, focus) for any brand color.
                    </p>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

                    {/* Controls */}
                    <div className="md:col-span-5 space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-4 block">Base Brand Color</label>
                            <div className="flex gap-4 items-center mb-8">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0 ring-4 ring-gray-50">
                                    <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                </div>
                                <input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="flex-1 text-3xl font-black text-gray-900 bg-transparent outline-none uppercase font-mono" />
                            </div>

                            <button onClick={copyCode} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-105 shadow-lg">
                                <Code2 size={18} /> Copy CSS
                            </button>
                        </div>
                    </div>

                    {/* Preview States */}
                    <div className="md:col-span-7 space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Interactive Preview</h3>

                        {/* Normal */}
                        <div className="flex items-center gap-6 group">
                            <span className="w-24 text-sm font-bold text-gray-400 text-right">Default</span>
                            <button
                                className="px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
                                style={{ backgroundColor: states.base, color: states.text }}
                            >
                                Button
                            </button>
                            <span className="font-mono text-xs text-gray-400">{states.base}</span>
                        </div>

                        {/* Hover */}
                        <div className="flex items-center gap-6 group">
                            <span className="w-24 text-sm font-bold text-gray-400 text-right">Hover</span>
                            <button
                                className="px-8 py-3 rounded-xl font-bold transition-all shadow-md transform scale-105"
                                style={{ backgroundColor: states.hover, color: states.text }}
                            >
                                Button
                            </button>
                            <span className="font-mono text-xs text-gray-400">{states.hover}</span>
                        </div>

                        {/* Active */}
                        <div className="flex items-center gap-6 group">
                            <span className="w-24 text-sm font-bold text-gray-400 text-right">Active</span>
                            <button
                                className="px-8 py-3 rounded-xl font-bold transition-all shadow-inner transform scale-95"
                                style={{ backgroundColor: states.active, color: states.text }}
                            >
                                Button
                            </button>
                            <span className="font-mono text-xs text-gray-400">{states.active}</span>
                        </div>

                        {/* Focus */}
                        <div className="flex items-center gap-6 group">
                            <span className="w-24 text-sm font-bold text-gray-400 text-right">Focus</span>
                            <button
                                className="px-8 py-3 rounded-xl font-bold transition-all"
                                style={{
                                    backgroundColor: states.base,
                                    color: states.text,
                                    boxShadow: `0 0 0 4px ${states.focus}`,
                                    outline: `2px solid ${states.base}`,
                                    outlineOffset: '2px'
                                }}
                            >
                                Button
                            </button>
                            <span className="font-mono text-xs text-gray-400">Ring: {baseColor} (30%)</span>
                        </div>

                        {/* Disabled */}
                        <div className="flex items-center gap-6 group">
                            <span className="w-24 text-sm font-bold text-gray-400 text-right">Disabled</span>
                            <button
                                disabled
                                className="px-8 py-3 rounded-xl font-bold transition-all cursor-not-allowed"
                                style={{ backgroundColor: states.disabled, color: states.text }}
                            >
                                Button
                            </button>
                            <span className="font-mono text-xs text-gray-400">Opacity 50%</span>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
