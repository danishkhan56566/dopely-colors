'use client';

import { useState, useMemo } from 'react';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { BrandGuide } from '@/components/content/AdvancedGuides';
import { Palette, Copy, Sparkles, LayoutPanelLeft, RefreshCw, Hexagon, Component, CheckCircle2, Moon, Sun, Download } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const PERSONALITIES = [
    { name: 'Modern Tech', desc: 'Analogous harmony, clean contrast', type: 'analogous' },
    { name: 'Luxury Minimal', desc: 'Monochromatic, deep tones', type: 'monochromatic' },
    { name: 'Bold Startup', desc: 'Complementary pops, high energy', type: 'complementary' },
    { name: 'Creative Agency', desc: 'Triadic balance, vibrant', type: 'triadic' }
];

interface ColorToken {
    name: string;
    hex: string;
    usage: string;
    isDarkText: boolean;
}

export default function BrandPalettePage() {
    const [baseColor, setBaseColor] = useState('#3B82F6');
    const [personality, setPersonality] = useState(PERSONALITIES[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

    // Core Generated System
    const [system, setSystem] = useState<{
        semantic: { primary: ColorToken, secondary: ColorToken, accent: ColorToken, background: ColorToken, surface: ColorToken },
        scale: { step: number, hex: string }[]
    } | null>(null);

    const generateSystem = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const primary = chroma(baseColor);

            // Logic based on personality
            let secondary, accent;
            if (personality.type === 'analogous') {
                secondary = primary.set('hsl.h', '+30');
                accent = primary.set('hsl.h', '-30');
            } else if (personality.type === 'monochromatic') {
                secondary = primary.darken(1.5).saturate(0.5);
                accent = primary.brighten(1.5);
            } else if (personality.type === 'complementary') {
                secondary = primary.set('hsl.h', '+180').desaturate(0.5);
                accent = primary.set('hsl.h', '+180').saturate(1);
            } else { // triadic
                secondary = primary.set('hsl.h', '+120');
                accent = primary.set('hsl.h', '-120');
            }

            // Semantic Background/Surface adapted for current theme
            const isDark = themeMode === 'dark';

            // Tint the backgrounds slightly with the primary color for a premium feel
            const bgHex = isDark
                ? chroma.mix('#050505', primary, 0.03).hex()
                : chroma.mix('#ffffff', primary, 0.02).hex();

            const surfaceHex = isDark
                ? chroma.mix('#121212', primary, 0.05).hex()
                : chroma.mix('#f8f9fa', primary, 0.04).hex();

            // Generate 50-900 Scale (Tailwind style)
            const scale = [];
            for (let i = 1; i <= 9; i++) {
                const step = i * 100;
                // 500 is the base color
                let hex;
                if (step === 500) {
                    hex = primary.hex();
                } else if (step < 500) {
                    // Lighter shades (50 to 400)
                    const lightenAmount = ((500 - step) / 100) * 0.4;
                    hex = primary.brighten(lightenAmount).hex();
                } else {
                    // Darker shades (600 to 900)
                    const darkenAmount = ((step - 500) / 100) * 0.4;
                    hex = primary.darken(darkenAmount).hex();
                }
                // Add 50
                if (i === 1) {
                    scale.push({ step: 50, hex: primary.brighten(2).hex() });
                }
                scale.push({ step, hex });
            }

            const checkLuma = (c: string) => chroma(c).luminance() > 0.5;

            setSystem({
                semantic: {
                    primary: { name: 'Brand Primary', hex: primary.hex(), usage: 'Main CTA, brand identity', isDarkText: checkLuma(primary.hex()) },
                    secondary: { name: 'Secondary', hex: secondary.hex(), usage: 'Supporting elements, active states', isDarkText: checkLuma(secondary.hex()) },
                    accent: { name: 'Accent highlight', hex: accent.hex(), usage: 'Badges, unread indicators, special focus', isDarkText: checkLuma(accent.hex()) },
                    background: { name: 'App Background', hex: bgHex, usage: 'Main html/body background', isDarkText: checkLuma(bgHex) },
                    surface: { name: 'Surface Core', hex: surfaceHex, usage: 'Cards, modals, dropdowns', isDarkText: checkLuma(surfaceHex) },
                },
                scale
            });

            setIsGenerating(false);
            toast.success("Brand Color System Assembled");
        }, 800);
    };

    const copyHex = (hex: string) => {
        navigator.clipboard.writeText(hex);
        toast.success(`Copied ${hex}`);
    };

    // Auto-regenerate if theme changes and we already have a system
    useMemo(() => {
        if (system) {
            generateSystem();
        }
    }, [themeMode]);

    return (
        <PremiumToolLayout
            title="Brand Palette Maker"
            description="Build a complete, scalable brand color system in seconds. From a single base color, generate semantic roles, accessibility-safe contrasts, and comprehensive scaling tokens."
            icon={Sparkles}
            badgeText="Identity Engineering"
            guide={(
                <div className="max-w-7xl mx-auto px-6 mt-12 pb-24 relative z-10">
                    <BrandGuide />
                </div>
            )}
        >
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Side: Builder Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white/50 ring-1 ring-black/5 space-y-8">

                        {/* DNA Input */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                <Hexagon size={18} className="text-blue-500" />
                                <h2>1. Brand DNA Color</h2>
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-inner border border-gray-200 cursor-pointer">
                                    <input
                                        type="color"
                                        value={baseColor}
                                        onChange={(e) => setBaseColor(e.target.value)}
                                        className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={baseColor.toUpperCase()}
                                    onChange={(e) => setBaseColor(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-2xl font-bold text-gray-900 focus:outline-none focus:ring-0 uppercase font-mono tracking-wider"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-3 font-medium">Pick your primary brand identifier.</p>
                        </div>

                        <div className="w-full h-px bg-gray-200/50 my-2" />

                        {/* Personality Setup */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                <LayoutPanelLeft size={18} className="text-blue-500" />
                                <h2>2. Brand Personality</h2>
                            </div>

                            <div className="space-y-3">
                                {PERSONALITIES.map(p => (
                                    <button
                                        key={p.name}
                                        onClick={() => setPersonality(p)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-1",
                                            personality.name === p.name
                                                ? "bg-blue-50 border-blue-200 shadow-sm scale-[1.02]"
                                                : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
                                        )}
                                    >
                                        <span className={cn("font-bold", personality.name === p.name ? "text-blue-900" : "text-gray-900")}>
                                            {p.name}
                                        </span>
                                        <span className={cn("text-xs font-medium", personality.name === p.name ? "text-blue-600" : "text-gray-500")}>
                                            {p.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action */}
                        <button
                            onClick={generateSystem}
                            disabled={isGenerating}
                            className={cn(
                                "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed",
                                isGenerating ? "bg-blue-600 shadow-blue-500/20 text-white" : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-gray-900/20 hover:-translate-y-0.5"
                            )}
                        >
                            {isGenerating ? (
                                <><RefreshCw className="animate-spin" size={20} /> Compiling System...</>
                            ) : (
                                <><Component size={20} /> Build Color System</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side: Output Canvas */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {system ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                {/* Semantic Palette Controls */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Semantic Architecture</h3>

                                    <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                                        <button
                                            onClick={() => setThemeMode('light')}
                                            className={cn("px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors", themeMode === 'light' ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900")}
                                        >
                                            <Sun size={16} /> Light
                                        </button>
                                        <button
                                            onClick={() => setThemeMode('dark')}
                                            className={cn("px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors", themeMode === 'dark' ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-900")}
                                        >
                                            <Moon size={16} /> Dark
                                        </button>
                                    </div>
                                </div>

                                {/* Environment Preview Card */}
                                <div
                                    className="p-8 md:p-12 rounded-[2rem] shadow-xl border border-black/5 relative overflow-hidden transition-colors duration-500"
                                    style={{ backgroundColor: system.semantic.background.hex }}
                                >
                                    <div className="max-w-xl mx-auto space-y-8">
                                        {/* Header in Preview */}
                                        <div>
                                            <h2 className="text-3xl font-black mb-2" style={{ color: system.semantic.background.isDarkText ? '#111827' : '#F9FAFB' }}>
                                                {personality.name} Identity
                                            </h2>
                                            <p className="font-medium opacity-70" style={{ color: system.semantic.background.isDarkText ? '#4B5563' : '#9CA3AF' }}>
                                                This area previews exactly how your background and surface colors interact.
                                            </p>
                                        </div>

                                        {/* Surface Cards Preview */}
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {Object.entries(system.semantic).filter(([key]) => ['primary', 'secondary', 'accent'].includes(key)).map(([key, token]) => (
                                                <div
                                                    key={key}
                                                    className="p-6 rounded-2xl shadow-lg border border-black/5"
                                                    style={{ backgroundColor: system.semantic.surface.hex }}
                                                >
                                                    <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: token.hex }} onClick={() => copyHex(token.hex)}>
                                                        <span className="opacity-0 hover:opacity-100" style={{ color: token.isDarkText ? '#000' : '#fff' }}><Copy size={16} /></span>
                                                    </div>
                                                    <h4 className="font-bold mb-1 capitalize" style={{ color: system.semantic.surface.isDarkText ? '#111827' : '#F9FAFB' }}>{token.name}</h4>
                                                    <p className="text-xs font-semibold opacity-60" style={{ color: system.semantic.surface.isDarkText ? '#4B5563' : '#9CA3AF' }}>{token.usage}</p>
                                                    <div className="mt-4 text-xs font-mono font-bold tracking-widest uppercase opacity-40 inline-block" style={{ color: system.semantic.surface.isDarkText ? '#000' : '#fff' }}>{token.hex}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Scale 50-900 Generator */}
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Primary Scale tokens</h3>
                                            <p className="text-sm text-gray-500 font-medium">Ready for Tailwind CSS</p>
                                        </div>
                                        <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                                            <Download size={16} /> Export JSON
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {system.scale.map((shade) => {
                                            const isDarkText = chroma(shade.hex).luminance() > 0.5;
                                            return (
                                                <div
                                                    key={shade.step}
                                                    onClick={() => copyHex(shade.hex)}
                                                    className="group flex items-center justify-between p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all duration-200"
                                                    style={{ backgroundColor: shade.hex }}
                                                >
                                                    <span className="font-bold tracking-widest text-sm" style={{ color: isDarkText ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' }}>
                                                        {shade.step}
                                                    </span>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: isDarkText ? '#000' : '#fff' }}>Copy</span>
                                                        <Copy size={16} style={{ color: isDarkText ? '#000' : '#fff' }} />
                                                    </div>
                                                    <span className="font-mono font-bold text-sm uppercase tracking-wider" style={{ color: isDarkText ? '#000' : '#fff' }}>
                                                        {shade.hex}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-300">
                                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 border border-blue-100 shadow-inner">
                                    <Component className="text-blue-500" size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Awaiting Brand DNA</h2>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">
                                    Enter your base color and select a personality on the left to instantly build a complete design system.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PremiumToolLayout>
    );
}

