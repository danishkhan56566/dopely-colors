'use client';

import { PaletteCard } from './PaletteCard';
import { Search, Eye, Download } from 'lucide-react';
import { useState, Suspense, useEffect, useMemo } from 'react';
import chroma from 'chroma-js';
import { usePaletteStore } from '@/store/usePaletteStore';
import { ContextPreview } from '../ContextPreview';
import { ExportModal } from '../ExportModal';
import { DashboardLayout } from '../layout/DashboardLayout';
import { useSearchParams, useRouter } from 'next/navigation';

// ---- MOCK DATA GENERATOR ----
const generateMockPalettes = (count: number) => {
    const TAGS = [
        'saas', 'fintech', 'health', 'islamic', 'ecommerce', 'ai',
        'pastel', 'vintage', 'warm', 'neon', 'dark'
    ];
    return Array.from({ length: count }, (_, i) => ({
        id: `p-${i}`,
        likes: Math.floor(Math.random() * 5000) + 100,
        date: '2 days ago',
        colors: chroma.scale([chroma.random(), chroma.random()]).mode('lch').colors(5),
        tags: TAGS[Math.floor(Math.random() * TAGS.length)]
    }));
};

const INITIAL_PALETTES = generateMockPalettes(50);

const ExploreContent = () => {
    // Modal States
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const { colors } = usePaletteStore();

    // Search & Filter
    const searchParams = useSearchParams();
    const router = useRouter();
    const sort = searchParams.get('sort') || 'popular';
    const tag = searchParams.get('tag');

    // Filter Logic
    const filteredPalettes = useMemo(() => {
        return [...INITIAL_PALETTES].filter(p => {
            if (tag && tag !== 'all') return p.tags === tag;
            return true;
        }).sort((a, b) => {
            if (sort === 'new') return Math.random() - 0.5; // Mock new
            if (sort === 'random') return Math.random() - 0.5;
            return b.likes - a.likes; // Default popular
        });
    }, [tag, sort]);

    const CATEGORIES = [
        { id: 'all', label: 'All' },
        { id: 'saas', label: 'SaaS' },
        { id: 'ecommerce', label: 'E-commerce' },
        { id: 'islamic', label: 'Islamic' },
        { id: 'fintech', label: 'Fintech' },
        { id: 'health', label: 'Health' },
        { id: 'ai', label: 'AI' },
        { id: 'vintage', label: 'Vintage' },
        { id: 'neon', label: 'Neon' }
    ];

    return (
        <>
            {/* Top Search Bar & Actions */}
            <div className="sticky top-16 md:top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 flex flex-col">
                <div className="px-8 py-5 flex items-center justify-between">
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search palettes..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                        />
                    </div>

                    {/* Navbar Action Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={() => setIsPreviewOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Visualize current palette"
                        >
                            <Eye size={18} />
                            <span className="hidden sm:inline">Preview</span>
                        </button>
                        <button
                            onClick={() => setIsExportOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Export current palette"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block" />

                        <div className="hidden md:flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 cursor-pointer hover:opacity-80 transition-opacity" />
                        </div>
                    </div>
                </div>

                {/* Categories Tab Bar */}
                <div className="px-8 pb-0 overflow-x-auto flex gap-6 scrollbar-hide">
                    {CATEGORIES.map(cat => {
                        const isActive = (!tag && cat.id === 'all') || tag === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => router.push(cat.id === 'all' ? '/explore' : `/explore?tag=${cat.id}`)}
                                className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${isActive ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Modals */}
            <ContextPreview
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                colors={colors}
            />
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                colors={colors}
            />

            {/* Palette Grid */}
            <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold capitalize">
                        {tag ? `${tag} Palettes` : `Popular Palettes`}
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 min-h-[50vh]">
                    {filteredPalettes.length > 0 ? filteredPalettes.slice(0, 24).map((palette) => (
                        <PaletteCard key={palette.id} {...palette} />
                    )) : (
                        <div className="col-span-full py-20 text-center text-gray-500">
                            No palettes found for this category.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export const ExploreLayout = () => {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-10 text-center">Loading feed...</div>}>
                <ExploreContent />
            </Suspense>
        </DashboardLayout>
    );
};
