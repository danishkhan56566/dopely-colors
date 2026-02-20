'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { AIPromptGuide } from '@/components/content/AdvancedGuides';
import { toast } from 'sonner';
import { Wand2, Copy, Sparkles, Tag, Layers, RefreshCw, Type, Palette, LayoutDashboard, Component } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const MOODS = ['Calm', 'Luxury', 'Energetic', 'Dark Aesthetic', 'Futuristic', 'Minimal'];
const STYLES = ['Cinematic Lighting', 'Pastel Themes', 'Retro Color Grading', 'Synthwave Neon', 'Corporate Branding', 'Natural Earth Tones'];
const CONTEXTS = ['Image Generation', 'UI / UX Design', 'Brand Identity', 'Concept Art', 'Marketing Visuals'];

interface GeneratedPrompt {
    fullText: string;
    paletteDesc: string;
    lighting: string;
    contrast: string;
    hierarchy: string;
}

export default function AIColorPromptLab() {
    const [vision, setVision] = useState('');
    const [mood, setMood] = useState(MOODS[0]);
    const [style, setStyle] = useState(STYLES[0]);
    const [context, setContext] = useState(CONTEXTS[0]);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GeneratedPrompt | null>(null);

    const handleGenerate = () => {
        if (!vision.trim()) {
            toast.error("Please describe your vision first");
            return;
        }

        setLoading(true);

        // Simulate AI Processing time
        setTimeout(() => {
            // Very basic but effective generation logic for MVP to demonstrate value
            const adjectives = mood === 'Futuristic' || mood === 'Dark Aesthetic' ? 'electric, high-contrast, deep' : 'soft, balanced, harmonious';
            const lightingDesc = style.includes('Cinematic') ? 'volumetric, dramatic shadows, rim lighting' : style.includes('Pastel') ? 'diffused, soft ambient lighting, airy' : 'structured studio lighting, crisp highlights';
            const baseColorInfo = style.includes('Neon') ? 'cyans and magentas' : style.includes('Earth') ? 'terracotta, olive, ochre' : 'monochromatic base with a vibrant pop';

            const generated: GeneratedPrompt = {
                fullText: `/imagine prompt: ${vision.trim()}. Core visual identity: ${mood.toLowerCase()} mood, ${style.toLowerCase()}. Color palette features ${adjectives} tones centered around ${baseColorInfo}. Lighting should be ${lightingDesc}. Maintain high professional quality, precise contrast hierarchy, 8k resolution, photorealistic render --ar 16:9`,
                paletteDesc: `Primary base of ${baseColorInfo} enriched with ${adjectives} accents tailored for a ${mood.toLowerCase()} emotional response.`,
                lighting: lightingDesc.charAt(0).toUpperCase() + lightingDesc.slice(1) + ' to emphasize depth and texture.',
                contrast: mood === 'Futuristic' || mood === 'Dark Aesthetic' ? 'High contrast ratio with deep true-blacks and glowing highlights.' : 'Medium-low contrast for a soothing, cohesive viewing experience.',
                hierarchy: context === 'UI / UX Design' ? 'Strict 60-30-10 rule application for backgrounds, surfaces, and interactive accents.' : 'Organic flow with focal points highlighted by maximum saturation.'
            };

            setResult(generated);
            setLoading(false);
            toast.success("Prompt Engineered Successfully", { icon: '✨' });
        }, 1200);
    };

    const handleExportSystem = () => {
        if (!result) return;

        const exportData = {
            prompt: result.fullText,
            theory: {
                palette: result.paletteDesc,
                lighting: result.lighting,
                contrast: result.contrast,
                hierarchy: result.hierarchy
            },
            metadata: {
                vision,
                mood,
                style,
                context,
                generatedAt: new Date().toISOString()
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-color-prompt-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Design System Exported (JSON)");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <PremiumToolLayout
            title="AI Color Prompt Lab"
            description="Generate intelligent, highly structured color prompts for AI design, image generation, and creative workflows. Translate your vision into machine-understandable instructions."
            icon={Sparkles}
            badgeText="AI Engineering"
            guide={(
                <div className="max-w-7xl mx-auto px-6 mt-12 pb-24 relative z-10">
                    <AIPromptGuide />
                </div>
            )}
        >
            <div className="grid lg:grid-cols-12 gap-8">

                {/* Left Side: Inputs */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white/50 ring-1 ring-black/5 space-y-8">
                        {/* Vision Input */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                                <Type size={20} className="text-blue-500" />
                                <h2>1. Describe Your Vision</h2>
                            </div>
                            <textarea
                                value={vision}
                                onChange={(e) => setVision(e.target.value)}
                                placeholder="e.g. futuristic neon cyberpunk interface with a sleek dashboard..."
                                className="w-full bg-white/50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none"
                            />
                        </div>

                        <div className="w-full h-px bg-gray-200/50 my-2" />

                        {/* Configuration */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 text-gray-900 font-bold border-b border-gray-100 pb-4">
                                <Settings2Icon size={20} className="text-blue-500" />
                                <h2>2. Refine Parameters</h2>
                            </div>

                            {/* Mood */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Mood / Emotion</label>
                                <div className="flex flex-wrap gap-2">
                                    {MOODS.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMood(m)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                                                mood === m
                                                    ? "bg-gray-900 text-white shadow-md shadow-gray-900/10 scale-[1.02]"
                                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Style */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Visual Style</label>
                                <div className="flex flex-wrap gap-2">
                                    {STYLES.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setStyle(s)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                                                style === s
                                                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm scale-[1.02]"
                                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Context */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Target Context</label>
                                <select
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    className="w-full bg-white/50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                >
                                    {CONTEXTS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={clsx(
                                "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed",
                                loading ? "bg-blue-600 shadow-blue-500/20 text-white" : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-gray-900/20 hover:-translate-y-0.5 min-h-[60px]"
                            )}
                        >
                            {loading ? (
                                <><RefreshCw className="animate-spin" size={20} /> Engineering Prompt...</>
                            ) : (
                                <><Wand2 size={20} /> Generate Intelligence</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side: Output */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Main Prompt Banner */}
                                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="bg-gray-900 p-6 sm:p-8 relative group">
                                        <div className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                            Structured AI Prompt
                                        </div>
                                        <div className="mt-4 mb-8">
                                            <p className="text-xl sm:text-2xl text-white font-serif leading-relaxed italic">
                                                "{result.fullText}"
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => copyToClipboard(result.fullText)}
                                                className="flex-1 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Copy size={18} /> Copy Full Prompt
                                            </button>
                                            <button
                                                onClick={handleGenerate}
                                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <RefreshCw size={18} /> Generate Variant
                                            </button>
                                        </div>
                                    </div>

                                    {/* Data Breakdown */}
                                    <div className="p-6 sm:p-8 bg-white grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Palette size={16} />
                                                <h4 className="text-xs font-bold uppercase tracking-wider">Palette Theory</h4>
                                            </div>
                                            <p className="text-sm text-gray-900 font-medium leading-relaxed">{result.paletteDesc}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <LightbulbIcon size={16} />
                                                <h4 className="text-xs font-bold uppercase tracking-wider">Lighting Behavior</h4>
                                            </div>
                                            <p className="text-sm text-gray-900 font-medium leading-relaxed">{result.lighting}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <ContrastIcon size={16} />
                                                <h4 className="text-xs font-bold uppercase tracking-wider">Contrast Depth</h4>
                                            </div>
                                            <p className="text-sm text-gray-900 font-medium leading-relaxed">{result.contrast}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Layers size={16} />
                                                <h4 className="text-xs font-bold uppercase tracking-wider">Visual Hierarchy</h4>
                                            </div>
                                            <p className="text-sm text-gray-900 font-medium leading-relaxed">{result.hierarchy}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Export formats missing contextually but nice to have in 10x */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                            <LayoutDashboard size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Push to Design System</h3>
                                            <p className="text-sm text-gray-500">Extract matching tokens automatically</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleExportSystem}
                                        className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Export System
                                    </button>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-300">
                                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Component className="text-gray-300" size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Awaiting Parameters</h2>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Describe your vision and configure your settings on the left to engineer a structured AI prompt.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PremiumToolLayout>
    );
}

// Simple local mock icons to replace those not imported directly due to huge lucide-react import
function Settings2Icon({ size, className }: { size: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>;
}

function LightbulbIcon({ size, className }: { size: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>;
}

function ContrastIcon({ size, className }: { size: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 18a6 6 0 1 0 0-12v12z" /></svg>;
}
