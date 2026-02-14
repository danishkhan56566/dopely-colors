'use client';

import { useState } from 'react';
import { Folder, Plus, Trash, X } from 'lucide-react';
import { toast } from 'sonner';
import { createCategoryAction, deleteCategoryAction } from '@/app/admin/categories/actions';
import { createPortal } from 'react-dom';

export default function CategoryList({ initialCategories }: { initialCategories: any[] }) {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState('bg-gray-500');

    const COLORS = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
        'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
        'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
        'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
        'bg-rose-500', 'bg-slate-500', 'bg-gray-500', 'bg-zinc-500'
    ];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', newName);
        formData.append('color', newColor);

        const result = await createCategoryAction(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Category created!');
            setIsModalOpen(false);
            setNewName('');
            // Optimistic update could go here, but revalidatePath handles it mostly
            window.location.reload(); // Force refresh to see new data
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category? Palettes with this category will lose the tag.')) return;

        const result = await deleteCategoryAction(id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Category deleted');
            setCategories(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 text-sm mt-1">Organize palettes into searchable groups.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110`}>
                                <Folder size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                                <p className="text-sm text-gray-400 font-mono">{cat.slug}</p>
                            </div>
                        </div>
                        <div className="flex text-gray-300 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        No categories found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold">New Category</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="e.g. Modern UI"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color Label</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewColor(color)}
                                            className={`h-8 w-8 rounded-full ${color} transition-transform hover:scale-110 ${newColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
