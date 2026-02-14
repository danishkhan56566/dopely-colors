'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sparkles, Wand2, Copy, RefreshCw, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';
import { toast } from 'sonner';
import { SemanticGuide } from '@/components/content/GenerativeGuides';

// --- SEMANTIC ENGINE (Simulated AI) ---
const KEYWORDS: Record<string, string[]> = {
    // Emotions
    'happy': ['#FFD700', '#FF8C00', '#FF69B4', '#00BFFF', '#7FFF00'],
    'sad': ['#708090', '#2F4F4F', '#483D8B', '#778899', '#B0C4DE'],
    'energetic': ['#FF4500', '#FF0000', '#FFFF00', '#00FF00', '#FF1493'],
    'calm': ['#E0FFFF', '#98FB98', '#ADD8E6', '#F0F8FF', '#F5F5DC'],
    'romantic': ['#FFC0CB', '#DC143C', '#800000', '#FF69B4', '#FA8072'],
    'mystery': ['#4B0082', '#000000', '#483D8B', '#800080', '#2F4F4F'],

    // Branding
    'luxury': ['#000000', '#D4AF37', '#C0C0C0', '#FFFFFF', '#333333'],
    'tech': ['#00BFFF', '#C0C0C0', '#000000', '#1E90FF', '#2F4F4F'],
    'eco': ['#228B22', '#8B4513', '#F5DEB3', '#556B2F', '#9ACD32'],
    'corporate': ['#000080', '#808080', '#FFFFFF', '#000000', '#4682B4'],
    'startup': ['#FF4500', '#32CD32', '#00BFFF', '#FFD700', '#FFFFFF'],

    // Nature
    'ocean': ['#00008B', '#00BFFF', '#20B2AA', '#48D1CC', '#F0F8FF'],
    'forest': ['#006400', '#228B22', '#8B4513', '#DEB887', '#556B2F'],
    'desert': ['#EDC9AF', '#F4A460', '#D2691E', '#8B0000', '#FFDEAD'],
    'sunset': ['#FF4500', '#FF8C00', '#FFD700', '#8B0000', '#4B0082'],
};

const INITIAL_PALETTE = ['#eeeeee', '#cccccc', '#999999', '#666666', '#333333'];

export default function SemanticGenPage() {
    const [prompt, setPrompt] = useState('');
    const [palette, setPalette] = useState<string[]>(INITIAL_PALETTE);
    const [isGenerating, setIsGenerating] = useState(false);
    const [semanticTags, setSemanticTags] = useState<string[]>([]);

    const generatePalette = () => {
        setIsGenerating(true);
        setSemanticTags([]);

        // Simulate AI Processing Delay
        setTimeout(() => {
            const words = prompt.toLowerCase().split(/\s+/);
            let foundColors: string[] = [];
            let tags: string[] = [];

            // 1. Keyword Matching
            words.forEach(word => {
                // Check direct match
                if (KEYWORDS[word]) {
                    foundColors.push(...KEYWORDS[word]);
                    tags.push(word);
                }
                // Check partial match (basic stemming)
                else {
                    const root = Object.keys(KEYWORDS).find(k => word.includes(k));
                    if (root) {
                        foundColors.push(...KEYWORDS[root]);
                        tags.push(root);
                    }
                }
            });

            // 2. Fallback Generation (Random harmonic)
            if (foundColors.length === 0) {
                const base = chroma.random();
                foundColors = chroma.scale([base, base.set('hsl.h', '+120')]).mode('lch').colors(5);
                tags.push('random (no keywords found)');
            }

            // 3. Mix & match to get exactly 5 colors
            // If we have too many, pick random 5. If too few, interpolate.
            let finalPalette: string[];
            if (foundColors.length >= 5) {
                finalPalette = foundColors.sort(() => 0.5 - Math.random()).slice(0, 5);
            } else {
                // Not enough colors found? Interpolate
                finalPalette = chroma.scale(foundColors).colors(5);
            }

            setPalette(finalPalette);
            setSemanticTags([...new Set(tags)]);
            setIsGenerating(false);
        }, 800);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

                {/* Left: Input Console */}
                <div className="w-full md:w-1/3 bg-white border-r border-gray-100 p-8 flex flex-col z-10 shadow-xl">
                    <header className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles size={14} /> AI Generator
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Semantic Color</h1>
                        <p className="text-gray-500">
                            Describe your brand, emotion, or scene. Our semantic engine translates text into color theory.
                        </p>
                    </header>

                    <div className="flex-1 flex flex-col gap-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Your Prompt</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A luxury fashion brand that feels mysterious and elegant..."
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl h-40 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none resize-none transition-all text-gray-700 leading-relaxed font-medium"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                            <span>Try:</span>
                            <button onClick={() => setPrompt("Eco-friendly organic food startup")} className="hover:text-indigo-600 underline decoration-dotted">Eco Startup</button>
                            <button onClick={() => setPrompt("Energetic gym clothing brand")} className="hover:text-indigo-600 underline decoration-dotted">Energetic Gym</button>
                            <button onClick={() => setPrompt("Calm spa ocean vibes")} className="hover:text-indigo-600 underline decoration-dotted">Calm Spa</button>
                            <button onClick={() => setPrompt("Cyberpunk sci-fi city")} className="hover:text-indigo-600 underline decoration-dotted">Cyberpunk</button>
                        </div>

                        <button
                            onClick={generatePalette}
                            disabled={!prompt || isGenerating}
                            className={`mt-auto w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${!prompt ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]'}`}
                        >
                            {isGenerating ? <RefreshCw className="animate-spin" /> : <Wand2 />}
                            {isGenerating ? 'Analyzing...' : 'Generate Palette'}
                        </button>
                    </div>
                </div>

                {/* Right: Visualization */}
                <div className="w-full md:w-2/3 relative flex flex-col">

                    {/* Palette Strips */}
                    <div className="h-2/3 flex">
                        {palette.map((color, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="h-full flex-1 flex flex-col items-center justify-end pb-12 group relative"
                                style={{ backgroundColor: color }}
                            >
                                <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 flex flex-col items-center gap-2">
                                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg font-mono font-bold text-sm shadow-sm uppercase">
                                        {color}
                                    </span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(color);
                                            toast.success(`Copied ${color} to clipboard!`);
                                        }}
                                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur transition-colors"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Context/Preview */}
                    <div className="h-1/3 bg-white border-t border-gray-100 p-8 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                Semantic Analysis
                            </h3>
                            <div className="flex gap-2">
                                {semanticTags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                                {semanticTags.length === 0 && <span className="text-gray-400 italic">No prompt analyzed yet</span>}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    const text = `Semantic Palette for "${prompt}": ${palette.join(', ')}`;
                                    navigator.clipboard.writeText(text);
                                    toast.success('Palette exported to clipboard!');
                                }}
                                className="px-6 py-3 border border-gray-200 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                            >
                                <Share2 size={18} /> Export
                            </button>
                        </div>
                    </div>

                </div>
                <SemanticGuide />
            </div>
        </DashboardLayout>
    );
}
