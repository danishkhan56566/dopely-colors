'use client';

import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { ArrowRightLeft, FileJson, Apple, Palette, Smartphone, Copy, CheckCircle2, ChevronRight, Terminal, Code2, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';
import { toast } from 'sonner';
import { MigratorGuide } from '@/components/content/UtilityGuides';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const SYSTEMS = [
    { id: 'tailwind', name: 'Tailwind CSS', icon: Palette, desc: 'Utility classes and config' },
    { id: 'material', name: 'Material Design', icon: Smartphone, desc: 'M3 Color Roles' },
    { id: 'apple', name: 'Apple HIG', icon: Apple, desc: 'iOS System Colors' },
];

export default function MigratorPage() {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [targetSystem, setTargetSystem] = useState('tailwind');
    const [copied, setCopied] = useState(false);

    // Ensure valid hex
    const validBaseColor = useMemo(() => {
        try {
            return chroma.valid(baseColor) ? chroma(baseColor).hex() : '#3b82f6';
        } catch {
            return '#3b82f6';
        }
    }, [baseColor]);

    // Generator Logic
    const tokens = useMemo(() => {
        try {
            const scale = chroma.scale([
                chroma(validBaseColor).brighten(2.5),
                validBaseColor,
                chroma(validBaseColor).darken(2.5)
            ]).colors(10); // 50-900

            if (targetSystem === 'tailwind') {
                return {
                    '50': scale[0],
                    '100': scale[1],
                    '200': scale[2],
                    '300': scale[3],
                    '400': scale[4],
                    '500': scale[5], // Base
                    '600': scale[6],
                    '700': scale[7],
                    '800': scale[8],
                    '900': scale[9],
                };
            }

            if (targetSystem === 'material') {
                return {
                    'primary': validBaseColor,
                    'onPrimary': chroma.contrast(validBaseColor, 'white') > 4.5 ? '#ffffff' : '#000000',
                    'primaryContainer': scale[1],
                    'onPrimaryContainer': scale[9],
                    'secondary': chroma(validBaseColor).set('hsl.h', '+30').hex(),
                    'surface': '#f8f9fa',
                    'onSurface': '#1a1b1e',
                };
            }

            if (targetSystem === 'apple') {
                return {
                    'systemBlue': validBaseColor,
                    'systemBlueDark': chroma(validBaseColor).darken(0.5).hex(),
                    'accessibleColor': scale[7],
                    'background': '#ffffff',
                    'secondaryBackground': '#f2f2f7',
                    'label': '#000000',
                    'secondaryLabel': '#3c3c4399',
                };
            }
        } catch (e) {
            return {};
        }
        return {};
    }, [validBaseColor, targetSystem]);

    const copyToClipboard = () => {
        const jsonString = JSON.stringify(tokens, null, 2);
        let exportString = jsonString;

        // Make it look like a config for Tailwind
        if (targetSystem === 'tailwind') {
            exportString = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: ${jsonString.replace(/\n/g, '\n        ')}\n      }\n    }\n  }\n}`;
        }

        navigator.clipboard.writeText(exportString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        toast.custom((t) => (
            <div className="bg-[#111] border border-white/10 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-blue-400" />
                </div>
                <span className="font-medium text-sm">Snippet copied to clipboard</span>
            </div>
        ), { duration: 2000 });
    };

    // Syntax Highlighting simple implementation
    const renderHighlightedCode = () => {
        const jsonLines = JSON.stringify(tokens, null, 2).split('\n');

        if (targetSystem === 'tailwind') {
            return (
                <div className="font-mono text-[13px] leading-relaxed tracking-tight">
                    <div className="text-purple-400">module<span className="text-gray-400">.</span>exports <span className="text-emerald-400">=</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="pl-4 text-blue-300">theme<span className="text-gray-300">: {'{'}</span></div>
                    <div className="pl-8 text-blue-300">extend<span className="text-gray-300">: {'{'}</span></div>
                    <div className="pl-12 text-blue-300">colors<span className="text-gray-300">: {'{'}</span></div>
                    <div className="pl-16 text-blue-300">brand<span className="text-gray-300">: {'{'}</span></div>
                    {jsonLines.slice(1, -1).map((line, i) => {
                        const [key, value] = line.split(':');
                        return (
                            <div key={i} className="pl-16">
                                <span className="text-sky-300">{key}</span>:
                                <span className="text-amber-300">{value?.replace(/,/g, '')}</span>
                                <span className="text-gray-400">{value?.includes(',') ? ',' : ''}</span>
                            </div>
                        );
                    })}
                    <div className="pl-16 text-gray-300">{'}'}</div>
                    <div className="pl-12 text-gray-300">{'}'}</div>
                    <div className="pl-8 text-gray-300">{'}'}</div>
                    <div className="pl-4 text-gray-300">{'}'}</div>
                    <div className="text-gray-300">{'}'}</div>
                </div>
            );
        }

        return (
            <div className="font-mono text-[13px] leading-relaxed tracking-tight">
                <div className="text-purple-400">const <span className="text-blue-300">designTokens</span> <span className="text-emerald-400">=</span> <span className="text-gray-300">{'{'}</span></div>
                {jsonLines.slice(1, -1).map((line, i) => {
                    const [key, value] = line.split(':');
                    return (
                        <div key={i} className="pl-4">
                            <span className="text-sky-300">{key}</span>:
                            <span className="text-amber-300">{value?.replace(/,/g, '')}</span>
                            <span className="text-gray-400">{value?.includes(',') ? ',' : ''}</span>
                        </div>
                    );
                })}
                <div className="text-gray-300">{'}'}</div>
            </div>
        );
    };

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="${key}: ${value}"
            description="Tool Description"
            icon={Wand2}
            badgeText="${key}: ${value}"
            guide={<MigratorGuide />}
        >
            <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center p-6 md:p-10 relative overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4" />

                <div className="w-full max-w-7xl relative z-10 flex flex-col h-full">
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-6 backdrop-blur-md"
                            >
                                <Terminal size={14} className="text-emerald-400" />
                                Developer Workspace
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                                Design Token Migrator
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl">
                                Translate your raw colors into standardized, copy-paste ready design tokens for Tailwind, Material Design, and Apple HIG.
                            </p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">

                        {/* Left: Input & Configuration */}
                        <div className="lg:col-span-5 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden"
                            >
                                {/* Decorative grid */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

                                <div className="relative z-10 space-y-10">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                            <Palette size={14} /> Source Brand Color
                                        </label>
                                        <div className="flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 gap-3 shadow-inner items-center">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-white/20 shrink-0">
                                                <input
                                                    type="color"
                                                    value={validBaseColor}
                                                    onChange={(e) => setBaseColor(e.target.value)}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={baseColor}
                                                    onChange={(e) => setBaseColor(e.target.value)}
                                                    className="w-full bg-transparent border-none text-white font-mono text-2xl uppercase outline-none focus:ring-0 p-0"
                                                    placeholder="#3B82F6"
                                                />
                                                <div className="text-xs text-gray-500 font-medium">Primary Seed</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block flex items-center gap-2">
                                            <ArrowRightLeft size={14} /> Target System
                                        </label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {SYSTEMS.map(sys => (
                                                <button
                                                    key={sys.id}
                                                    onClick={() => setTargetSystem(sys.id)}
                                                    className={clsx(
                                                        "p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 relative overflow-hidden group text-left",
                                                        targetSystem === sys.id
                                                            ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                                            : "bg-black/20 border-transparent hover:bg-white/5 text-gray-400"
                                                    )}
                                                >
                                                    {targetSystem === sys.id && (
                                                        <motion.div
                                                            layoutId="activeSystem"
                                                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"
                                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                        />
                                                    )}
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className={clsx(
                                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                            targetSystem === sys.id ? "bg-white/10 text-white" : "bg-black/40 text-gray-500 group-hover:text-gray-300"
                                                        )}>
                                                            <sys.icon size={20} />
                                                        </div>
                                                        <div>
                                                            <div className={clsx("font-bold text-base transition-colors", targetSystem === sys.id ? "text-white" : "text-gray-300")}>{sys.name}</div>
                                                            <div className="text-xs text-gray-500 font-medium">{sys.desc}</div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className={clsx("relative z-10 transition-transform", targetSystem === sys.id ? "text-white translate-x-1" : "text-gray-600")} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Code Editor Output */}
                        <div className="lg:col-span-7 flex flex-col h-full min-h-[600px]">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1e1e1e] flex-1 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden relative"
                            >
                                {/* Editor Header */}
                                <div className="h-14 bg-[#252526] border-b border-[#3c3c3c] flex items-center justify-between px-4 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5 mr-4">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] rounded-t-md border-t border-x border-[#3c3c3c] translate-y-[1px]">
                                            <Code2 size={14} className="text-blue-400" />
                                            <span className="text-xs text-gray-300 font-mono">
                                                {targetSystem === 'tailwind' ? 'tailwind.config.js' : 'tokens.ts'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-md text-xs font-mono transition-all border border-white/5 hover:border-white/20 group"
                                    >
                                        {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} className="group-hover:scale-110 transition-transform" />}
                                        {copied ? 'Copied!' : 'Copy Snippet'}
                                    </button>
                                </div>

                                {/* Editor Body Content */}
                                <div className="flex-1 p-6 overflow-y-auto relative">
                                    {/* Line Numbers Fake */}
                                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#3c3c3c] flex flex-col items-center py-6 text-[#858585] text-[13px] font-mono select-none">
                                        {Array.from({ length: 25 }).map((_, i) => (
                                            <div key={i} className="leading-relaxed tracking-tight">{i + 1}</div>
                                        ))}
                                    </div>

                                    {/* The Code */}
                                    <div className="pl-10">
                                        {renderHighlightedCode()}
                                    </div>
                                </div>

                                {/* Visual Swatches Footer */}
                                <div className="h-24 bg-[#252526] border-t border-[#3c3c3c] p-4 flex items-center gap-3 overflow-x-auto overflow-y-hidden visually-hidden-scrollbar shrink-0">
                                    <AnimatePresence mode="popLayout">
                                        {Object.entries(tokens).slice(0, 10).map(([key, value]) => (
                                            <motion.div
                                                key={`${targetSystem}-${key}`}
                                                layout
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                                className="h-12 w-16 shrink-0 rounded-xl flex flex-col items-center justify-center text-[9px] font-bold text-white/70 shadow-inner border border-white/10 relative group"
                                                style={{ backgroundColor: value as string }}
                                                title={`${key}: ${value}`}
                                            >
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-[2px]">
                                                    <span className="font-mono text-white text-[10px]">{key}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                    <div className="mt-12">
                        
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .visually-hidden-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .visually-hidden-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </PremiumToolLayout>
    );
}
