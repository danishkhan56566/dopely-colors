'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Palette, Layers, Heart, Download, MoreHorizontal, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import chroma from 'chroma-js';

// Mock Data
const MOCK_PALETTES = [
    { id: 1, name: 'Ocean Sunset', colors: ['#FF9A9E', '#FECFEF', '#E0C3FC', '#A8C0FF', '#3F2B96'] },
    { id: 2, name: 'Neon Cyberpunk', colors: ['#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0'] },
    { id: 3, name: 'Forest Rain', colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'] },
];

const MOCK_GRADIENTS = [
    { id: 1, name: 'Warm Flame', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
    { id: 2, name: 'Night Sky', gradient: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)' },
];

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<'palettes' | 'gradients' | 'favorites'>('palettes');

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Library</h1>
                        <p className="text-gray-500 mt-1">Manage all your saved design assets.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search library..."
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <Link href="/generate" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all">
                            <Plus size={16} /> New Asset
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
                    {[
                        { id: 'palettes', label: 'Palettes', icon: Palette },
                        { id: 'gradients', label: 'Gradients', icon: Layers },
                        { id: 'favorites', label: 'Favorites', icon: Heart },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg"
                            )}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">

                    {/* PALETTES STATE */}
                    {activeTab === 'palettes' && MOCK_PALETTES.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            {/* Preview */}
                            <div className="h-32 flex">
                                {item.colors.map(color => (
                                    <div key={color} className="flex-1 h-full" style={{ backgroundColor: color }} />
                                ))}
                            </div>
                            {/* Info */}
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                                    <span className="text-xs text-gray-500">{item.colors.length} Colors</span>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* GRADIENTS STATE */}
                    {activeTab === 'gradients' && MOCK_GRADIENTS.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            <div className="h-32 w-full" style={{ background: item.gradient }} />
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                                    <span className="text-xs text-gray-500">Linear</span>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* FAVORITES (Generic Placeholder for now) */}
                    {activeTab === 'favorites' && (
                        <div className="col-span-full py-12 text-center text-gray-400">
                            <Heart size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No favorites yet. Start exploring to save items!</p>
                            <Link href="/explore" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Explore Assets</Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
