'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Briefcase, ShoppingBag, Heart, Coffee, Settings2 } from 'lucide-react';
import chroma from 'chroma-js';
import { motion } from 'framer-motion';

const INDUSTRIES = [
    { id: 'fintech', name: 'Fintech & Banking', icon: Briefcase, colors: ['#0f172a', '#1e40af', '#3b82f6', '#94a3b8'], desc: 'Trust, Stability, Security' },
    { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingBag, colors: ['#ea580c', '#f97316', '#fbbf24', '#ffffff'], desc: 'Urgency, Energy, Conversion' },
    { id: 'health', name: 'Health & Wellness', icon: Heart, colors: ['#047857', '#10b981', '#a7f3d0', '#f0fdf4'], desc: 'Calm, Growth, Healing' },
    { id: 'social', name: 'Social & Lifestyle', icon: Coffee, colors: ['#be185d', '#ec4899', '#fbcfe8', '#fff1f2'], desc: 'Friendly, Playful, Human' },
];

export default function ContextOptimizerPage() {
    const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Settings2 size={14} /> Smart Calibration
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Context-Aware Optimizer</h1>
                    <p className="text-lg text-gray-500">
                        Calibrate your color system for industry-specific psychological goals.
                    </p>
                </header>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {INDUSTRIES.map(ind => (
                            <button
                                key={ind.id}
                                onClick={() => setSelectedIndustry(ind)}
                                className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all ${selectedIndustry.id === ind.id ? 'bg-white border-blue-500 shadow-lg scale-105' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                            >
                                <div className={`p-3 rounded-lg ${selectedIndustry.id === ind.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <ind.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{ind.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{ind.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Mock Hero Site */}
                        <motion.div
                            key={selectedIndustry.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 min-h-[400px] flex flex-col"
                        >
                            {/* Navbar */}
                            <div className="p-6 flex justify-between items-center" style={{ backgroundColor: selectedIndustry.colors[3], color: chroma(selectedIndustry.colors[3]).luminance() > 0.6 ? 'black' : 'white' }}>
                                <div className="font-black text-xl tracking-tighter uppercase">{selectedIndustry.id}</div>
                                <div className="flex gap-4 text-sm font-bold opacity-70">
                                    <span>Product</span>
                                    <span>About</span>
                                    <span>Contact</span>
                                </div>
                            </div>

                            {/* Hero Content */}
                            <div className="flex-1 p-12 flex flex-col justify-center items-start text-left bg-white">
                                <h2 className="text-5xl font-black mb-6 text-gray-900 leading-tight">
                                    {selectedIndustry.id === 'fintech' && 'Banking for the Next Generation.'}
                                    {selectedIndustry.id === 'ecommerce' && 'Summer Sale is Here.'}
                                    {selectedIndustry.id === 'health' && 'Your Wellness Journey.'}
                                    {selectedIndustry.id === 'social' && 'Connect with Friends.'}
                                </h2>
                                <p className="text-xl text-gray-400 mb-8 max-w-md">
                                    {selectedIndustry.id === 'fintech' && 'Secure, fast, and reliable payments for everyone.'}
                                    {selectedIndustry.id === 'ecommerce' && 'Up to 50% off on all selected items.'}
                                    {selectedIndustry.id === 'health' && 'Mindfulness, nutrition, and exercise tracking.'}
                                    {selectedIndustry.id === 'social' && 'Share moments, stories, and life.'}
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        className="px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105"
                                        style={{ backgroundColor: selectedIndustry.colors[1] }}
                                    >
                                        Get Started
                                    </button>
                                    <button
                                        className="px-8 py-4 rounded-xl font-bold border-2 transition-colors"
                                        style={{ borderColor: selectedIndustry.colors[0], color: selectedIndustry.colors[0] }}
                                    >
                                        Learn More
                                    </button>
                                </div>
                            </div>

                            {/* Accent Strip */}
                            <div className="h-4" style={{ backgroundColor: selectedIndustry.colors[2] }} />

                        </motion.div>

                        {/* Palette Breakdown */}
                        <div className="grid grid-cols-4 gap-4">
                            {selectedIndustry.colors.map((c, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="h-16 rounded-xl shadow-sm" style={{ backgroundColor: c }} />
                                    <span className="text-xs font-mono text-gray-400 text-center">{c}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
