'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import chroma from 'chroma-js';
import { ArrowLeftRight, Check, X, RefreshCw, Copy, Info, Sparkles, AlertTriangle } from 'lucide-react';
import { ContrastGuide } from '@/components/content/PageGuides';
import { ContrastFAQ } from '@/components/content/PageFAQs';
import { Footer } from '@/components/layout/Footer';
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

    const getScoreColor = () => {
        switch (analysis.score) {
            case 'Excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'Good': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Poor': return 'text-orange-600 bg-orange-50 border-orange-200';
            default: return 'text-red-600 bg-red-50 border-red-200';
        }
    };

    const getRingColor = () => {
        switch (analysis.score) {
            case 'Excellent': return 'ring-emerald-500/20';
            case 'Good': return 'ring-blue-500/20';
            case 'Poor': return 'ring-orange-500/20';
            default: return 'ring-red-500/20';
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000" />
                </div>

                <div className="w-full max-w-7xl px-4 py-16 sm:px-6 relative z-10 space-y-16">

                    {/* Premium Header */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <Sparkles size={14} className="text-emerald-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                                Accessibility Suite V2.0
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                            Check <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 saturate-150 drop-shadow-sm">Contrast</span> <br className="hidden md:block" />
                            for Everyone
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 font-medium">
                            Ensure your designs are accessible to the world. <br className="hidden sm:block" />
                            Validate against <span className="text-gray-900 font-bold">WCAG Standards</span> instantly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">

                        {/* Left: Input & Controls */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-white/50 ring-1 ring-black/5">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Color Selection
                                    </h3>
                                    <div className="flex gap-2">
                                        <button onClick={randomize} className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-xl transition-all" title="Randomize">
                                            <RefreshCw size={20} />
                                        </button>
                                        <button onClick={swapColors} className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-xl transition-all" title="Swap Colors">
                                            <ArrowLeftRight size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Text Color Input */}
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Text Color</label>
                                        <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-2xl focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all bg-white shadow-sm group-hover:shadow-md">
                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-black/5 shadow-inner shrink-0 ring-4 ring-gray-50">
                                                <div className="absolute inset-0 transition-colors duration-300" style={{ backgroundColor: fgColor }} />
                                                <input
                                                    type="color"
                                                    value={fgColor}
                                                    onChange={(e) => setFgColor(e.target.value)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={fgColor.toUpperCase()}
                                                    onChange={(e) => setFgColor(e.target.value)}
                                                    className="w-full font-mono text-xl font-bold text-gray-900 outline-none uppercase bg-transparent"
                                                    maxLength={7}
                                                />
                                                <div className="text-xs text-gray-400 font-medium mt-0.5">HEX Code</div>
                                            </div>
                                            <button onClick={() => copyToClipboard(fgColor)} className="p-2 text-gray-400 hover:text-gray-900 shrink-0 hover:bg-gray-50 rounded-lg transition-colors">
                                                <Copy size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Background Color Input */}
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Background Color</label>
                                        <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-2xl focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all bg-white shadow-sm group-hover:shadow-md">
                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-black/5 shadow-inner shrink-0 ring-4 ring-gray-50">
                                                <div className="absolute inset-0 transition-colors duration-300" style={{ backgroundColor: bgColor }} />
                                                <input
                                                    type="color"
                                                    value={bgColor}
                                                    onChange={(e) => setBgColor(e.target.value)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={bgColor.toUpperCase()}
                                                    onChange={(e) => setBgColor(e.target.value)}
                                                    className="w-full font-mono text-xl font-bold text-gray-900 outline-none uppercase bg-transparent"
                                                    maxLength={7}
                                                />
                                                <div className="text-xs text-gray-400 font-medium mt-0.5">HEX Code</div>
                                            </div>
                                            <button onClick={() => copyToClipboard(bgColor)} className="p-2 text-gray-400 hover:text-gray-900 shrink-0 hover:bg-gray-50 rounded-lg transition-colors">
                                                <Copy size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WCAG Score Card */}
                            <div className={clsx(
                                "flex-1 rounded-[2rem] border shadow-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500",
                                getScoreColor(),
                                getRingColor(),
                                "ring-4 ring-offset-4 ring-offset-white/50"
                            )}>
                                <span className="relative z-10 text-current opacity-80 font-bold mb-3 uppercase tracking-widest text-sm">Contrast Ratio</span>
                                <div className="relative z-10 text-8xl font-black mb-4 font-mono tracking-tighter drop-shadow-sm">
                                    {analysis.ratio}
                                </div>
                                <div className={clsx(
                                    "relative z-10 inline-flex items-center px-6 py-2 rounded-full text-base font-bold bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm",
                                )}>
                                    {analysis.score === 'Fail' ? <AlertTriangle size={18} className="mr-2" /> : <Check size={18} className="mr-2" />}
                                    {analysis.score} Score
                                </div>
                            </div>
                        </div>

                        {/* Center: Visual Preview */}
                        <div className="lg:col-span-4 bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border-8 border-white ring-1 ring-black/5 flex flex-col transition-all duration-300 transform hover:scale-[1.01]" style={{ backgroundColor: bgColor }}>
                            <div className="flex-1 p-10 flex flex-col justify-center items-center text-center space-y-8" style={{ color: fgColor }}>
                                <div>
                                    <h2 className="text-7xl font-black mb-6 tracking-tight">Aa</h2>
                                    <p className="text-2xl font-bold leading-relaxed">
                                        The quick brown fox jumps over the lazy dog.
                                    </p>
                                </div>
                                <div className="h-px w-20 bg-current opacity-20" />
                                <p className="text-base font-medium opacity-80 max-w-xs mx-auto leading-relaxed">
                                    Good contrast improves readability for users with visual impairments and reduces eye strain for everyone.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 text-center text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: fgColor }}>
                                Live Preview
                            </div>
                        </div>

                        {/* Right: Compliance Details */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-white/50 ring-1 ring-black/5 h-full">
                                <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
                                    <Info size={18} className="text-blue-500" /> WCAG 2.1 Pass/Fail
                                </h3>

                                <div className="space-y-4">
                                    <ComplianceCard
                                        level="AA"
                                        type="Normal Text"
                                        passed={analysis.aaNormal}
                                        requirement="4.5:1"
                                        desc="For standard paragraph usage"
                                    />
                                    <ComplianceCard
                                        level="AA"
                                        type="Large Text"
                                        passed={analysis.aaLarge}
                                        requirement="3.0:1"
                                        desc="For headings >18pt (24px)"
                                    />
                                    <div className="h-px bg-gray-100 my-2" />
                                    <ComplianceCard
                                        level="AAA"
                                        type="Normal Text"
                                        passed={analysis.aaaNormal}
                                        requirement="7.0:1"
                                        desc="Gold standard for legal/gov"
                                    />
                                    <ComplianceCard
                                        level="AAA"
                                        type="Large Text"
                                        passed={analysis.aaaLarge}
                                        requirement="4.5:1"
                                        desc="High contrast headings"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <ContrastGuide />
                    <ContrastFAQ />
                </div>
                <Footer />
            </div>
        </DashboardLayout >
    );
}

function ComplianceCard({ level, type, passed, requirement, desc }: { level: string, type: string, passed: boolean, requirement: string, desc: string }) {
    return (
        <div className={clsx(
            "p-5 rounded-2xl border transition-all duration-300",
            passed
                ? "bg-green-50/50 border-green-100 hover:bg-green-50"
                : "bg-red-50/50 border-red-100 hover:bg-red-50"
        )}>
            <div className="flex items-start justify-between mb-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={clsx("font-black text-sm px-1.5 py-0.5 rounded", passed ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800")}>{level}</span>
                        <span className="font-bold text-gray-900 text-sm">{type}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{desc}</div>
                </div>
                <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                    passed ? "bg-white text-green-600" : "bg-white text-red-600"
                )}>
                    {passed ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                </div>
            </div>
            <div className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider text-right">Requires {requirement}</div>
        </div>
    )
}
