'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { SpatialGuide } from '@/components/content/AdvancedGuides';
import { Box, Layers, Move3d, Sparkles, Maximize2, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';
import { motion } from 'framer-motion';

export default function SpatialPage() {
    const [glassColor, setGlassColor] = useState('#ffffff');
    const [opacity, setOpacity] = useState(0.6);
    const [blur, setBlur] = useState(20);
    const [saturation, setSaturation] = useState(1.2);
    const [previewBg, setPreviewBg] = useState('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop');

    const backdropStyle = {
        backgroundColor: chroma(glassColor).alpha(opacity).css(),
        backdropFilter: `blur(${blur}px) saturate(${saturation * 100}%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation * 100}%)`,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    };

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<SpatialGuide />}
        >
            <div
                className="min-h-screen bg-cover bg-center flex flex-col items-center p-6 md:p-10 relative overflow-hidden"
                style={{ backgroundImage: `url(${previewBg})` }}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

                <header className="relative z-10 max-w-4xl w-full text-center mb-12 text-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider mb-4">
                        <Box size={14} /> Spatial Design
                    </div>
                    <h1 className="text-5xl font-black mb-4 tracking-tight">Spatial Reality</h1>
                    <p className="text-xl opacity-80">
                        Design "Glassmorphism" materials for Mixed Reality (XR) interfaces.
                        Balance readability with environmental immersion.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl w-full relative z-10">

                    {/* Controls */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="lg:col-span-1 bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] text-white shadow-2xl"
                    >
                        <h3 className="font-bold text-xl mb-8 flex items-center gap-2">
                            <Layers size={20} /> Material Settings
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <label className="text-xs font-bold uppercase opacity-50 mb-2 block">Tint Color</label>
                                <div className="flex gap-4">
                                    <input
                                        type="color"
                                        value={glassColor}
                                        onChange={(e) => setGlassColor(e.target.value)}
                                        className="h-10 w-10 rounded-lg cursor-pointer bg-transparent border-none"
                                    />
                                    <input
                                        type="text"
                                        value={glassColor}
                                        onChange={(e) => setGlassColor(e.target.value)}
                                        className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Opacity (Alpha)</span>
                                    <span className="font-mono">{Math.round(opacity * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.01"
                                    value={opacity}
                                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                                />

                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Blur Radius</span>
                                    <span className="font-mono">{blur}px</span>
                                </div>
                                <input
                                    type="range" min="0" max="50" step="1"
                                    value={blur}
                                    onChange={(e) => setBlur(parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                                />

                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Saturation Boost</span>
                                    <span className="font-mono">x{saturation}</span>
                                </div>
                                <input
                                    type="range" min="0" max="3" step="0.1"
                                    value={saturation}
                                    onChange={(e) => setSaturation(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <label className="text-xs font-bold uppercase opacity-50 mb-4 block">Environment</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['https://images.unsplash.com/photo-1550684848-fac1c5b4e853', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713'].map((url, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPreviewBg(url + '?q=80&w=2070&auto=format&fit=crop')}
                                            className="h-12 rounded-lg bg-cover bg-center border-2 border-transparent hover:border-white/50 transition-all"
                                            style={{ backgroundImage: `url(${url}?q=60&w=100&auto=format&fit=crop)` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Simulation Area */}
                    <div className="lg:col-span-2 perspective-1000 flex items-center justify-center">
                        <motion.div
                            initial={{ rotateX: 5, rotateY: -5, scale: 0.9 }}
                            animate={{ rotateX: 0, rotateY: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 50 }}
                            className="w-full max-w-2xl rounded-[40px] border border-white/20 text-gray-800 p-8 flex flex-col gap-8 transition-all duration-300"
                            style={backdropStyle}
                        >
                            {/* Window Header */}
                            <div className="flex items-center justify-between opacity-50">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-black/20" />
                                    <div className="w-3 h-3 rounded-full bg-black/20" />
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest">Spatial Window</div>
                                <Maximize2 size={16} />
                            </div>

                            {/* Content */}
                            <div className="flex gap-8 items-start">
                                <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl flex items-center justify-center text-white">
                                    <Move3d size={40} />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black mb-2" style={{ color: chroma(glassColor).luminance() > 0.6 ? '#000' : '#fff' }}>
                                        Depth & Material
                                    </h2>
                                    <p className="text-lg leading-relaxed font-medium" style={{ color: chroma(glassColor).luminance() > 0.6 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' }}>
                                        In spatial computing, windows are physical objects.
                                        They need to blur the world behind them to ensure text remains readable
                                        while grounding the user in their environment.
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 mt-auto">
                                <div className="h-12 flex-1 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center font-bold">
                                    Cancel
                                </div>
                                <div className="h-12 flex-1 rounded-2xl bg-black text-white hover:scale-105 transition-transform flex items-center justify-center font-bold shadow-lg">
                                    Confirm
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>
                
                <SpatialGuide />
            </div>
        </PremiumToolLayout>
    );
}
