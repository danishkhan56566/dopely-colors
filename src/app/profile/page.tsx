'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { PaletteCard } from '@/components/explore/PaletteCard';
import { Loader2, Plus, Ghost } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [palettes, setPalettes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPalettes = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('palettes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                // Map DB schema to UI schema
                const mapped = data.map(p => ({
                    id: p.id,
                    colors: p.colors,
                    likes: 0, // Mock for now or fetch
                }));
                setPalettes(mapped);
            }
            setLoading(false);
        };

        fetchPalettes();
    }, []);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB] p-8 pt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Your Palettes</h1>
                            <p className="text-gray-500 mt-1">Manage your saved collections.</p>
                        </div>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            <Plus size={20} /> Create New
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="animate-spin text-gray-300" size={32} />
                        </div>
                    ) : palettes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {palettes.map((p) => (
                                <div key={p.id} className="relative group">
                                    <PaletteCard {...p} />
                                    {/* Delete Button Overlay could go here */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Ghost className="text-gray-300" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No palettes yet</h3>
                            <p className="text-gray-500 max-w-sm text-center mb-8">
                                Start generating colors and save them to build your personal library.
                            </p>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                            >
                                Open Generator
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
