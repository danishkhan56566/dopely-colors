'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowUpRight, TrendingUp, Loader2 } from 'lucide-react';
import { getFavoritesData, FavoritesData } from './actions';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminFavoritesPage() {
    const [data, setData] = useState<FavoritesData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const result = await getFavoritesData();
            if (result) {
                setData(result);
            } else {
                toast.error('Failed to load favorites data');
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        );
    }

    if (!data) return <div className="text-center py-20 text-red-500">Failed to load data</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Favorites Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Track what users are loving.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-pink-50 text-pink-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <Heart size={16} className="fill-pink-700" />
                        Total: {data.total.toLocaleString()}
                    </div>
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <TrendingUp size={16} />
                        {data.growth > 0 ? `+${data.growth}% Recent` : 'No Recent Growth'}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4 font-bold">Palette</th>
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Date</th>
                            <th className="px-6 py-4 font-bold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No favorites found yet.
                                </td>
                            </tr>
                        ) : (
                            data.items.map((fav) => (
                                <tr key={fav.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex w-16 h-8 rounded-md overflow-hidden ring-1 ring-black/5 shadow-sm">
                                                {fav.palette_colors.map((c, i) => (
                                                    <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                                                ))}
                                            </div>
                                            <span className="font-bold text-gray-900">{fav.palette_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                        {fav.user_email}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(fav.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/palette/${fav.palette_colors.map(c => c.replace('#', '')).join('-')}`}
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 justify-end"
                                        >
                                            View <ArrowUpRight size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
