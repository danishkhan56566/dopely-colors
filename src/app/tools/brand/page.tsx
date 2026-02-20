'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BrandGuide } from '@/components/content/AdvancedGuides';
import { Palette, Globe, ScanSearch, CheckCircle2, Copy, Sparkles, LayoutPanelLeft } from 'lucide-react';
import chroma from 'chroma-js';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type ExtractedColor = {
    role: string;
    hex: string;
    description: string;
};

// Mock function to simulate URL scraping
const mockExtractColors = async (url: string): Promise<ExtractedColor[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let base = '#3b82f6';
            if (url.includes('stripe')) base = '#6366f1';
            if (url.includes('github')) base = '#24292e';
            if (url.includes('vercel')) base = '#000000';
            if (url.includes('figma')) base = '#f24e1e';

            const primary = chroma(base);
            const isDark = primary.luminance() < 0.1;

            resolve([
                { role: 'Primary', hex: primary.hex(), description: 'Main brand interactive color' },
                { role: 'Secondary', hex: primary.set('hsl.h', '+45').hex(), description: 'Accents and highlights' },
                { role: 'Background', hex: isDark ? '#ffffff' : '#0a0a0b', description: 'Primary page background' },
                { role: 'Surface', hex: isDark ? '#f4f4f5' : '#18181b', description: 'Cards and elevated elements' },
                { role: 'Text', hex: isDark ? '#18181b' : '#ffffff', description: 'High-contrast typography' },
                { role: 'Muted', hex: isDark ? '#a1a1aa' : '#71717a', description: 'Secondary text and borders' },
            ]);
        }, 2500); // 2.5s simulated delay
    });
};

export default function BrandPalettePage() {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedColor[] | null>(null);

    const handleExtract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) {
            toast.error("Please enter a valid URL");
            return;
        }

        setIsScanning(true);
        setExtractedData(null);

        try {
            const data = await mockExtractColors(url);
            setExtractedData(data);
            toast.success("Brand colors extracted successfully!");
        } catch (error) {
            toast.error("Failed to extract colors");
        } finally {
            setIsScanning(false);
        }
    };

    const copyHex = (hex: string, role: string) => {
        navigator.clipboard.writeText(hex);
        toast.custom((t) => (
            <div className="bg-[#111] border border-white/10 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: hex + '40' }}>
                    <CheckCircle2 size={16} style={{ color: hex }} />
                </div>
                <span className="font-medium text-sm">Copied <span className="font-bold">{role}</span> color</span>
            </div>
        ), { duration: 2000 });
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#0a0a0b] flex flex-col p-6 md:p-10 relative overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

                <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col pt-10">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                        >
                            <Sparkles size={16} /> Brand Intelligence
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                        >
                            Color Extractor
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-xl max-w-2xl mx-auto"
                        >
                            Instantly analyze any website's CSS to extract its core design language and color tokens.
                        </motion.p>
                    </div>

                    {/* Extractor Input Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                        {/* Scanning Overlay Animation */}
                        <AnimatePresence>
                            {isScanning && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 pointer-events-none bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden"
                                >
                                    <motion.div
                                        animate={{ top: ['-10%', '110%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-500/20 to-blue-400/80 border-b border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.8)]"
                                    />
                                    <ScanSearch size={48} className="text-blue-400 animate-pulse relative z-30 mb-4" />
                                    <div className="text-blue-300 font-mono text-sm tracking-widest uppercase animate-pulse">Analyzing DOM & CSSOM...</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleExtract} className="relative z-10 max-w-3xl mx-auto">
                            <div className="relative group">
                                <div className={cn(
                                    "absolute -inset-1 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000",
                                    isScanning ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-pulse" : "bg-white/20"
                                )} />
                                <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-inner">
                                    <div className="pl-4 pr-3 text-gray-500">
                                        <Globe size={24} />
                                    </div>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="flex-1 bg-transparent border-none text-white text-xl md:text-2xl font-medium outline-none placeholder:text-gray-600 py-3"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isScanning}
                                        className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-2xl font-bold text-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Extract <LayoutPanelLeft size={20} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>

                    {/* Results Area */}
                    <AnimatePresence mode="wait">
                        {extractedData && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {extractedData.map((item, index) => {
                                    const luma = chroma(item.hex).luminance();
                                    const textColor = luma > 0.5 ? '#000000' : '#ffffff';
                                    const isDarkBg = luma < 0.2;

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => copyHex(item.hex, item.role)}
                                            className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/5 transition-transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between p-6"
                                            style={{ backgroundColor: item.hex }}
                                        >
                                            {/* Top info */}
                                            <div className="flex justify-between items-start w-full relative z-10">
                                                <div
                                                    className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                                                    style={{ backgroundColor: textColor === '#000000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)', color: textColor }}
                                                >
                                                    {item.role}
                                                </div>
                                                <div
                                                    className={cn("opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full", isDarkBg ? "bg-white/20" : "bg-black/10")}
                                                    style={{ color: textColor }}
                                                >
                                                    <Copy size={16} />
                                                </div>
                                            </div>

                                            {/* Bottom info */}
                                            <div className="relative z-10" style={{ color: textColor }}>
                                                <div className="font-mono text-3xl font-black mb-1 opacity-90 tracking-tighter uppercase">{item.hex}</div>
                                                <div className="text-sm font-medium opacity-70">{item.description}</div>
                                            </div>

                                            {/* Hover glare effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Initial State Helper text */}
                    {!extractedData && !isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-16 text-center text-gray-500 text-sm"
                        >
                            Try urls like <span className="text-gray-400 font-mono">stripe.com</span>, <span className="text-gray-400 font-mono">github.com</span>, or <span className="text-gray-400 font-mono">vercel.com</span>
                        </motion.div>
                    )}

                    <div className="mt-24">
                        <BrandGuide />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
