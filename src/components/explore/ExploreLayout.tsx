'use client';

import { PaletteCard } from './PaletteCard';
import { Search } from 'lucide-react';
import { useState, Suspense, useEffect, useRef } from 'react';

import { DashboardLayout } from '../layout/DashboardLayout';
import { useSearchParams, useRouter } from 'next/navigation';

import { fetchPalettesAction } from '@/app/explore/actions';

interface ExploreLayoutProps {
    initialCategories?: { id: string; label: string }[];
    initialPalettes?: any[];
}

const ExploreContent = ({ categories = [], initialPalettes = [] }: { categories?: { id: string; label: string }[], initialPalettes?: any[] }) => {
    // Modal States


    // Data State
    // Initialize with ISR data if available
    const [palettes, setPalettes] = useState<any[]>(initialPalettes);
    const [isLoading, setIsLoading] = useState(initialPalettes.length === 0);

    // Search & Filter
    const searchParams = useSearchParams();
    const router = useRouter();
    const sort = searchParams.get('sort') || 'popular';
    const tag = searchParams.get('tag');

    // Pagination State
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    // Track if we've done the initial client-side fetch (to avoid double fetching if ISR data exists)
    const isFirstMount = useRef(true);

    const fetchPalettes = async (isLoadMore = false) => {
        if (!isLoadMore) setIsLoading(true);

        try {
            const currentPage = isLoadMore ? page + 1 : 0;
            const { palettes: newPalettes, hasMore: moreAvailable, error } = await fetchPalettesAction(
                currentPage,
                tag,
                sort
            );

            if (error) {
                console.error('Fetch error:', error);
                return;
            }

            if (isLoadMore) {
                setPalettes(prev => [...prev, ...newPalettes]);
                setPage(prev => prev + 1);
            } else {
                setPalettes(newPalettes);
                setPage(0);
            }

            setHasMore(moreAvailable);
        } catch (err) {
            console.error('Failed to fetch palettes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Infinite Scroll Observer
    useEffect(() => {
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchPalettes(true);
            }
        }, { threshold: 0.1 });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoading, page, tag, sort]); // Refresh observer when dependencies change

    // Reset and fetch on filter change
    useEffect(() => {
        // If it's the first mount and we have ISR data, and no specific filter is active (or matches ISR default), skip fetch
        // However, if URL params (tag/sort) differ from default, we MUST fetch.
        // For simplicity: If there's initial data and we are on default view, skip.
        // Actually, safer logic: If `initialPalettes` is provided, we assume it matches the *current* server render params.
        // But `useEffect` runs on client. If client navigates, `initialPalettes` stays same (from server prop) but URL changes.
        // So we should only use `initialPalettes` on *very first* render if params match.

        if (isFirstMount.current) {
            isFirstMount.current = false;
            // If we have initial data (ISR) and no specific filter that would require a re-fetch, skip.
            // But simplify: If provided, use it. If filters change later, this effect runs again.
            if (initialPalettes.length > 0 && !tag && sort === 'popular') {
                return;
            }
        }

        setPage(0);
        fetchPalettes(false);
    }, [tag, sort]);

    // Fallback categories if empty
    const displayCategories = categories.length > 0 ? categories : [
        { id: 'all', label: 'All' },
        { id: 'SaaS', label: 'SaaS' },
        { id: 'Nature', label: 'Nature' },
        { id: 'Food', label: 'Food' },
        { id: 'Tech', label: 'Tech' },
        { id: 'Cyberpunk', label: 'Cyberpunk' },
        { id: 'Minimal', label: 'Minimal' }
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

                    {/* Navbar Action Buttons - REMOVED */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        {/* Buttons were here */}
                    </div>
                </div>

                {/* Categories Tab Bar */}
                <div className="px-8 pb-0 overflow-x-auto flex gap-6 scrollbar-hide">
                    {displayCategories.map(cat => {
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


            {/* Palette Grid */}
            <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold capitalize">
                        {tag && tag !== 'all' ? `${tag} Palettes` : `All Palettes`}
                    </h2>
                </div>
                {isLoading ? (
                    <div className="py-20 text-center text-gray-500">Loading palettes...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 min-h-[50vh]">
                        {palettes.length > 0 ? palettes.map((palette) => (
                            <PaletteCard key={palette.id} {...palette} />
                        )) : (
                            <div className="col-span-full py-20 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="font-medium text-gray-900 mb-1">No palettes found</p>
                                <p className="text-sm">Be the first to publish one in this category!</p>
                            </div>
                        )}
                    </div>
                )}
                {/* Infinite Scroll Sentinel */}
                {hasMore && (
                    <div ref={loadMoreRef} className="flex justify-center mt-12 pb-10">
                        {isLoading && palettes.length > 0 && (
                            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export const ExploreLayout = ({ initialCategories, initialPalettes }: ExploreLayoutProps) => {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-10 text-center">Loading feed...</div>}>
                <ExploreContent categories={initialCategories} initialPalettes={initialPalettes} />
            </Suspense>
        </DashboardLayout>
    );
};
