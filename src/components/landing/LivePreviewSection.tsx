'use client';

import { VisualizerView } from '@/components/visualize/VisualizerView';
import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// Static demo palette
// Static demo palette
const DEMO_PALETTE = [
    { id: '1', hex: '#0F172A', isLocked: false }, // Text
    { id: '2', hex: '#FFFFFF', isLocked: false }, // Background
    { id: '3', hex: '#00CC66', isLocked: false }, // Primary
    { id: '4', hex: '#1E1E1E', isLocked: false }, // Secondary
    { id: '5', hex: '#00CC66', isLocked: false }, // Accent
];

export const LivePreviewSection = () => {
    // We need to manage some state even for the demo to be interactive
    const [colors, setColors] = useState(DEMO_PALETTE);
    const [activeTab, setActiveTab] = useState<'website' | 'mobile' | 'all'>('website');

    // Simplified update for demo
    const updateColor = (id: string, newHex: string) => {
        setColors(prev => prev.map(c => c.id === id ? { ...c, hex: newHex } : c));
    };

    const generate = () => {
        setColors(prev => prev.map(c => ({ ...c, hex: chroma.random().hex() })));
    };

    const TABS: { id: 'website' | 'mobile' | 'all'; label: string }[] = [
        { id: 'website', label: 'Website' },
        { id: 'mobile', label: 'Mobile App' },
        { id: 'all', label: 'Dashboard' }
    ];

    return (
        <section className="py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">See it live, instantly.</h2>
                        <p className="text-xl text-gray-500">
                            Don&apos;t just guess how colors look. Visualize them on real UI components, shuffle layouts, and tweak in real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Browser Container Frame */}
                <div className="relative rounded-2xl border border-gray-200 shadow-2xl bg-gray-50 overflow-hidden h-[600px] md:h-[800px]">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-white border-b border-gray-200 flex items-center px-4 gap-2 z-10">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="bg-gray-100 px-3 py-1 rounded-md text-xs text-gray-400 flex-1 text-center font-mono">
                            dopley.app/preview
                        </div>
                    </div>

                    <div className="pt-10 h-full w-full">
                        <VisualizerView
                            colors={colors}
                            onGenerate={generate}
                            onToggleLock={() => { }} // No-op for landing demo
                            onUpdateColor={updateColor}
                            onUndo={() => { }}
                            onRedo={() => { }}
                            onExport={() => { }}
                            onShare={() => { }}
                            externalTemplate={activeTab}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
