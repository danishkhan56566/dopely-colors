'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Moon, Sun, Copy, RefreshCw, ArrowRightLeft, Code2, LayoutTemplate } from 'lucide-react';
import chroma from 'chroma-js';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DarkModeGuide } from '@/components/content/DevGuides';
import clsx from 'clsx';

// Type definition for generated palette
type DarkTheme = {
    bg: {
        900: string; // Main background
        800: string; // Secondary / Cards
        700: string; // Borders / Inputs
    };
    text: {
        primary: string;
        secondary: string;
        muted: string;
    };
    primary: {
        base: string;
        hover: string;
        active: string;
    };
    accent: string;
};

export default function DarkModeGenerator() {
    const [brandColor, setBrandColor] = useState('#3b82f6');
    const [preserveBrand, setPreserveBrand] = useState(true); // If true, keeps hue. If false, might desaturate more.
    const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('dark');

    // --- Generation Logic ---
    const darkTheme = useMemo<DarkTheme>(() => {
        try {
            const primary = chroma(brandColor);

            // 1. Generate Backgrounds (Neutral but tinted slightly with brand hue)
            // We want deep slates, not pure black, usually.
            // Tinting with brand color gives a "premium" feel.
            const bgBase = primary.set('hsl.l', 0.05).set('hsl.s', 0.1);

            // 2. Generate Text
            const textBase = chroma('#ffffff');

            // 3. Process Primary Brand Color for Dark Mode
            // Often needs to be lighter/desaturated to pass contrast on dark bg, 
            // OR kept vibrant if used as buttons.
            // Let's ensure it pops against bg900.
            let darkPrimary = primary;

            // If it's too dark, lighten it.
            if (chroma.contrast(darkPrimary, bgBase) < 4.5) {
                darkPrimary = darkPrimary.brighten(1.5);
            }

            // Optional: Reduce chroma if it's neon
            if (!preserveBrand && darkPrimary.get('oklch.c') > 0.15) {
                darkPrimary = darkPrimary.set('oklch.c', 0.15);
            }

            return {
                bg: {
                    900: bgBase.hex(),
                    800: bgBase.brighten(0.3).hex(), // Cards
                    700: bgBase.brighten(0.8).hex(), // Borders
                },
                text: {
                    primary: textBase.alpha(0.95).css(),
                    secondary: textBase.alpha(0.7).css(),
                    muted: textBase.alpha(0.4).css(),
                },
                primary: {
                    base: darkPrimary.hex(),
                    hover: darkPrimary.brighten(0.2).hex(),
                    active: darkPrimary.darken(0.1).hex(),
                },
                accent: primary.set('hsl.h', '+180').hex() // Complementary
            };
        } catch (e) {
            // Fallback
            return {
                bg: { 900: '#0f172a', 800: '#1e293b', 700: '#334155' },
                text: { primary: '#f8fafc', secondary: '#cbd5e1', muted: '#94a3b8' },
                primary: { base: '#3b82f6', hover: '#60a5fa', active: '#2563eb' },
                accent: '#f59e0b'
            };
        }
    }, [brandColor, preserveBrand]);

    // Mock Light Theme for comparison
    const lightTheme = useMemo(() => {
        return {
            bg: '#ffffff',
            card: '#f8fafc',
            text: '#0f172a',
            primary: brandColor,
        };
    }, [brandColor]);

    // Export Handlers
    const exportCSS = () => {
        const css = `
:root.dark {
  --bg-900: ${darkTheme.bg[900]};
  --bg-800: ${darkTheme.bg[800]};
  --bg-700: ${darkTheme.bg[700]};
  
  --text-primary: ${darkTheme.text.primary};
  --text-secondary: ${darkTheme.text.secondary};
  --text-muted: ${darkTheme.text.muted};
  
  --primary-base: ${darkTheme.primary.base};
  --primary-hover: ${darkTheme.primary.hover};
  --primary-active: ${darkTheme.primary.active};
}`;
        navigator.clipboard.writeText(css.trim());
        toast.success("Copied CSS Variables");
    };

    const exportTailwind = () => {
        const config = `
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        dark: {
          900: '${darkTheme.bg[900]}',
          800: '${darkTheme.bg[800]}',
          700: '${darkTheme.bg[700]}',
        },
        primary: {
          DEFAULT: '${darkTheme.primary.base}',
          hover: '${darkTheme.primary.hover}',
          active: '${darkTheme.primary.active}',
        }
      }
    }
  }
}`;
        navigator.clipboard.writeText(config.trim());
        toast.success("Copied Tailwind Config");
    };


    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center">

                {/* Hero Section */}
                <div className="w-full bg-white border-b border-gray-200 px-6 py-12 md:py-20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-slate-900/20">
                            <Moon size={14} className="text-blue-400" /> Developer Tools
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
                            Dark Mode Generator
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
                            Don&apos;t just invert colors. Generate a perceptually balanced, accessible dark theme from your brand identity.
                        </p>
                    </div>
                </div>

                <div className="w-full max-w-7xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Controls Sidebar */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Input Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <LayoutTemplate size={18} /> Source Brand
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Primary Color</label>
                                    <div className="flex gap-3 items-center">
                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                                            <input
                                                type="color"
                                                value={brandColor}
                                                onChange={(e) => setBrandColor(e.target.value)}
                                                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-mono text-sm uppercase font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer" onClick={() => setPreserveBrand(!preserveBrand)}>
                                    <span className="text-sm font-bold text-slate-700">Preserve Vibrancy</span>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${preserveBrand ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${preserveBrand ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {preserveBrand ? "Keeps saturation high. Good for buttons." : "Desaturates slightly for reduced eye strain."}
                                </p>
                            </div>
                        </div>

                        {/* Results / Export */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Code2 size={18} /> Export Code
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={exportCSS} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Code2 size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">CSS Vars</span>
                                </button>
                                <button onClick={exportTailwind} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <RefreshCw size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">Tailwind</span>
                                </button>
                            </div>
                        </div>

                    </div>


                    {/* Interactive Preview */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-200 h-[600px] flex flex-col">

                            {/* Toolbar */}
                            <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50/50 backdrop-blur">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Live Preview</span>
                                <div className="flex bg-gray-200 p-1 rounded-full">
                                    <button
                                        onClick={() => setPreviewMode('light')}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${previewMode === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Sun size={12} /> Light
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode('dark')}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${previewMode === 'dark' ? 'bg-slate-800 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Moon size={12} /> Dark
                                    </button>
                                </div>
                            </div>

                            {/* Mockup Canvas */}
                            <div className="flex-1 relative overflow-hidden transition-colors duration-500">

                                <AnimatePresence mode="wait">
                                    {previewMode === 'dark' ? (
                                        <motion.div
                                            key="dark"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 p-8 flex flex-col gap-6"
                                            style={{ backgroundColor: darkTheme.bg[900], color: darkTheme.text.primary }}
                                        >
                                            {/* Mock Header */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                                        <div className="w-4 h-4 bg-white rounded-full" />
                                                    </div>
                                                    <div className="font-bold text-lg">Dashboard</div>
                                                </div>
                                                <div className="h-10 w-10 rounded-full" style={{ backgroundColor: darkTheme.bg[800] }} />
                                            </div>

                                            {/* Mock Stats Grid */}
                                            <div className="grid grid-cols-3 gap-6">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="p-6 rounded-2xl flex flex-col gap-4" style={{ backgroundColor: darkTheme.bg[800], border: `1px solid ${darkTheme.bg[700]}` }}>
                                                        <div className="flex justify-between items-start">
                                                            <div className="h-8 w-8 rounded-lg opacity-20" style={{ backgroundColor: darkTheme.primary.base }} />
                                                            <div className="text-xs font-bold opacity-50">+12%</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-black">$24,500</div>
                                                            <div className="text-sm opacity-50">Total Revenue</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Mock Chart Area */}
                                            <div className="flex-1 rounded-2xl p-6 flex flex-col" style={{ backgroundColor: darkTheme.bg[800], border: `1px solid ${darkTheme.bg[700]}` }}>
                                                <div className="flex justify-between mb-8">
                                                    <h4 className="font-bold">Analytics</h4>
                                                    <div className="flex gap-2">
                                                        <div className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: darkTheme.primary.base, color: darkTheme.text.primary }}>Week</div>
                                                        <div className="px-3 py-1 rounded-lg text-xs font-bold opacity-50 hover:bg-white/5">Month</div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex items-end gap-4 px-4 pb-2">
                                                    {[40, 70, 45, 90, 60, 85, 55].map((h, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex-1 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                                                            style={{
                                                                height: `${h}%`,
                                                                backgroundColor: i === 3 ? darkTheme.primary.base : darkTheme.bg[700]
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <button
                                                className="w-full py-4 rounded-xl font-bold text-center transition-transform hover:scale-[1.02] shadow-lg"
                                                style={{ backgroundColor: darkTheme.primary.base, color: '#ffffff' }}
                                            >
                                                Upgrade Plan
                                            </button>

                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="light"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-slate-50 p-8 flex flex-col gap-6"
                                        >
                                            {/* Mock Header */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                                        <div className="w-4 h-4 bg-white rounded-full" />
                                                    </div>
                                                    <div className="font-bold text-lg text-slate-900">Dashboard</div>
                                                </div>
                                                <div className="h-10 w-10 rounded-full bg-white border border-gray-200" />
                                            </div>

                                            {/* Mock Stats Grid */}
                                            <div className="grid grid-cols-3 gap-6">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="p-6 rounded-2xl flex flex-col gap-4 bg-white border border-gray-200 shadow-sm">
                                                        <div className="flex justify-between items-start">
                                                            <div className="h-8 w-8 rounded-lg bg-gray-100" />
                                                            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-black text-slate-900">$24,500</div>
                                                            <div className="text-sm text-slate-400">Total Revenue</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Mock Chart Area */}
                                            <div className="flex-1 rounded-2xl p-6 flex flex-col bg-white border border-gray-200 shadow-sm">
                                                <div className="flex justify-between mb-8">
                                                    <h4 className="font-bold text-slate-900">Analytics</h4>
                                                    <div className="flex gap-2">
                                                        <div className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white">Week</div>
                                                        <div className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500">Month</div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex items-end gap-4 px-4 pb-2">
                                                    {[40, 70, 45, 90, 60, 85, 55].map((h, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex-1 rounded-t-lg transition-opacity"
                                                            style={{
                                                                height: `${h}%`,
                                                                backgroundColor: i === 3 ? lightTheme.primary : '#e2e8f0'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <button
                                                className="w-full py-4 rounded-xl font-bold text-center transition-transform hover:scale-[1.02] shadow-xl shadow-blue-500/20 text-white"
                                                style={{ backgroundColor: lightTheme.primary }}
                                            >
                                                Upgrade Plan
                                            </button>

                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
