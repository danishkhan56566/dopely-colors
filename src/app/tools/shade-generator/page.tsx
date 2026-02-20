'use client';

import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Pointer, Copy, Code2, Sparkles, Eye, Smartphone, Layout, Check, Info, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { ShadeGuide } from '@/components/content/UtilityGuides';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type StateMode = 'light' | 'dark';

interface ButtonStates {
    base: string;
    hover: string;
    active: string;
    disabled: string;
    focus: string;
    text: string;
    contrast: number;
}

export default function StateGenerator() {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [mode, setMode] = useState<StateMode>('light');
    const [copied, setCopied] = useState<string | null>(null);

    // Advanced state generation logic
    const states = useMemo((): ButtonStates => {
        try {
            const root = chroma(baseColor);
            const isDarkColor = root.luminance() < 0.5;

            // Text color for the button
            const text = root.luminance() > 0.5 ? '#000000' : '#ffffff';
            const contrast = chroma.contrast(baseColor, text);

            if (mode === 'light') {
                return {
                    base: baseColor,
                    hover: root.darken(0.4).hex(),
                    active: root.darken(0.8).hex(),
                    disabled: root.desaturate(1.5).alpha(0.4).css(),
                    focus: root.alpha(0.2).css(),
                    text,
                    contrast
                };
            } else {
                // Dark mode logic: states usually get lighter or more vibrant
                return {
                    base: baseColor,
                    hover: root.brighten(0.4).hex(),
                    active: root.brighten(0.8).hex(),
                    disabled: root.desaturate(1.5).alpha(0.3).css(),
                    focus: root.alpha(0.4).css(),
                    text,
                    contrast
                };
            }
        } catch {
            return {
                base: baseColor, hover: baseColor, active: baseColor,
                disabled: baseColor, focus: baseColor, text: '#ffffff', contrast: 0
            };
        }
    }, [baseColor, mode]);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        toast.success(`Copied ${label}`);
        setTimeout(() => setCopied(null), 2000);
    };

    const generateTailwind = () => `
/* Tailwind Config (v3.x) */
colors: {
  brand: {
    DEFAULT: '${states.base}',
    hover: '${states.hover}',
    active: '${states.active}',
    disabled: '${states.disabled}',
    focus: '${states.focus}',
  }
}`.trim();

    const generateCSSVars = () => `
:root {
  --brand-color: ${states.base};
  --brand-hover: ${states.hover};
  --brand-active: ${states.active};
  --brand-disabled: ${states.disabled};
  --brand-focus: ${states.focus};
  --brand-contrast: ${states.text};
}`.trim();

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Default"
            description="Tool Description"
            icon={Wand2}
            badgeText="Default"
            guide={<ShadeGuide />}
        >
            <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col items-center relative overflow-hidden font-sans">

                {/* Immersive Background Aura */}
                <div
                    className="absolute inset-0 opacity-20 blur-[120px] transition-colors duration-1000 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 20% 30%, ${states.base}, transparent), radial-gradient(circle at 80% 70%, ${states.hover}, transparent)`
                    }}
                />

                <div className="w-full max-w-7xl px-4 py-16 sm:px-6 relative z-10 space-y-16">

                    {/* Header Section */}
                    <div className="text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                        >
                            <Sparkles size={14} className="text-blue-400" /> Interaction Studio
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tight"
                        >
                            State <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Generator</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-400 max-w-2xl mx-auto"
                        >
                            Generate professional, accessible interaction states for buttons and components in seconds.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Control Panel (4 cols) */}
                        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                            <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl ring-1 ring-white/5">
                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-4 block">Pick a Brand Color</label>
                                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 shadow-inner group">
                                            <div className="relative w-16 min-w-[64px] h-16 rounded-2xl overflow-hidden ring-4 ring-black/20 shadow-lg">
                                                <input
                                                    type="color"
                                                    value={baseColor}
                                                    onChange={(e) => setBaseColor(e.target.value)}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={baseColor.toUpperCase()}
                                                onChange={(e) => setBaseColor(e.target.value)}
                                                className="flex-1 text-3xl font-mono font-black bg-transparent outline-none group-hover:text-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-4 block">Target Environment</label>
                                        <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5">
                                            {(['light', 'dark'] as StateMode[]).map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setMode(m)}
                                                    className={clsx(
                                                        "flex-1 py-3 text-sm font-bold rounded-xl capitalize transition-all",
                                                        mode === m ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                                                    )}
                                                >
                                                    {m} Mode
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <button
                                            onClick={() => handleCopy(generateTailwind(), 'Tailwind Config')}
                                            className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
                                        >
                                            {copied === 'Tailwind Config' ? <Check size={18} /> : <Code2 size={18} />}
                                            {copied === 'Tailwind Config' ? 'Copied Config' : 'Tailwind Config'}
                                        </button>
                                        <button
                                            onClick={() => handleCopy(generateCSSVars(), 'CSS Variables')}
                                            className="w-full py-4 bg-white/5 text-white font-black rounded-2xl border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
                                        >
                                            {copied === 'CSS Variables' ? <Check size={18} /> : <Copy size={18} />}
                                            {copied === 'CSS Variables' ? 'Copied Vars' : 'CSS Variables'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Accessibility Check */}
                            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 flex items-center gap-4">
                                <div className={clsx(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black",
                                    states.contrast >= 4.5 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                )}>
                                    {states.contrast >= 4.5 ? 'AA' : '!!'}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Accessibility</div>
                                    <div className="text-lg font-black">{states.contrast.toFixed(2)}:1 Ratio</div>
                                </div>
                            </div>
                        </div>

                        {/* Preview Section (8 cols) */}
                        <div className="lg:col-span-12 xl:col-span-8 space-y-8">

                            {/* State Grid */}
                            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Pointer size={120} />
                                </div>

                                <h3 className="text-xs font-black uppercase text-white/30 tracking-[0.3em] mb-10 flex items-center gap-2">
                                    <Eye size={16} /> Interactive States
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    <InteractionState title="Default" color={states.base} text={states.text} suffix="Base" />
                                    <InteractionState title="Hover" color={states.hover} text={states.text} suffix="+40% Dark" className="md:scale-105" />
                                    <InteractionState title="Active" color={states.active} text={states.text} suffix="+80% Dark" className="active-sim" />
                                    <InteractionState title="Focus" color={states.base} text={states.text} suffix="Ring 4px" ring={states.focus} />
                                    <InteractionState title="Disabled" color={states.disabled} text={states.text} suffix="40% Opacity" disabled />
                                </div>
                            </div>

                            {/* Live Application Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 border-dashed group">
                                    <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <Smartphone size={14} /> UI Component Preview
                                    </div>

                                    {/* Mockup Card */}
                                    <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-black/50 overflow-hidden text-black space-y-4">
                                        <div className="w-full h-32 rounded-2xl bg-gray-100 flex items-center justify-center">
                                            <Layout size={32} className="text-gray-300" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                                            <div className="h-2 w-full bg-gray-100 rounded-full" />
                                            <div className="h-2 w-5/6 bg-gray-100 rounded-full" />
                                        </div>
                                        <button
                                            className="w-full py-4 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95"
                                            style={{ backgroundColor: states.base, color: states.text }}
                                        >
                                            Purchase Now
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 border-dashed relative group">
                                    <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <Info size={14} /> Design Tip
                                    </div>
                                    <div className="space-y-4 text-white/60 leading-relaxed text-sm italic">
                                        "When designing accessible buttons, ensure the contrast ratio exceeds 4.5:1. For dark mode, darkening the base color often makes it 'muddy'—consider shifting hue or increasing brightness for a more vibrant feel."
                                    </div>
                                    <div className="mt-8 flex gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: states.base }} />
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: states.hover }} />
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: states.active }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                

                {/* CSS Simulation Hacks */}
                <style jsx>{`
                    .active-sim button {
                        transform: scale(0.95);
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
                    }
                `}</style>
            </div>
        </PremiumToolLayout>
    );
}

function InteractionState({ title, color, text, suffix, ring, disabled, className }: any) {
    return (
        <div className={clsx("space-y-4", className)}>
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/20 tracking-wider">
                <span>{title}</span>
                <span className="font-mono">{suffix}</span>
            </div>
            <div className="relative p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center">
                <button
                    disabled={disabled}
                    className={clsx(
                        "px-10 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all",
                        disabled && "cursor-not-allowed"
                    )}
                    style={{
                        backgroundColor: color,
                        color: text,
                        boxShadow: ring ? `0 0 0 6px ${ring}` : undefined,
                        outline: ring ? `2px solid ${color}` : undefined,
                        outlineOffset: ring ? '3px' : undefined
                    }}
                >
                    Button
                </button>
            </div>
            <div className="text-center font-mono text-xs text-white/30 group-hover:text-white/60 transition-colors uppercase">
                {color}
            </div>
        </div>
    );
}

