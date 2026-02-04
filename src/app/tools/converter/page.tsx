'use client';

import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Copy, RefreshCw, Check } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function ColorConverter() {
    const [input, setInput] = useState('#3B82F6');
    const [validColor, setValidColor] = useState<chroma.Color | null>(null);
    const [outputs, setOutputs] = useState<Record<string, string>>({});

    useEffect(() => {
        try {
            if (chroma.valid(input)) {
                const c = chroma(input);
                setValidColor(c);
                setOutputs({
                    HEX: c.hex(),
                    RGB: c.css('rgb'),
                    RGBA: `rgba(${c.rgba().join(', ')})`,
                    HSL: `hsl(${Math.round(c.get('hsl.h') || 0)}, ${Math.round(c.get('hsl.s') * 100)}%, ${Math.round(c.get('hsl.l') * 100)}%)`,
                    HSV: `hsv(${Math.round(c.get('hsv.h') || 0)}, ${Math.round(c.get('hsv.s') * 100)}%, ${Math.round(c.get('hsv.v') * 100)}%)`,
                    CMYK: `cmyk(${c.cmyk().map(v => Math.round(v * 100)).join(', ')})`,
                    LAB: `lab(${c.lab().map(v => Math.round(v)).join(', ')})`,
                    CSS: c.css(),
                });
            } else {
                setValidColor(null);
            }
        } catch (e) {
            setValidColor(null);
        }
    }, [input]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${label}`);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Color Converter</h1>
                    <p className="text-gray-500">
                        Convert colors between HEX, RGB, HSL, CMYK and more formats instantly.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Input Section */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <label className="block text-sm font-bold text-gray-700 mb-4">Enter Color</label>

                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="e.g. #3B82F6, rgb(0,0,0), blue"
                                    className={clsx(
                                        "w-full h-16 pl-6 pr-4 bg-gray-50 rounded-2xl border-2 font-mono text-lg outline-none transition-colors",
                                        validColor ? "border-transparent focus:border-blue-500" : "border-red-200 focus:border-red-500"
                                    )}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {validColor ? (
                                        <div className="w-8 h-8 rounded-full shadow-sm border border-gray-200" style={{ backgroundColor: validColor.css() }} />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">?</div>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-gray-500">
                                Supports HEX, RGB, HSL, HTML names (blue, red).
                            </p>
                        </div>

                        {/* Visual Preview Large */}
                        {validColor && (
                            <div
                                className="aspect-square rounded-3xl shadow-sm transition-colors duration-300 flex items-center justify-center"
                                style={{ backgroundColor: validColor.css() }}
                            >
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-mono font-bold text-white/90 shadow-sm mix-blend-overlay">
                                    {validColor.hex()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Outputs Section */}
                    <div className="md:col-span-7">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                                <h2 className="font-bold text-gray-900">Converted Formats</h2>
                                <RefreshCw size={16} className="text-gray-400" />
                            </div>

                            <div className="divide-y divide-gray-50">
                                {validColor ? Object.entries(outputs).map(([label, value]) => (
                                    <button
                                        key={label}
                                        onClick={() => copyToClipboard(value, label)}
                                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group text-left"
                                    >
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{label}</span>
                                            <span className="font-mono text-gray-700 font-medium">{value}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-sm transition-all text-blue-500">
                                            <Copy size={18} />
                                        </div>
                                    </button>
                                )) : (
                                    <div className="p-12 text-center text-gray-400">
                                        Enter a valid color to see formats
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
