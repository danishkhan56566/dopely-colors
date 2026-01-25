'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Type, Download, Search, Heart, Sparkles, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

const MOCK_FONTS = [
    { id: '1', name: 'Inter', provider: 'Google Fonts', category: 'Sans Serif', weight: '9 styles', preview: 'The quick brown fox jumps over the lazy dog' },
    { id: '2', name: 'Playfair Display', provider: 'Google Fonts', category: 'Serif', weight: '6 styles', preview: 'Experience the elegance of timeless typography' },
    { id: '3', name: 'Outfit', provider: 'Google Fonts', category: 'Sans Serif', weight: '9 styles', preview: 'Modern and geometric precision for interfaces' },
    { id: '4', name: 'JetBrains Mono', provider: 'Google Fonts', category: 'Monospace', weight: '8 styles', preview: 'const code = "beautiful typography";' },
    { id: '5', name: 'Plus Jakarta Sans', provider: 'Google Fonts', category: 'Sans Serif', weight: '7 styles', preview: 'Fresh and energetic for modern digital products' },
    { id: '6', name: 'Bormiolo', provider: 'Adobe Fonts', category: 'Display', weight: '2 styles', preview: 'Bold statements require bold typefaces' },
];

export default function FontsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [customText, setCustomText] = useState('');

    const filteredFonts = MOCK_FONTS.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-pink-100">
                                <Type size={14} />
                                <span>Curated Typography</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                Discover the best free fonts.
                            </h1>
                            <p className="text-gray-500 font-medium">
                                A hand-picked collection of premium-quality free fonts for your next design project.
                            </p>
                        </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search fonts by name..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Type custom text to preview..."
                                className="w-full px-6 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={clsx("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-pink-600" : "text-gray-400")}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={clsx("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-white shadow-sm text-pink-600" : "text-gray-400")}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Font Grid */}
                    <div className={clsx(
                        "grid gap-6",
                        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                    )}>
                        {filteredFonts.map((font) => (
                            <div key={font.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 mb-1">{font.name}</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{font.provider} • {font.category}</p>
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-pink-500 transition-colors">
                                            <Heart size={20} />
                                        </button>
                                    </div>

                                    <div className="py-8 border-y border-gray-50 mb-6">
                                        <p className="text-3xl text-gray-800 leading-tight">
                                            {customText || font.preview}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-500">{font.weight}</span>
                                    <button className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all text-sm">
                                        <Download size={16} /> View Collection
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
