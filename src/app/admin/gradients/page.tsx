'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Trash2, Layers, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Gradient {
    id: number;
    name: string;
    css: string;
    tags: string[];
    is_published: boolean;
    created_at: string;
}

export default function AdminGradientsPage() {
    const [gradients, setGradients] = useState<Gradient[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | string | null>(null);

    useEffect(() => {
        fetchGradients();
    }, []);

    const fetchGradients = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/gradients');
            const data = await res.json();

            if (!res.ok) {
                console.error('Error fetching gradients:', data.error);
                throw new Error(data.error || 'Failed to fetch gradients');
            }

            setGradients(data || []);
        } catch (error: any) {
            console.error('Error fetching gradients:', error);
            toast.error(error.message || 'Failed to fetch gradients');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (gradient: Gradient) => {
        setProcessingId(gradient.id);
        const newState = !gradient.is_published;
        try {
            const res = await fetch('/api/admin/gradients', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: gradient.id, is_published: newState })
            });

            if (!res.ok) throw new Error('Failed to update status');

            setGradients(prev => prev.map(g => g.id === gradient.id ? { ...g, is_published: newState } : g));
            toast.success(newState ? 'Gradient published!' : 'Gradient unpublished');
        } catch (err: any) {
            console.error(err);
            toast.error('Error updating status');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: number | string) => {
        if (!confirm('Are you sure you want to delete this gradient?')) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/gradients?id=${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to delete');

            toast.success('Gradient deleted');
            setGradients(prev => prev.filter(g => g.id !== id));
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Error deleting gradient');
        } finally {
            setProcessingId(null);
        }
    };

    const copyCSS = (css: string) => {
        navigator.clipboard.writeText(css);
        toast.success('CSS Copied!');
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" />
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Gradients</h1>
                    <p className="text-gray-500">View and manage generated gradients</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total: <span className="font-mono font-medium text-gray-900">{gradients.length}</span>
                </div>
            </div>

            {gradients.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Layers className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No gradients found</h3>
                    <p className="mt-1 text-sm text-gray-500">Generate some from the Palettes page.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gradients.map((gradient) => (
                        <div key={gradient.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div
                                className="h-32 w-full relative group-hover:scale-105 transition-transform duration-500"
                                style={{ background: gradient.css }}
                            >
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button
                                        onClick={() => handleTogglePublish(gradient)}
                                        disabled={processingId === gradient.id}
                                        className={`px-2 py-1 text-xs font-semibold rounded-md shadow-sm transition-colors ${gradient.is_published
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {processingId === gradient.id ? <Loader2 size={12} className="animate-spin" /> : (gradient.is_published ? 'Published' : 'Draft')}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-medium text-gray-900 truncate flex-1" title={gradient.name}>
                                        {gradient.name}
                                    </h3>
                                    <div className="flex gap-1 shrink-0">
                                        <button
                                            onClick={() => copyCSS(gradient.css)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Copy CSS"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(gradient.id)}
                                            disabled={processingId === gradient.id}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                            title="Delete"
                                        >
                                            {processingId === gradient.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {gradient.tags?.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-gray-50 text-xs text-gray-600 rounded-full border border-gray-100">
                                            {tag}
                                        </span>
                                    ))}
                                    {(gradient.tags?.length || 0) > 3 && (
                                        <span className="px-2 py-0.5 bg-gray-50 text-xs text-gray-400 rounded-full">+{gradient.tags.length - 3}</span>
                                    )}
                                </div>
                                <div className="mt-3 text-xs text-gray-400">
                                    {new Date(gradient.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
