'use client';

import { useState } from 'react';
import { PaletteCard } from '@/components/explore/PaletteCard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Smartphone, Copy, Check, Info, Box, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import Link from 'next/link';

const MATERIAL_PALETTES = [
    { id: 'md-1', colors: ['#6750A4', '#D0BCFF', '#625B71', '#CCC2DC', '#7D5260'], likes: 2100 },
    { id: 'md-2', colors: ['#006C4C', '#89F8C7', '#4B6358', '#CDE9DA', '#3B6470'], likes: 1540 },
    { id: 'md-3', colors: ['#984061', '#FFD9E2', '#76565F', '#FFD9E2', '#914277'], likes: 980 },
    { id: 'md-4', colors: ['#0061A4', '#D1E4FF', '#535F70', '#D7E3F7', '#6B5778'], likes: 1200 },
    { id: 'md-5', colors: ['#006A6A', '#81F3F3', '#4A6363', '#CCE8E8', '#4C627B'], likes: 870 },
    { id: 'md-6', colors: ['#BF0031', '#FFDAD9', '#775656', '#FFDAD9', '#934245'], likes: 1320 },
];

export default function MaterialDesignPage() {
    const [activePalette, setActivePalette] = useState(MATERIAL_PALETTES[0]);
    const [copied, setCopied] = useState(false);

    const m3Tokens = `// Material Design 3 Tokens
const md3Colors = {
  primary: '${activePalette.colors[0]}',
  onPrimary: '#ffffff',
  primaryContainer: '${activePalette.colors[1]}',
  onPrimaryContainer: '${activePalette.colors[0]}',
  secondary: '${activePalette.colors[2]}',
  onSecondary: '#ffffff',
  secondaryContainer: '${activePalette.colors[3]}',
  onSecondaryContainer: '${activePalette.colors[2]}',
  tertiary: '${activePalette.colors[4]}',
  // ... and 20+ more tokens
};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(m3Tokens);
        setCopied(true);
        toast.success("MD3 Tokens Copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB] pb-24">
                {/* Hero Section */}
                <div className="relative pt-20 pb-16 px-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 blur-[120px] rounded-full" />
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-600 text-xs font-bold uppercase tracking-widest mb-6 transition-all hover:bg-green-100">
                            <Box size={14} /> Material Design 3 (M3)
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            Material You <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-indigo-600">Theme Builder</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Generate production-ready Material Design 3 palettes. Optimized for dynamic color, high contrast, and accessibility on Android & Web.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
                    {/* Left: Token Selection */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden group">
                           <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Smartphone size={18} className="text-violet-500" /> System Tokens
                                </h3>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 text-xs font-bold text-violet-600 hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-colors border border-violet-100"
                                >
                                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy JS</>}
                                </button>
                           </div>

                           <div className="space-y-4">
                               {['Primary', 'Secondary', 'Tertiary', 'Neutral'].map((token, i) => (
                                   <div key={token} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                       <div className="flex items-center gap-3">
                                           <div className="w-10 h-10 rounded-full shadow-inner" style={{ backgroundColor: activePalette.colors[i] || activePalette.colors[0] }} />
                                           <div>
                                               <span className="text-xs font-black uppercase tracking-widest text-gray-400 block">{token}</span>
                                               <span className="text-sm font-bold text-gray-900">{activePalette.colors[i] || activePalette.colors[0]}</span>
                                           </div>
                                       </div>
                                       <div className="flex gap-1.5">
                                           <div className="w-6 h-6 rounded-md bg-white border border-gray-200" style={{ backgroundColor: activePalette.colors[i] }} />
                                           <div className="w-6 h-6 rounded-md bg-white border border-gray-200 opacity-60" style={{ backgroundColor: activePalette.colors[i] + '40' }} />
                                       </div>
                                   </div>
                               ))}
                           </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-violet-600 text-white shadow-xl shadow-violet-600/20 relative overflow-hidden">
                            <Sparkles className="absolute top-4 right-4 opacity-20" size={32} />
                            <h4 className="font-bold mb-2">Dynamic Color Ready</h4>
                            <p className="text-xs text-violet-100 leading-relaxed">
                                These hex codes are mathematically derived to ensure they meet the `HCT` color space requirements used in Android 12+ Material You systems.
                            </p>
                        </div>
                    </div>

                    {/* Right: Palette Grid */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">M3 Design Tokens</h2>
                            <Link href="/generate" className="text-sm font-bold text-green-600 hover:underline flex items-center gap-1">
                                Customize in Generator <Wand2 size={14} />
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {MATERIAL_PALETTES.map((palette) => (
                                <div 
                                    key={palette.id}
                                    onClick={() => setActivePalette(palette)}
                                    className={clsx(
                                        "cursor-pointer transition-all duration-300",
                                        activePalette.id === palette.id ? "ring-4 ring-green-500/20 scale-[1.02]" : "hover:scale-[1.01]"
                                    )}
                                >
                                    <PaletteCard {...palette} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Info size={18} className="text-gray-400" /> Why Material You?
                            </h3>
                            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                <p>Material Design 3 (M3) is Google's latest design system, focusing on <strong>Dynamic Color</strong>. Unlike static branding, M3 adapts to user wallpaper and context.</p>
                                <p>Our generator ensures your palettes maintain the necessary <strong>tonal ranges</strong> for Surface, Primary, and Secondary containers, guaranteeing a professional look across all device states.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
