'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
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
    Download,
    Sparkles,
    Trash2,
    RotateCw,
    Maximize2
} from 'lucide-react';
import { GradientGuide } from '@/components/content/GradientGuide';
import { toast } from 'sonner';
import clsx from 'clsx';
import chroma from 'chroma-js';

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

import { useSearchParams } from 'next/navigation';

function GradientGeneratorContent() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get('type') as GradientType | null;

    const [activeTab, setActiveTab] = useState<'create' | 'browse'>('create');
    const [allGradients, setAllGradients] = useState<SavedGradient[]>(PRESET_GRADIENTS);

    useEffect(() => {
        const fetchRemote = async () => {
            try {
                const res = await fetch('/api/gradients');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();

                if (data && Array.isArray(data) && data.length > 0) {
                    const mapped: SavedGradient[] = data.map((g: any) => ({
                        name: g.name,
                        css: g.css,
                        tags: g.tags || []
                    }));
                    setAllGradients([...PRESET_GRADIENTS, ...mapped]);
                }
            } catch (err) {
                console.error('Error loading gradients:', err);
                // Fallback silently to presets
            }
        };
        fetchRemote();
    }, []);

    // Builder State
    const [type, setType] = useState<GradientType>(initialType && ['linear', 'radial', 'conic'].includes(initialType) ? initialType : 'linear');
    const [angle, setAngle] = useState(135);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
    const [stops, setStops] = useState<GradientStop[]>([
        { id: '1', color: '#6366f1', position: 0 },
        { id: '2', color: '#a855f7', position: 50 },
        { id: '3', color: '#ec4899', position: 100 }
    ]);
    const [activeStopId, setActiveStopId] = useState<string>('2');

    // New Feature State
    const [noiseOpacity, setNoiseOpacity] = useState(20);
    const [easing, setEasing] = useState<'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'>('linear');

    // Helper to generate CSS
    const generatedCSS = useMemo(() => {
        let finalStops = [...stops].sort((a, b) => a.position - b.position);

        // Apply Easing Interpolation
        if (easing !== 'linear' && finalStops.length >= 2) {
            const easedStops: GradientStop[] = [];

            for (let i = 0; i < finalStops.length - 1; i++) {
                const start = finalStops[i];
                const end = finalStops[i + 1];
                const steps = 10;

                for (let j = 0; j <= steps; j++) {
                    const t = j / steps; // 0 to 1

                    // Easing functions
                    let easedT = t;
                    if (easing === 'ease-in') easedT = t * t;
                    if (easing === 'ease-out') easedT = 1 - (1 - t) * (1 - t);
                    if (easing === 'ease-in-out') easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

                    const pos = start.position + (end.position - start.position) * easedT;

                    // Simple RGB lerp for now (keeping it dependency free inside memo if possible, or use chroma)
                    // We can rely on CSS to mix the colors if we just place stops? 
                    // No, CSS mixes linearly between stops. To ease, we need to place INTERMEDIATE colors.
                    // We need a color mixer here. Let's use simple hex mixing or chroma if available.
                    // Since chroma is imported elsewhere, let's assuming it's available or use a helper.
                    // Actually, we can just let CSS handle color mixing if we only adjusting DISTANCE?
                    // No, easing "position" means color X takes longer to turn into color Y. 
                    // So we must calculate the color at the eased time.

                    // Simple Hex interpolator for this snippet to avoid heavy deps in loop
                    // Or just use chroma since we are client side
                    const mixedColor = chroma.mix(start.color, end.color, t, 'rgb').hex();

                    if (j === 0) easedStops.push(start);
                    else if (j === steps) { /* End added next loop */ }
                    else easedStops.push({ id: `${start.id}-e-${j}`, color: mixedColor, position: pos });
                }
            }
            easedStops.push(finalStops[finalStops.length - 1]);
            finalStops = easedStops;
        }

        const stopString = finalStops.map(s => `${s.color} ${Math.round(s.position * 100) / 100}%`).join(', ');

        if (type === 'linear') {
            return `linear-gradient(${angle}deg, ${stopString})`;
        } else if (type === 'radial') {
            return `radial-gradient(circle at ${position.x}% ${position.y}%, ${stopString})`;
        } else {
            return `conic-gradient(from ${angle}deg at ${position.x}% ${position.y}%, ${stopString})`;
        }
    }, [type, angle, stops, position, easing]);


    // Handlers
    const addStop = () => {
        if (stops.length >= 5) {
            toast.error("Max 5 stops allowed");
            return;
        }
        const newId = Math.random().toString(36).substr(2, 9);
        // Add slightly offset from center
        setStops([...stops, { id: newId, color: '#ffffff', position: 55 }]);
        setActiveStopId(newId);
    };

    const removeStop = (id: string) => {
        if (stops.length <= 2) {
            toast.error("Min 2 stops required");
            return;
        }
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
            <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000" />
                    <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-blob animation-delay-2000" />
                </div>

                <div className="w-full max-w-7xl px-4 py-12 sm:px-6 relative z-10 space-y-12">

                    {/* Premium Header */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <RotateCw size={14} className="text-indigo-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Gradient Studio V2.0
                            </span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200/50">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                                    Craft <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 saturate-150">Perfect Gradients</span>
                                </h1>
                                <p className="text-lg text-gray-500 font-medium">Design custom flows or explore our curated library.</p>
                            </div>

                            <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-gray-200/50 ring-1 ring-black/5">
                                <button
                                    onClick={() => setActiveTab('create')}
                                    className={clsx(
                                        "px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300",
                                        activeTab === 'create'
                                            ? "bg-white text-gray-900 shadow-md ring-1 ring-black/5 scale-100"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-white/50 scale-95"
                                    )}
                                >
                                    <Sliders size={18} /> Builder
                                </button>
                                <button
                                    onClick={() => setActiveTab('browse')}
                                    className={clsx(
                                        "px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300",
                                        activeTab === 'browse'
                                            ? "bg-white text-gray-900 shadow-md ring-1 ring-black/5 scale-100"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-white/50 scale-95"
                                    )}
                                >
                                    <Grid size={18} /> Library
                                </button>
                            </div>
                        </div>
                    </div>

                    {activeTab === 'create' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                            {/* Editor Controls */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-white/50 ring-1 ring-black/5 space-y-8">

                                    {/* Type Selection */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3 pl-1">Gradient Type</label>
                                        <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
                                            {(['linear', 'radial', 'conic'] as const).map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setType(t)}
                                                    className={clsx(
                                                        "flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all",
                                                        type === t ? "bg-white text-black shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                                                    )}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Angle Slider */}
                                    {(type === 'linear' || type === 'conic') && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end px-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Angle</label>
                                                <span className="text-sm font-black text-gray-900 bg-gray-100 px-2 py-1 rounded-lg min-w-[3rem] text-center">{angle}°</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                value={angle}
                                                onChange={(e) => setAngle(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                            />
                                        </div>
                                    )}

                                    {/* Stops Management */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Color Stops</label>
                                            <button
                                                onClick={addStop}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                            >
                                                <Plus size={14} /> Add Color
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {stops.map((stop, index) => (
                                                <div
                                                    key={stop.id}
                                                    className={clsx(
                                                        "p-2 pr-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all group",
                                                        activeStopId === stop.id
                                                            ? "border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                                                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                                                    )}
                                                    onClick={() => setActiveStopId(stop.id)}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-xl shadow-sm border border-black/5 ring-2 ring-white"
                                                        style={{ backgroundColor: stop.color }}
                                                    />

                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className={clsx("text-xs font-bold uppercase", activeStopId === stop.id ? "text-indigo-700" : "text-gray-500")}>
                                                                Stop {index + 1}
                                                            </span>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); removeStop(stop.id); }}
                                                                className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={stop.position}
                                                            onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                                                            className={clsx(
                                                                "w-full h-1.5 rounded-lg appearance-none cursor-pointer",
                                                                activeStopId === stop.id ? "bg-indigo-200 accent-indigo-600" : "bg-gray-200 accent-gray-400"
                                                            )}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Picker */}
                                    {activeStop && (
                                        <div className="pt-6 border-t border-gray-100">
                                            <div className="w-full aspect-square custom-picker-wrapper shadow-lg rounded-[1.5rem] border border-gray-100">
                                                <HexColorPicker
                                                    color={activeStop.color}
                                                    onChange={(c) => updateStop(activeStop.id, { color: c })}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {/* Advanced Controls (Easing & Noise) */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Blend Mode (Easing)</label>
                                        </div>
                                        <div className="flex gap-1 bg-gray-100/50 p-1 rounded-xl">
                                            {(['linear', 'ease-in-out'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setEasing(m as any)}
                                                    className={clsx(
                                                        "flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all",
                                                        easing === m ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                                                    )}
                                                >
                                                    {m.replace(/-/g, ' ')}
                                                </button>
                                            )))}
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex justify-between items-end px-1 mb-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Sparkles size={12} /> Grain / Noise
                                                </label>
                                                <span className="text-xs font-bold text-gray-900">{noiseOpacity}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={noiseOpacity}
                                                onChange={(e) => setNoiseOpacity(Number(e.target.value))}
                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Window */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <div
                                    className="w-full h-[500px] rounded-[2.5rem] shadow-2xl shadow-indigo-200/20 border-4 border-white ring-1 ring-black/5 relative group overflow-hidden transition-all duration-500"
                                    style={{ background: generatedCSS }}
                                >
                                    <div
                                        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay transition-opacity duration-300"
                                        style={{ opacity: noiseOpacity / 100 }}
                                    />

                                    <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                                        <button
                                            onClick={() => copyCSS(generatedCSS)}
                                            className="bg-white/90 backdrop-blur-md text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/5 flex items-center gap-2 hover:bg-white hover:scale-105 transition-all"
                                        >
                                            <Copy size={16} /> Copy CSS
                                        </button>
                                        <button
                                            className="bg-black/80 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/5 flex items-center gap-2 hover:bg-black hover:scale-105 transition-all"
                                        >
                                            <Maximize2 size={16} /> Fullscreen
                                        </button>
                                    </div>

                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col md:flex-row items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                            <div className="flex-1 font-mono text-xs text-gray-600 break-all">
                                                {generatedCSS}
                                            </div>
                                            <div className="h-8 w-px bg-gray-200 hidden md:block" />
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={() => copyCSS(generatedCSS)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black transition-colors" title="Copy raw CSS"><Copy size={18} /></button>
                                                <button onClick={() => copyCSS(`bg-[${generatedCSS.replace(/\s/g, '_')}]`)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-cyan-600 transition-colors" title="Copy Tailwind class"><Code size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Component Previews */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 ring-1 ring-black/5 flex flex-col items-center justify-center gap-6 min-h-[250px] relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10" />
                                        <button className="px-10 py-4 rounded-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 duration-300" style={{ background: generatedCSS }}>
                                            Primary Action
                                        </button>
                                        <div className="h-px w-32 bg-gray-200" />
                                        <div style={{ background: generatedCSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: '2.5rem', lineHeight: 1 }} className="drop-shadow-sm">
                                            Gradient Text
                                        </div>
                                    </div>

                                    <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 ring-1 ring-black/5 flex items-center justify-center min-h-[250px] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gray-50/50 -z-10" />
                                        <div className="w-40 h-40 rounded-full shadow-2xl relative" style={{ background: generatedCSS }}>
                                            <div className="absolute inset-0 rounded-full shadow-inner ring-1 ring-black/5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {allGradients.map((gradient, i) => (
                                <div key={i} className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
                                    <div
                                        className="w-full aspect-[4/3] rounded-2xl mb-4 relative overflow-hidden shadow-inner"
                                        style={{ background: gradient.css }}
                                    >
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                            <button
                                                onClick={() => copyCSS(gradient.css)}
                                                className="bg-white text-black w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                                                title="Copy CSS"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Basic logic to load preset into builder
                                                    // Ideally setActiveTab('create') and setStops(...)
                                                    copyCSS(gradient.css);
                                                    toast.success("Ready to paste!");
                                                }}
                                                className="bg-black text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                                                title="Use"
                                            >
                                                <Palette size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-2 pb-2">
                                        <h3 className="font-bold text-gray-900 text-base mb-2">{gradient.name}</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {gradient.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                                    {tag}
                                                </span>
                                            ))}
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
                        border-radius: 1.25rem;
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
                    }
                     .custom-picker-wrapper .react-colorful__saturation {
                        border-radius: 1.25rem 1.25rem 0 0;
                    }
                    .custom-picker-wrapper .react-colorful__hue {
                        border-radius: 0 0 1.25rem 1.25rem;
                        height: 28px;
                    }
                    .custom-picker-wrapper .react-colorful__pointer {
                        width: 24px;
                        height: 24px;
                        border-width: 3px;
                        border-color: white;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                 `}</style>

                <GradientGuide />
            </div>
        </DashboardLayout>
    );
}

export default function GradientGeneratorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>}>
            <GradientGeneratorContent />
        </Suspense>
    );
}
