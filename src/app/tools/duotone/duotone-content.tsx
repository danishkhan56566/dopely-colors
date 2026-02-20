'use client';

import { useState, useRef } from 'react';
import chroma from 'chroma-js';
import { Image as ImageIcon, Copy, Download, UploadCloud, Droplet, Sparkles, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { DuotoneGuide } from '@/components/content/ScienceGuides';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
    { id: 'spotify', name: 'Spotify Classic', shadow: '#191414', highlight: '#1DB954' },
    { id: 'cyber', name: 'Cyberpunk', shadow: '#2b0f4c', highlight: '#00ffcc' },
    { id: 'sunset', name: 'Desert Sunset', shadow: '#4a0e4e', highlight: '#ff7b54' },
    { id: 'ocean', name: 'Deep Ocean', shadow: '#020024', highlight: '#00d4ff' },
    { id: 'cherry', name: 'Cherry Blossom', shadow: '#4a001f', highlight: '#ffb7b2' },
];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&q=80&w=2070&auto=format&fit=crop';

export default function DuotoneContent() {
    const [image, setImage] = useState(DEFAULT_IMAGE);
    const [color1, setColor1] = useState(PRESETS[0].shadow);
    const [color2, setColor2] = useState(PRESETS[0].highlight);
    const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    const getMatrix = (c1: string, c2: string) => {
        try {
            const rgb1 = chroma(c1).rgb();
            const rgb2 = chroma(c2).rgb();

            const r1 = rgb1[0] / 255, g1 = rgb1[1] / 255, b1 = rgb1[2] / 255;
            const r2 = rgb2[0] / 255, g2 = rgb2[1] / 255, b2 = rgb2[2] / 255;

            const Lr = 0.2126, Lg = 0.7152, Lb = 0.0722;
            const rDiff = r2 - r1, gDiff = g2 - g1, bDiff = b2 - b1;

            const m = [
                (Lr * rDiff), (Lg * rDiff), (Lb * rDiff), 0, r1,
                (Lr * gDiff), (Lg * gDiff), (Lb * gDiff), 0, g1,
                (Lr * bDiff), (Lg * bDiff), (Lb * bDiff), 0, b1,
                0, 0, 0, 1, 0
            ];

            return m.join(' ');
        } catch (e) {
            return "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"; // Fallback identity
        }
    };

    const matrix = getMatrix(color1, color2);
    const filterId = "duotone-filter";

    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg">
  <filter id="${filterId}">
    <feColorMatrix type="matrix" values="${matrix}" />
  </filter>
</svg>`.trim();

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center p-6 md:p-10 relative overflow-hidden text-gray-200">
            {/* Ambient Background based on current colors */}
            <motion.div
                className="absolute top-0 right-0 w-[60vw] h-[60vw] blur-[150px] rounded-full pointer-events-none opacity-20 -translate-y-1/2 translate-x-1/4"
                animate={{ backgroundColor: color2 }}
                transition={{ duration: 1 }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-[50vw] h-[50vw] blur-[150px] rounded-full pointer-events-none opacity-30 translate-y-1/3 -translate-x-1/4"
                animate={{ backgroundColor: color1 }}
                transition={{ duration: 1 }}
            />

            <div className="w-full max-w-7xl relative z-10 flex flex-col h-full">

                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-6 backdrop-blur-md"
                        >
                            <Sparkles size={14} /> Creative Studio
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                            Duotone FX Generator
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Turn vibrant photography into focused brand assets using SVG spectral luminance mapping.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1">

                    {/* Left: Studio Canvas */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Hidden Filter */}
                        <svg className="hidden w-0 h-0">
                            <filter id="preview-filter">
                                <feColorMatrix type="matrix" values={matrix} />
                            </filter>
                        </svg>

                        {/* Interactive Canvas */}
                        <div
                            className="relative aspect-video rounded-[2rem] overflow-hidden bg-black/40 border border-white/10 shadow-2xl group cursor-crosshair"
                            onMouseEnter={() => setIsHoveringCanvas(true)}
                            onMouseLeave={() => setIsHoveringCanvas(false)}
                        >
                            {/* Base Image (hidden, only used for filter mapping target) */}
                            <img
                                src={image}
                                alt="Duotone Base"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                style={{ filter: 'url(#preview-filter)' }}
                            />

                            {/* Wipe Effect Compare Tool */}
                            <AnimatePresence>
                                {isHoveringCanvas && (
                                    <motion.div
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                                        className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 shadow-xl"
                                    >
                                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color1 }} />
                                        <div className="w-4 h-4 rounded-full border border-white/20 -ml-5" style={{ backgroundColor: color2 }} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-white ml-2">Active Mapping</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Original Image Peek (on click/hold) */}
                            <div className="absolute inset-0 bg-transparent opacity-0 active:opacity-100 transition-opacity duration-300">
                                <img src={image} className="w-full h-full object-cover" />
                                <div className="absolute top-4 left-0 right-0 text-center">
                                    <span className="bg-white/90 text-black px-4 py-2 rounded-full text-xs font-bold shadow-xl tracking-wider">ORIGINAL</span>
                                </div>
                            </div>
                        </div>

                        {/* Presets Strip */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                            {PRESETS.map((p) => {
                                const isActive = color1 === p.shadow && color2 === p.highlight;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => { setColor1(p.shadow); setColor2(p.highlight); }}
                                        className={cn(
                                            "snap-start flex-shrink-0 flex items-center gap-3 p-2 pr-4 rounded-2xl border transition-all duration-300",
                                            isActive
                                                ? "bg-white/10 border-white/30 shadow-lg"
                                                : "bg-black/20 border-white/5 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner flex shrink-0 border border-white/10">
                                            <div className="flex-1" style={{ backgroundColor: p.shadow }} />
                                            <div className="flex-1" style={{ backgroundColor: p.highlight }} />
                                        </div>
                                        <span className={cn("text-sm font-medium whitespace-nowrap", isActive ? "text-white" : "text-gray-400")}>
                                            {p.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Control Panel */}
                    <div className="lg:col-span-4 space-y-6">

                        <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-xl relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-8">
                                <SlidersHorizontal size={20} className="text-blue-400" />
                                <h3 className="text-lg font-bold text-white tracking-tight">Effect Matrix</h3>
                            </div>

                            <div className="space-y-8">
                                {/* Highlights */}
                                <div>
                                    <label className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-white" /> Highlights (Whites)
                                        </span>
                                        <span className="font-mono text-xs text-gray-500 uppercase">{color2}</span>
                                    </label>
                                    <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 shadow-inner grow-0">
                                        <input
                                            type="color"
                                            value={color2}
                                            onChange={(e) => setColor2(e.target.value)}
                                            className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent shrink-0 [color-scheme:dark]"
                                        />
                                        <input
                                            type="text"
                                            value={color2}
                                            onChange={(e) => setColor2(e.target.value)}
                                            className="flex-1 bg-transparent border-none text-white text-xl font-mono px-4 uppercase outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>

                                {/* Shadows */}
                                <div>
                                    <label className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-black border border-gray-700" /> Shadows (Blacks)
                                        </span>
                                        <span className="font-mono text-xs text-gray-500 uppercase">{color1}</span>
                                    </label>
                                    <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 shadow-inner grow-0">
                                        <input
                                            type="color"
                                            value={color1}
                                            onChange={(e) => setColor1(e.target.value)}
                                            className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent shrink-0 [color-scheme:dark]"
                                        />
                                        <input
                                            type="text"
                                            value={color1}
                                            onChange={(e) => setColor1(e.target.value)}
                                            className="flex-1 bg-transparent border-none text-white text-xl font-mono px-4 uppercase outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>

                                <hr className="border-white/5" />

                                {/* Source Engine */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Source Image Engine</label>

                                    <div className="space-y-3">
                                        <div className="relative group">
                                            <input
                                                type="url"
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                                className="w-full bg-black/40 backdrop-blur-md border border-white/5 rounded-xl py-3 px-4 text-sm text-gray-300 font-mono focus:border-blue-500/50 outline-none transition-colors pr-10 hover:border-white/20"
                                                placeholder="https://..."
                                            />
                                            <ImageIcon size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-gray-400 transition-colors" />
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 bg-black/20 hover:bg-black/40 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white"
                                            >
                                                <UploadCloud size={20} />
                                                <span className="text-xs font-bold uppercase tracking-wide">Upload Local Image</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Module */}
                        <div className="bg-black/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 relative group">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Droplet size={14} /> Output Filter Code
                                </h3>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(svgCode);
                                        toast.success("SVG Filter copied to clipboard.");
                                    }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                                    title="Copy SVG"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                            <div className="bg-[#050505] rounded-xl p-4 overflow-x-auto border border-white/5 shadow-inner">
                                <pre className="font-mono text-[10px] leading-relaxed text-blue-300">
                                    <code>{svgCode}</code>
                                </pre>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-20 border-t border-white/5 pt-12">
                    <DuotoneGuide />
                </div>
            </div>
        </div>
    );
}
