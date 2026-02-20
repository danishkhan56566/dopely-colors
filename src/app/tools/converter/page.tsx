'use client';

import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Copy, RefreshCw, Layers, Zap } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ConverterGuide } from '@/components/content/ScienceGuides';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColorConverter() {
    const [input, setInput] = useState('#3B82F6');
    const [validColor, setValidColor] = useState<chroma.Color | null>(null);
    const [outputs, setOutputs] = useState<Record<string, string>>({});

    useEffect(() => {
        try {
            if (chroma.valid(input)) {
                const c = chroma(input);
                setValidColor(c);
                setOutputs({
                    HEX: c.hex(),
                    RGB: c.css('rgb'),
                    RGBA: `rgba(${c.rgba().join(', ')})`,
                    HSL: `hsl(${Math.round(c.get('hsl.h') || 0)}, ${Math.round(c.get('hsl.s') * 100)}%, ${Math.round(c.get('hsl.l') * 100)}%)`,
                    HSV: `hsv(${Math.round(c.get('hsv.h') || 0)}, ${Math.round(c.get('hsv.s') * 100)}%, ${Math.round(c.get('hsv.v') * 100)}%)`,
                    CMYK: `cmyk(${c.cmyk().map(v => Math.round(v * 100)).join(', ')})`,
                    LAB: `lab(${c.lab().map(v => Math.round(v)).join(', ')})`,
                    CSS: c.css(),
                });
            } else {
                setValidColor(null);
            }
        } catch (e) {
            setValidColor(null);
        }
    }, [input]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${label}`, {
            style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <DashboardLayout>
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0a0a0b]">
                <div
                    className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ease-in-out mix-blend-screen"
                    style={{ backgroundColor: validColor ? validColor.hex() : '#3B82F6' }}
                />
                <div
                    className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-10 transition-colors duration-1000 ease-in-out mix-blend-screen"
                    style={{ backgroundColor: validColor ? validColor.set('hsl.h', '+60').hex() : '#8B5CF6' }}
                />
            </div>

            <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto relative z-10">
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-6 backdrop-blur-md"
                    >
                        <RefreshCw size={14} className="text-blue-400" />
                        Universal Translator
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Color Converter Matrix
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Instantly translate colors into mathematically precise formats for any environment or framework.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Column: Input & Preview */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Input Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                            <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-4 tracking-wide uppercase">
                                <Zap size={16} className="text-blue-400" />
                                Base Signal
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="e.g. #3B82F6, rgb(0,0,0), blue"
                                    className={clsx(
                                        "w-full h-16 pl-6 pr-16 bg-black/40 rounded-2xl border font-mono text-xl text-white outline-none transition-all duration-300 shadow-inner placeholder:text-gray-600",
                                        validColor ? "border-white/20 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10" : "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-400"
                                    )}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    {validColor ? (
                                        <div
                                            className="w-10 h-10 rounded-xl shadow-lg border border-white/20 transition-transform group-focus-within:scale-110 duration-300"
                                            style={{ backgroundColor: validColor.css() }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold">!</div>
                                    )}
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Supports all standard formats & HTML names
                            </p>
                        </motion.div>

                        {/* Large Preview */}
                        <AnimatePresence mode="popLayout">
                            {validColor && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex-1 min-h-[250px] lg:min-h-0 rounded-[2rem] shadow-2xl transition-colors duration-500 ease-out border border-white/10 flex items-center justify-center group overflow-hidden relative"
                                    style={{ backgroundColor: validColor.css() }}
                                >
                                    {/* Inner Glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_100%)] pointer-events-none" />

                                    <div className="text-center transform transition-transform duration-500 group-hover:scale-110">
                                        <div className="px-6 py-3 bg-black/20 backdrop-blur-xl rounded-2xl font-mono font-bold text-white shadow-xl border border-white/10 mix-blend-luminosity">
                                            {validColor.hex().toUpperCase()}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Data Matrix */}
                    <div className="lg:col-span-7">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden h-full flex flex-col"
                        >
                            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                                <h2 className="font-bold text-white flex items-center gap-2">
                                    <Layers size={18} className="text-blue-400" />
                                    Translation Matrix
                                </h2>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 px-3 py-1.5 rounded-full">
                                    <div className={clsx("w-2 h-2 rounded-full", validColor ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500")} />
                                    {validColor ? 'SYNCED' : 'AWAITING SIGNAL'}
                                </div>
                            </div>

                            <div className="p-4 md:p-6 flex-1 flex flex-col">
                                {validColor ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                                        {Object.entries(outputs).map(([label, value]) => (
                                            <motion.button
                                                variants={itemVariants}
                                                key={label}
                                                onClick={() => copyToClipboard(value, label)}
                                                className="group relative flex flex-col justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 text-left overflow-hidden h-[88px]"
                                            >
                                                {/* Hover Highlight */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                                <div className="relative flex justify-between items-center w-full">
                                                    <div className="w-full">
                                                        <span className="text-[10px] font-bold text-gray-400 tracking-widest block mb-1">
                                                            {label}
                                                        </span>
                                                        <span className="font-mono text-gray-200 font-medium truncate block w-[90%]">
                                                            {value}
                                                        </span>
                                                    </div>
                                                    <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                                            <Copy size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
                                            <RefreshCw size={24} className="opacity-50" />
                                        </div>
                                        <p className="text-gray-400">Waiting for valid color input...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-12">
                    <ConverterGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
