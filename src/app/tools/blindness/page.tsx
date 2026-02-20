'use client';

import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Upload, Image as ImageIcon, X, Eye, EyeOff, SlidersHorizontal, ArrowRightLeft } from 'lucide-react';
import { BlindVizGuide } from '@/components/content/AdvancedGuides';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// Color Blindness Simulation Matrices (SVG ColorMatrix)
// Source: https://www.w3.org/TR/filter-effects-1/
const SIMULATIONS = [
    {
        id: 'normal',
        name: 'Normal Vision',
        desc: 'Standard trichromatic vision',
        matrix: null,
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'protanopia',
        name: 'Protanopia',
        desc: 'Red-blind (1% of males)',
        matrix: "0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0",
        color: 'from-red-500 to-orange-500'
    },
    {
        id: 'deuteranopia',
        name: 'Deuteranopia',
        desc: 'Green-blind (1% of males)',
        matrix: "0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0",
        color: 'from-green-400 to-teal-500'
    },
    {
        id: 'tritanopia',
        name: 'Tritanopia',
        desc: 'Blue-blind (Rare)',
        matrix: "0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0",
        color: 'from-blue-500 to-indigo-500'
    },
    {
        id: 'achromatopsia',
        name: 'Achromatopsia',
        desc: 'Total color blindness',
        matrix: "0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0",
        color: 'from-gray-400 to-slate-500'
    }
];

export default function ColorBlindnessPage() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [activeSim, setActiveSim] = useState('protanopia');
    const [splitPos, setSplitPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        let clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSplitPos(percentage);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, []);

    const activeSimulation = SIMULATIONS.find(s => s.id === activeSim);

    return (
        <DashboardLayout>
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0a0a0b]">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="min-h-screen flex flex-col items-center p-6 md:p-10 relative z-10 w-full max-w-7xl mx-auto">

                {/* Header */}
                <header className="text-center max-w-3xl mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-6 backdrop-blur-md"
                    >
                        <Eye size={14} className="text-purple-400" />
                        Accessibility Studio
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Vision Simulator
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Experience your designs through the lens of various color vision deficiencies in real-time.
                    </p>
                </header>

                {/* SVG Filters Definition */}
                <svg className="absolute w-0 h-0 pointer-events-none">
                    <defs>
                        {SIMULATIONS.map(sim => (
                            sim.matrix && (
                                <filter key={sim.id} id={sim.id}>
                                    <feColorMatrix type="matrix" values={sim.matrix} />
                                </filter>
                            )
                        ))}
                    </defs>
                </svg>

                <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* Controls - Left Panel */}
                    <div className="xl:col-span-3 flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4 flex items-center gap-2">
                                <SlidersHorizontal size={14} />
                                Simulation Mode
                            </label>
                            <div className="space-y-3 relative z-10">
                                {SIMULATIONS.map(sim => (
                                    <button
                                        key={sim.id}
                                        onClick={() => setActiveSim(sim.id)}
                                        className={clsx(
                                            "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                                            activeSim === sim.id
                                                ? "bg-white/10 border-white/20 shadow-lg"
                                                : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
                                        )}
                                    >
                                        {activeSim === sim.id && (
                                            <motion.div
                                                layoutId="activeSimHighlight"
                                                className={`absolute inset-0 bg-gradient-to-r ${sim.color} opacity-10`}
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className={clsx(
                                                    "w-2 h-2 rounded-full",
                                                    activeSim === sim.id ? `bg-gradient-to-br ${sim.color}` : "bg-gray-600"
                                                )} />
                                                <div className={clsx("font-bold text-sm transition-colors", activeSim === sim.id ? "text-white" : "text-gray-400 group-hover:text-gray-300")}>
                                                    {sim.name}
                                                </div>
                                            </div>
                                            <div className={clsx("text-xs mt-1 ml-4 transition-colors", activeSim === sim.id ? "text-gray-300" : "text-gray-500")}>
                                                {sim.desc}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-6 bg-black/40 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-gray-400 text-sm hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/5 cursor-pointer transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-500/10 transition-transform">
                                        <Upload size={20} className="group-hover:text-blue-400" />
                                    </div>
                                    <span className="font-medium">Upload custom image</span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFile} accept="image/*" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Preview Area - Right Panel Drop */}
                    <div className="xl:col-span-9 flex flex-col h-full min-h-[600px]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex-1 flex flex-col relative"
                        >
                            {/* Header Tools */}
                            <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 pointer-events-none">
                                <div className="pointer-events-auto">
                                    <div className="flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-lg">
                                        <div className="px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider">
                                            Original View
                                        </div>
                                    </div>
                                </div>

                                <div className="pointer-events-auto">
                                    <motion.div
                                        key={activeSim}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-lg"
                                    >
                                        <div className="px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${activeSimulation?.color || 'from-gray-500 to-gray-600'}`} />
                                            {activeSimulation?.name || 'Simulation'}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Inner Preview Workspace */}
                            <div className="flex-1 bg-black/60 relative overflow-hidden flex items-center justify-center p-4">

                                {/* Background Grid Pattern */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPC9zdmc+')] opacity-50" />

                                <div
                                    ref={containerRef}
                                    className="relative w-full h-[80vh] max-h-[800px] rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl bg-[#111]"
                                    onMouseDown={(e) => { setIsDragging(true); handleMouseMove(e); }}
                                    onTouchStart={(e) => { setIsDragging(true); handleMouseMove(e); }}
                                    onMouseMove={handleMouseMove}
                                    onTouchMove={handleMouseMove}
                                >
                                    {previewImage ? (
                                        <>
                                            {/* Base Image (Simulated) */}
                                            <img
                                                src={previewImage}
                                                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                                style={{ filter: activeSim !== 'normal' ? `url(#${activeSim})` : 'none' }}
                                                alt="Simulated"
                                                draggable={false}
                                            />

                                            {/* Top Image (Original) masked by split slider */}
                                            <div
                                                className="absolute inset-0 overflow-hidden pointer-events-none"
                                                style={{ width: `${splitPos}%` }}
                                            >
                                                <img
                                                    src={previewImage}
                                                    className="absolute top-0 left-0 h-full w-[calc(100vw_-_2rem)] xl:w-[calc((12/12*100vw)_-_((3/12)*100vw)_-_4rem)] object-contain !w-auto !max-w-none"
                                                    style={{ width: containerRef.current?.offsetWidth ? `${containerRef.current.offsetWidth}px` : '100%' }}
                                                    alt="Original"
                                                    draggable={false}
                                                />
                                            </div>

                                            {/* Slider Divider */}
                                            <div
                                                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(0,0,0,0.5)] z-30"
                                                style={{ left: `calc(${splitPos}% - 0.125rem)` }}
                                            >
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-200">
                                                    <ArrowRightLeft size={16} className="text-gray-800" />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        /* Default Demo Content */
                                        <>
                                            {/* Base Content (Simulated) */}
                                            <div
                                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 pointer-events-none bg-black/20"
                                                style={{ filter: activeSim !== 'normal' ? `url(#${activeSim})` : 'none' }}
                                            >
                                                <div className="grid grid-cols-3 gap-4 w-64 h-64 rotate-12 opacity-80 backdrop-blur-3xl">
                                                    <div className="bg-red-500 rounded-2xl shadow-lg border border-white/10" />
                                                    <div className="bg-green-500 rounded-2xl shadow-lg border border-white/10" />
                                                    <div className="bg-blue-500 rounded-2xl shadow-lg border border-white/10" />
                                                    <div className="bg-yellow-500 rounded-2xl shadow-lg border border-white/10" />
                                                    <div className="bg-purple-500 rounded-2xl shadow-lg border border-white/10" />
                                                    <div className="bg-indigo-500 rounded-2xl shadow-lg border border-white/10" />
                                                    <div className="bg-orange-500 rounded-2xl shadow-lg border border-white/10" />
                                                    <div className="bg-pink-500 rounded-2xl shadow-lg border border-white/10" />
                                                    <div className="bg-teal-500 rounded-2xl shadow-lg border border-white/10" />
                                                </div>
                                            </div>

                                            {/* Top Content (Original) */}
                                            <div
                                                className="absolute inset-0 overflow-hidden pointer-events-none"
                                                style={{ width: `${splitPos}%` }}
                                            >
                                                <div
                                                    className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#111]"
                                                    style={{ width: containerRef.current?.offsetWidth ? `${containerRef.current.offsetWidth}px` : '100%' }}
                                                >
                                                    <div className="grid grid-cols-3 gap-4 w-64 h-64 rotate-12 opacity-80 backdrop-blur-3xl">
                                                        <div className="bg-red-500 rounded-2xl shadow-lg border border-white/10" />
                                                        <div className="bg-green-500 rounded-2xl shadow-lg border border-white/10" />
                                                        <div className="bg-blue-500 rounded-2xl shadow-lg border border-white/10" />
                                                        <div className="bg-yellow-500 rounded-2xl shadow-lg border border-white/10" />
                                                        <div className="bg-purple-500 rounded-2xl shadow-lg border border-white/10" />
                                                        <div className="bg-indigo-500 rounded-2xl shadow-lg border border-white/10" />
                                                        <div className="bg-orange-500 rounded-2xl shadow-lg border border-white/10" />
                                                        <div className="bg-pink-500 rounded-2xl shadow-lg border border-white/10" />
                                                        <div className="bg-teal-500 rounded-2xl shadow-lg border border-white/10" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Slider Divider */}
                                            <div
                                                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(0,0,0,0.5)] z-30 group-hover:bg-blue-400 transition-colors"
                                                style={{ left: `calc(${splitPos}% - 0.125rem)` }}
                                            >
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-200 hover:scale-110 transition-transform">
                                                    <ArrowRightLeft size={18} className="text-gray-900" />
                                                </div>

                                                {/* Tooltip hint initially */}
                                                {!isDragging && splitPos === 50 && (
                                                    <div className="absolute top-3/4 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg pointer-events-none whitespace-nowrap animate-bounce">
                                                        Drag to compare
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>

                <div className="mt-20 w-full max-w-5xl mx-auto">
                    <BlindVizGuide />
                </div>

            </div>
        </DashboardLayout>
    );
}
