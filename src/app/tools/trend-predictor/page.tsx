'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    BarChart3, TrendingUp, Sparkles, RefreshCw,
    Calendar, Globe, ArrowRight, Share2, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ENGINE ---
type Trend = {
    id: string;
    name: string;
    description: string;
    year: number;
    season: 'Spring/Summer' | 'Autumn/Winter';
    sentiment: string;
    colors: { hex: string; name: string; usage: number }[]; // usage is % growth
    signals: string[]; // "Social Media", "Runway", "Tech"
};

const INITIAL_TRENDS: Trend[] = [
    {
        id: 'trend-1',
        name: 'Bio-Luminescence',
        description: 'Inspired by deep-sea organisms and neon nature. A response to the merging of biology and technology.',
        year: 2026,
        season: 'Spring/Summer',
        sentiment: 'Optimistic / Cyber-Organic',
        colors: [
            { hex: '#00ffcc', name: 'Cyber Algae', usage: 145 },
            { hex: '#00ccff', name: 'Deep Sea Blue', usage: 89 },
            { hex: '#ccff00', name: 'Radioactive Lime', usage: 67 },
            { hex: '#1a1a2e', name: 'Abyss Black', usage: 34 }
        ],
        signals: ['Tech Conferences', 'Avatar Design', 'Sustainable Bio-Materials']
    },
    {
        id: 'trend-2',
        name: 'Martian Dust',
        description: 'Earthy, rusty tones reflecting the renewed interest in space exploration and terraforming.',
        year: 2026,
        season: 'Autumn/Winter',
        sentiment: 'Rugged / Exploration',
        colors: [
            { hex: '#c1440e', name: 'Rusty Red', usage: 112 },
            { hex: '#e77d11', name: 'Solar Flare', usage: 78 },
            { hex: '#4a3b32', name: 'Regolith', usage: 45 },
            { hex: '#d1bfa7', name: 'Dune Sand', usage: 23 }
        ],
        signals: ['SpaceX Missions', 'Gorpcore Fashion', 'Architectural Brutalism']
    }
];

export default function TrendPredictorPage() {
    const [trends, setTrends] = useState<Trend[]>(INITIAL_TRENDS);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedTrend, setSelectedTrend] = useState<Trend>(INITIAL_TRENDS[0]);

    // AI Simulation
    const analyzeTrends = () => {
        setIsAnalyzing(true);
        // Simulate "Reading Social Signals"
        setTimeout(() => {
            const newTrend: Trend = {
                id: 'trend-new-' + Date.now(),
                name: 'Digital Lavender v2',
                description: 'A spiritual successor to 2023s color of the year, evolved for the metaverse era with holographic undertones.',
                year: 2027,
                season: 'Spring/Summer',
                sentiment: 'Calm / Virtual',
                colors: [
                    { hex: '#E6E6FA', name: 'Lavender Mist', usage: 200 },
                    { hex: '#B19CD9', name: 'Digital Purple', usage: 150 },
                    { hex: '#FFB7C5', name: 'Sakura Glitch', usage: 120 },
                    { hex: '#F0F8FF', name: 'Alice Blue', usage: 90 }
                ],
                signals: ['Virtual Wellness', 'Meditation Apps', 'Soft UI']
            };
            setTrends(prev => [newTrend, ...prev]);
            setSelectedTrend(newTrend);
            setIsAnalyzing(false);
        }, 2500);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 max-w-7xl mx-auto">

                {/* Header */}
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={14} /> AI Powered
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        2026 Trend Predictor
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Our AI scans millions of images from fashion week, social media, and design portfolios to predict the next big color movements.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Trend Timeline */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <TrendingUp className="text-blue-500" /> Detected Trends
                                </h2>
                                <button
                                    onClick={analyzeTrends}
                                    disabled={isAnalyzing}
                                    className={`p-2 rounded-xl transition-all ${isAnalyzing ? 'bg-gray-100 text-gray-400' : 'bg-black text-white hover:bg-gray-800'}`}
                                >
                                    <RefreshCw size={20} className={isAnalyzing ? 'animate-spin' : ''} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence>
                                    {trends.map(trend => (
                                        <motion.div
                                            key={trend.id}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => setSelectedTrend(trend)}
                                            className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedTrend.id === trend.id ? 'border-purple-500 bg-purple-50' : 'border-transparent hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-bold text-gray-900">{trend.name}</h3>
                                                <span className="text-xs font-mono text-gray-500">{trend.year}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                {trend.colors.map(c => (
                                                    <div key={c.hex} className="w-6 h-6 rounded-full border border-black/10" style={{ background: c.hex }} />
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Signals Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                                <Globe size={14} /> Signals Detected
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedTrend.signals.map(s => (
                                    <span key={s} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                                        #{s.replace(/\s/g, '').toLowerCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Trend Detail */}
                    <div className="lg:col-span-2">
                        <motion.div
                            key={selectedTrend.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-[2rem] p-8 shadow-xl shadow-purple-900/5 border border-gray-100 h-full relative overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-blue-50 rounded-full blur-3xl -z-10 opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-bold px-3 py-1 bg-black text-white rounded-full">
                                            {selectedTrend.season} {selectedTrend.year}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                            Sentiment: <span className="text-gray-900 font-bold">{selectedTrend.sentiment}</span>
                                        </span>
                                    </div>
                                    <h2 className="text-5xl font-black text-gray-900 mb-4">{selectedTrend.name}</h2>
                                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                        {selectedTrend.description}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-gray-600">
                                        <Share2 size={20} />
                                    </button>
                                    <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-gray-600">
                                        <Download size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Color Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedTrend.colors.map((color, i) => (
                                    <motion.div
                                        key={color.hex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative h-48 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-end p-6 transition-transform hover:scale-[1.02]"
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-900">{color.name}</span>
                                                <span className="text-xs font-mono text-gray-500">{color.hex}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Growth</span>
                                                <span className="text-[10px] text-green-600 font-bold">+{color.usage}%</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Growth Chart (Visual Dummy) */}
                            <div className="mt-12 bg-gray-50 rounded-2xl p-6">
                                <h4 className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-wider flex items-center gap-2">
                                    <BarChart3 size={14} /> 12-Month Projection
                                </h4>
                                <div className="flex items-end gap-2 h-32 w-full">
                                    {[35, 42, 45, 50, 48, 55, 62, 68, 75, 80, 85, 92].map((h, i) => (
                                        <div key={i} className="flex-1 bg-purple-200 rounded-t-sm relative group hover:bg-purple-400 transition-colors" style={{ height: `${h}%` }}>
                                            {/* Tooltip */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Oct {2025 + Math.floor(i / 12)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
