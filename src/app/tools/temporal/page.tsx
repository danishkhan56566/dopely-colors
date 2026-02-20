'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { TemporalGuide } from '@/components/content/UtilityGuides';
import { Clock, Play, Pause, RotateCcw, Sun, Moon, Sunrise, Sunset, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';
import { motion } from 'framer-motion';

const TIME_STOPS = [
    { time: 0, color: '#0f172a', label: 'Midnight', icon: Moon },
    { time: 6, color: '#f97316', label: 'Dawn', icon: Sunrise },
    { time: 12, color: '#38bdf8', label: 'Noon', icon: Sun },
    { time: 18, color: '#a855f7', label: 'Dusk', icon: Sunset },
    { time: 24, color: '#0f172a', label: 'Midnight', icon: Moon },
];

export default function TemporalPage() {
    const [currentTime, setCurrentTime] = useState(12); // 0-24
    const [isPlaying, setIsPlaying] = useState(false);

    // Color Interpolation
    const scale = chroma.scale(TIME_STOPS.map(s => s.color))
        .domain(TIME_STOPS.map(s => s.time))
        .mode('lch');

    const currentColor = scale(currentTime).hex();

    // Complementary for text
    const textColor = chroma.contrast(currentColor, '#ffffff') > 4.5 ? '#ffffff' : '#000000';

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    const next = prev + 0.1;
                    return next >= 24 ? 0 : next;
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (t: number) => {
        const hours = Math.floor(t);
        const minutes = Math.floor((t - hours) * 60);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<TemporalGuide />}
        >
            <div
                className="min-h-screen transition-colors duration-100 flex flex-col items-center justify-center p-6 relative overflow-hidden"
                style={{ backgroundColor: currentColor, color: textColor }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="max-w-4xl w-full relative z-10 text-center space-y-12">

                    <header>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                            <Clock size={14} /> Temporal Design
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 font-mono">
                            {formatTime(currentTime)}
                        </h1>
                        <p className="text-xl opacity-80 max-w-lg mx-auto">
                            Colors change with time. Design interfaces that breathe with the circadian rhythm of your users.
                        </p>
                    </header>

                    {/* Timeline Interaction */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

                        {/* Slider */}
                        <div className="relative h-12 mb-8 flex items-center">
                            <div className="absolute inset-x-0 h-2 bg-white/20 rounded-full" />
                            <input
                                type="range"
                                min="0"
                                max="24"
                                step="0.1"
                                value={currentTime}
                                onChange={(e) => { setIsPlaying(false); setCurrentTime(parseFloat(e.target.value)); }}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                            />

                            {/* Knob */}
                            <motion.div
                                className="absolute h-8 w-8 bg-white rounded-full shadow-lg border-2 border-transparent top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ left: `${(currentTime / 24) * 100}%`, x: '-50%', borderColor: currentColor }}
                            />

                            {/* Markers */}
                            {TIME_STOPS.map((stop, i) => (
                                <div
                                    key={i}
                                    className="absolute top-8 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50"
                                    style={{ left: `${(stop.time / 24) * 100}%` }}
                                >
                                    <div className="w-1 h-2 bg-white/50 mb-1" />
                                    <stop.icon size={12} />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">{stop.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                            >
                                {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                            </button>
                            <button
                                onClick={() => { setIsPlaying(false); setCurrentTime(12); }}
                                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <RotateCcw size={20} />
                            </button>
                        </div>

                    </div>

                    {/* Data Points */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <span className="text-xs font-bold uppercase opacity-50 block mb-1">Color Code</span>
                            <div className="font-mono text-lg font-bold">{currentColor}</div>
                        </div>
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <span className="text-xs font-bold uppercase opacity-50 block mb-1">Illuminance</span>
                            <div className="font-mono text-lg font-bold">{(chroma(currentColor).luminance() * 1000).toFixed(0)} Lux</div>
                        </div>
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <span className="text-xs font-bold uppercase opacity-50 block mb-1">Mood</span>
                            <div className="font-bold flex items-center gap-2">
                                {currentTime < 6 || currentTime > 20 ? 'Restful' : currentTime > 10 && currentTime < 16 ? 'Productive' : 'Transition'}
                            </div>
                        </div>
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <span className="text-xs font-bold uppercase opacity-50 block mb-1">Use Case</span>
                            <div className="font-bold">
                                {currentTime < 6 || currentTime > 20 ? 'Dark Mode' : 'Light Mode'}
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>
        </PremiumToolLayout>
    );
}
