'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Grid, Plus, X, Copy, Download, Share2, AlertCircle, Eye, EyeOff, Sparkles, Wand2, Info, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ContrastGuide } from '@/components/content/ContrastGuide';
// @ts-ignore
import { calcAPCA, sRGBtoY, colorParsley } from 'apca-w3';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function ContrastGridContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [colors, setColors] = useState([
        { id: '1', hex: '#ffffff', name: 'White' },
        { id: '2', hex: '#0f172a', name: 'Slate 900' },
        { id: '3', hex: '#3b82f6', name: 'Blue 500' },
        { id: '4', hex: '#ef4444', name: 'Red 500' },
        { id: '5', hex: '#22c55e', name: 'Green 500' },
    ]);

    const [hideFails, setHideFails] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    // Sync from URL on mount
    useEffect(() => {
        const paletteParam = searchParams.get('palette');
        if (paletteParam) {
            try {
                const decoded = JSON.parse(atob(paletteParam));
                if (Array.isArray(decoded)) setColors(decoded);
            } catch (e) {
                console.error("Failed to parse palette from URL", e);
            }
        }
    }, [searchParams]);

    const shareUrl = () => {
        try {
            const encoded = btoa(JSON.stringify(colors));
            const url = `${window.location.origin}${window.location.pathname}?palette=${encoded}`;
            navigator.clipboard.writeText(url);
            toast.success('Shareable link copied to clipboard!');
            router.replace(`?palette=${encoded}`, { scroll: false });
        } catch (e) {
            toast.error('Failed to generate link');
        }
    };

    const addColor = () => {
        setColors([...colors, {
            id: Math.random().toString(36).substr(2, 9),
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

    const getAPCA = (fg: string, bg: string) => {
        try {
            return calcAPCA(fg, bg);
        } catch (e) {
            return 0;
        }
    };

    const getScore = (ratio: number, apca: number) => {
        const absApca = Math.abs(apca);
        let wcagLabel = 'Fail';
        let wcagColor = 'text-red-400 bg-red-400/10 ring-1 ring-red-400/20';
        let pass = false;

        if (ratio >= 7) {
            wcagLabel = 'AAA';
            wcagColor = 'text-green-400 bg-green-400/10 ring-1 ring-green-400/20';
            pass = true;
        }
        else if (ratio >= 4.5) {
            wcagLabel = 'AA';
            wcagColor = 'text-blue-400 bg-blue-400/10 ring-1 ring-blue-400/20';
            pass = true;
        }
        else if (ratio >= 3) {
            wcagLabel = 'AA+';
            wcagColor = 'text-amber-400 bg-amber-400/10 ring-1 ring-amber-400/20';
            pass = true;
        }

        return { wcagLabel, wcagColor, absApca, pass };
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col items-center relative overflow-hidden font-sans">

                {/* Immersive Background Aura */}
                <div className="absolute inset-0 opacity-10 blur-[150px] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent" />
                </div>

                <div className="w-full max-w-[1700px] px-6 py-16 relative z-10 space-y-16">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-left space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                            >
                                <Sparkles size={14} className="text-purple-400" /> Accessibility Auditor
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-black tracking-tight"
                            >
                                Contrast <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 text-outline">Grid</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-gray-400 max-w-xl"
                            >
                                Visualize WCAG 2.1 and APCA accessibility compliance across your entire brand palette.
                            </motion.p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setHideFails(!hideFails)}
                                className={clsx(
                                    "px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border",
                                    hideFails
                                        ? "bg-purple-500/20 border-purple-500/50 text-purple-200"
                                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                                )}
                            >
                                {hideFails ? <EyeOff size={18} /> : <Eye size={18} />}
                                {hideFails ? 'Showing Passes' : 'Hide Fails'}
                            </button>
                            <button
                                onClick={shareUrl}
                                className="px-6 py-3 bg-white text-black rounded-2xl font-black flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
                            >
                                <Share2 size={18} /> Share Palette
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                        {/* Control Panel (3 cols) */}
                        <div className="lg:col-span-12 xl:col-span-3 space-y-6">
                            <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl ring-1 ring-white/5">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Palette Colors</h3>
                                    <button
                                        onClick={addColor}
                                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all group"
                                    >
                                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    <AnimatePresence mode="popLayout">
                                        {colors.map((c, idx) => (
                                            <motion.div
                                                layout
                                                key={c.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex gap-3 items-center group"
                                            >
                                                <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-4 ring-black/40 shadow-xl shrink-0">
                                                    <input
                                                        type="color"
                                                        value={c.hex}
                                                        onChange={(e) => updateColor(c.id, { hex: e.target.value })}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        type="text"
                                                        value={c.name}
                                                        onChange={(e) => updateColor(c.id, { name: e.target.value })}
                                                        className="w-full bg-transparent border-none text-white font-bold p-0 text-sm focus:ring-0 placeholder:text-white/20"
                                                    />
                                                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">{c.hex}</div>
                                                </div>
                                                <button
                                                    onClick={() => removeColor(c.id)}
                                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                    <Info size={14} /> Auditor Notes
                                </h4>
                                <ul className="text-xs text-white/60 space-y-4">
                                    <li className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0" />
                                        <span><strong>AA (4.5:1)</strong>: Minimum requirement for normal text (18pt-).</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 shrink-0" />
                                        <span><strong>AAA (7.0:1)</strong>: Enhanced contrast for maximum accessibility.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                                        <span><strong>APCA (Lc)</strong>: Perceptual score. Aim for 75+ for body text.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Grid Visualization (9 cols) */}
                        <div className="lg:col-span-12 xl:col-span-9">
                            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[3rem] border border-white/10 shadow-2xl overflow-x-auto shadow shadow-white/5">
                                <table className="w-full border-separate border-spacing-2">
                                    <thead>
                                        <tr>
                                            <th className="p-4 text-left">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black uppercase text-white/20">Background ↓</span>
                                                    <span className="text-[10px] font-black uppercase text-white/20 whitespace-nowrap">Typography →</span>
                                                </div>
                                            </th>
                                            {colors.map(c => (
                                                <th key={`thead-${c.id}`} className="p-2 min-w-[120px]">
                                                    <div className="flex flex-col items-center gap-2 bg-white/5 py-4 rounded-3xl border border-white/5">
                                                        <div className="w-6 h-6 rounded-lg ring-2 ring-black/40" style={{ backgroundColor: c.hex }} />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 truncate w-20 text-center">{c.name}</span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {colors.map(rowColor => (
                                            <tr key={`row-${rowColor.id}`}>
                                                <td className="p-2">
                                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
                                                        <div className="w-8 h-8 rounded-xl ring-2 ring-black/40 shadow-lg shrink-0" style={{ backgroundColor: rowColor.hex }} />
                                                        <div className="truncate w-24">
                                                            <div className="text-xs font-black text-white/80 overflow-hidden text-ellipsis">{rowColor.name}</div>
                                                            <div className="text-[9px] font-mono text-white/20 uppercase">{rowColor.hex}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {colors.map(colColor => {
                                                    const ratio = getContrast(colColor.hex, rowColor.hex);
                                                    const apca = getAPCA(colColor.hex, rowColor.hex);
                                                    const { wcagLabel, wcagColor, absApca, pass } = getScore(ratio, apca);

                                                    const isSelf = rowColor.id === colColor.id;
                                                    const hidden = hideFails && !pass && !isSelf;

                                                    return (
                                                        <td key={`${rowColor.id}-${colColor.id}`} className="transition-all duration-300">
                                                            {isSelf ? (
                                                                <div className="w-full h-32 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                                </div>
                                                            ) : (
                                                                <motion.div
                                                                    initial={false}
                                                                    animate={{ opacity: hidden ? 0.2 : 1, scale: hidden ? 0.95 : 1 }}
                                                                    className={clsx(
                                                                        "w-full h-32 rounded-[2rem] flex flex-col items-center justify-center p-4 relative group cursor-default transition-all duration-300 border-2 border-transparent hover:border-white/10",
                                                                        !pass && "grayscale-[0.5]"
                                                                    )}
                                                                    style={{ backgroundColor: rowColor.hex }}
                                                                >
                                                                    {/* Text Sample */}
                                                                    <span
                                                                        className="text-2xl font-black mb-3 select-none transition-transform group-hover:scale-110"
                                                                        style={{ color: colColor.hex }}
                                                                    >
                                                                        Aa
                                                                    </span>

                                                                    {/* Score Badges */}
                                                                    <div className="flex flex-col gap-1.5 items-center w-full">
                                                                        <div className={clsx(
                                                                            "text-[9px] font-black px-2 py-0.5 rounded-full tracking-[0.05em] uppercase shadow-sm",
                                                                            wcagColor
                                                                        )}>
                                                                            {wcagLabel} {ratio.toFixed(1)}
                                                                        </div>
                                                                        <div className={clsx(
                                                                            "text-[8px] font-black opacity-40 uppercase tracking-[0.1em]",
                                                                            chroma(rowColor.hex).luminance() > 0.5 ? "text-black" : "text-white"
                                                                        )}>
                                                                            Lc {Math.round(absApca)}
                                                                        </div>
                                                                    </div>

                                                                    {/* Checkmark for Passes */}
                                                                    {pass && (
                                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <CheckCircle2 size={12} className={clsx(
                                                                                chroma(rowColor.hex).luminance() > 0.5 ? "text-green-600" : "text-green-400"
                                                                            )} />
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                            )}
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

                <ContrastGuide />

                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.02);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    .text-outline {
                        -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
                    }
                `}</style>
            </div>
        </DashboardLayout>
    );
}

export default function ContrastGridWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0b]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
            </div>
        </div>}>
            <ContrastGridContent />
        </Suspense>
    );
}
