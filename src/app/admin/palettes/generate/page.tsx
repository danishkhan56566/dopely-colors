'use client';

import { useState } from 'react';
import { VisualizerView } from '@/components/visualize/VisualizerView';
import { Sparkles, Sliders, Save, Eye, Globe } from 'lucide-react';
import chroma from 'chroma-js';
import clsx from 'clsx';

// Initial Mock Colors
const INITIAL_COLORS = [
    { id: '1', hex: '#0F172A', isLocked: false },
    { id: '2', hex: '#FFFFFF', isLocked: false },
    { id: '3', hex: '#3B82F6', isLocked: false },
    { id: '4', hex: '#1E293B', isLocked: false },
    { id: '5', hex: '#60A5FA', isLocked: false },
];

export default function PaletteGenerator() {
    const [colors, setColors] = useState(INITIAL_COLORS);
    const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('ai');

    // Metadata State
    const [metadata, setMetadata] = useState({
        name: '',
        slug: '',
        industry: 'SaaS',
        mood: 'Modern',
        tags: '',
        status: 'draft'
    });

    const handleUpdateColor = (id: string, newHex: string) => {
        setColors(prev => prev.map(c => c.id === id ? { ...c, hex: newHex } : c));
    };

    const handleGenerate = () => {
        // Mock Generation
        setColors(prev => prev.map(c => ({
            ...c,
            hex: chroma.random().hex()
        })));
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex bg-white overflow-hidden">

            {/* LEFT PANEL: Controls */}
            <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 relative z-20">
                <div className="p-4 border-b border-gray-100 flex gap-2">
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={clsx(
                            "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
                            activeTab === 'ai' ? "bg-rainbow text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                        )}
                    >
                        <Sparkles size={14} /> AI Gen
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={clsx(
                            "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
                            activeTab === 'manual' ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                        )}
                    >
                        <Sliders size={14} /> Manual
                    </button>
                </div>

                <div className="p-5 flex-1 overflow-y-auto space-y-6">
                    {activeTab === 'ai' ? (
                        <>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Prompt</label>
                                <textarea
                                    className="w-full h-32 p-3 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="Describe your palette..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Industry</label>
                                <select className="w-full p-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
                                    <option>SaaS</option>
                                    <option>Fintech</option>
                                    <option>E-commerce</option>
                                    <option>Health</option>
                                </select>
                            </div>
                            <button
                                onClick={handleGenerate}
                                className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} /> Generate
                            </button>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 text-sm py-10">
                            Manual controls...
                        </div>
                    )}
                </div>
            </div>

            {/* CENTER PANEL: Visualizer Canvas */}
            <div className="flex-1 bg-gray-50/50 relative overflow-hidden flex flex-col min-w-0">
                {/* Optional Toolbar/Breadcrumb Header could go here */}
                <div className="flex-1 relative">
                    <VisualizerView
                        colors={colors}
                        onUpdateColor={handleUpdateColor}
                        onGenerate={handleGenerate}
                        onToggleLock={() => { }}
                        onUndo={() => { }}
                        onRedo={() => { }}
                        onExport={() => { }}
                        onShare={() => { }}
                        externalTemplate="saas"
                    />
                </div>
            </div>

            {/* RIGHT PANEL: Metadata */}
            <div className="w-72 bg-white border-l border-gray-200 flex flex-col shrink-0 relative z-20">
                <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Properties</span>
                    <Globe size={16} className="text-gray-400" />
                </div>

                <div className="p-5 flex-1 overflow-y-auto space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Name</label>
                        <input
                            type="text"
                            value={metadata.name}
                            onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
                            placeholder="Palette Name"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Slug</label>
                        <input
                            type="text"
                            value={metadata.slug}
                            onChange={(e) => setMetadata({ ...metadata, slug: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 font-mono text-xs bg-gray-50 focus:bg-white"
                            placeholder="palette-slug"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mood</label>
                            <input type="text" className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-gray-50" placeholder="Modern" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Region</label>
                            <input type="text" className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-gray-50" placeholder="Global" />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Accessibility</label>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="px-2 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase tracking-wide rounded">AA Pass</div>
                            <div className="px-2 py-1 bg-red-100 text-red-700 font-bold text-[10px] uppercase tracking-wide rounded">AAA Fail</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 gap-2 bg-gray-50 flex flex-col">
                    <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                        <Save size={14} /> Save Draft
                    </button>
                    <button className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <Globe size={14} /> Publish Palette
                    </button>
                </div>
            </div>
        </div>
    );
}
