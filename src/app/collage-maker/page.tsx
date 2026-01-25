'use client';

import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LayoutGrid, Plus, Trash2, Download, Image as ImageIcon, Sparkles, Palette } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

type CollageItem = {
    id: string;
    type: 'image' | 'color';
    value: string;
};

export default function CollageMakerPage() {
    const [items, setItems] = useState<CollageItem[]>([
        { id: '1', type: 'color', value: '#4b7bec' },
        { id: '2', type: 'color', value: '#0fb9b1' },
        { id: '3', type: 'color', value: '#eb3b5a' },
        { id: '4', type: 'color', value: '#8854d0' },
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addItem = (type: 'image' | 'color', value: string) => {
        if (items.length >= 9) {
            toast.error('Maximum 9 items in the collage');
            return;
        }
        setItems([...items, { id: Math.random().toString(36).substr(2, 9), type, value }]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            addItem('image', url);
        }
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                                <LayoutGrid size={14} />
                                <span>Visual Moodboards</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                Create stunning photo collages.
                            </h1>
                            <p className="text-gray-500 font-medium">
                                Combine your favorite photos and color palettes into a beautiful visual story.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                                <ImageIcon size={18} /> Add Image
                            </button>
                            <button
                                onClick={() => addItem('color', '#' + Math.floor(Math.random() * 16777215).toString(16))}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                            >
                                <Palette size={18} /> Add Color
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                <Download size={18} /> Export Collage
                            </button>
                        </div>
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />

                    {/* Collage Canvas */}
                    <div className="max-w-4xl mx-auto">
                        <div className={clsx(
                            "aspect-square bg-white rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden grid gap-2 p-2",
                            items.length <= 1 ? "grid-cols-1" :
                                items.length <= 4 ? "grid-cols-2" :
                                    "grid-cols-3"
                        )}>
                            {items.map((item) => (
                                <div key={item.id} className="relative group overflow-hidden rounded-[1.5rem]">
                                    {item.type === 'color' ? (
                                        <div className="w-full h-full" style={{ backgroundColor: item.value }} />
                                    ) : (
                                        <img src={item.value} className="w-full h-full object-cover" alt="Collage cell" />
                                    )}

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-all scale-75 group-hover:scale-100"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {items.length === 0 && (
                                <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                    <LayoutGrid size={64} className="opacity-20" />
                                    <p className="font-bold">Add images or colors to start</p>
                                </div>
                            )}
                        </div>

                        {/* Empty Slots Hint */}
                        {items.length < 9 && (
                            <p className="text-center mt-8 text-gray-400 font-medium text-sm">
                                Add up to {9 - items.length} more pieces to your collage
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
