import React from 'react';
import Link from 'next/link';
import { Palette, Zap, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

// --- Shared Styles ---
const Section = ({ children }: { children: React.ReactNode }) => (
    <section className="max-w-5xl mx-auto py-20 px-6 text-gray-700 bg-white border-t border-gray-100">
        <div className="prose prose-lg prose-indigo max-w-none">
            {children}
        </div>
    </section>
);

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight text-center">{children}</h2>
);

const Subtitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed text-center mb-16">{children}</p>
);

// --- 1. Home Page Guide ---
// --- 1. Home Page Guide (Redesigned) ---
export const HomeGuide = () => (
    <section className="max-w-7xl mx-auto py-32 px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-24 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-widest mb-8">
                <Zap size={14} className="fill-slate-900" />
                The Science of Color
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                Engineering <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Perception.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                Most tools give you 5 random colors that look nice in a stripe but fail in a real UI. We built Dopely to fix that.
            </p>
        </div>

        {/* 1. The Core Conflict: Bento Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mb-6">
            {/* Dark Card: The Problem */}
            <div className="bg-[#020617] rounded-[2.5rem] p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden group border border-slate-900 shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] group-hover:bg-blue-600/20 transition-colors duration-700" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
                            <Palette size={24} className="text-blue-400" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400">The Problem</span>
                    </div>

                    <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Why "Math"<br />isn't enough</h3>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8 max-w-lg">
                        Computers see color linearly. Humans don't. Pure yellow (<code className="text-yellow-300 font-mono">#FFFF00</code>) and pure blue (<code className="text-blue-400 font-mono">#0000FF</code>) share the same math "value", but your eye screams at the yellow while the blue recedes.
                    </p>
                    <Link href="/guides/hcl-color-space" className="inline-flex items-center gap-2 text-blue-400 font-bold group-hover:translate-x-2 transition-transform cursor-pointer hover:text-blue-300">
                        Learn about HCL Space <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {/* Visual Demo Card - Interactive */}
            <div className="bg-slate-50 rounded-[2.5rem] p-10 md:p-14 border border-slate-200 flex flex-col justify-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="relative z-10 w-full space-y-8">
                    {/* Linear Math (Bad) */}
                    <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
                        <div className="flex justify-between items-end">
                            <span className="font-bold text-xs uppercase tracking-widest text-slate-400">Linear Math</span>
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Unbalanced</span>
                        </div>
                        <div className="h-20 rounded-2xl w-full flex overflow-hidden ring-4 ring-white shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500">
                            <div className="flex-1 bg-[#FFFF00]" />
                            <div className="flex-1 bg-[#00FF00]" />
                            <div className="flex-1 bg-[#0000FF]" />
                        </div>
                    </div>

                    {/* Perceptual Model (Good) */}
                    <div className="space-y-3 transform scale-105">
                        <div className="flex justify-between items-end">
                            <span className="font-bold text-xs uppercase tracking-widest text-slate-900">Dopely Engine</span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded flex items-center gap-1">
                                <CheckCircle2 size={12} /> Balanced
                            </span>
                        </div>
                        <div className="h-24 rounded-2xl w-full flex overflow-hidden ring-4 ring-white shadow-xl">
                            <div className="flex-1 bg-[#FFD700]" />
                            <div className="flex-1 bg-[#10B981]" />
                            <div className="flex-1 bg-[#3B82F6]" />
                        </div>
                    </div>

                    <p className="text-center text-slate-400 text-sm font-medium pt-4">
                        * Notice how the yellow feels heavier? The bottom strip fixes this.
                    </p>
                </div>
            </div>
        </div>

        {/* 2. Accessibility & Logic Split */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 mb-6">

            {/* Accessibility Card - Vibrant */}
            <div className="2xl:col-span-1 bg-violet-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-xl shadow-violet-900/20 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                        <span className="font-serif text-3xl">Aa</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 leading-tight">
                        "If you can't read this, it's wrong."
                    </h3>
                    <p className="text-violet-100 leading-relaxed font-medium">
                        We enforce a minimum <strong>4.5:1</strong> contrast ratio automatically.
                    </p>
                </div>
                <div className="mt-10 p-5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70">WCAG Score</span>
                    <span className="text-2xl font-black text-emerald-300">PASS</span>
                </div>
            </div>

            {/* Logic Tools - Clean Minimalist Grid */}
            <div className="2xl:col-span-2 bg-white rounded-[2.5rem] p-10 md:p-12 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                            <Layers size={20} />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Logic Tools</span>
                    </div>
                    <Link href="/generate" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        Try Generator <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4 h-full">
                    {[
                        { title: 'Analogous', desc: 'Serenity through proximity. Perfect for backgrounds.', bg: 'bg-emerald-50 pointer-events-none' },
                        { title: 'Complementary', desc: 'High-tension pairs for CTA dominance.', bg: 'bg-pink-50 pointer-events-none' },
                        { title: 'Triadic', desc: 'Vibrant balance for visualizations.', bg: 'bg-blue-50 pointer-events-none' }
                    ].map((item, i) => (
                        <div key={i} className="group relative bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-default">
                            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${item.bg.replace('50', '500').replace('pointer-events-none', '')}`} />
                            <h4 className="font-bold text-slate-900 mb-3 text-lg">{item.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 3. Scalability Banner - Dark Mode Premium */}
        <div className="bg-[#0f172a] rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden text-center md:text-left shadow-2xl">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-widest mb-6">
                        <Layers size={12} />
                        Scalability
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Building Systems,<br />Not Swatches.</h3>
                    <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-xl">
                        Picking 5 colors is easy. Building a system with <strong>Semantic Tokens</strong> and <strong>Interactive States</strong> is where the real work happens.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <Link href="/design-system" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-2">
                            Build a Design System <ArrowRight size={18} />
                        </Link>
                        <Link href="/contrast" className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all flex items-center gap-2 border border-slate-700">
                            Check Accessibility <CheckCircle2 size={18} />
                        </Link>
                    </div>
                </div>

                {/* Visual Decoration for Scalability */}
                <div className="relative w-full max-w-md aspect-square hidden md:block">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="flex gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 w-2/3 bg-slate-700 rounded-full" />
                            <div className="h-4 w-1/2 bg-slate-800 rounded-full" />
                            <div className="mt-8 flex gap-4">
                                <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20">Primary</div>
                                <div className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold border border-slate-700">Secondary</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- 2. AI Generator Guide ---
export const AIGuide = () => (
    <Section>
        <Title>The Future of Design: Generative Color</Title>
        <Subtitle>How Large Language Models (LLMs) connect semantic meaning to visual color coordinates.</Subtitle>

        <div className="grid xl:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100">
                <h3 className="font-bold text-lg mb-2">Semantic Understanding</h3>
                <p className="text-sm text-gray-600">AI doesn't just "see" blue; it understands that "corporate trust" maps to deep navy (`#0f172a`) while "summertime joy" maps to vibrant coral and turquoise.</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-100">
                <h3 className="font-bold text-lg mb-2">Trend Analysis</h3>
                <p className="text-sm text-gray-600">By training on millions of Dribbble and Behance shots, our model suggests combinations that align with current 2024-2026 design aesthetics.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100">
                <h3 className="font-bold text-lg mb-2">Context Awareness</h3>
                <p className="text-sm text-gray-600">Ask for "a dark mode dashboard for finance," and the AI prioritizes contrast ratios and eye-strain reduction over pure aesthetics.</p>
            </div>
        </div>
    </Section>
);

// --- 3. Contrast & Accessibility Guide ---
export const ContrastGuide = () => (
    <Section>
        <Title>Contrast & Accessibility</Title>
        <Subtitle>Ensure your designs are legible for everyone, every time.</Subtitle>

        <div className="grid xl:grid-cols-2 gap-12 mb-12">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="text-2xl font-bold mb-4">WCAG 2.1 Guidelines</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex gap-2">
                        <span className="font-bold text-green-600">AA Large (3:1):</span>
                        Minimum for headers over 18pt.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-green-600">AA Normal (4.5:1):</span>
                        Standard for body text.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-green-600">AAA (7:1):</span>
                        Enhanced contrast for maximum legibility.
                    </li>
                </ul>
            </div>
            <div className="p-8 bg-gray-900 text-white rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">How Dopely Helps</h3>
                <p className="text-gray-400 mb-4">
                    Our contrast checker runs in real-time. Toggle "Color Blindness Mode" to see your palette through 8 different lenses including Deuteranopia and Protanopia.
                </p>
                <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-500" />
                    <div className="h-8 w-8 rounded-full bg-green-500" />
                    <div className="h-8 w-8 rounded-full bg-blue-500" />
                </div>
            </div>
        </div>
    </Section>
);

// --- 4. Tailwind Integration Guide ---
export const TailwindGuide = () => (
    <Section>
        <Title>Developer Handoff with Tailwind CSS</Title>
        <Subtitle>Copy-paste ready configurations. No more manual 'extend: ...'.</Subtitle>

        <div className="grid xl:grid-cols-2 gap-8 mb-12 mt-8">
            <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2" />
                <div className="relative bg-[#0f172a] p-6 rounded-2xl border border-blue-500/20 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
                        <span className="text-xs font-mono text-blue-400">tailwind.config.js</span>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                    </div>
                    <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
                        {`module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Primary
          900: '#0c4a6e',
        }
      }
    }
  }
}`}
                    </pre>
                </div>
            </div>
            <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">One-Click Export</h3>
                <p className="text-gray-600 mb-6">
                    Dopely generates the exact JS/TS object needed for your Tailwind config. Detailed names like `slate`, `zinc`, or custom names like `primary` are handled automatically.
                </p>
                <button className="self-start text-sm font-bold text-blue-600 hover:underline">
                    Read Integration Docs &rarr;
                </button>
            </div>
        </div>
    </Section>
);

// --- 5. Image Extraction Guide ---
export const ImageGuide = () => (
    <Section>
        <Title>Extract Colors from Reality</Title>
        <Subtitle>Upload a photo and let our Quantization Algorithm find the dominant mood.</Subtitle>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-12">
            <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop)' }}>
                    <div className="h-full w-full bg-black/20 flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Source Image</span>
                    </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                    <h3 className="font-bold text-xl mb-6">Quantization Result</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#2a2b3d] shadow-md ring-2 ring-gray-100" />
                            <div>
                                <p className="font-bold text-gray-900">Midnight</p>
                                <p className="text-xs text-gray-400">#2A2B3D • 34% dominance</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#ff3366] shadow-md ring-2 ring-gray-100" />
                            <div>
                                <p className="font-bold text-gray-900">Neon Rose</p>
                                <p className="text-xs text-gray-400">#FF3366 • 12% dominance</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#70e1f5] shadow-md ring-2 ring-gray-100" />
                            <div>
                                <p className="font-bold text-gray-900">Cyan Sky</p>
                                <p className="text-xs text-gray-400">#70E1F5 • 8% dominance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Section>
);

// --- 6. Design System Guide ---
export const DesignSystemGuide = () => (
    <div className="bg-slate-900 text-white py-24 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to standardise?</h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Stop using hex codes. Start using tokens. Dopely bridges the gap between Figma design and React code.
            </p>
            <ul className="grid xl:grid-cols-3 gap-4 text-center">
                <li className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="block text-2xl font-bold mb-1">100%</span>
                    <span className="text-sm text-slate-400">Consistent</span>
                </li>
                <li className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="block text-2xl font-bold mb-1">WCAG</span>
                    <span className="text-sm text-slate-400">Compliant</span>
                </li>
                <li className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="block text-2xl font-bold mb-1">JSON</span>
                    <span className="text-sm text-slate-400">Export</span>
                </li>
            </ul>
        </div>
    </div>
);
