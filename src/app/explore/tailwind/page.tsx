'use client';

import { useState } from 'react';
import { PaletteCard } from '@/components/explore/PaletteCard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileCode, Copy, Check, Download, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import Link from 'next/link';

// Curated Tailwind-friendly palettes (High-intent for devs)
const TAILWIND_PALETTES = [
    { id: 'tw-1', colors: ['#0f172a', '#334155', '#38bdf8', '#f8fafc', '#1e293b'], likes: 1240 },
    { id: 'tw-2', colors: ['#4f46e5', '#818cf8', '#e0e7ff', '#f5f3ff', '#312e81'], likes: 890 },
    { id: 'tw-3', colors: ['#059669', '#10b981', '#6ee7b7', '#ecfdf5', '#064e3b'], likes: 750 },
    { id: 'tw-4', colors: ['#db2777', '#f472b6', '#fbcfe8', '#fff1f2', '#831843'], likes: 620 },
    { id: 'tw-5', colors: ['#7c3aed', '#a78bfa', '#ddd6fe', '#f5f3ff', '#4c1d95'], likes: 1100 },
    { id: 'tw-6', colors: ['#ea580c', '#fb923c', '#ffedd5', '#fffaf3', '#7c2d12'], likes: 540 },
];

export default function TailwindExplorePage() {
    const [activePalette, setActivePalette] = useState(TAILWIND_PALETTES[0]);
    const [copied, setCopied] = useState(false);

    const tailwindConfig = `module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '${activePalette.colors[3]}',
          100: '${activePalette.colors[2]}',
          500: '${activePalette.colors[0]}',
          600: '${activePalette.colors[1]}',
          900: '${activePalette.colors[4]}',
        },
      },
    },
  },
}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(tailwindConfig);
        setCopied(true);
        toast.success("Tailwind Config Copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB] pb-24">
                {/* Hero Section */}
                <div className="relative pt-20 pb-16 px-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 blur-[120px] rounded-full" />
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                            <FileCode size={14} /> Developer Edition
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            Tailwind CSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Color Palettes</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Stop guessing colors. Get production-ready Tailwind CSS configurations for your next SaaS, Dashboard, or Landing Page.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
                    {/* Left: Config Preview */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-gray-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">tailwind.config.js</span>
                            </div>

                            <pre className="font-mono text-sm text-blue-300 leading-relaxed overflow-x-auto">
                                {tailwindConfig}
                            </pre>

                            <button
                                onClick={handleCopy}
                                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/5 active:scale-95"
                            >
                                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                            </button>

                            <div className="mt-8 flex gap-2">
                                {activePalette.colors.map(c => (
                                    <div key={c} className="flex-1 h-3 rounded-full" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Sparkles size={18} className="text-yellow-500" /> Pro Tip
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Our Tailwind shades are automatically calculated based on the primary hex code to ensure perfect visual balance across your UI components.
                            </p>
                        </div>
                    </div>

                    {/* Right: Palette Grid */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Curated Framework Palettes</h2>
                            <Link href="/" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                                Generate New <Wand2 size={14} />
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {TAILWIND_PALETTES.map((palette) => (
                                <div 
                                    key={palette.id}
                                    onClick={() => setActivePalette(palette)}
                                    className={clsx(
                                        "cursor-pointer transition-all duration-300",
                                        activePalette.id === palette.id ? "ring-4 ring-blue-500/20 scale-[1.02]" : "hover:scale-[1.01]"
                                    )}
                                >
                                    <PaletteCard {...palette} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO Content Section */}
                <div className="max-w-4xl mx-auto px-6 mt-24">
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-3xl font-black text-gray-900 mb-8">Why use Dopley for Tailwind CSS?</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-gray-600">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">Instant Implementation</h4>
                                <p className="text-sm leading-relaxed">
                                    Stop manually picking hex codes for your Tailwind configuration. Dopley provides direct copy-paste snippets that extend your `tailwind.config.js` with semantic color names.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">Accessibility First</h4>
                                <p className="text-sm leading-relaxed">
                                    Every curated Tailwind palette on this page is tested for contrast. We ensure your brand colors work perfectly with Tailwind's utility-first typography.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
