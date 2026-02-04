'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Zap, BookOpen, Eye, Palette, Check } from 'lucide-react';

type Mode = 'standard' | 'adhd' | 'autism' | 'dyslexia' | 'protanopia';

const MODES: { id: Mode; name: string; icon: any; desc: string; colors: any }[] = [
    {
        id: 'standard',
        name: 'Standard',
        icon: Palette,
        desc: 'Default high-contrast design.',
        colors: { bg: '#ffffff', card: '#f3f4f6', text: '#111827', accent: '#3b82f6', success: '#22c55e', warning: '#eab308' }
    },
    {
        id: 'adhd',
        name: 'ADHD Focus',
        icon: Zap,
        desc: 'High contrast, minimal distraction. Reduced non-essential colors to help focus.',
        colors: { bg: '#f8fafc', card: '#ffffff', text: '#0f172a', accent: '#2563eb', success: '#15803d', warning: '#b45309' }
    },
    {
        id: 'autism',
        name: 'Autism (Calm)',
        icon: Smile,
        desc: 'Soft, muted pastels. Avoids bright yellows/reds and high-contrast vibration.',
        colors: { bg: '#fdfbf7', card: '#e2e8f0', text: '#475569', accent: '#94a3b8', success: '#86efac', warning: '#fde047' }
    },
    {
        id: 'dyslexia',
        name: 'Dyslexia Friendly',
        icon: BookOpen,
        desc: 'Warm cream backgrounds (avoid pure white). Dark grey text (avoid pure black).',
        colors: { bg: '#fffff0', card: '#faebd7', text: '#333333', accent: '#4682b4', success: '#556b2f', warning: '#DAA520' }
    },
    {
        id: 'protanopia',
        name: 'Color Blind Safe',
        icon: Eye,
        desc: 'Red-Green safe palette. Uses Blue/Orange/Yellow for distinction.',
        colors: { bg: '#ffffff', card: '#f3f4f6', text: '#000000', accent: '#0072b2', success: '#009e73', warning: '#d55e00' }
    }
];

export default function NeurodiversityPage() {
    const [activeMode, setActiveMode] = useState<Mode>('standard');
    const currentTheme = MODES.find(m => m.id === activeMode)?.colors;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center">

                <header className="max-w-3xl w-full text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Smile size={14} /> Inclusive Design
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Neurodiversity Optimizer</h1>
                    <p className="text-gray-500 text-lg">
                        Simulate and optimize your palette for different neurodivergent needs.
                        Design for brains that process sensory information differently.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl w-full">

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {MODES.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setActiveMode(mode.id)}
                                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all duration-200 ${activeMode === mode.id ? 'bg-white border-blue-500 ring-2 ring-blue-100 shadow-lg scale-105' : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                <div className={`p-3 rounded-xl ${activeMode === mode.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <mode.icon size={24} />
                                </div>
                                <div>
                                    <h3 className={`font-bold ${activeMode === mode.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {mode.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                        {mode.desc}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-3xl shadow-xl overflow-hidden border border-gray-100 min-h-[500px] flex flex-col"
                                style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
                            >
                                {/* Mock App Header */}
                                <div className="p-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400 opacity-50" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-50" />
                                            <div className="w-3 h-3 rounded-full bg-green-400 opacity-50" />
                                        </div>
                                        <div className="text-sm font-bold opacity-50">App Preview</div>
                                    </div>
                                </div>

                                {/* Mock App Content */}
                                <div className="p-8 flex-1 flex flex-col gap-8">

                                    {/* Hero */}
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-black">Welcome back, User.</h2>
                                            <p className="opacity-70 max-w-md">Here is your daily overview. You have 3 pending tasks to complete today.</p>
                                        </div>
                                        <button
                                            className="px-6 py-3 rounded-xl font-bold text-white shadow-lg transform transition-transform hover:scale-105 active:scale-95"
                                            style={{ backgroundColor: currentTheme.accent }}
                                        >
                                            New Task
                                        </button>
                                    </div>

                                    {/* Cards */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: currentTheme.card }}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-lg" style={{ backgroundColor: currentTheme.success + '20', color: currentTheme.success }}>
                                                    <Check size={20} />
                                                </div>
                                                <span className="text-xs font-bold opacity-50 uppercase">Completed</span>
                                            </div>
                                            <div className="text-2xl font-bold mb-1">12 Tasks</div>
                                            <div className="text-sm opacity-60">+24% from yesterday</div>
                                        </div>

                                        <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: currentTheme.card }}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-lg" style={{ backgroundColor: currentTheme.warning + '20', color: currentTheme.warning }}>
                                                    <Zap size={20} />
                                                </div>
                                                <span className="text-xs font-bold opacity-50 uppercase">Pending</span>
                                            </div>
                                            <div className="text-2xl font-bold mb-1">5 Urgent</div>
                                            <div className="text-sm opacity-60">Requires attention</div>
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div className="p-6 rounded-2xl shadow-sm space-y-4" style={{ backgroundColor: currentTheme.card }}>
                                        <h3 className="font-bold border-b pb-2 opacity-80" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>Recent Activity</h3>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: currentTheme.accent, opacity: 0.8 }}>
                                                        U{i}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">Project Update #{i}</div>
                                                        <div className="text-xs opacity-60">2 hours ago</div>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: currentTheme.bg }}>
                                                    View
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
