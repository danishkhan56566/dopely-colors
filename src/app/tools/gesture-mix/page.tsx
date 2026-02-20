import { GestureMixGuide } from '@/components/content/generated_guides/GestureMixGuide';
'use client';

import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Hand, Move, MousePointer2, Camera, RefreshCw, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';
import { motion, AnimatePresence } from 'framer-motion';

export default function GestureMixPage() {
    const [color, setColor] = useState('#808080');
    const [history, setHistory] = useState<string[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [velocity, setVelocity] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPos = useRef({ x: 0, y: 0, time: 0 });

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;

        // Get coordinates
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        // Calculate Velocity (for Saturation/Intensity)
        const now = Date.now();
        const dt = now - lastPos.current.time;
        const dist = Math.sqrt(Math.pow(clientX - lastPos.current.x, 2) + Math.pow(clientY - lastPos.current.y, 2));
        const v = Math.min(1, dist / (dt || 1) * 0.5); // Normalize somewhat

        lastPos.current = { x: clientX, y: clientY, time: now };
        setVelocity(v);

        // Map to Color
        // X = Hue (0-360)
        // Y = Lightness (100-0)
        // Velocity = Saturation boost
        const hue = x * 360;
        const lightness = 1 - y * 0.8; // Avoid pure black
        const saturation = 0.5 + (v * 0.5);

        const newColor = chroma.hsl(hue, saturation, lightness).hex();
        setColor(newColor);
    };

    const handleClick = () => {
        setHistory(prev => [color, ...prev].slice(0, 10));
    };

    return (
        <PremiumToolLayout
            guide={<GestureMixGuide />}
            hideHeader={true}
            title="Gesture-Based Color Mixer"
            description="Use your webcam and bare hands to mix virtual colors in the air, translating physical motion into digital palettes."
            icon={Wand2}
            badgeText="Webcam Mode (Coming Soon)"
        >
            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* Canvas Area */}
                <div
                    ref={containerRef}
                    onMouseMove={handleMove}
                    onTouchMove={handleMove}
                    onClick={handleClick}
                    className="flex-1 relative cursor-crosshair overflow-hidden touch-none"
                    style={{ backgroundColor: color, transition: 'background-color 0.1s linear' }}
                >
                    {/* Instructions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 mix-blend-difference text-white">
                        <div className="text-center">
                            <Hand size={48} className="mx-auto mb-4 animate-pulse" />
                            <h2 className="text-4xl font-black uppercase tracking-widest hidden md:block">Move to Mix</h2>
                            <p className="text-sm font-mono mt-2">
                                X: Hue | Y: Lightness | Speed: Saturation
                            </p>
                            <p className="text-xs mt-4 border border-white/50 px-3 py-1 rounded-full inline-block">
                                Click / Tap to Save
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Cursor/Orb */}
                    <div
                        className="pointer-events-none fixed w-32 h-32 rounded-full blur-3xl mix-blend-overlay transition-transform duration-75"
                        style={{
                            left: lastPos.current.x - 64,
                            top: lastPos.current.y - 64,
                            backgroundColor: 'white',
                            transform: `scale(${1 + velocity * 2})`
                        }}
                    />
                </div>

                {/* Bottom Bar */}
                <div className="h-48 bg-white border-t border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8 z-10 shadow-xl">

                    <div className="flex items-center gap-4">
                        <div
                            className="w-20 h-20 rounded-2xl shadow-inner border border-black/5"
                            style={{ backgroundColor: color }}
                        />
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 font-mono">
                                {color}
                            </h3>
                            <div className="flex gap-2 text-xs text-gray-400 font-mono mt-1">
                                <span>{chroma(color).css('hsl')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex gap-4 overflow-x-auto pb-2 max-w-2xl px-4 no-scrollbar">
                        <AnimatePresence>
                            {history.length === 0 && (
                                <div className="text-gray-300 italic text-sm py-4">Saved colors appear here...</div>
                            )}
                            {history.map((c, i) => (
                                <motion.button
                                    key={`${c}-${i}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    onClick={() => { setColor(c); navigator.clipboard.writeText(c); }}
                                    className="w-12 h-12 rounded-xl flex-shrink-0 shadow-sm hover:scale-110 transition-transform relative group"
                                    style={{ backgroundColor: c }}
                                >
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        Copy
                                    </span>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-4 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200" title="Webcam Mode (Coming Soon)">
                            <Camera size={20} />
                        </button>
                        <button onClick={() => setHistory([])} className="p-4 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

            </div>
        </PremiumToolLayout>
    );
}
