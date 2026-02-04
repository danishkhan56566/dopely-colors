'use client';

import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Moon, Sun, ArrowRight, Copy, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function DarkModeGenerator() {
    const [lightPalette, setLightPalette] = useState([
        { id: 'bg', name: 'Background', hex: '#ffffff' },
        { id: 'surface', name: 'Surface', hex: '#f8fafc' },
        { id: 'text-pri', name: 'Text Primary', hex: '#0f172a' },
        { id: 'text-sec', name: 'Text Secondary', hex: '#64748b' },
        { id: 'primary', name: 'Primary Brand', hex: '#3b82f6' },
        { id: 'accent', name: 'Accent', hex: '#f43f5e' },
    ]);

    const generateDarkColor = (hex: string, id: string) => {
        try {
            const color = chroma(hex);

            // Special handling based on role if possible, otherwise generic inversion
            if (id.includes('bg') || id.includes('surface')) {
                // Backgrounds: Invert lightness but keep very dark
                // e.g. White (L=1) -> Dark (L=0.05 - 0.15)
                // If input is already dark, keep it? strict inversion assumes input is Light Mode.
                const l = color.get('hsl.l');
                const newL = 0.05 + (1 - l) * 0.15; // Map 1.0 -> 0.05, 0.9 -> 0.065
                // Actually simple inversion: 1 - L usually works but we want "Good" dark mode (slate/gray).
                // Let's use 900-950 range.
                return chroma(hex).set('hsl.l', 0.1).hex(); // naive
            }

            // Better Algorithm:
            // 1. Convert to HSL
            // 2. Keep Hue
            // 3. Adjust Saturation (Dark mode often has lower saturation)
            // 4. Invert Lightness intelligentally

            const hsl = color.hsl();
            const h = hsl[0];
            const s = hsl[1];
            const l = hsl[2];

            let newL = 1 - l;
            let newS = s * 0.85; // slightly desaturate

            // Adjustments for specific roles
            if (id.includes('bg')) {
                newL = 0.02 + (1 - l) * 0.1; // Maps white to very dark
            } else if (id.includes('surface')) {
                newL = 0.1 + (1 - l) * 0.1; // Maps white to dark gray
            } else if (id.includes('text')) {
                newL = Math.max(0.8, 1 - l); // Ensure text is bright
            } else {
                // Brand colors: Ensure they are visible against dark bg
                // Often need to be lighter/brighter in dark mode
                if (l < 0.5) newL = l + 0.3;
            }

            return chroma.hsl(h, newS, newL).hex();
        } catch {
            return hex;
        }
    };

    const darkPalette = useMemo(() => {
        return lightPalette.map(c => ({
            ...c,
            hex: generateDarkColor(c.hex, c.id)
        }));
    }, [lightPalette]);

    const updateLight = (id: string, hex: string) => {
        setLightPalette(lightPalette.map(p => p.id === id ? { ...p, hex } : p));
    };

    const updateDark = (id: string, hex: string) => {
        // Allow manual override? For now just visual output
    };

    const copyAll = () => {
        const css = `:root {
  /* Light Mode */
  --bg: ${lightPalette.find(p => p.id === 'bg')?.hex};
  --surface: ${lightPalette.find(p => p.id === 'surface')?.hex};
  --text: ${lightPalette.find(p => p.id === 'text-pri')?.hex};
  --primary: ${lightPalette.find(p => p.id === 'primary')?.hex};
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark Mode */
    --bg: ${darkPalette.find(p => p.id === 'bg')?.hex};
    --surface: ${darkPalette.find(p => p.id === 'surface')?.hex};
    --text: ${darkPalette.find(p => p.id === 'text-pri')?.hex};
    --primary: ${darkPalette.find(p => p.id === 'primary')?.hex};
  }
}`;
        navigator.clipboard.writeText(css);
        toast.success("Copied CSS Variables");
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-gray-800 rounded-2xl text-yellow-400">
                            <Moon size={32} />
                        </div>
                        Dark Mode Generator
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Instantly generate a high-quality dark theme from your existing light palette.
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

                    {/* Light Mode Input */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 to-orange-400" />
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                                <Sun className="text-orange-400" /> Light Mode
                            </h3>
                            <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-500">Input</span>
                        </div>

                        <div className="space-y-6">
                            {lightPalette.map(p => (
                                <div key={p.id}>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">{p.name}</label>
                                    <div className="flex gap-3">
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-200 shrink-0">
                                            <input type="color" value={p.hex} onChange={(e) => updateLight(p.id, e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                        </div>
                                        <input
                                            type="text"
                                            value={p.hex}
                                            onChange={(e) => updateLight(p.id, e.target.value)}
                                            className="w-full px-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-sm uppercase"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dark Mode Output */}
                    <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden text-white">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />
                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="font-bold text-white text-xl flex items-center gap-2">
                                <Moon className="text-indigo-400" /> Dark Mode
                            </h3>
                            <button onClick={copyAll} className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-white transition-colors flex items-center gap-2">
                                <Copy size={12} /> Copy CSS
                            </button>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {darkPalette.map(p => (
                                <div key={p.id}>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{p.name}</label>
                                    <div className="flex gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl shadow-lg border border-white/10 shrink-0"
                                            style={{ backgroundColor: p.hex }}
                                        />
                                        <div className="flex-1 flex items-center bg-white/5 rounded-xl px-4 border border-white/5">
                                            <span className="font-mono text-sm text-gray-300 uppercase select-all">{p.hex}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                                title="Regenerate"
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Preview Section */}
                <div className="w-full max-w-6xl mt-16">
                    <h3 className="text-center font-bold text-gray-400 uppercase tracking-widest mb-8">Live Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Light Preview */}
                        <div
                            className="p-8 rounded-3xl shadow-sm border border-gray-200 transition-all min-h-[300px]"
                            style={{ backgroundColor: lightPalette[0].hex, color: lightPalette[2].hex }}
                        >
                            <h4 className="text-2xl font-black mb-4">Light Theme</h4>
                            <p className="mb-6 opacity-80" style={{ color: lightPalette[3].hex }}>
                                This is how your content looks in the standardized light mode. Clean, legible, and crisp.
                            </p>
                            <button
                                className="px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105"
                                style={{ backgroundColor: lightPalette[4].hex, color: '#fff' }}
                            >
                                Primary Action
                            </button>
                        </div>

                        {/* Dark Preview */}
                        <div
                            className="p-8 rounded-3xl shadow-2xl border border-gray-800 transition-all min-h-[300px]"
                            style={{ backgroundColor: darkPalette[0].hex, color: darkPalette[2].hex }}
                        >
                            <h4 className="text-2xl font-black mb-4">Dark Theme</h4>
                            <p className="mb-6 opacity-80" style={{ color: darkPalette[3].hex }}>
                                And this is the generated dark mode. Easy on the eyes, saving battery, and looking sleek.
                            </p>
                            <button
                                className="px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105"
                                style={{ backgroundColor: darkPalette[4].hex, color: '#fff' }}
                            >
                                Primary Action
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
