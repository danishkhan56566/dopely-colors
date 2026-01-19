'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HexColorPicker } from 'react-colorful';
import {
    Plus,
    Copy,
    Code,
    Check,
    Grid,
    Sliders,
    ArrowRight,
    Palette,
    Download
} from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

// --- Types ---
type GradientStop = {
    color: string;
    position: number;
    id: string;
};

type GradientType = 'linear' | 'radial' | 'conic';

type SavedGradient = {
    name: string;
    css: string;
    tags: string[];
};

// --- Data ---
const PRESET_GRADIENTS: SavedGradient[] = [
    { name: 'Sunset Vibes', css: 'linear-gradient(to right, #ff9966, #ff5e62)', tags: ['Warm', 'Sunset'] },
    { name: 'Ocean Blue', css: 'linear-gradient(to right, #2193b0, #6dd5ed)', tags: ['Cool', 'Blue'] },
    { name: 'Lush Green', css: 'linear-gradient(to right, #11998e, #38ef7d)', tags: ['Nature', 'Green'] },
    { name: 'Purple Haze', css: 'linear-gradient(to right, #8e2de2, #4a00e0)', tags: ['Vivid', 'Purple'] },
    { name: 'Midnight City', css: 'linear-gradient(to right, #232526, #414345)', tags: ['Dark', 'Monochrome'] },
    { name: 'Cherry Blossom', css: 'linear-gradient(to right, #fbc2eb, #a6c1ee)', tags: ['Pastel', 'Pink'] },
    { name: 'Lemon Twist', css: 'linear-gradient(to right, #f7971e, #ffd200)', tags: ['Warm', 'Yellow'] },
    { name: 'Neon Life', css: 'linear-gradient(to right, #c471ed, #f64f59)', tags: ['Neon', 'Vivid'] },
    { name: 'Cool Sky', css: 'linear-gradient(to right, #2980b9, #6dd5fa, #ffffff)', tags: ['Cool', 'Sky'] },
    { name: 'Royal Gold', css: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728)', tags: ['Luxury', 'Metallic'] },
    { name: 'Subtle Grey', css: 'linear-gradient(to right, #bdc3c7, #2c3e50)', tags: ['Neutral', 'Professional'] },
    { name: 'Instagram', css: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', tags: ['Social', 'Trending'] },
];

export default function GradientGeneratorPage() {
    const [activeTab, setActiveTab] = useState<'create' | 'browse'>('create');

    // Builder State
    const [type, setType] = useState<GradientType>('linear');
    const [angle, setAngle] = useState(115);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
    const [stops, setStops] = useState<GradientStop[]>([
        { id: '1', color: '#2575ff', position: 100 },
        { id: '2', color: '#8b5cf6', position: 49 },
        { id: '3', color: '#ff5656', position: 0 }
    ]);
    const [activeStopId, setActiveStopId] = useState<string>('1');

    // Helper to generate CSS
    const generatedCSS = useMemo(() => {
        const sortedStops = [...stops].sort((a, b) => a.position - b.position);
        const stopString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

        if (type === 'linear') {
            return `linear-gradient(${angle}deg, ${stopString})`;
        } else if (type === 'radial') {
            return `radial-gradient(circle at ${position.x}% ${position.y}%, ${stopString})`;
        } else {
            return `conic-gradient(from ${angle}deg at ${position.x}% ${position.y}%, ${stopString})`;
        }
    }, [type, angle, stops, position]);

    // Handlers
    const addStop = () => {
        if (stops.length >= 5) return;
        const newId = Math.random().toString(36).substr(2, 9);
        setStops([...stops, { id: newId, color: '#ffffff', position: 50 }]);
        setActiveStopId(newId);
    };

    const removeStop = (id: string) => {
        if (stops.length <= 2) return;
        setStops(stops.filter(s => s.id !== id));
        if (activeStopId === id) setActiveStopId(stops[0].id);
    };

    const updateStop = (id: string, updates: Partial<GradientStop>) => {
        setStops(stops.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const copyCSS = (css: string) => {
        navigator.clipboard.writeText(css);
        toast.success('Copied CSS to clipboard');
    };

    const activeStop = stops.find(s => s.id === activeStopId);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col py-8 px-6">
                <div className="max-w-7xl mx-auto w-full">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gradient Generator</h1>
                            <p className="text-gray-500">Create beautiful gradients or browse our curated collection.</p>
                        </div>
                        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                            <button
                                onClick={() => setActiveTab('browse')}
                                className={clsx("px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all", activeTab === 'browse' ? "bg-black text-white shadow" : "text-gray-500 hover:text-gray-900")}
                            >
                                <Grid size={16} /> Library
                            </button>
                            <button
                                onClick={() => setActiveTab('create')}
                                className={clsx("px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all", activeTab === 'create' ? "bg-black text-white shadow" : "text-gray-500 hover:text-gray-900")}
                            >
                                <Sliders size={16} /> Builder
                            </button>
                        </div>
                    </div>

                    {activeTab === 'create' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Editor Controls */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">

                                    {/* Type Selection */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase block mb-3">Type</label>
                                        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                                            {(['linear', 'radial', 'conic'] as const).map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setType(t)}
                                                    className={clsx("flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all", type === t ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600")}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Angle (Linear & Conic) */}
                                    {(type === 'linear' || type === 'conic') && (
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase block mb-3 flex justify-between">
                                                <span>{type === 'conic' ? 'Starting Angle' : 'Angle'}</span>
                                                <span>{angle}°</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                value={angle}
                                                onChange={(e) => setAngle(Number(e.target.value))}
                                                className="w-full accent-black h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    )}

                                    {/* Position (Radial & Conic) */}
                                    {(type === 'radial' || type === 'conic') && (
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase block mb-3">Center Position</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-[10px] text-gray-500 font-bold">X</span>
                                                        <span className="text-[10px] text-gray-500">{position.x}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={position.x}
                                                        onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
                                                        className="w-full accent-black h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-[10px] text-gray-500 font-bold">Y</span>
                                                        <span className="text-[10px] text-gray-500">{position.y}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={position.y}
                                                        onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
                                                        className="w-full accent-black h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stops List */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Color Stops</label>
                                            <button onClick={addStop} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
                                                <Plus size={12} /> ADD
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {stops.map((stop, index) => (
                                                <div
                                                    key={stop.id}
                                                    className={clsx(
                                                        "p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all",
                                                        activeStopId === stop.id ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-100 hover:border-gray-200"
                                                    )}
                                                    onClick={() => setActiveStopId(stop.id)}
                                                >
                                                    <div className="w-8 h-8 rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: stop.color }} />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-gray-900">Stop {index + 1}</span>
                                                            <span className="text-xs font-mono text-gray-400">{stop.position}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={stop.position}
                                                            onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                                                            className="w-full mt-2 accent-blue-500 h-1 bg-gray-200 rounded appearance-none"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Picker */}
                                    {activeStop && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="text-xs font-bold text-gray-400 uppercase block mb-3">Selected Color</label>
                                            <div className="w-full aspect-square custom-picker-wrapper">
                                                <HexColorPicker color={activeStop.color} onChange={(c) => updateStop(activeStop.id, { color: c })} style={{ width: '100%', height: '100%' }} />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Preview Window */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <div
                                    className="w-full h-[400px] rounded-3xl shadow-sm border border-gray-100 relative group overflow-hidden"
                                    style={{ background: generatedCSS }}
                                >
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => copyCSS(generatedCSS)}
                                            className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-white"
                                        >
                                            <Copy size={16} /> Copy CSS
                                        </button>
                                    </div>
                                </div>

                                {/* Component Previews */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 h-[200px]">
                                        <button className="px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105" style={{ background: generatedCSS }}>
                                            Primary Action
                                        </button>
                                        <div style={{ background: generatedCSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.5rem' }}>
                                            Gradient Text
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3">
                                        <h3 className="font-bold text-gray-900">Code Export</h3>
                                        <div className="flex-1 bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-600 overflow-x-auto border border-gray-100 relative group">
                                            {generatedCSS}
                                            <button
                                                onClick={() => copyCSS(generatedCSS)}
                                                className="absolute top-2 right-2 p-1.5 bg-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-black"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-600 overflow-x-auto border border-gray-100 relative group">
                                            {`bg-[${generatedCSS.replace(/\s/g, '_')}]`} {/* Naive tailwind arbitrary value */}
                                            <div className="absolute top-2 right-2 text-[10px] font-bold text-gray-300 uppercase">Tailwind JIT</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {PRESET_GRADIENTS.map((gradient, i) => (
                                <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                    <div
                                        className="w-full aspect-[4/3] rounded-2xl mb-4 relative overflow-hidden"
                                        style={{ background: gradient.css }}
                                    >
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => copyCSS(gradient.css)}
                                                className="bg-white text-black p-2 rounded-lg shadow-sm hover:scale-110 transition-transform"
                                                title="Copy CSS"
                                            >
                                                <Copy size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between px-1">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm mb-1">{gradient.name}</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {gradient.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <style jsx global>{`
                    .custom-picker-wrapper .react-colorful {
                        width: 100%;
                        height: 100%;
                        border-radius: 1rem;
                    }
                 `}</style>
            </div>
        </DashboardLayout>
    );
}
