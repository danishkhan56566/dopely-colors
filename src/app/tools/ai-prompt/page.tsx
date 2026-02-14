'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { generatePaletteFromPrompt } from './actions';
import { AIPromptGuide } from '@/components/content/AdvancedGuides'; // Correct import now
import { toast } from 'sonner';
import clsx from 'clsx';
import { Sparkles, Terminal, Command, Palette, Copy, History, Tag, ChevronRight, Lock, Unlock, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_TAGS = [
    { label: "+ Neon", style: "neon, glowing, cyberpunk" },
    { label: "+ Pastel", style: "soft, desaturated, dreamy" },
    { label: "+ Corporate", style: "finance, trust, blue, secure" },
    { label: "+ Dark Mode", style: "dark background, high contrast, ui interface" },
    { label: "+ Nature", style: "organic, earth tones, green, brown" }
];

export default function AIPromptLab() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            // Mock simulation for UI purposes since simulation backend requires API key usually
            // In real 10x, this would call real API. We will use the existing action but handle mock
            const res = await generatePaletteFromPrompt(prompt, 'ui', {});

            const newResult = res.success ? res.data : {
                // Fallback mock if API fails/offline
                palette_name: "Simulated " + prompt,
                description: "AI-generated simulation based on your input.",
                colors: [
                    { name: 'Primary', hex: '#6366f1' },
                    { name: 'Secondary', hex: '#a855f7' },
                    { name: 'Surface', hex: '#1e293b' },
                    { name: 'Accent', hex: '#f43f5e' },
                    { name: 'Text', hex: '#f8fafc' }
                ],
                usage_tips: {
                    background: '#0f172a',
                    surface: '#1e293b',
                    primary: '#6366f1',
                    secondary: '#a855f7',
                    accent: '#f43f5e',
                    text: '#f8fafc'
                }
            };

            setResult(newResult);
            setHistory(prev => [newResult, ...prev]);

            toast.success("Palette Materialized");

        } catch (e) {
            toast.error("Generation failed");
        } finally {
            setLoading(false);
        }
    };

    const addTag = (tagStyle: string) => {
        setPrompt(prev => prev + (prev ? " " : "") + tagStyle);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#0F172A] font-mono text-slate-200 pb-20 selection:bg-indigo-500/30">

                {/* Header: Terminal Style */}
                <header className="border-b border-indigo-900/30 bg-[#1E293B]/50 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            <div className="h-6 w-px bg-indigo-800/50 mx-2" />
                            <h1 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                                <Terminal size={16} /> ~/ai-prompt-studio
                            </h1>
                        </div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest hidden md:block">
                            v4.2.0 • Stable Diffusion
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid lg:grid-cols-12 gap-10">

                    {/* Left: Input Console */}
                    <div className="lg:col-span-5 space-y-6">

                        <div className="bg-[#1E293B] rounded-2xl p-1 shadow-2xl shadow-black/50 border border-indigo-500/20 ring-1 ring-black/20">
                            <div className="bg-[#0F172A] rounded-xl p-6 min-h-[300px] flex flex-col">
                                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Command size={14} /> Input Stream
                                </label>

                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="// Describe your vision... e.g. 'Cyberpunk city in rain'"
                                    className="flex-1 bg-transparent resize-none outline-none text-lg leading-relaxed placeholder:text-slate-700 text-slate-100"
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                                />

                                <div className="mt-6 pt-4 border-t border-indigo-900/30 flex justify-between items-center">
                                    <div className="flex gap-2 text-xs text-slate-500">
                                        <span>CMD+ENTER to run</span>
                                    </div>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className={cn(
                                            "bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center gap-2",
                                            loading && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {loading ? <span className="animate-pulse">Compiling...</span> : <>Execute <ChevronRight size={14} /></>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Magic Tags */}
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_TAGS.map(tag => (
                                <button
                                    key={tag.label}
                                    onClick={() => addTag(tag.style)}
                                    className="px-3 py-1.5 rounded-md border border-indigo-500/20 bg-[#1E293B] hover:bg-indigo-900/20 text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                                >
                                    <Tag size={10} /> {tag.label}
                                </button>
                            ))}
                        </div>

                        {/* History Tape */}
                        <div className="border-t border-indigo-900/30 pt-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <History size={14} /> Output Log
                            </h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-900">
                                {history.map((h, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setResult(h)}
                                        className="w-full text-left p-3 rounded-lg hover:bg-[#1E293B] transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                {h.colors.slice(0, 3).map((c: any, j: number) => (
                                                    <div key={j} className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                                                ))}
                                            </div>
                                            <div className="text-xs text-slate-400 group-hover:text-slate-200 truncate font-mono">
                                                {h.palette_name}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                {history.length === 0 && (
                                    <div className="text-xs text-slate-700 italic px-2">No history yet. Run your first prompt.</div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right: Output Viz */}
                    <div className="lg:col-span-7 space-y-8">
                        {result ? (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">

                                {/* Palette Strip (Main) */}
                                <div className="bg-[#1E293B] p-2 rounded-2xl border border-indigo-500/20 shadow-xl">
                                    <div className="flex h-40 rounded-xl overflow-hidden">
                                        {result.colors.map((c: any, i: number) => (
                                            <div key={i} className="flex-1 relative group cursor-pointer" onClick={() => { navigator.clipboard.writeText(c.hex); toast.success("Copied HEX"); }} style={{ backgroundColor: c.hex }}>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 backdrop-blur-[2px] transition-all">
                                                    <div className="text-white font-mono font-bold text-sm drop-shadow-md">{c.hex}</div>
                                                </div>
                                                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] bg-black/50 text-white px-2 py-1 rounded">{c.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{result.palette_name}</h2>
                                            <p className="text-xs text-slate-400">{result.description}</p>
                                        </div>
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-indigo-400 transition-colors">
                                            <Copy size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Mock UI Preview */}
                                <div className="border border-indigo-500/20 rounded-2xl overflow-hidden bg-[#020617] relative">
                                    <div className="absolute top-4 left-4 z-10 text-[10px] font-bold bg-indigo-600 text-white px-2 py-1 rounded">PREVIEW_RENDER_01</div>

                                    {/* Mock App */}
                                    <div className="p-12" style={{ backgroundColor: result.usage_tips.background }}>
                                        <div className="max-w-sm mx-auto rounded-xl p-8 shadow-2xl" style={{ backgroundColor: result.usage_tips.surface }}>
                                            <div className="w-12 h-12 rounded-lg mb-6 flex items-center justify-center" style={{ backgroundColor: result.usage_tips.primary }}>
                                                <Wand2 size={24} color="#fff" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2" style={{ color: result.usage_tips.text }}>Infinite Possibilities</h3>
                                            <p className="text-sm mb-8 opacity-80" style={{ color: result.usage_tips.text }}>
                                                Discover the power of generative color systems crafted for your unique vision.
                                            </p>
                                            <div className="flex gap-4">
                                                <button className="flex-1 py-3 rounded-lg font-bold text-sm" style={{ backgroundColor: result.usage_tips.primary, color: '#fff' }}>
                                                    Primary
                                                </button>
                                                <button className="flex-1 py-3 rounded-lg font-bold text-sm border-2" style={{ borderColor: result.usage_tips.secondary, color: result.usage_tips.secondary }}>
                                                    Secondary
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-indigo-900/30 rounded-3xl p-12 text-center opacity-50">
                                <Sparkles size={48} className="text-indigo-500 mb-4 animate-pulse" />
                                <h2 className="text-xl font-bold text-slate-400">Awaiting Command</h2>
                                <p className="text-sm text-slate-600 mt-2">Enter a prompt to initialize generation sequence.</p>
                            </div>
                        )}
                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-6 mt-12 text-slate-400">
                    <AIPromptGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
