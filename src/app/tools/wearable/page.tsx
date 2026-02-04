'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Watch, Sun, Moon, Battery, Zap, CheckCircle, Smartphone } from 'lucide-react';
import chroma from 'chroma-js';
import { motion, AnimatePresence } from 'framer-motion';

const WATCH_FACES = [
    { id: 'minimal', name: 'Minimal Digital' },
    { id: 'data', name: 'Data Rich' },
    { id: 'artistic', name: 'Artistic Gradient' },
];

const ENVIRONMENTS = [
    { id: 'indoor', name: 'Indoor (Normal)', brightness: 1, glare: 0 },
    { id: 'outdoor', name: 'Outdoor (Sunny)', brightness: 1.5, glare: 0.3 },
    { id: 'night', name: 'Night Mode', brightness: 0.6, glare: 0 },
];

export default function WearablePage() {
    const [color, setColor] = useState('#3b82f6');
    const [accent, setAccent] = useState('#A855F7');
    const [environment, setEnvironment] = useState(ENVIRONMENTS[0]);
    const [face, setFace] = useState(WATCH_FACES[0].id);

    // Analysis Logic
    const bgLuminance = chroma(color).luminance();
    const isOledFriendly = chroma(color).hex() === '#000000';
    const contrast = chroma.contrast(color, '#ffffff'); // Assuming white text

    // Battery Impact Calc (Simplified)
    // OLED: Black = 0 energy. White = 100 energy.
    // Sum of luminance * active pixels.
    // Here we just estimate based on background color luminance.
    const batteryScore = Math.max(0, 100 - (bgLuminance * 100));

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center">

                <header className="max-w-2xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Watch size={14} /> Wearable OS
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Wearable Display Optimizer</h1>
                    <p className="text-gray-500 text-lg">
                        Design for the wrist. Optimize for tiny OLED screens, outdoor glare, and battery life.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl w-full">

                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-8">

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Display Colors</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Background</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="h-10 w-10 rounded-lg cursor-pointer bg-transparent"
                                        />
                                        <button
                                            onClick={() => setColor('#000000')}
                                            className="flex-1 border border-gray-200 rounded-lg text-xs font-bold hover:bg-black hover:text-white transition-colors"
                                        >
                                            Set True Black (OLED)
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Accent</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={accent}
                                            onChange={(e) => setAccent(e.target.value)}
                                            className="h-10 w-10 rounded-lg cursor-pointer bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={accent}
                                            onChange={(e) => setAccent(e.target.value)}
                                            className="flex-1 border border-gray-200 rounded-lg px-2 font-mono text-sm uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Environment Test</h3>
                            <div className="space-y-2">
                                {ENVIRONMENTS.map(env => (
                                    <button
                                        key={env.id}
                                        onClick={() => setEnvironment(env)}
                                        className={`w-full p-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors ${environment.id === env.id ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {env.id === 'indoor' && <Smartphone size={16} />}
                                        {env.id === 'outdoor' && <Sun size={16} />}
                                        {env.id === 'night' && <Moon size={16} />}
                                        {env.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Analysis</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Readability</span>
                                    <span className={`font-bold ${contrast > 4.5 ? 'text-green-500' : 'text-red-500'}`}>
                                        {contrast.toFixed(2)}:1
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Battery Score</span>
                                    <span className={`font-bold ${batteryScore > 80 ? 'text-green-500' : 'text-orange-500'}`}>
                                        {batteryScore.toFixed(0)}/100
                                    </span>
                                </div>
                                {isOledFriendly && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 p-2 rounded-lg">
                                        <Zap size={12} /> OLED Optimized (True Black)
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Simulator */}
                    <div className="lg:col-span-2 flex items-center justify-center bg-gray-200 rounded-[50px] p-20 relative overflow-hidden">

                        {/* Background Environment Simulation */}
                        <div
                            className="absolute inset-0 transition-all duration-500"
                            style={{
                                backgroundColor: environment.id === 'night' ? '#0f172a' : environment.id === 'outdoor' ? '#fff7ed' : '#e5e7eb',
                                opacity: 1 // Controlling container bg
                            }}
                        />

                        {/* Sun Glare Overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%)',
                                opacity: environment.glare
                            }}
                        />

                        {/* Watch Device */}
                        <motion.div
                            layout
                            className="relative w-[300px] h-[360px] bg-black rounded-[48px] border-[12px] border-gray-800 shadow-2xl flex items-center justify-center overflow-hidden"
                            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                        >
                            {/* Screen */}
                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center transition-colors duration-300"
                                style={{
                                    backgroundColor: color,
                                    filter: `brightness(${environment.brightness})` // Simulate screen fighting ambient light
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {face === 'minimal' && (
                                        <motion.div
                                            key="minimal"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="text-center"
                                        >
                                            <div className="text-6xl font-black text-white tracking-tighter" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                                10:09
                                            </div>
                                            <div className="text-lg text-white/70 font-medium uppercase mt-2 tracking-widest">
                                                WED 24
                                            </div>
                                            <div className="mt-8 flex justify-center gap-4 text-white/50">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="w-10 h-1 rounded-full bg-white/20 overflow-hidden">
                                                        <div className="w-2/3 h-full" style={{ backgroundColor: accent }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold">ACT</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1">
                                                    <Battery size={16} />
                                                    <span className="text-[10px] font-bold">82%</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bezel Gloss / Reflection */}
                            <div className="absolute inset-0 rounded-[36px] border border-white/10 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-white/20 to-transparent opacity-50 rounded-tr-[36px] pointer-events-none" />

                        </motion.div>

                        {/* Strap suggestions visual */}
                        <div className="absolute -z-10 w-[200px] h-[600px] bg-gray-800 rounded-full opacity-0" /> {/* Just a placeholder */}

                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
