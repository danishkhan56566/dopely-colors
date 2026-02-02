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
export const HomeGuide = () => (
    <section className="max-w-7xl mx-auto py-24 px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-24 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6">
                <Zap size={12} className="fill-indigo-600" />
                The Science of Color
            </div>
            {/* FIX: Reduced font size to text-4xl/6xl to prevent overlap */}
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight leading-[0.9]">
                Engineering <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">Perception.</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
                Most tools give you 5 random colors that look nice in a stripe but fail in a real UI. We built Dopely to fix that.
            </p>
        </div>

        {/* 1. The Core Conflict: Math vs Eye */}
        {/* FIX: Changed break point to 2xl so it stacks on laptops */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-950 rounded-[2.5rem] p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-colors duration-700" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                            <Palette size={20} />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">The Problem</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold mb-6">Why "Math" isn't enough</h3>
                    <p className="text-lg text-gray-400 leading-relaxed mb-6">
                        Computers see color linearly. Humans don't. Pure yellow (<code className="bg-white/10 px-1.5 py-0.5 rounded text-yellow-300">#FFFF00</code>) and pure blue (<code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300">#0000FF</code>) share the same math "value", but your eye screams at the yellow while the blue recedes.
                    </p>
                    <p className="text-lg text-gray-400 leading-relaxed font-medium">
                        Our <strong>Perceptual Modeling Engine</strong> adjusts for these quirks, ensuring "Light Blue" and "Light Yellow" actually <em>feel</em> the same.
                    </p>
                </div>
            </div>

            {/* Visual Demo Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-[2.5rem] p-10 md:p-14 border border-indigo-50 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />

                <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="space-y-6">
                        {/* Bad Stripe */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                                <span>Linear Math</span>
                                <span className="text-red-500">Unbalanced</span>
                            </div>
                            <div className="h-16 rounded-xl w-full flex overflow-hidden">
                                <div className="flex-1 bg-[#FFFF00]" />
                                <div className="flex-1 bg-[#00FF00]" />
                                <div className="flex-1 bg-[#0000FF]" />
                            </div>
                        </div>

                        {/* Good Stripe */}
                        <div className="bg-white p-4 rounded-2xl shadow-xl border border-indigo-100 scale-105 relative">
                            <div className="absolute -right-3 -top-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Dopely Engine</div>
                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                                <span>Perceptual Model</span>
                                <span className="text-emerald-500">Balanced</span>
                            </div>
                            <div className="h-16 rounded-xl w-full flex overflow-hidden">
                                <div className="flex-1 bg-[#FFD700]" />
                                <div className="flex-1 bg-[#10B981]" />
                                <div className="flex-1 bg-[#3B82F6]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Accessibility & Logic Split */}
        {/* FIX: Changed break point to 2xl */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8 mb-8">

            {/* Accessibility Card (Featured) */}
            <div className="2xl:col-span-1 bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-white/20 transition-colors" />

                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
                        <span className="font-black text-xl">Aa</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 leading-tight">
                        "If you can't read this, the color is wrong."
                    </h3>
                    <p className="text-indigo-100 leading-relaxed mb-6">
                        Accessibility is the baseline. We enforce a minimum <strong>4.5:1</strong> contrast ratio on generated text pairs.
                    </p>
                </div>

                <div className="mt-8 bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">WCAG AA Score</span>
                        <span className="text-2xl font-black text-emerald-400">PASS</span>
                    </div>
                </div>
            </div>

            {/* Logic Tools & Harmony */}
            <div className="2xl:col-span-2 bg-white rounded-[2.5rem] p-10 md:p-12 border border-gray-100 shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Zap size={20} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Logic Tools</span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 h-full">
                    {[
                        { title: 'Analogous', desc: 'Serenity through proximity. Perfect for backgrounds.', color: 'bg-emerald-500' },
                        { title: 'Complementary', desc: 'High-tension pairs for CTA dominance.', color: 'bg-pink-500' },
                        { title: 'Triadic', desc: 'Vibrant balance for visualizations.', color: 'bg-blue-500' }
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
                            <div className={`w-3 h-3 rounded-full ${item.color} mb-4 group-hover:scale-150 transition-transform`} />
                            <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 3. Scalability Banner */}
        <div className="bg-slate-50 rounded-[2.5rem] p-10 md:p-16 border border-gray-200 relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
                <div className="flex items-center gap-3 mb-6 text-indigo-600">
                    <Layers size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">Scalability</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Building Systems, Not Swatches.</h3>
                <p className="text-xl text-gray-500 leading-relaxed mb-10">
                    Picking 5 colors is easy. Building a system with <strong>Semantic Tokens</strong> (Success/Error/Warning) and <strong>Interactive States</strong> (Hover/Active) is where the real work happens. We automate the boring math so you can focus on the art.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link href="/design-system" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                        Build a Design System <ArrowRight size={18} />
                    </Link>
                    <Link href="/contrast" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                        Check Accessibility <CheckCircle2 size={18} />
                    </Link>
                </div>
            </div>

            {/* Abstract UI decoration */}
            <div className="hidden xl:block absolute top-0 right-0 h-full w-1/3 bg-gray-100 border-l border-gray-200">
                <div className="p-8 space-y-4 opacity-50">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-300"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="h-32 rounded-xl bg-gray-200 w-full"></div>
                    <div className="flex gap-2">
                        <div className="flex-1 h-10 bg-indigo-200 rounded-lg"></div>
                        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
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
        <Subtitle>Copy-paste ready configurations. No more manual `extend: {... }`.</Subtitle>

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
