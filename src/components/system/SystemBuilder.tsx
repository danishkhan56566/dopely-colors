'use client';

import { Color } from '@/store/usePaletteStore';
import chroma from 'chroma-js';
import { useState, useMemo } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

interface SystemBuilderProps {
    colors: Color[];
    isOpen: boolean;
    onClose: () => void;
}

export const SystemBuilder = ({ colors, isOpen, onClose }: SystemBuilderProps) => {
    if (!isOpen) return null;

    // Generate scales (50-950) for a base color
    const generateScale = (hex: string) => {
        return chroma.scale(['white', hex, 'black'])
            .domain([0, 0.5, 1])
            .mode('lch')
            .colors(11) // 11 steps for 50, 100... 900, 950? Closer to Tailwind logic: 50, 100, 200... 900, 950
            .slice(1, 11); // Simple approximation
    };

    // Semantic Mapping Logic
    const semanticMap = useMemo(() => {
        const map = {
            success: '',
            error: '',
            warning: '',
            info: ''
        };

        // Simple heuristic: specific hues
        colors.forEach(c => {
            const hue = chroma(c.hex).get('hsl.h');
            const sat = chroma(c.hex).get('hsl.s');

            // Skip grays
            if (sat < 0.1) return;

            if (hue >= 70 && hue <= 160 && !map.success) map.success = c.hex; // Green
            if ((hue >= 340 || hue <= 20) && !map.error) map.error = c.hex;  // Red
            if (hue >= 30 && hue <= 60 && !map.warning) map.warning = c.hex; // Orange/Yellow
            if (hue >= 180 && hue <= 260 && !map.info) map.info = c.hex;    // Blue
        });

        // Fallbacks if not found (find closest or generate?)
        // For now, if missing, we just leave blank or use defaults? 
        // Let's use defaults if matches not found 
        if (!map.success) map.success = '#22c55e';
        if (!map.error) map.error = '#ef4444';
        if (!map.warning) map.warning = '#eab308';
        if (!map.info) map.info = '#3b82f6';

        return map;
    }, [colors]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied!');
    };

    return (
        <div className="fixed inset-0 z-[60] bg-white overflow-auto animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between z-10">
                <div>
                    <h2 className="text-2xl font-bold">Palette System</h2>
                    <p className="text-gray-500">Auto-generated scales & semantic aliasing</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-12 space-y-16">

                {/* 1. Color Scales */}
                <section>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-black text-white flex items-center justify-center text-sm">1</span>
                        Color Scales
                    </h3>
                    <div className="grid gap-8">
                        {colors.map((color, i) => {
                            const scale = chroma.scale(['#fff', color.hex, '#000']).mode('lch').colors(12).slice(1, 11);
                            const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

                            return (
                                <div key={color.id} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                                        <span className="font-mono text-xs uppercase text-gray-400">{color.hex}</span>
                                    </div>
                                    <div className="grid grid-cols-10 gap-0 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                        {scale.map((shade, idx) => (
                                            <div
                                                key={idx}
                                                className="h-16 flex flex-col items-center justify-center gap-1 cursor-pointer hover:scale-105 transition-transform relative z-0 hover:z-10 group"
                                                style={{ backgroundColor: shade }}
                                                onClick={() => copyToClipboard(shade)}
                                            >
                                                <span className={`text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${chroma.contrast(shade, 'white') > 4.5 ? 'text-white' : 'text-black'}`}>
                                                    {steps[idx]}
                                                </span>
                                                <span className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${chroma.contrast(shade, 'white') > 4.5 ? 'text-white/60' : 'text-black/60'}`}>
                                                    {shade}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 2. Semantic Aliases */}
                <section>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-black text-white flex items-center justify-center text-sm">2</span>
                        Semantic Aliases
                    </h3>
                    <div className="grid grid-cols-4 gap-6">
                        {Object.entries(semanticMap).map(([role, hex]) => (
                            <div key={role} className="p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start gap-4" style={{ backgroundColor: chroma(hex).alpha(0.05).css() }}>
                                <div className="w-full flex items-center justify-between">
                                    <span className="capitalize font-bold text-gray-900">{role}</span>
                                    <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                                </div>
                                <div className="w-full">
                                    <div className="text-xs text-gray-400 mb-1">Foundational Color</div>
                                    <code className="text-sm font-bold">{hex}</code>
                                </div>
                                <div className="w-full flex gap-2">
                                    <div className="flex-1 h-8 rounded-lg" style={{ backgroundColor: hex }}></div>
                                    <div className="flex-1 h-8 rounded-lg" style={{ backgroundColor: chroma(hex).alpha(0.2).css() }}></div>
                                    <div className="flex-1 h-8 rounded-lg border border-current" style={{ color: hex }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Export System */}
                <section className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">System Export (JSON)</h3>
                        <button
                            onClick={() => copyToClipboard(JSON.stringify({ palette: colors, system: { scales: '...', semantic: semanticMap } }, null, 2))}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800"
                        >
                            <Copy size={16} /> Copy JSON
                        </button>
                    </div>
                    <pre className="text-xs font-mono text-gray-500 overflow-x-auto p-4 bg-white rounded-xl border border-gray-200">
                        {JSON.stringify({
                            semantic: semanticMap,
                            primitives: colors.map(c => c.hex)
                        }, null, 2)}
                    </pre>
                </section>
            </div>
        </div>
    );
};
