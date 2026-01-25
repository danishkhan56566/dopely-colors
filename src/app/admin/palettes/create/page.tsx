'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Plus, X, Globe, Star, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Algorithm, ALGORITHMS, generateColor } from '@/store/usePaletteStore';

export default function AdminCreatePalettePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('random');
    const [bulkCount, setBulkCount] = useState(50);
    const [isBulkGenerating, setIsBulkGenerating] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'], // Default 4 colors
        category: [] as string[],
        status: 'draft',
        is_featured: false,
        seo_title: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('name')
                    .order('name');

                if (error) throw error;

                if (data && data.length > 0) {
                    setCategories(data.map(c => c.name));
                } else {
                    // Fallback if empty DB
                    setCategories(['SaaS', 'Nature', 'Tech', 'Food', 'Travel', 'Fashion', 'Health', 'Sport', 'Art', 'Music', 'Business', 'Abstract']);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                // Fallback on error
                setCategories(['SaaS', 'Nature', 'Tech', 'Food', 'Travel', 'Fashion', 'Health', 'Sport', 'Art', 'Music', 'Business', 'Abstract']);
            }
        };
        fetchCategories();
    }, []);



    const generateSmartPalette = () => {
        const { name, category, colors } = generateSinglePaletteData();

        // 4. Update State
        setFormData({
            ...formData,
            colors: colors,
            name: name,
            category: [category],
            status: 'published',
            is_featured: true,
            seo_title: `${name} - ${category} Color Palette Inspiration`
        });

        toast.success('Generated full palette setup! 🪄');
    };

    const handleBulkGenerate = async () => {
        if (bulkCount < 1 || bulkCount > 500) return toast.error('Please enter a number between 1 and 500');

        setIsBulkGenerating(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const palettesToInsert = [];

            for (let i = 0; i < bulkCount; i++) {
                const { name, category, colors } = generateSinglePaletteData();
                palettesToInsert.push({
                    name,
                    colors,
                    category: [category],
                    created_by: user.id,
                    status: 'published',
                    is_featured: Math.random() < 0.2, // 20% chance of being featured
                    seo_title: `${name} - ${category} Color Palette Inspiration`,
                    updated_at: new Date().toISOString()
                });
            }

            const { error } = await supabase.from('palettes').insert(palettesToInsert);
            if (error) throw error;

            toast.success(`Successfully published ${bulkCount} ${selectedAlgorithm} palettes! 🚀`);
            // Optional: Redirect to list or stay
        } catch (err: any) {
            console.error(err);
            toast.error('Bulk generation failed: ' + err.message);
        } finally {
            setIsBulkGenerating(false);
        }
    };

    const generateSinglePaletteData = () => {
        // 1. Generate Colors based on Algorithm
        const newColors = Array(5).fill(0).map(() => generateColor(selectedAlgorithm));

        // 2. Generate Random Name
        const adjectives = ['Vibrant', 'Muted', 'Neon', 'Pastel', 'Dark', 'Soft', 'Bold', 'Fresh', 'Warm', 'Cool', 'Electric', 'Cozy', 'Cyber', 'Urban', 'Wild'];
        const nouns = ['Sunset', 'Ocean', 'Forest', 'Dream', 'Night', 'Sky', 'Berry', 'Tech', 'Minimal', 'Future', 'Wave', 'Harmony', 'Vibe', 'Flow', 'Pulse'];
        const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;

        // 3. Pick Random Category
        const availableCategories = categories.length > 0 ? categories : ['SaaS', 'Nature'];
        const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];

        return { name: randomName, category: randomCategory, colors: newColors };
    };

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

        setIsLoading(true);
        try {
            // Get current user ID
            const { data: { user } } = await supabase.auth.getUser();

            const payload = {
                ...formData,
                created_by: user?.id,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase.from('palettes').insert(payload);

            if (error) throw error;

            toast.success('Palette created successfully! Ready for the next one. 🚀');

            // Stay on page and generate fresh data for next palette
            generateSmartPalette();
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Optional: Reset featured/status if needed, but keeping them same is often helpful
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to create palette: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/palettes" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Add Palette</h1>
                        <p className="text-gray-500 text-sm mt-1">Design a new color combination.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isLoading ? 'Saving...' : 'Publish Palette'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Visual Editor */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-bold text-gray-700">Colors & Preview</label>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedAlgorithm}
                                    onChange={(e) => setSelectedAlgorithm(e.target.value as Algorithm)}
                                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-purple-500 bg-white"
                                >
                                    {ALGORITHMS.map(algo => (
                                        <option key={algo.id} value={algo.id}>{algo.label}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={generateSmartPalette}
                                    className="text-sm font-bold text-purple-600 flex items-center gap-1.5 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Wand2 size={16} /> Auto Generate
                                </button>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="h-32 rounded-xl overflow-hidden flex border border-gray-200 shadow-sm mb-6">
                            {formData.colors.map((color, i) => (
                                <div key={i} style={{ backgroundColor: color }} className="flex-1 transition-all group relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-black/20 text-white text-xs font-mono py-1 px-2 rounded backdrop-blur-sm">
                                            {color}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Color Inputs */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {formData.colors.map((color, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">
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
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addColor}
                                className="flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 border-dashed rounded-lg h-12 hover:bg-gray-50 hover:border-gray-300 transition font-bold text-sm"
                            >
                                <Plus size={16} /> Add
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
                                {categories.length === 0 ? (
                                    <span className="text-gray-400 text-sm">Loading categories...</span>
                                ) : (
                                    categories.map(cat => (
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
                                    ))
                                )}
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

                {/* Bulk Generator Card */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Wand2 size={18} className="text-purple-600" />
                        Bulk Generator
                    </h3>
                    <p className="text-sm text-gray-600">
                        Mass generate <strong>{selectedAlgorithm}</strong> palettes and publish them instantly.
                    </p>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="1"
                            max="500"
                            value={bulkCount}
                            onChange={(e) => setBulkCount(parseInt(e.target.value))}
                            className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 bg-white font-bold"
                        />
                        <button
                            onClick={handleBulkGenerate}
                            disabled={isBulkGenerating}
                            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none text-sm"
                        >
                            {isBulkGenerating ? 'Generating...' : `Generate ${bulkCount} Palettes`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
