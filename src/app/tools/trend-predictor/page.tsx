'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { BarChart3, TrendingUp, Sparkles, RefreshCw, AlertOctagon, Activity, Globe, Share2, Download, Radar, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { TrendGuide } from '@/components/content/AdvancedGuides';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const TREND_DATA = [
    {
        id: 'bio-lum',
        name: 'Bio-Luminescence',
        sentiment: [
            { subject: 'Futuristic', A: 120, fullMark: 150 },
            { subject: 'Natural', A: 98, fullMark: 150 },
            { subject: 'Calm', A: 40, fullMark: 150 },
            { subject: 'Energetic', A: 110, fullMark: 150 },
            { subject: 'Luxury', A: 60, fullMark: 150 },
            { subject: 'Accessible', A: 85, fullMark: 150 },
        ],
        virality: [
            { month: 'Jan', value: 20 }, { month: 'Feb', value: 35 }, { month: 'Mar', value: 50 },
            { month: 'Apr', value: 45 }, { month: 'May', value: 80 }, { month: 'Jun', value: 120 }
        ],
        colors: ['#00ffcc', '#00ccff', '#ccff00', '#1a1a2e'],
        signals: ['Avatar Design', 'Deep Sea Tech', 'Neon Nature'],
        score: 98
    },
    {
        id: 'martian',
        name: 'Martian Dust',
        sentiment: [
            { subject: 'Futuristic', A: 110, fullMark: 150 },
            { subject: 'Natural', A: 130, fullMark: 150 },
            { subject: 'Calm', A: 90, fullMark: 150 },
            { subject: 'Energetic', A: 60, fullMark: 150 },
            { subject: 'Luxury', A: 120, fullMark: 150 },
            { subject: 'Accessible', A: 70, fullMark: 150 },
        ],
        virality: [
            { month: 'Jan', value: 60 }, { month: 'Feb', value: 65 }, { month: 'Mar', value: 70 },
            { month: 'Apr', value: 85 }, { month: 'May', value: 90 }, { month: 'Jun', value: 95 }
        ],
        colors: ['#c1440e', '#e77d11', '#4a3b32', '#d1bfa7'],
        signals: ['SpaceX', 'Terraforming', 'Red Planet'],
        score: 92
    }
];

export default function TrendPredictorPage() {
    const [selectedTrend, setSelectedTrend] = useState(TREND_DATA[0]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isEmergencyStop, setIsEmergencyStop] = useState(false);

    const handleAnalysis = () => {
        setIsAnalyzing(true);
        setIsEmergencyStop(false);
        // Simulation
        setTimeout(() => {
            if (!isEmergencyStop) {
                toast.success("Analysis Complete: New Micro-Trends Detected");
                setIsAnalyzing(false);
            }
        }, 2000);
    };

    const handleStop = () => {
        setIsEmergencyStop(true);
        setIsAnalyzing(false);
        toast.error("Process Halted by User");
    };

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<TrendGuide />}
        >
            <div className="min-h-screen bg-[#0B0F19] text-white pb-20 font-sans">

                {/* 1. Dashboard Header */}
                <header className="bg-[#111827] border-b border-gray-800 px-8 py-6 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">
                                <Activity size={16} /> Global Intelligence
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Trend Command Center</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {isAnalyzing ? (
                                <button
                                    onClick={handleStop}
                                    className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/50 rounded-lg font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all animate-pulse"
                                >
                                    <AlertOctagon size={18} /> EMERGENCY GRIP
                                </button>
                            ) : (
                                <button
                                    onClick={handleAnalysis}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                                >
                                    <RefreshCw size={18} /> SCAN NETWORK
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-12 gap-8">

                    {/* Left: Trend Feed */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-[#111827] rounded-3xl p-6 border border-gray-800 h-full">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Active Signals</h3>
                            <div className="space-y-2">
                                {TREND_DATA.map(trend => (
                                    <button
                                        key={trend.id}
                                        onClick={() => setSelectedTrend(trend)}
                                        className={cn(
                                            "w-full p-4 rounded-xl border text-left transition-all relative overflow-hidden group",
                                            selectedTrend.id === trend.id
                                                ? "bg-blue-600/10 border-blue-500/50"
                                                : "bg-gray-800/50 border-transparent hover:bg-gray-800"
                                        )}
                                    >
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-white">{trend.name}</span>
                                                <span className="text-xs font-mono text-green-400">^{trend.score}</span>
                                            </div>
                                            <div className="flex gap-1 h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-full" style={{ width: `${trend.score}%` }} />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Main Viz */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Radar Chart Card */}
                        <div className="bg-[#111827] rounded-3xl p-6 border border-gray-800 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Radar size={18} className="text-purple-500" /> Sentiment Analysis
                                </h3>
                                <span className="text-xs font-mono text-gray-500">LIVE DATA STREAM</span>
                            </div>

                            <div className="h-80 w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={selectedTrend.sentiment}>
                                        <PolarGrid stroke="#374151" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                                        <RechartsRadar
                                            name={selectedTrend.name}
                                            dataKey="A"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            fill="#8b5cf6"
                                            fillOpacity={0.3}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Background Grid Decoration */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                        </div>

                        {/* Bar Chart Card */}
                        <div className="bg-[#111827] rounded-3xl p-6 border border-gray-800">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                                <TrendingUp size={18} className="text-green-500" /> Virality Velocity
                            </h3>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={selectedTrend.virality}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                        <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                                        <Tooltip
                                            cursor={{ fill: '#1F2937' }}
                                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', color: '#fff' }}
                                        />
                                        <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details & Palette */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-[#111827] rounded-3xl p-6 border border-gray-800 h-full">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Dominant Palette</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {selectedTrend.colors.map((hex) => (
                                    <div key={hex} className="group relative h-20 rounded-2xl bg-gray-800 overflow-hidden flex items-center justify-center transition-transform hover:scale-105">
                                        <div className="absolute inset-0" style={{ backgroundColor: hex }} />
                                        <div className="relative z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-white font-mono text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            {hex}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-800 space-y-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Detected Signals</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTrend.signals.map(s => (
                                        <span key={s} className="px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-400 border border-gray-700">
                                            #{s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-8 mt-12 mb-20">
                    
                </div>
            </div>
        </PremiumToolLayout>
    );
}
