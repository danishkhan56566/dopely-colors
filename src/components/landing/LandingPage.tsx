'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    Sparkles,
    Zap,
    Image as ImageIcon,
    Droplet,
    Layers,
    Wind,
    Palette,
    ArrowRight,
    CheckCircle2,
    Monitor,
    Smartphone,
    Layout,
    BarChart3,
    ShoppingCart,
    CreditCard,
    Menu,
    User,
    Bell,
    Download,
    Share2,
    Eye,
    Type,
    RotateCcw,
    Undo,
    Redo,
    ChevronDown,
    Heart,
    Tag,
    RefreshCw,
    LayoutGrid
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';
import dynamic from 'next/dynamic';
const HexColorPicker = dynamic(() => import('react-colorful').then(mod => mod.HexColorPicker), { ssr: false });
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HomeGuide } from '@/components/content/PageGuides';
import { HomeFAQ } from '@/components/content/PageFAQs';
import type { BlogPost } from '@/lib/blog';
import { colorPsychologyDb } from '@/data/colorPsychology';

type DesignState = {
    text: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;
};

const DEFAULT_DESIGN: DesignState = {
    text: '#0f172a',
    background: '#ffffff',
    primary: '#6366f1',
    secondary: '#ffffff',
    accent: '#10b981',
};

const TRENDING_PALETTES = [
    { name: 'Sunset Vibes', colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#fff7ed'] },
    { name: 'Ocean Mist', colors: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'] },
    { name: 'Forest Deep', colors: ['#14532d', '#166534', '#15803d', '#22c55e', '#86efac'] },
    { name: 'Berry Smoothie', colors: ['#831843', '#9d174d', '#be185d', '#db2777', '#f472b6'] },
    { name: 'Slate Minimal', colors: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'] },
    { name: 'Sunny Day', colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'] },
    { name: 'Lavender Dream', colors: ['#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa'] },
    { name: 'Cherry Blossom', colors: ['#9f1239', '#be123c', '#e11d48', '#f43f5e', '#fb7185'] },
    { name: 'Midnight Neon', colors: ['#312e81', '#4338ca', '#6366f1', '#818cf8', '#a5b4fc'] },
    { name: 'Earth & Clay', colors: ['#451a03', '#78350f', '#92400e', '#b45309', '#d97706'] },
];

export function LandingPage({ recentPosts = [] }: { recentPosts?: BlogPost[] }) {
    const [activePreview, setActivePreview] = useState<'dashboard' | 'mobile' | 'marketing'>('mobile');
    const [design, setDesign] = useState<DesignState>(DEFAULT_DESIGN);
    const [activePicker, setActivePicker] = useState<keyof DesignState | null>(null);

    const handleColorChange = (key: keyof DesignState, color: string) => {
        setDesign(prev => ({ ...prev, [key]: color }));
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col min-h-screen bg-gray-50/50 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-200/30 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob" />
                    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob animation-delay-2000" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-emerald-200/30 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob animation-delay-4000" />
                </div>

                {/* Hero Section */}
                <div className="relative pt-24 pb-16 px-4 text-center w-full z-10 overflow-hidden">
                    {/* Main Hero Content */}
                    <div className="relative pt-12 text-center w-full max-w-6xl mx-auto px-4">
                        {/* Background Decoration */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-pink-400/10 via-orange-400/10 to-yellow-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />

                        {/* AI Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-rainbow text-white rounded-full mb-10 font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform cursor-default select-none mx-auto">
                            <Sparkles size={12} className="fill-white/50 text-white animate-pulse" />
                            AI-POWERED COLOR ENGINE
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[0.95] mb-8 text-balance drop-shadow-sm max-w-6xl mx-auto">
                            Build smarter<br />
                            <span className="relative inline-block">
                                <span className="text-rainbow mr-3">color</span>
                                <span className="text-rainbow">systems</span>
                            </span><br />
                            instantly
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12 font-medium opacity-90">
                            Dopely Colors is the world's most intelligent color toolkit. Stop guessing and start building production-ready palettes, gradients, and design systems in seconds.
                        </p>

                        {/* AI Input Box - Professional Style */}
                        <div className="max-w-3xl mx-auto relative group w-full mb-10 z-20">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-200 via-orange-200 to-yellow-200 rounded-[2rem] blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const query = (e.currentTarget.elements.namedItem('aiQuery') as HTMLInputElement).value;
                                    if (query) window.location.href = `/ai?q=${encodeURIComponent(query)}`;
                                }}
                                className="relative bg-white rounded-[1.8rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center gap-2"
                            >
                                <div className="pl-5 text-gray-500">
                                    <Sparkles size={24} className="text-orange-400 fill-orange-400/20" />
                                </div>
                                <input
                                    type="text"
                                    name="aiQuery"
                                    placeholder="Describe your project..."
                                    className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder:text-gray-500 h-16 min-w-0 font-medium"
                                />
                                <button type="submit" className="hidden sm:flex px-8 py-4 bg-rainbow text-white rounded-[1.4rem] font-bold items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-95 whitespace-nowrap text-base">
                                    Start Exploring <ArrowRight size={18} />
                                </button>
                                <button type="submit" aria-label="Generate" className="sm:hidden px-4 py-4 bg-rainbow text-white rounded-[1.4rem] font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95 shrink-0">
                                    <ArrowRight size={20} />
                                </button>
                            </form>
                        </div>

                        {/* Quick Suggestions - Pills */}
                        <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
                            <span className="font-bold text-xs uppercase tracking-widest text-gray-500 mr-2">Try:</span>
                            {['Minimalist Dashboard', 'Luxury Brand', 'Neon Cyberpunk', 'Pastel App', 'Ocean Vibes'].map((tag) => (
                                <button key={tag} className="px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:shadow-md transition-all text-[11px] font-bold uppercase tracking-wide">
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* Actions (Standalone Buttons) */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 relative z-10">
                            <Link href="/colors" className="px-12 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-[1.5rem] font-bold text-lg hover:border-gray-200 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto flex items-center justify-center gap-3 group">
                                Explore Trending Palettes
                                <ArrowRight size={18} className="text-gray-500 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    </div>

                    {/* Full Width Marquee Section */}
                    <div className="w-full overflow-hidden pb-24 relative mask-linear-fade">
                        {/* Row 1 - Left */}
                        <div className="flex gap-6 animate-marquee hover:pause mb-6 w-max">
                            {[...TRENDING_PALETTES, ...TRENDING_PALETTES, ...TRENDING_PALETTES].map((palette, i) => (
                                <div key={`r1-${i}`} className="flex-shrink-0 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer min-w-[240px] group">
                                    <div className="flex rounded-xl overflow-hidden w-full h-32 relative">
                                        {palette.colors.map((color, colorIndex) => (
                                            <div key={colorIndex} className="flex-1 h-full group-hover:w-[120%] transition-all duration-500" style={{ backgroundColor: color }} />
                                        ))}
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="mt-4 flex justify-between items-center px-1">
                                        <div>
                                            <span className="block text-sm font-bold text-gray-800">{palette.name}</span>
                                            <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">5 Colors • {palette.colors[0]}</span>
                                        </div>
                                        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                            <Heart size={14} className="fill-current" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Row 2 - Right (Reversed) */}
                        <div className="flex gap-6 animate-marquee-reverse hover:pause w-max ml-[-500px]">
                            {[...TRENDING_PALETTES, ...TRENDING_PALETTES, ...TRENDING_PALETTES].reverse().map((palette, i) => (
                                <div key={`r2-${i}`} className="flex-shrink-0 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer min-w-[240px] group">
                                    <div className="flex rounded-xl overflow-hidden w-full h-32 relative">
                                        {palette.colors.map((color, colorIndex) => (
                                            <div key={colorIndex} className="flex-1 h-full group-hover:w-[120%] transition-all duration-500" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-between items-center px-1">
                                        <div>
                                            <span className="block text-sm font-bold text-gray-800">{palette.name}</span>
                                            <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">5 Colors • {palette.colors[0]}</span>
                                        </div>
                                        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <Download size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* PREVIEW DESIGNS SECTION (MASSIVE) */}
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 mb-12 relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 overflow-hidden">
                    <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] md:rounded-[3.5rem] border border-white/60 shadow-2xl p-4 md:p-10 ring-1 ring-black/5" style={{ '--preview-bg': design.background, '--preview-text': design.text, '--preview-primary': design.primary, '--preview-secondary': design.secondary, '--preview-accent': design.accent } as any}>
                        {/* Tabs */}
                        <div className="flex justify-center mb-6 md:mb-10 overflow-x-auto no-scrollbar pb-4 md:pb-0 sticky top-4 md:relative md:top-0 z-30">
                            <div className="bg-white/80 backdrop-blur-md p-2 rounded-full inline-flex gap-2 border border-black/5 shadow-sm whitespace-nowrap">
                                <button
                                    onClick={() => setActivePreview('dashboard')}
                                    className={clsx("px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-bold transition-all flex items-center gap-2", activePreview === 'dashboard' ? "bg-black text-white shadow-lg scale-105" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")}
                                >
                                    <Layout size={16} className="md:w-[18px] md:h-[18px]" /> Dashboard
                                </button>
                                <button
                                    onClick={() => setActivePreview('mobile')}
                                    className={clsx("px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-bold transition-all flex items-center gap-2", activePreview === 'mobile' ? "bg-black text-white shadow-lg scale-105" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")}
                                >
                                    <Smartphone size={16} className="md:w-[18px] md:h-[18px]" /> Mobile App
                                </button>
                                <button
                                    onClick={() => setActivePreview('marketing')}
                                    className={clsx("px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-bold transition-all flex items-center gap-2", activePreview === 'marketing' ? "bg-black text-white shadow-lg scale-105" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")}
                                >
                                    <Monitor size={16} className="md:w-[18px] md:h-[18px]" /> Storefront
                                </button>
                            </div>
                        </div>

                        {/* Mockup Container (Massive Height) */}
                        <div
                            className="w-full h-[600px] md:h-[900px] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative shadow-2xl transition-colors duration-500"
                            style={{ backgroundColor: design.secondary }}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] opacity-40" />

                            {/* DASHBOARD PREVIEW */}
                            {activePreview === 'dashboard' && (
                                <div className="absolute inset-0 p-4 md:p-12 flex animate-in fade-in zoom-in-95 duration-500 flex-col lg:flex-row">
                                    {/* Sidebar */}
                                    <div className="w-80 border-r border-white/10 hidden lg:flex flex-col gap-8 pr-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center text-white transition-colors duration-300" style={{ backgroundColor: design.primary }}>
                                                <Layers size={24} />
                                            </div>
                                            <span className="text-xl font-bold tracking-tight transition-colors duration-300" style={{ color: design.background }}>NexusAdmin</span>
                                        </div>

                                        <div className="space-y-3">
                                            <div
                                                className="h-14 w-full rounded-r-xl flex items-center px-6 font-bold text-lg border-l-4 transition-all duration-300"
                                                style={{
                                                    background: `linear-gradient(to right, ${design.primary}33, transparent)`,
                                                    borderColor: design.primary,
                                                    color: design.primary
                                                }}
                                            >
                                                Overview
                                            </div>
                                            {['Analytics', 'Users', 'Settings', 'Audit Logs', 'Integrations'].map(item => (
                                                <div key={item} className="h-14 w-full hover:bg-white/5 rounded-xl flex items-center px-6 font-medium text-lg cursor-pointer transition-colors" style={{ color: `${design.background}99` }}>{item}</div>
                                            ))}
                                        </div>

                                        <div className="mt-auto h-48 w-full rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group transition-colors duration-300" style={{ background: `linear-gradient(135deg, ${design.primary}, ${design.accent})` }}>
                                            <div className="absolute top-0 right-0 p-4 opacity-20 text-white"><Zap size={48} /></div>
                                            <div className="relative z-10">
                                                <div className="text-white text-xl font-bold mb-1">Pro Plan</div>
                                                <div className="text-white/80">Unlock full power</div>
                                            </div>
                                            <button className="bg-white py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform" style={{ color: design.text }}>Upgrade Now</button>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 pl-0 lg:pl-12 flex flex-col gap-6 md:gap-10 overflow-y-auto no-scrollbar">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-2xl md:text-4xl font-bold mb-2" style={{ color: design.background }}>Color Performance</h3>
                                                <p className="text-base md:text-xl" style={{ color: `${design.background}80` }}>Real-time analysis of your design system usage.</p>
                                            </div>
                                            <div className="flex gap-2 md:gap-4">
                                                <div className="h-10 w-10 md:h-14 md:w-14 rounded-full border border-white/10 flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${design.background}10`, color: design.background }}><Bell size={20} className="md:w-6 md:h-6" /></div>
                                                <div className="h-10 w-10 md:h-14 md:w-14 rounded-full border border-white/10 shadow-lg flex items-center justify-center text-white transition-colors duration-300" style={{ backgroundColor: design.primary }}><User size={20} className="md:w-6 md:h-6" /></div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                                            <div className="backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 hover:bg-white/5 transition-colors group" style={{ backgroundColor: `${design.background}08` }}>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${design.primary}33`, color: design.primary }}>
                                                        <BarChart3 size={28} />
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: `${design.accent}33`, color: design.accent }}>+12.5%</span>
                                                </div>
                                                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: design.background }}>98.5%</div>
                                                <div className="font-medium text-lg" style={{ color: `${design.background}80` }}>Accessibility Score</div>
                                            </div>

                                            <div className="backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 hover:bg-white/5 transition-colors group" style={{ backgroundColor: `${design.background}08` }}>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${design.secondary}33`, color: design.background }}>
                                                        <Palette size={28} />
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: `${design.background}20`, color: design.background }}>+4.2%</span>
                                                </div>
                                                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: design.background }}>1,240</div>
                                                <div className="font-medium text-lg" style={{ color: `${design.background}80` }}>Total Tokens</div>
                                            </div>

                                            <div className="backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 hover:bg-white/5 transition-colors group" style={{ backgroundColor: `${design.background}08` }}>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${design.accent}33`, color: design.accent }}>
                                                        <Zap size={28} />
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: `${design.accent}33`, color: design.accent }}>99.9%</span>
                                                </div>
                                                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: design.background }}>12ms</div>
                                                <div className="font-medium text-lg" style={{ color: `${design.background}80` }}>Load Time</div>
                                            </div>
                                        </div>

                                        {/* Main Chart Area */}
                                        <div className="flex-1 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col min-h-[300px]" style={{ backgroundColor: `${design.background}05` }}>
                                            <div className="flex justify-between items-center mb-8 relative z-10 flex-wrap gap-4">
                                                <h4 className="text-xl md:text-2xl font-bold" style={{ color: design.background }}>Usage Trends</h4>
                                                <div className="flex gap-2">
                                                    <div className="px-4 py-2 rounded-lg font-bold text-sm" style={{ backgroundColor: `${design.background}10`, color: design.background }}>Weekly</div>
                                                    <div className="px-4 py-2 hover:bg-white/5 rounded-lg font-bold text-sm transition-colors" style={{ color: `${design.background}60` }}>Monthly</div>
                                                </div>
                                            </div>

                                            {/* CSS Chart */}
                                            <div className="flex items-end justify-between gap-2 h-40 md:h-64 mt-auto w-full">
                                                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                                    <div key={i} className="group relative flex-1 bg-white/5 rounded-t-xl hover:bg-white/10 transition-all duration-300 md:rounded-t-2xl flex flex-col justify-end overflow-hidden">
                                                        <div
                                                            className="w-full transition-all duration-1000 ease-out rounded-t-xl md:rounded-t-2xl relative"
                                                            style={{
                                                                height: `${h}%`,
                                                                background: i % 2 === 0 ? design.primary : design.accent,
                                                                opacity: 0.8
                                                            }}
                                                        >
                                                            <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/20 to-transparent" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MOBILE PREVIEW */}
                            {activePreview === 'mobile' && (
                                <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500 p-4 md:p-8">
                                    <div className="flex gap-10 lg:gap-20 h-full items-center justify-center w-full">
                                        {/* Phone 1 */}
                                        <div className="w-full max-w-[300px] sm:max-w-[360px] md:max-w-[380px] h-[95%] md:h-[780px] rounded-[2.5rem] md:rounded-[3.5rem] p-3 md:p-4 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 md:border-8 border-gray-800 ring-2 md:ring-4 ring-gray-700 transform md:rotate-[-6deg] hover:rotate-0 transition-transform duration-700 overflow-hidden" style={{ backgroundColor: design.background }}>
                                            <div className="h-full w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col relative" style={{ backgroundColor: `${design.text}08` }}>

                                                {/* Header */}
                                                <div className="absolute top-0 w-full h-80 rounded-b-[4rem] shadow-xl transition-colors duration-300" style={{ backgroundColor: design.primary }} />

                                                <div className="p-6 md:p-8 relative z-10 h-full flex flex-col">
                                                    <div className="flex justify-between text-white mb-8 md:mb-12 mt-2 md:mt-4">
                                                        <Menu size={24} className="md:w-[28px] md:h-[28px]" />
                                                        <User size={24} className="md:w-[28px] md:h-[28px]" />
                                                    </div>
                                                    <div className="text-white text-3xl md:text-4xl font-black leading-tight mb-8 md:mb-10 drop-shadow-md">Discover<br />New <span className="opacity-80">Palettes</span></div>

                                                    {/* Feed Items */}
                                                    <div className="space-y-4 overflow-y-auto no-scrollbar pb-20 fade-mask">
                                                        {[1, 2, 3].map((i) => (
                                                            <div key={i} className="bg-white p-4 rounded-3xl shadow-lg transform transition-transform hover:scale-[1.02]">
                                                                <div className="flex gap-2 mb-3 h-24 rounded-2xl overflow-hidden">
                                                                    <div className="flex-1" style={{ backgroundColor: design.primary }} />
                                                                    <div className="flex-1" style={{ backgroundColor: design.accent }} />
                                                                    <div className="flex-1" style={{ backgroundColor: design.secondary }} />
                                                                    <div className="flex-1" style={{ backgroundColor: design.text }} />
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <div className="font-bold text-gray-800">Summer Vibes {i}</div>
                                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                                        <Heart size={16} fill={i === 1 ? design.accent : "none"} stroke={i === 1 ? design.accent : "currentColor"} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>
                                                {/* Bottom Nav */}
                                                <div className="mt-auto backdrop-blur-md p-4 md:p-6 m-3 md:m-4 mb-4 md:mb-6 rounded-3xl flex justify-between items-center shadow-lg border" style={{ backgroundColor: `${design.background}CC`, borderColor: `${design.text}10` }}>
                                                    <div style={{ color: design.primary }}><Layout size={24} className="md:w-[28px] md:h-[28px]" strokeWidth={2.5} /></div>
                                                    <div style={{ color: `${design.text}40` }}><Sparkles size={24} className="md:w-[28px] md:h-[28px]" /></div>
                                                    <div style={{ color: `${design.text}40` }}><User size={24} className="md:w-[28px] md:h-[28px]" /></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone 2 (Hidden on Mobile) */}
                                        <div className="w-[380px] h-[780px] bg-white rounded-[3.5rem] p-4 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-8 border-gray-800 ring-4 ring-gray-700 transform rotate-[6deg] hover:rotate-0 transition-transform duration-700 hidden lg:block overflow-hidden" style={{ backgroundColor: design.background }}>
                                            <div className="h-full w-full rounded-[2.5rem] overflow-hidden flex flex-col relative bg-gray-50/50">
                                                {/* Detail View Header */}
                                                <div className="h-1/2 w-full p-8 flex flex-col justify-end relative">
                                                    <div className="absolute inset-0 transition-colors duration-300" style={{ backgroundColor: design.primary }} />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                                                    <button className="absolute top-8 left-8 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                                                        <ArrowRight size={24} className="rotate-180" />
                                                    </button>
                                                    <div className="relative z-10 text-white">
                                                        <div className="text-4xl font-bold mb-2">Neon Lights</div>
                                                        <div className="flex gap-2 text-white/80">
                                                            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-md">Vibrant</span>
                                                            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-md">Cyberpunk</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Swatches List */}
                                                <div className="flex-1 p-6 space-y-4">
                                                    {[
                                                        { name: 'Primary', color: design.primary },
                                                        { name: 'Accent', color: design.accent },
                                                        { name: 'Secondary', color: design.secondary },
                                                        { name: 'Background', color: design.text }, // Inverted for contrast
                                                    ].map((swatch, i) => (
                                                        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                                            <div className="w-16 h-16 rounded-xl shadow-inner" style={{ backgroundColor: swatch.color }} />
                                                            <div>
                                                                <div className="font-bold text-gray-900 text-lg">{swatch.color}</div>
                                                                <div className="text-gray-500 text-sm font-medium">{swatch.name}</div>
                                                            </div>
                                                            <button className="ml-auto w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                                                                <Share2 size={18} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button className="w-full py-4 mt-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/30 transition-colors" style={{ backgroundColor: design.primary }}>
                                                        Export Palette
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MARKETING PREVIEW */}
                            {activePreview === 'marketing' && (
                                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 lg:p-16 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="w-full h-full rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row" style={{ backgroundColor: design.background }}>

                                        {/* Hero Text Side */}
                                        <div className="flex-1 p-8 md:p-12 lg:p-20 flex flex-col justify-center gap-4 md:gap-8 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: design.primary }}>
                                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />

                                            <div className="inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10 font-bold text-sm uppercase tracking-wider">
                                                <Sparkles size={14} /> New Season
                                            </div>

                                            <h3 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] text-white tracking-tighter">
                                                50% OFF<br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">EVERYTHING</span>
                                            </h3>

                                            <p className="text-lg md:text-xl text-white/80 max-w-md font-medium leading-relaxed">
                                                Discover the latest trends in our summer collection. Limited time offer valid until Sunday.
                                            </p>

                                            <div className="flex flex-wrap gap-4 mt-4">
                                                <button className="px-8 py-4 bg-white rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl" style={{ color: design.primary }}>
                                                    Shop Now
                                                </button>
                                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-bold text-lg text-white transition-colors hover:bg-white/20">
                                                    View Lookbook
                                                </button>
                                            </div>
                                        </div>

                                        {/* Product Showcase Side */}
                                        <div className="flex-1 bg-gray-50 p-8 md:p-12 relative overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: design.background }}>
                                            {/* Abstract Background Elements */}
                                            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(${design.primary} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                                            <div className="relative z-10 w-full max-w-md">
                                                <div className="aspect-[4/5] rounded-[2rem] relative shadow-2xl overflow-hidden group">
                                                    <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: design.secondary }} />
                                                    <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-110 transition-transform duration-700">
                                                        <ImageIcon size={200} />
                                                    </div>

                                                    {/* Floating Details */}
                                                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="font-bold text-xl text-gray-900">Premium Sneaker</div>
                                                            <span className="font-black text-xl" style={{ color: design.primary }}>$129</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {[design.primary, design.accent, design.text].map((color, i) => (
                                                                <div key={i} className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 font-bold z-20">
                                                        <Heart size={24} fill={design.primary} stroke={design.primary} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* DESIGN TOOLBAR (Moved) */}
                <div className="sticky bottom-4 md:bottom-10 z-40 flex justify-center perspective-1000 mb-8 md:mb-24 pointer-events-none px-4">
                    <div className="bg-white rounded-full shadow-2xl border border-gray-200 p-2 flex items-center gap-2 md:gap-4 animate-in slide-in-from-bottom-4 duration-700 ring-4 ring-black/5 pointer-events-auto overflow-x-auto max-w-full">

                        {/* Color Swatches */}
                        <div className="flex items-center gap-2 pl-2">
                            {Object.entries(design).map(([key, value]) => (
                                <div key={key} className="relative group">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                className={clsx(
                                                    "h-12 px-4 rounded-xl flex flex-col justify-center gap-0.5 border-2 transition-all hover:scale-105 min-w-[100px]",
                                                    "border-transparent hover:border-gray-200 data-[state=open]:border-blue-500 data-[state=open]:shadow-lg data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20"
                                                )}
                                                style={{ backgroundColor: value, color: getContrastYIQ(value) }}
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{key}</span>
                                                <span className="text-xs font-mono font-bold opacity-60">{value}</span>
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-3 bg-white rounded-xl shadow-2xl border border-gray-100" side="top" sideOffset={16}>
                                            <HexColorPicker color={value} onChange={(c) => handleColorChange(key as keyof DesignState, c)} />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            ))}
                        </div>

                        <div className="w-px h-8 bg-gray-200" />

                        {/* Actions */}
                        <div className="flex items-center gap-1 pr-2">
                            <button onClick={() => setDesign(DEFAULT_DESIGN)} className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors" title="Reset" aria-label="Reset Design">
                                <RotateCcw size={18} />
                            </button>
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button className="p-2 text-gray-500 hover:text-gray-900 rounded-lg transition-colors" aria-label="Undo"><Undo size={16} /></button>
                                <button className="p-2 text-gray-500 hover:text-gray-900 rounded-lg transition-colors" aria-label="Redo"><Redo size={16} /></button>
                            </div>
                            <button className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Download"><Download size={18} /></button>
                            <button className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Share"><Share2 size={18} /></button>
                            <button className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-colors ml-2">
                                <Type size={16} /> Fonts
                            </button>
                        </div>

                    </div>
                </div>

                {/* Tools Grid (Bento Box) */}
                {/* Tools Grid (Bento Box) - Professional & Unified */}
                <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* AI Generator - Feature Card (Purple) */}
                        <Link href="/ai" className="lg:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] p-8 md:p-12 text-white shadow-xl transition-all hover:shadow-2xl hover:scale-[1.01] min-h-[360px] flex flex-col justify-between">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-inner">
                                    <Sparkles size={32} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 tracking-tight">AI Palette Generator</h3>
                                <p className="text-lg text-white/90 font-medium max-w-lg leading-relaxed opacity-90">
                                    Transform simple text prompts into production-ready color systems. Our advanced AI analyzes context, mood, and color theory to generate harmonious palettes instantly.
                                </p>
                            </div>
                            <div className="relative z-10 mt-8">
                                <div className="inline-flex items-center gap-2 font-bold px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors border border-white/20">
                                    Try it out <ArrowRight size={18} />
                                </div>
                            </div>
                            {/* Abstract Shapes */}
                            <div className="absolute right-[-10%] bottom-[-40%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700" />
                        </Link>

                        {/* Image Extractor - White Card */}
                        <Link href="/tools/art-extractor" className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-10 shadow-lg border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1 min-h-[360px] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-32 bg-orange-50/50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <ImageIcon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Gallery Lens</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Upload any photo or masterpiece. Our AI extracts "Mood DNA" and dominant pigments using advanced clustering.
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:translate-x-2 transition-transform self-end">
                                <ArrowRight size={20} />
                            </div>
                        </Link>

                        {/* Contrast Checker - White Card */}
                        <Link href="/tools/dynamic-contrast" className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-10 shadow-lg border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1 min-h-[360px] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-32 bg-emerald-50/50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle2 size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Dynamic Contrast</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Beyond WCAG. Test legibility against different font weights, textures, and environmental glare.
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:translate-x-2 transition-transform self-end">
                                <ArrowRight size={20} />
                            </div>
                        </Link>

                        {/* Pro Picker - UNIFIED White Card (Previously Pink) */}
                        <Link href="/tools/mixer" className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-10 shadow-lg border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1 min-h-[360px] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-32 bg-pink-50/50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Droplet size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Color Mixer</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Simulate real-world pigment mixing (Subtractive) vs screen light (Additive).
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 group-hover:translate-x-2 transition-transform self-end">
                                <ArrowRight size={20} />
                            </div>
                        </Link>

                        {/* Gradient Studio - White Card */}
                        <Link href="/tools/fluid" className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-10 shadow-lg border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1 min-h-[360px] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-32 bg-cyan-50/50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Layers size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Fluid Gradients</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Create organic, moving gradient meshes that feel alive. Export as CSS or SVG.
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:translate-x-2 transition-transform self-end">
                                <ArrowRight size={20} />
                            </div>
                        </Link>

                        {/* Design System Builder - Feature Card (Dark) */}
                        <Link href="/tools/design-tokens" className="lg:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-8 md:p-12 text-white shadow-xl transition-all hover:shadow-2xl hover:scale-[1.01] min-h-[360px] flex flex-col justify-between">
                            {/* Grid Pattern Background */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] group-hover:bg-blue-500/30 transition-colors" />

                            <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start h-full">
                                <div className="flex-1 flex flex-col justify-between h-full">
                                    <div>
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                                            <Layout size={32} className="text-blue-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4 tracking-tight">Design Token Engine</h3>
                                        <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed mb-8">
                                            Manage semantic tokens, aliases, and component values in one place. Export to JSON, CSS, or Swift.
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 font-bold px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 w-max">
                                        Manage Tokens <ArrowRight size={18} />
                                    </div>
                                </div>

                                {/* Visual Preview Decoration */}
                                <div className="hidden sm:block w-72 h-56 bg-gray-900/50 rounded-2xl border border-white/10 p-5 rotate-3 group-hover:rotate-6 transition-transform shadow-2xl backdrop-blur-sm">
                                    <div className="flex gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20"></div>
                                        <div className="w-10 h-10 rounded-xl bg-purple-500 shadow-lg shadow-purple-500/20"></div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 w-3/4 bg-gray-700/50 rounded-full"></div>
                                        <div className="h-3 w-1/2 bg-gray-700/50 rounded-full"></div>
                                    </div>
                                    <div className="mt-8 flex gap-3">
                                        <div className="px-4 py-2 rounded-lg bg-white/10 text-xs text-gray-500 font-medium border border-white/5">Button</div>
                                        <div className="px-4 py-2 rounded-lg bg-white/10 text-xs text-gray-500 font-medium border border-white/5">Input</div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Tailwind Generator - White Card */}
                        <Link href="/tools/shadows" className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-10 shadow-lg border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1 min-h-[360px] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-32 bg-purple-50/50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Wind size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Atmosphere Lab</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Design physically accurate shadows with colored light dispersion and multi-layer depth.
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:translate-x-2 transition-transform self-end">
                                <ArrowRight size={20} />
                            </div>
                        </Link>

                    </div>
                </div>

                {/* Color Psychology Showcase Section */}
                <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-8 md:p-16 overflow-hidden relative">
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-rose-100 via-fuchsia-100 to-transparent rounded-full blur-[100px] opacity-50 -mr-40 -mt-40 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100 via-emerald-100 to-transparent rounded-full blur-[80px] opacity-50 -ml-20 -mb-20 pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                            {/* Content Side */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-widest mb-6 border border-rose-100">
                                    <Sparkles size={14} className="fill-rose-600" />
                                    The Color Encyclopedia
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-[1.1]">
                                    Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-600">Psychology</span> of Color.
                                </h2>
                                <p className="text-lg md:text-xl text-gray-500 font-medium mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Why do banks use blue? Why does fast food use red? Dive deep into the history, symbolism, and psychological impact of 45+ distinct colors in our comprehensive encyclopedia.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link href="/color-psychology" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 min-w-[200px]">
                                        Read the Encyclopedia <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>

                            {/* Cards Side */}
                            <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative">
                                    {colorPsychologyDb.slice(0, 6).map((color, idx) => (
                                        <Link
                                            href={`/color-psychology/${color.slug}`}
                                            key={color.slug}
                                            className={clsx(
                                                "group relative bg-white rounded-3xl p-5 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col",
                                                idx === 1 ? "lg:translate-y-8" : "",
                                                idx === 4 ? "lg:translate-y-8" : ""
                                            )}
                                        >
                                            <div
                                                className="w-full aspect-square rounded-2xl mb-4 relative overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500"
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">{color.name}</h4>
                                            <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">
                                                {color.shortDescription}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* More Useful Resources Section - Redesigned 10x UI */}
                <div className="max-w-7xl mx-auto px-6 py-32 relative z-10 w-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent pointer-events-none" />

                    <div className="text-center mb-20 relative">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
                            <Sparkles size={12} className="fill-blue-600" />
                            Everything you need
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
                            Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Toolkit</span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Powerful standalone tools to help you design better, faster, and more efficiently.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">

                        {/* Color Names */}
                        <Link href="/colors" className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-32 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100" />

                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10">
                                <Tag size={28} strokeWidth={2} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">Color Names</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                                The ultimate encyclopedia of color. Search thousands of names and find the exact shade you're looking for.
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-indigo-600 transition-colors">Explore Library</span>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>

                        {/* Free Fonts */}
                        <Link href="/fonts" className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-32 bg-pink-50/50 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100" />

                            <div className="w-16 h-16 bg-pink-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-pink-200 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 relative z-10">
                                <Type size={28} strokeWidth={2} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-pink-600 transition-colors">Free Fonts</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                                A curated collection of beautiful, open-source typefaces ready for your next big project.
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-pink-600 transition-colors">Browse Typography</span>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>

                        {/* Collage Maker */}
                        <Link href="/collage-maker" className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-32 bg-emerald-50/50 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100" />

                            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10">
                                <LayoutGrid size={28} strokeWidth={2} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-emerald-600 transition-colors">Collage Maker</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                                Compose stunning moodboards and photo grids in seconds with our drag-and-drop tool.
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-emerald-600 transition-colors">Start Creating</span>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>

                        {/* Browse Gradients */}
                        <Link href="/gradients" className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-32 bg-orange-50/50 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100" />

                            <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-200 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 relative z-10">
                                <Layers size={28} strokeWidth={2} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-orange-600 transition-colors">Browse Gradients</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                                Explore thousands of hand-picked gradients or use the studio to craft your own unique blends.
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-orange-600 transition-colors">View Collection</span>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>

                        {/* Gradient Palette */}
                        <Link href="/gradient-palette" className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-32 bg-cyan-50/50 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100" />

                            <div className="w-16 h-16 bg-cyan-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-cyan-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10">
                                <Palette size={28} strokeWidth={2} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-cyan-600 transition-colors">Gradient Palette</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                                Visualize gradients as full color palettes. Perfect for extracting steps and interpolations.
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-cyan-600 transition-colors">Generate Palette</span>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>

                        {/* Image Converter */}
                        <Link href="/image-converter" className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-32 bg-purple-50/50 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100" />

                            <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-200 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 relative z-10">
                                <RefreshCw size={28} strokeWidth={2} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-purple-600 transition-colors">Image Converter</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                                Convert, compress, and resize images in bulk. Supports PNG, JPG, WebP and SVG.
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-purple-600 transition-colors">Convert Files</span>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>

                    </div>
                </div>

                {/* Latest Blog Posts Section */}
                {recentPosts && recentPosts.length > 0 && (
                    <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full border-t border-gray-100">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-100">
                                    <Layers size={12} className="fill-indigo-600 text-indigo-600" />
                                    Knowledge Base
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Latest Insights & Resources</h2>
                                <p className="text-lg text-gray-500 max-w-2xl">Expert articles on UI design, color theory, accessibility, and modern frontend development.</p>
                            </div>
                            <Link href="/blog" className="hidden md:flex font-bold text-indigo-600 hover:text-indigo-700 items-center gap-2 group">
                                View All Articles <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recentPosts.map((post) => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col h-full">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest border border-indigo-100">{post.category}</span>
                                        <span className="font-semibold text-[10px] md:text-xs uppercase tracking-widest opacity-80">{post.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">{post.title}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1 line-clamp-3">{post.excerpt}</p>
                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity">Read Article</span>
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-10 md:hidden">
                            <Link href="/blog" className="w-full flex justify-center py-4 rounded-xl font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors items-center gap-2">
                                View All Articles <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Guides - Now with component */}
                <HomeGuide />

                {/* FAQs */}
                <HomeFAQ />

            </div>
        </DashboardLayout>
    );
}

// Utility function (you might need to ensure this is available or inline it)
function getContrastYIQ(hexcolor: string) {
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}
