'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HexColorPicker } from 'react-colorful';
import chroma from 'chroma-js';
import { Copy, RefreshCw, Heart, History, Sparkles, Plus, Palette } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { PickerGuide } from '@/components/content/PageGuides';
import { PickerFAQ } from '@/components/content/PageFAQs';

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
                toast.success('Removed from favorites');
            } else {
                updated = [c, ...prev];
                toast.success('Added to favorites');
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
            <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000" />
                </div>

                <div className="w-full max-w-7xl px-4 py-16 sm:px-6 relative z-10 space-y-16">

                    {/* Premium Header */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <Palette size={14} className="text-indigo-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-600">
                                Pro Tools V2.0
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 saturate-150 drop-shadow-sm">Color Picker</span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 font-medium">
                            Precision control, automatic harmonies, and <br className="hidden sm:block" />
                            history tracking for <span className="text-gray-900 font-bold">professional designers</span>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">

                        {/* LEFT COLUMN: Picker & Inputs (5 cols) */}
                        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">

                            {/* Visual Picker Card */}
                            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white/50 ring-1 ring-black/5">
                                <div className="flex flex-col items-center">
                                    <div className="w-full aspect-square max-w-[340px] mb-8 custom-picker-wrapper shadow-lg rounded-[1.5rem] ring-4 ring-white">
                                        <HexColorPicker color={color} onChange={setColor} style={{ width: '100%', height: '100%' }} />
                                    </div>

                                    <div className="flex items-center gap-5 w-full bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                                        <div
                                            className="w-20 h-20 rounded-2xl shadow-inner border border-black/5 ring-4 ring-gray-50 transition-colors duration-200"
                                            style={{ backgroundColor: color }}
                                        />
                                        <div className="flex-1">
                                            <div className="text-3xl font-mono font-black text-gray-900 uppercase tracking-tight">{colorValues.hex}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={clsx(
                                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                    colorValues.contrast >= 4.5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                )}>
                                                    {colorValues.contrast >= 4.5 ? 'Pass' : 'Fail'}
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    Contrast: {colorValues.contrast.toFixed(2)}:1
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleFavorite(color)}
                                            className={clsx(
                                                "p-4 rounded-2xl transition-all shadow-sm active:scale-95",
                                                favorites.includes(color)
                                                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                            )}
                                        >
                                            <Heart size={24} fill={favorites.includes(color) ? "currentColor" : "none"} className="transition-transform active:scale-125" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Inputs Card */}
                            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/50 ring-1 ring-black/5">
                                <div className="flex items-center gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl">
                                    {(['HEX', 'RGB', 'HSL', 'CMYK'] as ColorModel[]).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setActiveModel(m)}
                                            className={clsx(
                                                "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm",
                                                activeModel === m ? "bg-white text-gray-900 shadow-md scale-100" : "text-gray-400 hover:text-gray-600 hover:bg-white/50 scale-95"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    {activeModel === 'HEX' && (
                                        <InputRow label="HEX Code" value={colorValues.hex} onCopy={() => handleCopy(colorValues.hex)} />
                                    )}
                                    {activeModel === 'RGB' && (
                                        <InputRow label="RGB Values" value={`rgb(${colorValues.rgb.join(', ')})`} onCopy={() => handleCopy(`rgb(${colorValues.rgb.join(', ')})`)} />
                                    )}
                                    {activeModel === 'HSL' && (
                                        <InputRow
                                            label="HSL Values"
                                            value={`hsl(${colorValues.hsl[0].toFixed(0)}, ${Math.round(colorValues.hsl[1] * 100)}%, ${Math.round(colorValues.hsl[2] * 100)}%)`}
                                            onCopy={() => handleCopy(`hsl(${colorValues.hsl[0].toFixed(0)}, ${Math.round(colorValues.hsl[1] * 100)}%, ${Math.round(colorValues.hsl[2] * 100)}%)`)}
                                        />
                                    )}
                                    {activeModel === 'CMYK' && (
                                        <InputRow
                                            label="CMYK Values"
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
                            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-indigo-900/5 border border-white/50 ring-1 ring-black/5">
                                <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><RefreshCw size={20} /></div>
                                    Generated Harmonies
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {harmonies.map((harmony) => (
                                        <div key={harmony.type} className="p-5 rounded-[1.5rem] border border-gray-100 hover:border-blue-200 transition-all bg-white hover:shadow-lg hover:-translate-y-1 duration-300 group">
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 group-hover:text-blue-500 transition-colors">{harmony.title}</div>
                                            <div className="flex rounded-2xl overflow-hidden h-16 shadow-sm ring-1 ring-black/5">
                                                <div
                                                    className="w-1/3 h-full cursor-pointer hover:opacity-90 transition-opacity relative"
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setColor(color)}
                                                    title="Base Color"
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[10px] font-bold bg-black/20 text-white px-2 py-1 rounded backdrop-blur-sm">BASE</span>
                                                    </div>
                                                </div>
                                                {harmony.colors.map((c, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity relative group/color"
                                                        style={{ backgroundColor: c }}
                                                        onClick={() => setColor(c)}
                                                        title={c}
                                                    >
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 bg-black/10 transition-opacity">
                                                            <Plus size={20} className="text-white drop-shadow-md" />
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
                                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-lg border border-white/50 ring-1 ring-black/5 h-[400px] flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <div className="bg-red-100 p-2 rounded-lg text-red-500"><Heart size={20} /></div> Saved
                                        </h3>
                                        <button onClick={() => { setFavorites([]); localStorage.removeItem('dopley_picker_favorites'); }} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition-colors">Clear All</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-4 content-start gap-3 custom-scrollbar">
                                        {favorites.length === 0 ? (
                                            <div className="col-span-4 flex flex-col items-center justify-center h-full text-center text-gray-400">
                                                <Heart size={32} className="mb-2 opacity-20" />
                                                <p className="text-sm font-medium">No favorites yet</p>
                                            </div>
                                        ) : (
                                            favorites.map((c, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setColor(c)}
                                                    className="aspect-square rounded-2xl shadow-sm border border-black/5 hover:scale-105 hover:shadow-md transition-all relative group"
                                                    style={{ backgroundColor: c }}
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="bg-black/20 p-1.5 rounded-full backdrop-blur-sm">
                                                            <Sparkles size={12} className="text-white" />
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Recent History */}
                                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-lg border border-white/50 ring-1 ring-black/5 h-[400px] flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <div className="bg-purple-100 p-2 rounded-lg text-purple-500"><History size={20} /></div> Recents
                                        </h3>
                                        <button onClick={() => { setHistory([]); localStorage.removeItem('dopley_picker_history'); }} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition-colors">Clear All</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-5 content-start gap-2 custom-scrollbar">
                                        {history.length === 0 ? (
                                            <div className="col-span-5 flex flex-col items-center justify-center h-full text-center text-gray-400">
                                                <History size={32} className="mb-2 opacity-20" />
                                                <p className="text-sm font-medium">No history yet</p>
                                            </div>
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

            <PickerGuide />
            <PickerFAQ />

            <style jsx global>{`
                .custom-picker-wrapper .react-colorful {
                    width: 100%;
                    height: 100%;
                    border-radius: 1.5rem;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                }
                .custom-picker-wrapper .react-colorful__saturation {
                    border-radius: 1.5rem 1.5rem 0 0;
                    margin-bottom: 4px;
                }
                .custom-picker-wrapper .react-colorful__hue {
                    border-radius: 0 0 1.5rem 1.5rem;
                    height: 32px;
                }
                .custom-picker-wrapper .react-colorful__pointer {
                    width: 32px;
                    height: 32px;
                    border-width: 4px;
                    border-color: white;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.1);
                    border-radius: 20px;
                }
            `}</style>
        </DashboardLayout>
    );
}

function InputRow({ label, value, onCopy }: { label: string, value: string, onCopy: () => void }) {
    return (
        <div>
            <label className="text-xs font-bold text-gray-400 block mb-2 uppercase tracking-wide ml-1">{label}</label>
            <div className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-300 cursor-copy" onClick={onCopy}>
                <code className="text-base font-mono font-bold text-gray-700 flex-1 truncate">{value}</code>
                <button
                    className="text-gray-400 group-hover:text-blue-500 transition-colors p-1"
                >
                    <Copy size={18} />
                </button>
            </div>
        </div>
    )
}
