'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MousePointerClick, Check, X } from 'lucide-react';
import chroma from 'chroma-js';

export default function MicroInteractionsPage() {
    const [baseColor, setBaseColor] = useState('#3b82f6');

    // Generate States
    const hover = chroma(baseColor).brighten(0.5).hex();
    const active = chroma(baseColor).darken(0.5).hex();
    const focus = chroma(baseColor).alpha(0.4).css(); // Ring color
    const disabled = chroma(baseColor).desaturate(2).brighten(1.5).hex();

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white p-6 md:p-10 flex flex-col items-center">
                <header className="max-w-2xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <MousePointerClick size={14} /> UI States
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Micro-Interaction Set</h1>
                    <p className="text-lg text-gray-500">
                        Automatically generate consistent Hover, Active, Focus, and Disabled states from a single primary color.
                    </p>
                </header>

                {/* Input */}
                <div className="flex items-center gap-4 mb-16 bg-gray-50 p-4 rounded-2xl shadow-sm">
                    <div className="font-bold text-gray-500 uppercase text-xs">Primary Color</div>
                    <input
                        type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)}
                        className="w-10 h-10 rounded-full cursor-pointer"
                    />
                    <div className="font-mono">{baseColor}</div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl w-full">

                    {/* Normal */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-sm font-bold text-gray-400 uppercase">Default</span>
                        <button
                            className="px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all"
                            style={{ backgroundColor: baseColor }}
                        >
                            Button
                        </button>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{baseColor}</div>
                    </div>

                    {/* Hover */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-sm font-bold text-gray-400 uppercase">Hover</span>
                        <button
                            className="px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all transform scale-105"
                            style={{ backgroundColor: hover }}
                        >
                            Button
                        </button>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{hover}</div>
                    </div>

                    {/* Active */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-sm font-bold text-gray-400 uppercase">Active / Press</span>
                        <button
                            className="px-6 py-3 rounded-lg font-bold text-white shadow-inner transition-all transform scale-95"
                            style={{ backgroundColor: active }}
                        >
                            Button
                        </button>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{active}</div>
                    </div>

                    {/* Focus */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-sm font-bold text-gray-400 uppercase">Focus Ring</span>
                        <button
                            className="px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all"
                            style={{ backgroundColor: baseColor, boxShadow: `0 0 0 4px ${focus}` }}
                        >
                            Button
                        </button>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">Outline: 40% Opacity</div>
                    </div>

                    {/* Disabled */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-sm font-bold text-gray-400 uppercase">Disabled</span>
                        <button
                            className="px-6 py-3 rounded-lg font-bold text-white shadow-none cursor-not-allowed"
                            style={{ backgroundColor: disabled }}
                        >
                            Button
                        </button>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{disabled}</div>
                    </div>

                </div>

                {/* CSS Output */}
                <div className="mt-16 max-w-2xl w-full bg-gray-900 text-gray-300 p-8 rounded-2xl font-mono text-sm shadow-xl">
                    <pre>
                        {`.button {
  background-color: ${baseColor};
  color: white;
}
.button:hover {
  background-color: ${hover};
}
.button:active {
  background-color: ${active};
}
.button:focus-visible {
  outline: 4px solid ${focus};
}
.button:disabled {
  background-color: ${disabled};
  cursor: not-allowed;
}`}
                    </pre>
                </div>

            </div>
        </DashboardLayout>
    );
}
