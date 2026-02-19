'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Grid, Plus, X, Copy, Download, Share2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ContrastGuide } from '@/components/content/ContrastGuide';
// @ts-ignore
import { calcAPCA, sRGBtoY, colorParsley } from 'apca-w3';
import { useSearchParams, useRouter } from 'next/navigation';

export const metadata = {
    title: 'Contrast Grid - Check WCAG & APCA Contrast Matrices | Dopely Colors',
    description: 'Visualize accessibility compliance across your entire color palette. Check WCAG 2.1 (AA/AAA) and APCA contrast scores in a grid format.',
    alternates: {
        canonical: '/tools/contrast-grid',
    },
};

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
    }, []);

    // ... rest of the component logic ...

    // Sync to URL on change
    const shareUrl = () => {
        try {
            const encoded = btoa(JSON.stringify(colors));
            const url = `${window.location.origin}${window.location.pathname}?palette=${encoded}`;
            navigator.clipboard.writeText(url);
            toast.success('Shareable link copied to clipboard!');

            // Optimistically update URL without reload
            router.replace(`?palette=${encoded}`, { scroll: false });
        } catch (e) {
            toast.error('Failed to generate link');
        }
    };

    const addColor = () => {
        setColors([...colors, {
            id: Math.random().toString(36),
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

    // WCAG 2.1 Ratio
    const getContrast = (fg: string, bg: string) => {
        try {
            return chroma.contrast(fg, bg);
        } catch {
            return 0;
        }
    };

    // APCA Lc Score
    const getAPCA = (fg: string, bg: string) => {
        try {
            // calcAPCA handles parsing of hex strings internally via colorParsley
            return calcAPCA(fg, bg);
        } catch (e) {
            console.error(e);
            return 0;
        }
    };

    const getScore = (ratio: number, apca: number) => {
        const absApca = Math.abs(apca);
        let wcagLabel = 'Fail';
        let wcagColor = 'bg-red-100 text-red-700';

        if (ratio >= 7) { wcagLabel = 'AAA'; wcagColor = 'bg-green-100 text-green-700'; }
        else if (ratio >= 4.5) { wcagLabel = 'AA'; wcagColor = 'bg-blue-100 text-blue-700'; }
        else if (ratio >= 3) { wcagLabel = 'AA+'; wcagColor = 'bg-yellow-100 text-yellow-700'; }

        // APCA Rating (Simplified)
        // 90+ Preferred for body text
        // 75+ Minimum for body text
        // 60+ Minimum for large text
        // 45+ Minimum for large headings/icons
        let apcaLabel = 'Fail';
        if (absApca >= 90) apcaLabel = 'Excellent';
        else if (absApca >= 75) apcaLabel = 'Good';
        else if (absApca >= 60) apcaLabel = 'Large Text';
        else if (absApca >= 45) apcaLabel = 'Big Text';
        else if (absApca >= 30) apcaLabel = 'Spot';

        return { wcagLabel, wcagColor, apcaLabel, absApca };
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-gray-900 rounded-2xl text-white">
                            <Grid size={32} />
                        </div>
                        Contrast Grid 2.0
                    </h1>
                    <p className="text-gray-500 text-lg mb-6">
                        Visualize accessibility compliance (WCAG & APCA) across your entire palette.
                    </p>
                    <button
                        onClick={shareUrl}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 shadow-sm rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all"
                    >
                        <Share2 size={16} /> Share Palette
                    </button>
                </div>

                <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Controls */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Palette Colors</h3>
                                <button onClick={addColor} className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-lg hover:bg-black transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {colors.map(c => (
                                    <div key={c.id} className="flex gap-2 items-center group">
                                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-sm">
                                            <input type="color" value={c.hex} onChange={(e) => updateColor(c.id, { hex: e.target.value })} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer" />
                                        </div>
                                        <input
                                            type="text"
                                            value={c.name}
                                            onChange={(e) => updateColor(c.id, { name: e.target.value })}
                                            className="flex-1 min-w-0 px-3 py-2 text-sm font-medium rounded-lg border border-transparent hover:border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none bg-transparent transition-all"
                                        />
                                        <button onClick={() => removeColor(c.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white rounded-lg shadow-sm">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <AlertCircle size={16} /> Understanding Scores
                            </h4>
                            <ul className="text-xs text-blue-800 space-y-2 opacity-80">
                                <li><strong>WCAG (AA/AAA):</strong> Current standard. Checks ratio between colors.</li>
                                <li><strong>APCA (Lc):</strong> New perceptual standard. Checks estimated readability.
                                    <ul className="pl-3 mt-1 space-y-1 list-disc">
                                        <li>Lc 90+: Preferred body text</li>
                                        <li>Lc 75+: Minimum body text</li>
                                        <li>Lc 60+: Large text / inputs</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Grid Visualization */}
                    <div className="lg:col-span-9">
                        <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 text-left font-bold text-gray-400 text-xs uppercase tracking-wider sticky left-0 bg-white z-20">Background <span className="text-gray-300">↓</span></th>
                                        {colors.map(c => (
                                            <th key={c.id} className="p-4 min-w-[140px]">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: c.hex }} />
                                                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{c.name}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {colors.map(rowColor => (
                                        <tr key={rowColor.id}>
                                            <td className="p-4 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl border border-gray-200 shadow-sm" style={{ backgroundColor: rowColor.hex }} />
                                                    <span className="text-xs font-bold text-gray-900 w-24 truncate">{rowColor.name}</span>
                                                </div>
                                            </td>
                                            {colors.map(colColor => {
                                                const ratio = getContrast(colColor.hex, rowColor.hex);
                                                const apca = getAPCA(colColor.hex, rowColor.hex);
                                                const { wcagLabel, wcagColor, apcaLabel, absApca } = getScore(ratio, apca);

                                                const isSelf = rowColor.id === colColor.id;

                                                return (
                                                    <td key={colColor.id} className="p-2 align-top">
                                                        {isSelf ? (
                                                            <div className="w-full aspect-[4/3] rounded-2xl bg-gray-50 flex items-center justify-center opacity-20">
                                                                <span className="text-2xl font-black">×</span>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="w-full aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-transform hover:scale-105 p-2 text-center"
                                                                style={{ backgroundColor: rowColor.hex }}
                                                            >
                                                                <span className="text-xl font-bold" style={{ color: colColor.hex }}>Aa</span>

                                                                <div className="flex flex-col gap-1 w-full items-center">
                                                                    <span className={clsx("text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide", wcagColor)}>
                                                                        {wcagLabel} {ratio.toFixed(1)}
                                                                    </span>
                                                                    <span className={clsx("text-[9px] font-bold opacity-80",
                                                                        // Dynamic text color for the score label itself depending on bg
                                                                        chroma(rowColor.hex).luminance() > 0.5 ? "text-black" : "text-white"
                                                                    )}>
                                                                        APCA {Math.round(absApca)}
                                                                    </span>
                                                                </div>
                                                            </div>
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
                <ContrastGuide />
            </div>
        </DashboardLayout>
    );
}

export default function ContrastGridPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>}>
            <ContrastGridContent />
        </Suspense>
    );
}
