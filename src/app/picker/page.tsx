'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HexColorPicker } from 'react-colorful';
import chroma from 'chroma-js';
import { Copy, RefreshCw, Heart, History, Trash2, Plus } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

// Types
type ColorModel = 'HEX' | 'RGB' | 'HSL' | 'CMYK';
type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split' | 'monochromatic';

export default function AdvancedPickerPage() {
    const [color, setColor] = useState('#3b82f6');
    const [history, setHistory] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeModel, setActiveModel] = useState<ColorModel>('HEX');

    // Load history/favorites from local storage
    useEffect(() => {
        const savedHistory = localStorage.getItem('dopley_picker_history');
        const savedFavorites = localStorage.getItem('dopley_picker_favorites');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    }, []);

    // Save history
    const addToHistory = (newColor: string) => {
        setHistory(prev => {
            const filtered = prev.filter(c => c !== newColor);
            const updated = [newColor, ...filtered].slice(0, 20);
            localStorage.setItem('dopley_picker_history', JSON.stringify(updated));
            return updated;
        });
    };

    // Toggle Favorite
    const toggleFavorite = (c: string) => {
        setFavorites(prev => {
            const isFav = prev.includes(c);
            let updated;
            if (isFav) {
                updated = prev.filter(fav => fav !== c);
            } else {
                updated = [c, ...prev];
            }
            localStorage.setItem('dopley_picker_favorites', JSON.stringify(updated));
            return updated;
        });
    };

    // Debounced history update for picker interaction
    useEffect(() => {
        const timer = setTimeout(() => {
            addToHistory(color);
        }, 1000);
        return () => clearTimeout(timer);
    }, [color]);

    // Derived Values
    const colorValues = useMemo(() => {
        try {
            const c = chroma(color);
            return {
                hex: c.hex(),
                rgb: c.rgb(),
                hsl: c.hsl(),
                cmyk: c.cmyk(),
                contrast: chroma.contrast(color, '#ffffff')
            };
        } catch (e) {
            return null;
        }
    }, [color]);

    const harmonies = useMemo(() => {
        if (!colorValues) return [];
        const c = chroma(color);

        const generators: Record<HarmonyType, { title: string, colors: string[] }> = {
            complementary: { title: 'Complementary', colors: [c.set('hsl.h', '+180').hex()] },
            analogous: { title: 'Analogous', colors: [c.set('hsl.h', '-30').hex(), c.set('hsl.h', '+30').hex()] },
            triadic: { title: 'Triadic', colors: [c.set('hsl.h', '+120').hex(), c.set('hsl.h', '+240').hex()] },
            split: { title: 'Split Compl.', colors: [c.set('hsl.h', '+150').hex(), c.set('hsl.h', '+210').hex()] },
            tetradic: { title: 'Tetradic', colors: [c.set('hsl.h', '+90').hex(), c.set('hsl.h', '+180').hex(), c.set('hsl.h', '+270').hex()] },
            monochromatic: { title: 'Monochromatic', colors: [c.brighten(1).hex(), c.darken(1).hex()] }
        };

        return Object.entries(generators).map(([type, data]) => ({ type, ...data }));
    }, [color, colorValues]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text}`);
    };

    if (!colorValues) return null;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-6">

                <div className="max-w-6xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Color Picker</h1>
                        <p className="text-gray-500">Precision tools, color harmonies, and history tracking.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN: Picker & Inputs (5 cols) */}
                        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">

                            {/* Visual Picker Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex flex-col items-center">
                                    <div className="w-full aspect-square max-w-[300px] mb-6 custom-picker-wrapper">
                                        <HexColorPicker color={color} onChange={setColor} style={{ width: '100%', height: '100%' }} />
                                    </div>

                                    <div className="flex items-center gap-4 w-full">
                                        <div
                                            className="w-16 h-16 rounded-xl shadow-inner border border-black/5"
                                            style={{ backgroundColor: color }}
                                        />
                                        <div className="flex-1">
                                            <div className="text-2xl font-mono font-bold text-gray-900 uppercase">{colorValues.hex}</div>
                                            <div className="text-xs text-gray-400 font-medium mt-1">
                                                Contrast: {colorValues.contrast.toFixed(2)}:1
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleFavorite(color)}
                                            className={clsx(
                                                "p-3 rounded-xl transition-colors",
                                                favorites.includes(color)
                                                    ? "bg-red-50 text-red-500"
                                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                            )}
                                        >
                                            <Heart size={20} fill={favorites.includes(color) ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Inputs Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2 overflow-x-auto">
                                    {(['HEX', 'RGB', 'HSL', 'CMYK'] as ColorModel[]).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setActiveModel(m)}
                                            className={clsx(
                                                "px-4 py-2 text-sm font-bold rounded-lg transition-colors",
                                                activeModel === m ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    {activeModel === 'HEX' && (
                                        <InputRow label="HEX" value={colorValues.hex} onCopy={() => handleCopy(colorValues.hex)} />
                                    )}
                                    {activeModel === 'RGB' && (
                                        <InputRow label="RGB" value={`rgb(${colorValues.rgb.join(', ')})`} onCopy={() => handleCopy(`rgb(${colorValues.rgb.join(', ')})`)} />
                                    )}
                                    {activeModel === 'HSL' && (
                                        <InputRow
                                            label="HSL"
                                            value={`hsl(${colorValues.hsl[0].toFixed(0)}, ${Math.round(colorValues.hsl[1] * 100)}%, ${Math.round(colorValues.hsl[2] * 100)}%)`}
                                            onCopy={() => handleCopy(`hsl(${colorValues.hsl[0].toFixed(0)}, ${Math.round(colorValues.hsl[1] * 100)}%, ${Math.round(colorValues.hsl[2] * 100)}%)`)}
                                        />
                                    )}
                                    {activeModel === 'CMYK' && (
                                        <InputRow
                                            label="CMYK"
                                            value={`cmyk(${colorValues.cmyk.map(v => Math.round(v * 100)).join('%, ')}%)`}
                                            onCopy={() => handleCopy(`cmyk(${colorValues.cmyk.map(v => Math.round(v * 100)).join('%, ')}%)`)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Harmonies & History (7 cols) */}
                        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">

                            {/* Harmonies */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <RefreshCw size={18} className="text-blue-500" /> Smart Harmonies
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {harmonies.map((harmony) => (
                                        <div key={harmony.type} className="p-4 rounded-2xl border border-gray-100 hover:border-blue-100 transition-colors bg-gray-50/50">
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{harmony.title}</div>
                                            <div className="flex rounded-xl overflow-hidden h-12 shadow-sm">
                                                <div
                                                    className="w-1/3 h-full cursor-pointer hover:opacity-90 transition-opacity"
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setColor(color)}
                                                    title="Base Color"
                                                />
                                                {harmony.colors.map((c, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity relative group"
                                                        style={{ backgroundColor: c }}
                                                        onClick={() => setColor(c)}
                                                        title={c}
                                                    >
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity">
                                                            <Plus size={16} className="text-white drop-shadow-md" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* History & Favorites */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Favorites */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[300px]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Heart size={18} className="text-red-500" /> Favorites
                                        </h3>
                                        <button onClick={() => { setFavorites([]); localStorage.removeItem('dopley_picker_favorites'); }} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-5 gap-2 content-start">
                                        {favorites.length === 0 ? (
                                            <div className="col-span-5 text-center py-10 text-gray-400 text-sm">No favorites yet</div>
                                        ) : (
                                            favorites.map((c, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setColor(c)}
                                                    className="aspect-square rounded-xl shadow-sm border border-black/5 hover:scale-110 transition-transform relative group"
                                                    style={{ backgroundColor: c }}
                                                >
                                                    <span className="sr-only">{c}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Recent History */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[300px]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <History size={18} className="text-purple-500" /> Recent
                                        </h3>
                                        <button onClick={() => { setHistory([]); localStorage.removeItem('dopley_picker_history'); }} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-5 gap-2 content-start">
                                        {history.length === 0 ? (
                                            <div className="col-span-5 text-center py-10 text-gray-400 text-sm">No history yet</div>
                                        ) : (
                                            history.map((c, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setColor(c)}
                                                    className="aspect-square rounded-xl shadow-sm border border-black/5 hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-picker-wrapper .react-colorful {
                    width: 100%;
                    height: 100%;
                    border-radius: 1.5rem;
                }
                .custom-picker-wrapper .react-colorful__saturation {
                    border-radius: 1.5rem 1.5rem 0 0;
                    margin-bottom: 2px;
                }
                .custom-picker-wrapper .react-colorful__hue {
                    border-radius: 0 0 1.5rem 1.5rem;
                    height: 24px;
                }
                .custom-picker-wrapper .react-colorful__pointer {
                    width: 24px;
                    height: 24px;
                    border-width: 3px;
                }
            `}</style>
        </DashboardLayout>
    );
}

function InputRow({ label, value, onCopy }: { label: string, value: string, onCopy: () => void }) {
    return (
        <div>
            <label className="text-xs font-bold text-gray-400 block mb-1.5">{label}</label>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 group hover:border-gray-200 transition-colors">
                <code className="text-sm font-mono text-gray-700 flex-1 truncate">{value}</code>
                <button
                    onClick={onCopy}
                    className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Copy size={14} />
                </button>
            </div>
        </div>
    )
}
