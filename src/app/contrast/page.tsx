'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import chroma from 'chroma-js';
import { ArrowLeftRight, Check, X, RefreshCw, Copy, Info } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function ContrastCheckerPage() {
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');

    const analysis = useMemo(() => {
        let contrast = 1;
        try {
            contrast = chroma.contrast(fgColor, bgColor);
        } catch (e) {
            // invalid color
        }

        const score = contrast >= 7 ? 'Excellent' : contrast >= 4.5 ? 'Good' : contrast >= 3 ? 'Poor' : 'Fail';

        return {
            ratio: contrast.toFixed(2),
            score,
            aaNormal: contrast >= 4.5,
            aaLarge: contrast >= 3,
            aaaNormal: contrast >= 7,
            aaaLarge: contrast >= 4.5
        };
    }, [fgColor, bgColor]);

    const swapColors = () => {
        setFgColor(bgColor);
        setBgColor(fgColor);
    };

    const randomize = () => {
        setFgColor(chroma.random().hex());
        setBgColor(chroma.random().hex());
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text}`);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">

                {/* Header */}
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contrast Checker</h1>
                    <p className="text-gray-500 text-lg">
                        Ensure your designs are accessible to everyone. Check color contrast ratios against WCAG standards instantly.
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left: Input & Preview */}
                    <div className="flex flex-col gap-6">

                        {/* Controls */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900">Colors</h3>
                                <div className="flex gap-2">
                                    <button onClick={randomize} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Randomize">
                                        <RefreshCw size={18} />
                                    </button>
                                    <button onClick={swapColors} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Swap Colors">
                                        <ArrowLeftRight size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Text Color Input */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Text Color</label>
                                    <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-xl focus-within:ring-2 ring-blue-500/20 transition-all bg-white">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-black/5 shadow-inner shrink-0">
                                            <div className="absolute inset-0" style={{ backgroundColor: fgColor }} />
                                            <input
                                                type="color"
                                                value={fgColor}
                                                onChange={(e) => setFgColor(e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="flex-1 font-mono text-gray-700 outline-none uppercase min-w-0"
                                            maxLength={7}
                                        />
                                        <button onClick={() => copyToClipboard(fgColor)} className="p-2 text-gray-400 hover:text-gray-600 shrink-0">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Background Color Input */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Background Color</label>
                                    <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-xl focus-within:ring-2 ring-blue-500/20 transition-all bg-white">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-black/5 shadow-inner shrink-0">
                                            <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
                                            <input
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="flex-1 font-mono text-gray-700 outline-none uppercase min-w-0"
                                            maxLength={7}
                                        />
                                        <button onClick={() => copyToClipboard(bgColor)} className="p-2 text-gray-400 hover:text-gray-600 shrink-0">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Preview */}
                        <div
                            className="flex-1 min-h-[300px] rounded-3xl shadow-sm border border-black/5 flex flex-col items-center justify-center p-8 transition-colors duration-300"
                            style={{ backgroundColor: bgColor, color: fgColor }}
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">Aa</h2>
                            <p className="text-lg md:text-xl font-medium text-center max-w-md">
                                The quick brown fox jumps over the lazy dog.
                            </p>
                            <p className="mt-8 text-sm opacity-60">
                                This is regular text for context.
                            </p>
                        </div>
                    </div>

                    {/* Right: Results & Scores */}
                    <div className="flex flex-col gap-6">

                        {/* Score Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className={clsx(
                                "absolute top-0 left-0 w-full h-2",
                                analysis.score === 'Excellent' ? "bg-green-500" :
                                    analysis.score === 'Good' ? "bg-blue-500" :
                                        analysis.score === 'Poor' ? "bg-orange-500" : "bg-red-500"
                            )} />

                            <span className="text-gray-500 font-medium mb-2 uppercase tracking-wide text-sm">Contrast Ratio</span>
                            <div className="text-6xl md:text-7xl font-black text-gray-900 mb-2 font-mono tracking-tighter">
                                {analysis.ratio}:1
                            </div>
                            <div className={clsx(
                                "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold",
                                analysis.score === 'Excellent' ? "bg-green-100 text-green-700" :
                                    analysis.score === 'Good' ? "bg-blue-100 text-blue-700" :
                                        analysis.score === 'Poor' ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                            )}>
                                {analysis.score} Score
                            </div>
                        </div>

                        {/* WCAG Breakdown */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Info size={18} className="text-gray-400" /> WCAG 2.1 Compliance
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ComplianceCard
                                    level="AA"
                                    type="Normal Text"
                                    passed={analysis.aaNormal}
                                    requirement="4.5:1"
                                />
                                <ComplianceCard
                                    level="AA"
                                    type="Large Text"
                                    passed={analysis.aaLarge}
                                    requirement="3.0:1"
                                />
                                <ComplianceCard
                                    level="AAA"
                                    type="Normal Text"
                                    passed={analysis.aaaNormal}
                                    requirement="7.0:1"
                                />
                                <ComplianceCard
                                    level="AAA"
                                    type="Large Text"
                                    passed={analysis.aaaLarge}
                                    requirement="4.5:1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function ComplianceCard({ level, type, passed, requirement }: { level: string, type: string, passed: boolean, requirement: string }) {
    return (
        <div className={clsx(
            "p-4 rounded-xl border flex items-center justify-between",
            passed ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
        )}>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{level}</span>
                    <span className="text-sm text-gray-500">{type}</span>
                </div>
                <div className="text-xs text-gray-400 font-mono">Requires {requirement}</div>
            </div>
            <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center",
                passed ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
            )}>
                {passed ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
            </div>
        </div>
    )
}
