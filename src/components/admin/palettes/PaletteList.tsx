'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, Heart, Search, Filter, Plus, Trash2, Edit, CheckSquare, Square, RefreshCw, Save, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cleanupDuplicates } from '@/app/admin/daily/actions'; // Import server action

interface PaletteListProps {
    initialPalettes: any[];
    totalCount: number;
}

export default function PaletteList({ initialPalettes, totalCount }: PaletteListProps) {
    const [palettes, setPalettes] = useState(initialPalettes);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isCleaning, setIsCleaning] = useState(false);

    // Editable Metrics State
    const [editingMetric, setEditingMetric] = useState<{ id: string, field: 'favorites_count' | 'views_count' } | null>(null);
    const [tempMetricValue, setTempMetricValue] = useState<number>(0);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this palette?')) return;
        try {
            const { error } = await supabase.from('palettes').delete().eq('id', id);
            if (error) throw error;
            setPalettes(prev => prev.filter(p => p.id !== id));
            setSelectedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
            toast.success('Palette deleted');
        } catch (err: any) {
            toast.error('Failed to delete');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Delete ${selectedIds.size} palettes?`)) return;

        try {
            const ids = Array.from(selectedIds);
            const { error } = await supabase.from('palettes').delete().in('id', ids);
            if (error) throw error;
            setPalettes(prev => prev.filter(p => !selectedIds.has(p.id)));
            setSelectedIds(new Set());
            toast.success(`${ids.length} palettes deleted`);
        } catch (err: any) {
            toast.error('Bulk delete failed');
        }
    };

    const handleAutoCleanup = async () => {
        if (!confirm('Run auto-cleanup for duplicates?')) return;
        setIsCleaning(true);
        try {
            const res = await cleanupDuplicates();
            if (res.error) throw new Error(res.error);
            toast.success(res.message);
            // Ideally re-fetch or just reload window to see changes
            if (res.deletedCount && res.deletedCount > 0) window.location.reload();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsCleaning(false);
        }
    };

    // Metrics Editing
    const startEditing = (palette: any, field: 'favorites_count' | 'views_count') => {
        setEditingMetric({ id: palette.id, field });
        setTempMetricValue(palette[field] || 0);
    };

    const saveMetric = async () => {
        if (!editingMetric) return;
        try {
            const { error } = await supabase
                .from('palettes')
                .update({ [editingMetric.field]: tempMetricValue })
                .eq('id', editingMetric.id);

            if (error) throw error;

            setPalettes(prev => prev.map(p =>
                p.id === editingMetric.id ? { ...p, [editingMetric.field]: tempMetricValue } : p
            ));
            setEditingMetric(null);
            toast.success('Metric updated');
        } catch (err) {
            toast.error('Update failed');
        }
    };

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredPalettes.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredPalettes.map(p => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    // Derived state for filtering
    const filteredPalettes = palettes.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Palette Manager</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Total: <span className="font-bold">{totalCount}</span> (Showing {filteredPalettes.length})
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleAutoCleanup}
                        disabled={isCleaning}
                        className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-200 transition disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isCleaning ? 'animate-spin' : ''} />
                        Cleanup Duplicates
                    </button>
                    <Link
                        href="/admin/palettes/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition"
                    >
                        <Plus size={18} />
                        New
                    </Link>
                </div>
            </div>

            {/* Filters & Bulk Actions */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    {/* Bulk Delete Btn - Only show if selected */}
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100 transition animate-in fade-in"
                        >
                            <Trash2 size={16} />
                            Delete ({selectedIds.size})
                        </button>
                    )}

                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 w-48 text-sm"
                        />
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Showing {filteredPalettes.length}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4 w-12">
                                <button onClick={toggleSelectAll} className="block">
                                    {selectedIds.size > 0 && selectedIds.size === filteredPalettes.length ? (
                                        <CheckSquare size={18} className="text-blue-600" />
                                    ) : (
                                        <Square size={18} className="text-gray-300" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-4 font-bold">Palette</th>
                            <th className="px-6 py-4 font-bold text-center">Engagement (Click to Edit)</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPalettes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No palettes found.</td>
                            </tr>
                        ) : (
                            filteredPalettes.map((palette) => (
                                <tr key={palette.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(palette.id) ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleSelect(palette.id)}>
                                            {selectedIds.has(palette.id) ? (
                                                <CheckSquare size={18} className="text-blue-600" />
                                            ) : (
                                                <Square size={18} className="text-gray-300" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="flex h-10 w-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                                {palette.colors.map((color: string, i: number) => (
                                                    <div key={i} style={{ backgroundColor: color }} className="flex-1" />
                                                ))}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{palette.name}</div>
                                                <div className="flex gap-1 mt-1">
                                                    {palette.category?.slice(0, 2).map((cat: string) => (
                                                        <span key={cat} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Editable Metrics Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-6 text-gray-500">
                                            {/* Views */}
                                            <div className="flex items-center gap-2 group cursor-pointer" title="Click to edit Views">
                                                <Eye size={16} />
                                                {editingMetric?.id === palette.id && editingMetric?.field === 'views_count' ? (
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            className="w-16 border rounded px-1 py-0.5 text-xs"
                                                            autoFocus
                                                            value={tempMetricValue}
                                                            onChange={e => setTempMetricValue(Number(e.target.value))}
                                                            onKeyDown={e => e.key === 'Enter' && saveMetric()}
                                                        />
                                                        <button onClick={saveMetric} className="text-green-600"><Save size={14} /></button>
                                                        <button onClick={() => setEditingMetric(null)} className="text-red-600"><X size={14} /></button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        onClick={() => startEditing(palette, 'views_count')}
                                                        className="hover:text-blue-600 hover:underline decoration-dashed underline-offset-4"
                                                    >
                                                        {palette.views_count || 0}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Favorites */}
                                            <div className="flex items-center gap-2 group cursor-pointer" title="Click to edit Favorites">
                                                <Heart size={16} className={palette.favorites_count > 0 ? "text-red-500 fill-red-500/10" : ""} />
                                                {editingMetric?.id === palette.id && editingMetric?.field === 'favorites_count' ? (
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            className="w-16 border rounded px-1 py-0.5 text-xs"
                                                            autoFocus
                                                            value={tempMetricValue}
                                                            onChange={e => setTempMetricValue(Number(e.target.value))}
                                                            onKeyDown={e => e.key === 'Enter' && saveMetric()}
                                                        />
                                                        <button onClick={saveMetric} className="text-green-600"><Save size={14} /></button>
                                                        <button onClick={() => setEditingMetric(null)} className="text-red-600"><X size={14} /></button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        onClick={() => startEditing(palette, 'favorites_count')}
                                                        className="hover:text-blue-600 hover:underline decoration-dashed underline-offset-4"
                                                    >
                                                        {palette.favorites_count || 0}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${palette.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {palette.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/palettes/${palette.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(palette.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
