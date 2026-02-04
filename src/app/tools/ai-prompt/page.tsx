'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sparkles, ArrowRight, Wand2, Copy, Palette } from 'lucide-react';
import { generatePaletteFromPrompt } from './actions';
import { toast } from 'sonner';
import clsx from 'clsx';

export default function AIPromptLab() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res = await generatePaletteFromPrompt(prompt);
            setResult(res.data);
            if (!res.success) {
                toast.error("AI Service limited - Using offline mode");
            } else {
                toast.success("Palette Generated!");
            }
        } catch (e) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const suggestedPrompts = [
        "Cyberpunk city at midnight",
        "Organic skincare brand",
        "Cozy coffee shop in autumn",
        "Futuristic banking app"
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                            <Wand2 size={32} />
                        </div>
                        AI Color Prompt Lab
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Describe a mood, scene, or brand, and let AI generate the perfect color system for it.
                    </p>
                </div>

                <div className="w-full max-w-4xl space-y-12">

                    {/* Input Section */}
                    <div className="bg-white p-2 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-2 relative z-20">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder="e.g. A serene japanese garden in spring..."
                            className="flex-1 px-6 py-4 rounded-2xl text-lg outline-none text-gray-800 placeholder:text-gray-400"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={clsx(
                                "px-8 py-4 rounded-2xl font-bold text-white transition-all flex items-center gap-2 shadow-lg",
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
                            )}
                        >
                            {loading ? 'Thinking...' : <>Generate <Sparkles size={18} /></>}
                        </button>
                    </div>

                    {/* Suggestions */}
                    {!result && (
                        <div className="flex flex-wrap justify-center gap-3">
                            {suggestedPrompts.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPrompt(p)}
                                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Results */}
                    {result && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            {/* Header */}
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">{result.palette_name}</h2>
                                <p className="text-gray-500 mt-2 max-w-xl mx-auto">{result.description}</p>
                            </div>

                            {/* Palette Strip */}
                            <div className="flex flex-col md:flex-row h-64 md:h-40 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white">
                                {result.colors.map((c: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex-1 relative group cursor-pointer"
                                        style={{ backgroundColor: c.hex }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(c.hex);
                                            toast.success(`Copied ${c.hex}`);
                                        }}
                                    >
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                            <span className="font-mono text-white font-bold drop-shadow-md">{c.hex}</span>
                                            <span className="text-[10px] text-white/90 uppercase tracking-wider mt-1">{c.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contextual Usage */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
                                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-6 text-center">AI Suggested Usage</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                                    {Object.entries(result.usage_tips).map(([role, hex]: [string, any]) => (
                                        <div key={role} className="flex flex-col items-center text-center gap-3 group">
                                            <div className="w-16 h-16 rounded-2xl shadow-md border border-gray-100 transition-transform group-hover:scale-110" style={{ backgroundColor: hex }} />
                                            <div>
                                                <h4 className="font-bold text-gray-900 capitalize text-sm">{role}</h4>
                                                <span className="text-xs text-gray-400 font-mono">{hex}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mock UI Preview */}
                            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                                <div className="bg-gray-100 p-2 flex gap-2 border-b border-gray-200">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div
                                    className="p-12 text-center"
                                    style={{ backgroundColor: result.usage_tips.background }}
                                >
                                    <div
                                        className="max-w-md mx-auto p-8 rounded-3xl shadow-xl backdrop-blur-sm"
                                        style={{ backgroundColor: result.usage_tips.surface }}
                                    >
                                        <div
                                            className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: result.usage_tips.primary + '20', color: result.usage_tips.primary }}
                                        >
                                            <Palette size={24} />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 break-words" style={{ color: result.usage_tips.primary }}>
                                            {result.palette_name}
                                        </h3>
                                        <p className="mb-6 leading-relaxed" style={{ color: result.usage_tips.secondary }}>
                                            This is a preview of how your AI-generated palette translates into a real user interface layout.
                                        </p>
                                        <button
                                            className="px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 shadow-lg"
                                            style={{ backgroundColor: result.usage_tips.accent, color: '#fff' }}
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
