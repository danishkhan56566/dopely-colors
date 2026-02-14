'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BrandGuide } from '@/components/content/AdvancedGuides';
import { Palette, Layers, Box, Type, MousePointer2, Smartphone, Monitor, Download, Copy, Check } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { HexColorPicker } from 'react-colorful';

export default function BrandPalettePage() {
    const [primary, setPrimary] = useState('#3B82F6');
    const [showPicker, setShowPicker] = useState(false);

    // 1. Semantic Token Generation
    const tokens = useMemo(() => {
        const p = chroma(primary);
        return {
            primary: primary,
            onPrimary: p.luminance() > 0.5 ? '#000000' : '#FFFFFF',
            primaryContainer: p.alpha(0.1).css(),
            secondary: p.set('hsl.h', '+30').hex(),
            tertiary: p.set('hsl.h', '+180').hex(),
            surface: '#FFFFFF',
            surfaceVariant: '#F3F4F6',
            background: '#FAFAFA',
            error: '#EF4444',
            success: '#22C55E'
        };
    }, [primary]);

    // 2. Scale Generation (50-950)
    const scale = useMemo(() => {
        return chroma.scale(['#fff', primary, '#000']).mode('lch').colors(11); // Simplified steps
    }, [primary]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                                <Palette size={20} />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">Brand Command Center</h1>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
                            <Download size={14} /> Export Tokens
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 mt-6">

                    {/* Left: Toggles & Map */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Primary Input */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core DNA</h3>
                            <div className="flex gap-4 items-start">
                                <div className="relative">
                                    <div
                                        className="w-16 h-16 rounded-xl shadow-inner cursor-pointer border-2 border-slate-100"
                                        style={{ backgroundColor: primary }}
                                        onClick={() => setShowPicker(!showPicker)}
                                    />
                                    {showPicker && (
                                        <div className="absolute top-full mt-2 left-0 z-50">
                                            <HexColorPicker color={primary} onChange={setPrimary} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-500 block mb-1">Primary Hex</label>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:ring-2 ring-blue-500/20">
                                        <span className="text-slate-400">#</span>
                                        <input
                                            type="text"
                                            value={primary.replace('#', '')}
                                            onChange={(e) => setPrimary('#' + e.target.value)}
                                            className="bg-transparent outline-none font-mono font-bold text-slate-700 w-full uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Semantic Map */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Token Map</h3>
                            <div className="space-y-4">
                                {Object.entries(tokens).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-lg -mx-2 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: value }} />
                                            <span className="text-sm font-medium capitalize text-slate-600">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </div>
                                        <span className="font-mono text-xs text-slate-400 group-hover:text-blue-500">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right: Live Preview */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* App Simulation */}
                        <div className="bg-slate-100 rounded-3xl p-2 border border-slate-200 shadow-inner overflow-hidden">
                            <div className="bg-white rounded-[1.2rem] overflow-hidden shadow-xl min-h-[500px] flex flex-col md:flex-row">

                                {/* Sidebar */}
                                <div className="w-64 bg-slate-50 border-r border-slate-100 p-6 hidden md:flex flex-col gap-8">
                                    <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                                        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: tokens.primary }} />
                                        BrandOS
                                    </div>
                                    <div className="space-y-1">
                                        {['Dashboard', 'Projects', 'Team', 'Settings'].map((item, i) => (
                                            <div key={item}
                                                className={cn("px-3 py-2 rounded-lg text-sm font-medium cursor-pointer", i === 0 ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:bg-slate-100")}
                                                style={i === 0 ? { color: tokens.primary } : {}}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 bg-white p-8">
                                    <header className="flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                                            <p className="text-slate-500 text-sm">Welcome back, Team.</p>
                                        </div>
                                        <button
                                            className="px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
                                            style={{ backgroundColor: tokens.primary, color: tokens.onPrimary }}
                                        >
                                            + New Project
                                        </button>
                                    </header>

                                    {/* Cards */}
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110" style={{ color: tokens.primary }}>
                                                <Layers size={64} />
                                            </div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Revenue</div>
                                            <div className="text-3xl font-black text-slate-900">$24,500</div>
                                            <div className="text-xs font-bold mt-2" style={{ color: tokens.success }}>+12% vs last month</div>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-slate-50">
                                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Users</div>
                                            <div className="text-3xl font-black text-slate-900">1,204</div>
                                        </div>
                                    </div>

                                    {/* Alert Component */}
                                    <div className="p-4 rounded-xl border flex items-center gap-4 mb-8" style={{ backgroundColor: tokens.primaryContainer, borderColor: tokens.primary + '30' }}>
                                        <div className="p-2 bg-white rounded-lg shadow-sm" style={{ color: tokens.primary }}>
                                            <Box size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-slate-900">System Update Available</div>
                                            <div className="text-xs opacity-70">A new version of the design system is ready.</div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* Generated Scale */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Generated Scale ({scale.length} Steps)</h3>
                            <div className="flex rounded-xl overflow-hidden h-16 shadow-inner">
                                {scale.map((color, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex items-end justify-center pb-2 group cursor-pointer hover:flex-[1.5] transition-all duration-300"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(color);
                                            toast.success(`Copied ${color}`);
                                        }}
                                    >
                                        <span className={cn("text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity", chroma(color).luminance() > 0.5 ? "text-black" : "text-white")}>
                                            {(i * 100) === 0 ? 50 : i * 100}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-6 mt-12 mb-20">
                    <BrandGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
