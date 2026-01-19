'use client';

import { usePaletteStore } from '@/store/usePaletteStore';
import { PaletteCard } from '@/components/explore/PaletteCard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Favorites() {
    const { savedPalettes, removeFavorite } = usePaletteStore();

    if (savedPalettes.length === 0) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center p-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                        <Trash2 size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h1>
                    <p className="text-gray-500 max-w-sm mb-8">
                        Start exploring or generating palettes and save the ones you love to build your collection.
                    </p>
                    <Link
                        href="/generate"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                        Create Palette
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
                        <p className="text-gray-500">You have {savedPalettes.length} saved palettes</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {savedPalettes.map((palette) => (
                        <div key={palette.id} className="relative group">
                            <PaletteCard
                                colors={palette.colors}
                                likes={palette.likes}
                                date={formatDistanceToNow(palette.date, { addSuffix: true })}
                            />
                            {/* Delete Action Overlay - Customized for Favorites view */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFavorite(palette.id);
                                }}
                                className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm z-20"
                                title="Remove from favorites"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
