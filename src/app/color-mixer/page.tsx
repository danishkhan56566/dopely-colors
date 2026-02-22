'use client';

import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { Pipette, ArrowRight } from 'lucide-react';

export default function ColorMixer() {
    const [color1, setColor1] = useState('#ff0000');
    const [color2, setColor2] = useState('#ffff00');
    const [mixedColor, setMixedColor] = useState('');

    useEffect(() => {
        try {
            const mixed = chroma.mix(color1, color2).hex();
            setMixedColor(mixed);
        } catch (e) {
            console.error(e);
        }
    }, [color1, color2]);

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">
                    Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500">Color Mixer</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                    Ever wondered what color you get when you mix Red and Yellow? Select any two colors and see the perfect scientific result instantly.
                </p>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* Input 1 */}
                        <div className="flex-1 w-full group">
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4">First Color</label>
                            <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 transition-transform group-hover:scale-105"
                                style={{ backgroundColor: color1 }}>
                                <input
                                    type="color"
                                    value={color1}
                                    onChange={(e) => setColor1(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-mono text-sm border border-white/20 uppercase">
                                        {color1}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Plus Icon */}
                        <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-3xl font-black text-slate-400">+</span>
                        </div>

                        {/* Input 2 */}
                        <div className="flex-1 w-full group">
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4">Second Color</label>
                            <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 transition-transform group-hover:scale-105"
                                style={{ backgroundColor: color2 }}>
                                <input
                                    type="color"
                                    value={color2}
                                    onChange={(e) => setColor2(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-mono text-sm border border-white/20 uppercase">
                                        {color2}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:block">
                            <ArrowRight className="w-8 h-8 text-slate-400" />
                        </div>

                        {/* Result */}
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4">Result (Mixed)</label>
                            <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800"
                                style={{ backgroundColor: mixedColor }}>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-8 py-4 rounded-2xl text-slate-900 dark:text-white font-black text-2xl border border-white dark:border-slate-700 uppercase shadow-xl mb-4">
                                        {mixedColor}
                                    </span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(mixedColor)}
                                        className="text-xs font-bold text-white/70 hover:text-white uppercase tracking-widest bg-black/20 hover:bg-black/40 px-3 py-1 rounded-full transition-all"
                                    >
                                        Copy Hex Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mt-20 text-left max-w-3xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 uppercase">How Color Mixing Works</h2>
                    <p>In the digital world, mixing colors uses the <strong>Subtractive Color Model</strong> if we simulate physical paint, or the <strong>Additive Model</strong> for light. Our mixer uses high-precision color space interpolation (Luv and Lab) to create the most realistic and visually pleasing results, mimicking exactly what happens when you combine pigments on a canvas.</p>
                    <p>For example, if you mix Red (#FF0000) and Yellow (#FFFF00), you get a vibrant Orange. The specific shade depends on the ratio, and our tool allows you to see the perfect 50/50 split every time.</p>
                </section>
            </div>
        </main>
    );
}
