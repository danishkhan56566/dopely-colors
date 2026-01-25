'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import chroma from 'chroma-js';

export const Hero = () => {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        // Mock AI Wait
        setTimeout(() => {
            // Mock AI Response: Hashing the prompt to simpler randomness or specific keywords
            // Real implementation would call an API
            const keywords = prompt.toLowerCase();
            let newColors: string[] = [];

            if (keywords.includes('fintech')) {
                newColors = ['#0047AB', '#00A86B', '#F5F7FA', '#1A1A1A', '#FFD700'];
            } else if (keywords.includes('food')) {
                newColors = ['#FF4500', '#FFD700', '#32CD32', '#FFF8DC', '#8B4513'];
            } else {
                // Default to Brand Palette if no keyword match or empty
                newColors = ['#0F172A', '#FFFFFF', '#00CC66', '#1E1E1E', '#00CC66'];
            }

            const hexString = newColors.map(c => c.replace('#', '')).join('-');
            router.push(`/generate/${hexString}`);
        }, 1200);
    };

    return (
        <section className="relative px-6 pt-32 pb-40 overflow-hidden">
            {/* Background Gradients (Rainbow Spectrum) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/50 rounded-full blur-[100px]" />
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-200/50 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-yellow-200/40 rounded-full blur-[80px]" />
                <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-pink-200/40 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 mb-8 animate-fade-in group hover:shadow-md transition-all">
                    <Sparkles size={14} className="text-purple-500" />
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        AI-Powered Color Engine
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 text-balance">
                    Build smarter <br />
                    <span className="text-rainbow">color systems</span> instantly
                </h1>

                <p className="text-xl text-gray-500 mb-10 max-w-2xl text-balance">
                    Dopely Colors is a professional color and design toolkit for designers and developers. Generate palettes, gradients, Tailwind colors, and design systems instantly.
                </p>

                {/* AI Input Box */}
                <form onSubmit={handleGenerate} className="w-full max-w-lg relative group mb-6">
                    <div className="absolute inset-0 bg-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-gray-200">
                        <div className="pl-4 text-gray-400">
                            <Sparkles size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Describe your project (e.g., 'Fintech SaaS dashboard')..."
                            className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-400 text-gray-900 h-12"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        // Removed autoFocus to avoid mobile keyboard pop-up annoyance if unwanted
                        // autoFocus 
                        />
                        <button
                            type="submit"
                            disabled={isGenerating} // Allow generating even if empty (triggers default)
                            className="bg-rainbow text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
                        >
                            {isGenerating ? 'Dreaming...' : 'Start Exploring'}
                            {!isGenerating && <ArrowRight size={18} />}
                        </button>
                    </div>
                </form>

                <div className="flex gap-4">
                    <button
                        onClick={() => router.push('/explore')}
                        className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                    >
                        Explore Palettes
                    </button>
                </div>

                {/* Quick Tags */}
                <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
                    <span>Try:</span>
                    {['SaaS Dashboard', 'E-commerce', 'Portfolio', 'Medical App'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setPrompt(tag)}
                            className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
