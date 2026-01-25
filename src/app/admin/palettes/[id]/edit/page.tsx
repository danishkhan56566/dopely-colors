'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Plus, X, Palette, Globe, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function EditPalettePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params in Next.js 15+ way
    const { id } = use(params);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        colors: [] as string[],
        category: [] as string[],
        status: 'draft',
        is_featured: false,
        seo_title: ''
    });

    const CATEGORIES = ['SaaS', 'Nature', 'Food', 'Tech', 'Cyberpunk', 'Minimal', 'Pastel', 'Dark Mode'];

    useEffect(() => {
        const fetchPalette = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('palettes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                toast.error('Failed to load palette');
                router.push('/admin/palettes');
                return;
            }

            if (data) {
                setFormData({
                    name: data.name || '',
                    colors: data.colors || [],
                    category: data.category || [],
                    status: data.status || 'draft',
                    is_featured: data.is_featured || false,
                    seo_title: data.seo_title || ''
                });
            }
            setIsLoading(false);
        };

        fetchPalette();
    }, [id, router]);

    const handleColorChange = (index: number, value: string) => {
        const newColors = [...formData.colors];
        newColors[index] = value;
        setFormData({ ...formData, colors: newColors });
    };

    const addColor = () => {
        if (formData.colors.length >= 10) return;
        setFormData({ ...formData, colors: [...formData.colors, '#000000'] });
    };

    const removeColor = (index: number) => {
        if (formData.colors.length <= 2) {
            toast.error('Palette must have at least 2 colors');
            return;
        }
        const newColors = formData.colors.filter((_, i) => i !== index);
        setFormData({ ...formData, colors: newColors });
    };

    const toggleCategory = (cat: string) => {
        const current = formData.category;
        if (current.includes(cat)) {
            setFormData({ ...formData, category: current.filter(c => c !== cat) });
        } else {
            setFormData({ ...formData, category: [...current, cat] });
        }
    };

    const handleSave = async () => {
        if (!formData.name) return toast.error('Palette Name is required');

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('palettes')
                .update(payload)
                .eq('id', id);

            if (error) throw error;

            toast.success('Palette updated successfully!');
            router.push('/admin/palettes');
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to update palette: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center text-gray-500">Loading editor...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/palettes" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Palette</h1>
                        <p className="text-gray-500 text-sm mt-1">Refine your color combination.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Visual Editor */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-4">Colors & Preview</label>

                        {/* Live Preview */}
                        <div className="h-32 rounded-xl overflow-hidden flex border border-gray-200 shadow-sm mb-6">
                            {formData.colors.map((color, i) => (
                                <div key={i} style={{ backgroundColor: color }} className="flex-1 transition-all" />
                            ))}
                        </div>

                        {/* Color Inputs */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {formData.colors.map((color, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => handleColorChange(i, e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                                    />
                                    <input
                                        type="text"
                                        value={color.toUpperCase()}
                                        onChange={(e) => handleColorChange(i, e.target.value)}
                                        className="w-full bg-transparent font-mono text-xs font-bold outline-none text-gray-700"
                                    />
                                    <button
                                        onClick={() => removeColor(i)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addColor}
                                className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 border-dashed rounded-lg h-12 hover:bg-blue-100 transition font-bold text-sm"
                            >
                                <Plus size={16} /> Add Color
                            </button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Palette Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Ocean Sunset"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${formData.category.includes(cat)
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe size={18} /> Visibility
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-medium text-gray-700">Featured</span>
                                <button
                                    onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_featured ? 'bg-yellow-500' : 'bg-gray-200'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.is_featured ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Star size={18} /> SEO
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">SEO Title (Optional)</label>
                            <input
                                type="text"
                                value={formData.seo_title}
                                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                placeholder="Custom meta title..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
