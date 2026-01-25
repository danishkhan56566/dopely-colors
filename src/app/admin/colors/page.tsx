'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Plus, Trash2, Check, X, Search, Globe, Lock } from 'lucide-react';
import chroma from 'chroma-js';
import { getColors, createColor, updateColor, deleteColor, generateRandomColors, deleteAllColors } from './actions';
import { Sparkles, Trash } from 'lucide-react'; // Import Trash

export default function ColorsManager() {
    const [colors, setColors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Create Mode
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newHex, setNewHex] = useState('');

    useEffect(() => {
        loadColors();
    }, []);

    async function loadColors() {
        try {
            const data = await getColors();
            setColors(data || []);
        } catch (e) {
            toast.error('Failed to load colors');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (!chroma.valid(newHex)) {
                toast.error('Invalid Hex Code');
                return;
            }
            await createColor(newName, newHex);
            toast.success('Color added');
            setIsCreating(false);
            setNewName('');
            setNewHex('');
            loadColors();
        } catch (e: any) {
            toast.error(e.message);
        }
    }

    async function togglePublish(id: string, current: boolean) {
        try {
            const promise = updateColor(id, { published: !current });
            toast.promise(promise, {
                loading: 'Updating...',
                success: 'Status updated',
                error: 'Failed to update'
            });
            await promise;
            loadColors();
        } catch (e) {
            //
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this color?')) return;
        try {
            await deleteColor(id);
            toast.success('Color deleted');
            loadColors();
        } catch (e) {
            toast.error('Failed to delete');
        }
    }

    const filtered = colors.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.hex.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleDeleteAll() {
        if (!confirm('Are you ABSOLUTELY SURE? This will delete ALL colors in the database. This action cannot be undone.')) return;

        const toastId = toast.loading('Deleting all colors...');
        try {
            await deleteAllColors();
            toast.success('All colors deleted', { id: toastId });
            loadColors();
        } catch (e: any) {
            toast.error(e.message || 'Failed to delete all', { id: toastId });
        }
    }

    // ...

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                {/* ... */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDeleteAll}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <Trash size={18} /> Delete All
                    </button>

                    <button
                        onClick={async () => {
                            const toastId = toast.loading('Generating 100 colors...');
                            try {
                                await generateRandomColors(100);
                                loadColors(); // Should work if case matches, see next chunk
                                toast.success('Generated 100 colors', { id: toastId });
                            } catch (e: any) {
                                toast.error(e.message || 'Failed to generate', { id: toastId });
                            }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <Sparkles size={18} /> Auto Generate
                    </button>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> Add Color
                    </button>
                </div>
            </div>

            {/* Create Modal */}
            {
                isCreating && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Add New Color</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Color Name</label>
                                    <input
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Cherry Rose"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hex Code</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 px-4 py-2 border rounded-lg font-mono focus:ring-2 focus:ring-indigo-500"
                                            placeholder="#AB274F"
                                            value={newHex}
                                            onChange={e => setNewHex(e.target.value)}
                                            required
                                        />
                                        <div
                                            className="w-10 h-10 rounded-lg border shadow-sm"
                                            style={{ backgroundColor: chroma.valid(newHex) ? newHex : 'transparent' }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                                    >
                                        Create Color
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Color</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Loading colors...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No colors found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(color => (
                                    <tr key={color.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-lg shadow-sm border border-gray-100"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                                <Link
                                                    href={`/colors/${color.hex.replace('#', '')}/about`}
                                                    target="_blank"
                                                    className="hover:underline"
                                                >
                                                    <div className="font-bold text-gray-900">{color.name}</div>
                                                    <div className="text-xs font-mono text-gray-400">{color.hex}</div>
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(color.created_at).toLocaleDateString()} {new Date(color.created_at).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => togglePublish(color.id, color.published)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${color.published
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    }`}
                                            >
                                                {color.published ? <Globe size={12} /> : <Lock size={12} />}
                                                {color.published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(color.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
