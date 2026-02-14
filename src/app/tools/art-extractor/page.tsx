'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Image as ImageIcon, Upload, Sparkles, RefreshCw, BarChart2, Zap, ScanEye, Download } from 'lucide-react';
import { extractPalette, ExtractedColor } from '@/lib/image-extraction';
import { usePaletteStore } from '@/store/usePaletteStore';
import { toast } from 'sonner';
import clsx from 'clsx';
import chroma from 'chroma-js';
import { ArtExtractorGuide } from '@/components/content/AdvancedGuides'; // Correct import
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type MoodStats = {
    temperature: 'Warm' | 'Cool';
    vibrancy: number; // 0-100
    contrast: number; // 0-100
};

export default function ArtExtractor() {
    const { setColors } = usePaletteStore();
    const [image, setImage] = useState<string | null>(null);
    const [palette, setPalette] = useState<ExtractedColor[]>([]);
    const [mood, setMood] = useState<MoodStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    // --- Image Handling ---
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            if (event.target?.result) {
                const src = event.target.result as string;
                setImage(src);
                analyzeImage(src);
            }
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = async (src: string) => {
        setLoading(true);
        try {
            const { palette, stats } = await extractPalette(src);
            setPalette(palette);
            setMood(stats);
            // Auto-set the first 5 colors to global store
            if (palette.length >= 5) {
                setColors(palette.slice(0, 5).map(c => ({
                    id: crypto.randomUUID(),
                    hex: c.hex,
                    isLocked: false
                })));
            }
            toast.success("Analysis Complete");
        } catch (error) {
            console.error(error);
            toast.error("Failed to extract colors");
        } finally {
            setLoading(false);
        }
    };

    const remixPalette = () => {
        setIsThinking(true);
        setTimeout(() => {
            const newPalette = palette.map(c => {
                const shift = Math.random() * 60 - 30; // +/- 30deg hue shift
                const newHex = chroma(c.hex).set('hsl.h', `+${shift}`).hex();
                return { ...c, hex: newHex };
            });
            setPalette(newPalette);
            setIsThinking(false);
            toast.success("Style Remixed");
        }, 800);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-20">

                {/* Header: Gallery Style */}
                <header className="px-10 py-8 border-b border-gray-100 mb-8 bg-white/80 backdrop-blur sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Curator Tools</div>
                            <h1 className="text-3xl font-light tracking-tight text-gray-900">
                                Gallery <span className="font-serif italic font-bold text-gray-400">Lens</span>
                            </h1>
                        </div>
                        <button className="bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                            <Download size={14} /> Export Report
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Canvas / Image */}
                    <div className="lg:col-span-7">
                        <div className="relative group rounded-[2px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-gray-100 min-h-[500px] flex items-center justify-center border-[12px] border-white ring-1 ring-gray-200">

                            {image ? (
                                <>
                                    <img src={image} alt="Art" className="w-full h-full object-cover" />

                                    {/* Overlay Action */}
                                    <div className="absolute top-4 right-4">
                                        <button onClick={() => setImage(null)} className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold hover:bg-white shadow-lg">New Image</button>
                                    </div>

                                    {/* Scan Effect Overlay */}
                                    {loading && (
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <ScanEye size={48} className="text-gray-900 animate-pulse" />
                                                <span className="text-xs font-black uppercase tracking-widest">Scanning Pigments...</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <label className="flex flex-col items-center gap-6 cursor-pointer opacity-40 group-hover:opacity-100 transition-opacity">
                                    <Upload size={48} />
                                    <div className="text-center">
                                        <p className="font-serif text-2xl italic mb-2">Upload Masterpiece</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Drop Image or Click</p>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                </label>
                            )}

                        </div>

                        {/* Image Meta Strip */}
                        {image && !loading && (
                            <div className="mt-6 flex justify-between items-end border-b border-gray-100 pb-4">
                                <div>
                                    <div className="text-[10px] font-bold uppercase text-gray-400">Source</div>
                                    <div className="font-mono text-xs text-gray-600">analysis_render_{Date.now().toString().slice(-4)}.jpg</div>
                                </div>
                                <div className="flex gap-4 text-xs font-bold">
                                    <span>2400 x 1800</span>
                                    <span>RGB</span>
                                    <span>72 DPI</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Analysis Panel */}
                    <div className="lg:col-span-5 space-y-10">

                        {palette.length > 0 ? (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-10">

                                {/* 1. Mood DNA */}
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                        <BarChart2 size={14} /> Emotional DNA
                                    </h3>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <div className="text-3xl font-serif italic text-gray-900">{mood?.temperature}</div>
                                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className={cn("h-full w-3/4 rounded-full", mood?.temperature === 'Warm' ? "bg-orange-400" : "bg-blue-400")} />
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mt-1">Temp</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-3xl font-serif italic text-gray-900">{mood?.vibrancy}%</div>
                                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${mood?.vibrancy}%` }} />
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mt-1">Vibrancy</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={remixPalette}
                                            disabled={isThinking}
                                            className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
                                        >
                                            {isThinking ? <span className="animate-pulse">Processing...</span> : <><Sparkles size={14} /> Remix Style</>}
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Extracted Palette */}
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Pigment Breakdown</h3>
                                    <div className="space-y-3">
                                        {palette.slice(0, 6).map((c, i) => (
                                            <div key={i} className="flex items-center gap-4 group cursor-pointer" onClick={() => { navigator.clipboard.writeText(c.hex); toast.success("Copied"); }}>
                                                <div className="w-16 h-16 rounded-full shadow-sm border border-gray-100 transition-transform group-hover:scale-110" style={{ backgroundColor: c.hex }} />
                                                <div className="flex-1 border-b border-gray-100 pb-3 group-hover:border-gray-300 transition-colors">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <span className="font-mono font-bold text-gray-900">{c.hex}</span>
                                                        <span className="font-serif italic text-gray-400 text-sm">{(c.area * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gray-900" style={{ width: `${c.area * 100}%`, backgroundColor: c.hex }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            // Empty State
                            <div className="h-full flex flex-col justify-center items-center opacity-30 text-center">
                                <div className="w-20 h-1 bg-gray-300 mb-4" />
                                <p className="font-serif italic text-xl">"Every color holds a story."</p>
                                <p className="text-xs font-bold uppercase text-gray-400 mt-2">No Analysis Data</p>
                            </div>
                        )}

                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-10 mt-20">
                    <ArtExtractorGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
