'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Fingerprint, Heart, Activity, Brain } from 'lucide-react';
import chroma from 'chroma-js';
import { motion } from 'framer-motion';

// Simulate Bio-Data
const STRESS_LEVELS = [
    { label: 'Relaxed', value: 20, color: '#10b981' }, // Green
    { label: 'Focused', value: 50, color: '#3b82f6' }, // Blue
    { label: 'Stressed', value: 80, color: '#f59e0b' }, // Orange
    { label: 'Panic', value: 95, color: '#ef4444' }, // Red
];

export default function BiometricPage() {
    const [stress, setStress] = useState(50);
    const [heartRate, setHeartRate] = useState(70);
    const [isSimulating, setIsSimulating] = useState(false);

    // Dynamic Palette Calculation
    // As stress increases -> Shift to calming colors (Cool Blues/Greens) OR Alert colors?
    // "Biophilic Design" theory suggests:
    // High Stress -> Needs Calming (Low Saturation, Cool Hue)
    // But typically apps MIRROR state. Let's do "Adaptive calming".
    // Goal: Counteract stress.

    // Low Stress (20) -> Vibrant, energetic allows.
    // High Stress (90) -> Needs absolute calm (Pastels, Cool tones).

    const AdaptivePalette = (stressLevel: number) => {
        // Base Hue: Moves from Orange (Energy) to Blue/Teal (Calm)
        const targetHue = 200 + (stressLevel * 0.5); // 210 (Blue) to 250 (Purple/Blue)

        // Saturation: Drops as stress rises to reduce cognitive load
        const targetSat = 1 - (stressLevel / 150);

        // Lightness: Increases to feel "lighter"
        const targetLight = 0.5 + (stressLevel / 300);

        const primary = chroma.hsl(targetHue, targetSat, targetLight).hex();

        return {
            primary,
            secondary: chroma(primary).set('hsl.h', '+30').hex(),
            bg: chroma(primary).brighten(2.5).hex(),
            text: chroma(primary).darken(3).hex()
        };
    };

    const theme = AdaptivePalette(stress);

    // Heartbeat Simulation
    useEffect(() => {
        if (isSimulating) {
            const interval = setInterval(() => {
                setHeartRate(prev => {
                    const target = 60 + (stress * 0.8); // 80 to 140
                    const drift = (Math.random() - 0.5) * 5;
                    return Math.round(prev + (target - prev) * 0.1 + drift);
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isSimulating, stress]);

    return (
        <DashboardLayout>
            <div
                className="min-h-screen transition-colors duration-1000 p-6 md:p-10 flex flex-col items-center"
                style={{ backgroundColor: theme.bg, color: theme.text }}
            >
                <header className="max-w-4xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur">
                        <Fingerprint size={14} /> Bio-Adaptive Interface
                    </div>
                    <h1 className="text-4xl font-black mb-4">Biometric Analyzer</h1>
                    <p className="opacity-70 text-lg max-w-xl mx-auto">
                        Interfaces that feel. Simulating how color systems can adapt to physiological signals like heart rate and stress (HealthKit Integration Concept).
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full">

                    {/* Bio-Console */}
                    <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/50 shadow-xl">

                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <Activity size={20} /> Live Vitals
                            </h3>
                            <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        </div>

                        {/* Heart Rate Viz */}
                        <div className="mb-8 text-center py-8 bg-white/40 rounded-3xl relative overflow-hidden">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 60 / heartRate }}
                            >
                                <Heart size={64} className="mx-auto text-red-500 fill-red-500/20" />
                            </motion.div>
                            <div className="text-5xl font-black mt-4 tabular-nums">{heartRate}</div>
                            <div className="text-xs uppercase font-bold opacity-50">BPM</div>

                            {/* ECG Line (Fake) */}
                            <svg className="absolute bottom-0 left-0 w-full h-12 opacity-30" preserveAspectRatio="none">
                                <path d="M0,20 L20,20 L30,5 L40,35 L50,20 L100,20 L110,5 L120,35 L130,20 L400,20" vectorEffect="non-scaling-stroke" stroke="currentColor" fill="none" />
                            </svg>
                        </div>

                        {/* Stress Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold">
                                <span>User Stress Level</span>
                                <span>{stress}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={stress}
                                onChange={(e) => { setStress(parseInt(e.target.value)); setIsSimulating(true); }}
                                className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer overflow-hidden"
                                style={{ background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)` }}
                            />
                            <div className="flex justify-between text-xs opacity-50">
                                <span>Zen</span>
                                <span>Panic</span>
                            </div>
                        </div>

                    </div>

                    {/* Adaptive UI Preview */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-white/20 blur-3xl rounded-full" style={{ backgroundColor: theme.primary }} />

                        <motion.div
                            layout
                            className="relative bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[500px] flex flex-col"
                        >
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gray-100" />
                                    <Brain size={24} style={{ color: theme.primary }} />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">
                                    {stress > 70 ? 'Take a breath.' : stress > 40 ? 'Stay focused.' : 'You are flowing.'}
                                </h2>
                                <p className="opacity-60">
                                    {stress > 70 ? 'Detecting high cognitive load. Reducing visual noise.' : 'System optimal. Standard contrast applied.'}
                                </p>
                            </div>

                            <div className="flex-1 bg-gray-50 p-6 space-y-4">
                                {/* Simulated Cards */}
                                <motion.div
                                    className="p-6 rounded-3xl text-white shadow-lg transition-colors duration-500"
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    <div className="opacity-80 mb-2 font-medium">Next Task</div>
                                    <div className="text-xl font-bold">Deep Work Session</div>
                                    <div className="mt-4 flex gap-2">
                                        <div className="h-2 w-12 bg-white/30 rounded-full" />
                                        <div className="h-2 w-8 bg-white/10 rounded-full" />
                                    </div>
                                </motion.div>

                                <div className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="font-bold">Notifications</div>
                                        {stress > 60 && <div className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">MUTED</div>}
                                    </div>
                                    {stress > 60 ? (
                                        <div className="text-sm opacity-50 text-center py-4">
                                            Notifications paused for calm.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex gap-3 items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                                                    <div className="h-2 w-24 bg-gray-100 rounded" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
