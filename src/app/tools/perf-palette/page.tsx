'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Zap, Code2, Server, Smartphone, Monitor } from 'lucide-react';
import chroma from 'chroma-js';

export default function PerfPalettePage() {
    const [colors, setColors] = useState(['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1']);

    // Performance Metrics
    const metrics = colors.map(c => {
        const rgb = chroma(c).rgb();
        // "Expense" heuristic: Alpha channel is expensive. Hex is cheap.
        // HSL calc is expensive at runtime if done frequently.
        // Here we simulate "Paint Cost".
        return {
            color: c,
            hex_size: 7, // 7 bytes
            rgb_size: `rgb(${rgb.join(',')})`.length,
            is_web_safe: true,
            paint_cost: 'Low'
        };
    });

    const totalSize = metrics.reduce((acc, m) => acc + m.hex_size, 0);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Zap size={14} /> Developer Tools
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Performance Check</h1>
                    <p className="text-lg text-gray-500">
                        Optimize your palette for production. Minimize payload size and ensure rendering efficiency.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Palette Inputs</h3>
                        <div className="space-y-4">
                            {colors.map((c, i) => (
                                <div key={i} className="flex gap-4">
                                    <input
                                        type="color" value={c}
                                        onChange={(e) => {
                                            const start = [...colors];
                                            start[i] = e.target.value;
                                            setColors(start);
                                        }}
                                        className="h-10 w-10 rounded-lg cursor-pointer bg-transparent"
                                    />
                                    <div className="flex-1 bg-gray-50 rounded-lg px-4 flex items-center font-mono text-sm">
                                        {c}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl font-mono text-sm">
                        <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
                            <span className="font-bold flex items-center gap-2"><Server size={16} /> Payload Analysis</span>
                            <span className="text-green-400">{totalSize} bytes</span>
                        </div>
                        <div className="space-y-4">
                            {metrics.map((m, i) => (
                                <div key={i} className="flex justify-between items-center opacity-80">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                                        <span>{m.color}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span>HEX: {m.hex_size}B</span>
                                        <span>RGB: {m.rgb_size}B</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-700">
                            <h4 className="font-bold mb-2 text-white">Generated CSS Variables</h4>
                            <pre className="text-gray-400 overflow-x-auto p-4 bg-black/30 rounded-xl">
                                {`:root {
${colors.map((c, i) => `  --color-primary-${i + 1}: ${c};`).join('\n')}
}`}
                            </pre>
                            <button
                                onClick={() => navigator.clipboard.writeText(`:root {\n${colors.map((c, i) => `  --color-primary-${i + 1}: ${c};`).join('\n')}\n}`)}
                                className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs uppercase font-bold transition-colors"
                            >
                                Copy CSS
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
