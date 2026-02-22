'use client';

import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { MousePointer2, Copy, RefreshCw } from 'lucide-react';

export default function ColorWheelPage() {
    const [rotation, setRotation] = useState(0);
    const [baseColor, setBaseColor] = useState('#3b82f6'); // Default Blue

    const harmonies = useMemo(() => {
        try {
            const color = chroma(baseColor);
            return [
                { name: 'Complementary', color: color.set('hsl.h', (color.get('hsl.h') + 180) % 360).hex() },
                { name: 'Analogous L', color: color.set('hsl.h', (color.get('hsl.h') + 30) % 360).hex() },
                { name: 'Analogous R', color: color.set('hsl.h', (color.get('hsl.h') - 30) % 360).hex() },
                { name: 'Triadic 1', color: color.set('hsl.h', (color.get('hsl.h') + 120) % 360).hex() },
                { name: 'Triadic 2', color: color.set('hsl.h', (color.get('hsl.h') + 240) % 360).hex() },
            ];
        } catch (e) {
            return [];
        }
    }, [baseColor]);

    const handleWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const wheel = e.currentTarget;
        const rect = wheel.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        const normalizedAngle = (angle + 360) % 360;

        const newColor = chroma.hsl(normalizedAngle, 0.8, 0.5).hex();
        setBaseColor(newColor);
        setRotation(normalizedAngle);
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight uppercase">
                        Interactive <span className="text-blue-600">Color Wheel</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Explore color relationships and discover perfect harmonies. Our wheel uses precision HSL math to help you find the science behind your next palette.
                    </p>
                </header>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* The Wheel */}
                    <div className="relative flex justify-center items-center group">
                        <div
                            className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full shadow-2xl transition-all duration-700 cursor-crosshair border-[20px] border-white dark:border-slate-800"
                            style={{
                                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                                transform: `rotate(${rotation}deg)`
                            }}
                            onClick={handleWheelClick}
                        >
                            <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-transparent transition-all" />
                        </div>

                        {/* Center Indicator */}
                        <div className="absolute w-24 h-24 bg-white dark:bg-slate-900 rounded-full shadow-xl flex items-center justify-center border-4 border-slate-100 dark:border-slate-800">
                            <div className="w-16 h-16 rounded-full shadow-inner" style={{ backgroundColor: baseColor }} />
                        </div>

                        {/* Instruction Overlay */}
                        <div className="absolute -bottom-8 bg-black/80 text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <MousePointer2 className="w-3 h-3" /> Click anywhere on the wheel to pick a color
                        </div>
                    </div>

                    {/* The Results & Harmonies */}
                    <div className="space-y-8">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Base Color</label>
                            <div className="flex items-center gap-4">
                                <span className="text-5xl font-mono font-black text-slate-900 dark:text-white uppercase">
                                    {baseColor}
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(baseColor)}
                                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:text-blue-600 transition-colors"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-blue-500" /> Color Harmonies
                            </h3>
                            {harmonies.map((h, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl border border-white/20" style={{ backgroundColor: h.color }} />
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{h.name}</span>
                                    </div>
                                    <span className="font-mono text-sm text-slate-400">{h.color}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <section className="mt-32 max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-3xl font-black uppercase">Understanding the Color Wheel</h2>
                    <p>The color wheel is the fundamental tool for understanding <strong>Color Theory</strong>. First created by Sir Isaac Newton in 1666, it maps out the physical spectrum of light in a circular format. This allows designers to mathematically identify harmonies—colors that look pleasing together when combined in a palette.</p>

                    <h3>Primary, Secondary, and Tertiary Colors</h3>
                    <p>Our interactive wheel simplifies the complexity of the spectrum. Red, Yellow, and Blue sit as the primary anchors. Mixing them creates secondary colors like Orange and Green, while the further nuances create <strong>Tertiary Colors</strong> like Red-Orange or Yellow-Green.</p>

                    <h3>Why Color Harmony Matters</h3>
                    <p>Using a color wheel isn't just about picking pretty colors; it's about accessibility and psychology. Complementary colors (opposites) provide the highest contrast, making them perfect for Call-to-Action buttons. Analogous colors (neighbors) create a serene and uniform feeling, ideal for background surfaces and secondary elements.</p>
                </section>
            </div>
        </main>
    );
}
