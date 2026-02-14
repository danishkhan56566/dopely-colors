'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Type, MoveHorizontal, MoveVertical, Sliders } from 'lucide-react';
import { FontGuide } from '@/components/content/UtilityGuides';
import chroma from 'chroma-js';

// Google Fonts that support variable axes are great.
// We'll simulate the "Concept" here using standard CSS for now if external font loading is tricky.
// Actually standard fonts support 'wght' usually.

export default function VariableFontsPage() {
    const [color, setColor] = useState('#2563eb');
    const [bg, setBg] = useState('#eff6ff');
    const [weight, setWeight] = useState(400); // 100-900
    const [slant, setSlant] = useState(0); // -10 to 0 (Simulated via transform or font-style)
    const [width, setWidth] = useState(100); // 75-125 (stretch)

    const contrast = chroma.contrast(color, bg);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white p-6 md:p-10 flex flex-col">
                <header className="max-w-4xl mx-auto w-full mb-10 text-center flex-shrink-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Type size={14} /> Typography Lab
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Variable Font Pairing</h1>
                    <p className="text-lg text-gray-500">
                        Test how color optical weight interacts with variable font axes.
                        Heavy fonts can handle lower contrast; thin fonts need higher contrast.
                    </p>
                </header>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full">

                    {/* Controls */}
                    <div className="lg:col-span-1 bg-gray-50 p-6 rounded-3xl h-fit border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Sliders size={18} /> Axis Controls
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase text-gray-400 mb-2">
                                    <span>Background</span>
                                    <span>Foreground</span>
                                </div>
                                <div className="flex gap-2">
                                    <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-12 rounded-lg cursor-pointer" />
                                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-lg cursor-pointer" />
                                </div>
                                <div className={`text-center mt-2 text-sm font-bold px-3 py-1 rounded-full inline-block w-full ${contrast > 4.5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    Contrast: {contrast.toFixed(2)}:1
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div>
                                    <label className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                                        Weight (wght) <span>{weight}</span>
                                    </label>
                                    <input
                                        type="range" min="100" max="900" step="50"
                                        value={weight} onChange={(e) => setWeight(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                                        Width (wdth) <span>{width}%</span>
                                    </label>
                                    <input
                                        type="range" min="75" max="150" step="5"
                                        value={width} onChange={(e) => setWidth(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                                        Slant (slnt) <span>{slant}deg</span>
                                    </label>
                                    <input
                                        type="range" min="-15" max="0" step="1"
                                        value={slant} onChange={(e) => setSlant(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Canvas */}
                    <div
                        className="lg:col-span-3 rounded-3xl flex flex-col justify-center p-12 transition-colors duration-200"
                        style={{ backgroundColor: bg, color: color }}
                    >
                        {/* Note: Inter is a variable font, but sticking to system-ui for broader compatibility if needed, using standard CSS props */}
                        <div
                            style={{
                                fontWeight: weight,
                                transform: `scaleX(${width / 100}) skewX(${slant}deg)`,
                                transition: 'all 0.2s ease',
                                transformOrigin: 'left center'
                            }}
                        >
                            <h2 className="text-6xl md:text-8xl leading-none mb-4 tracking-tight">
                                Ag
                            </h2>
                            <h2 className="text-5xl md:text-7xl leading-tight mb-8">
                                The quick brown fox jumps over the lazy dog.
                            </h2>
                            <p className="text-xl md:text-2xl max-w-2xl opacity-80">
                                Variable fonts allow for infinite flexibility.
                                Adjusting weight and width changes the "Optical Volume" of color.
                                A thin font needs higher contrast than a bold one.
                            </p>
                        </div>

                        <div className="mt-12 pt-12 border-t opacity-30 text-sm font-mono flex gap-8">
                            <span>font-weight: {weight};</span>
                            <span>font-width: {width}%;</span>
                            <span>font-style: {slant !== 0 ? `oblique ${Math.abs(slant)}deg` : 'normal'};</span>
                        </div>
                    </div>

                </div>
                <FontGuide />
            </div>
        </DashboardLayout>
    );
}
