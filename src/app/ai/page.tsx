'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    Wand2,
    Image as ImageIcon,
    Palette,
    Loader2,
    Upload,
    ArrowRight,
    Sparkles,
    Check,
    Copy,
    LayoutTemplate
} from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { generateFromText, generateFromBase, generateFromImage, AIResult } from '@/lib/mock-ai';
import { HexColorPicker } from 'react-colorful';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useRouter, useSearchParams } from 'next/navigation';

function AIPaletteGeneratorContent() {
    const [mode, setMode] = useState<'text' | 'image' | 'base'>('text');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AIResult[] | null>(null);

    // Inputs
    const [prompt, setPrompt] = useState('');
    const [baseColor, setBaseColor] = useState('#3B82F6');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setColors } = usePaletteStore();

    // Auto-generate if prompted via URL
    useEffect(() => {
        const urlPrompt = searchParams.get('prompt');
        if (urlPrompt && !results && !isLoading) {
            setPrompt(urlPrompt);
            handleGenerate(urlPrompt);
        }
    }, [searchParams]);

    const handleGenerate = async (overridePrompt?: string) => {
        setIsLoading(true);
        setResults(null);
        try {
            let res: AIResult[];
            const activePrompt = overridePrompt || prompt;

            if (mode === 'text' || overridePrompt) {
                if (!activePrompt.trim()) throw new Error("Please enter a description");
                // Import the new function dynamically or ensure imports are updated
                const { generateVariationsFromText } = await import('@/lib/mock-ai');
                res = await generateVariationsFromText(activePrompt);
            } else if (mode === 'base') {
                res = [await generateFromBase(baseColor)];
            } else {
                if (!imagePreview) throw new Error("Please upload an image");
                res = [await generateFromImage(imagePreview)];
            }
            setResults(res);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to generate");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const openInEditor = (result: AIResult) => {
        // Map result colors to store format
        const newColors = result.colors.map(hex => ({
            id: crypto.randomUUID(),
            hex,
            isLocked: false
        }));
        setColors(newColors);
        router.push('/');
        toast.success("Palette loaded into editor!");
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col items-center py-12 px-4 sm:px-6">

            <div className="max-w-6xl w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
                        <Sparkles size={14} /> AI Powered
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Generate from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Pure Imagination</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Describe your idea, upload an image, or start with a color. Our AI will craft the perfect palette for your project.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto w-full">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {[
                            { id: 'text', label: 'Text Prompt', icon: Wand2 },
                            { id: 'image', label: 'Image Upload', icon: ImageIcon },
                            { id: 'base', label: 'Base Color', icon: Palette },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setMode(tab.id as any);
                                    setResults(null);
                                }}
                                className={clsx(
                                    "flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2",
                                    mode === tab.id
                                        ? "border-blue-600 text-blue-600 bg-blue-50/30"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        {mode === 'text' && (
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Describe your project or mood</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., A calming meditation app with forest vibes..."
                                    className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors resize-none text-lg bg-gray-50 focus:bg-white"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {['Cyperpunk City', 'Organic Skincare', 'Fintech Dashboard', 'Retro 80s'].map(ex => (
                                        <button
                                            key={ex}
                                            onClick={() => setPrompt(ex)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 transition-colors"
                                        >
                                            {ex}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mode === 'image' && (
                            <div className="space-y-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={clsx(
                                        "w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group",
                                        imagePreview ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                    )}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />

                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
                                            <div className="relative z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm font-bold text-sm text-gray-900 flex items-center gap-2">
                                                <ImageIcon size={16} /> Change Image
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center space-y-2 pointer-events-none">
                                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Upload size={24} />
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">Click to upload image</p>
                                            <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {mode === 'base' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
                                    <div className="w-full sm:w-auto">
                                        <HexColorPicker color={baseColor} onChange={setBaseColor} />
                                    </div>
                                    <div className="space-y-4 text-center sm:text-left">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Selected Hex</label>
                                            <input
                                                type="text"
                                                value={baseColor.toUpperCase()}
                                                onChange={(e) => setBaseColor(e.target.value)}
                                                className="w-32 text-center sm:text-left text-2xl font-mono font-bold border-b-2 border-gray-200 focus:border-black outline-none bg-transparent"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 max-w-xs">
                                            We'll generate a harmonious palette based on this primary color using color theory rules.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => handleGenerate()}
                                disabled={isLoading}
                                className="bg-black text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} /> Generate Palette
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Check className="text-green-500" size={24} />
                                {results.length > 1 ? `Generated ${results.length} Varieties` : "Generated Result"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {results.map((res, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ring-1 ring-black/5 hover:ring-2 hover:ring-blue-500/20 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="text-sm font-bold text-gray-500 mb-1">Option {idx + 1}</div>
                                            <p className="font-bold text-gray-900 text-lg">
                                                {res.description}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => openInEditor(res)}
                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            Edit <ArrowRight size={16} />
                                        </button>
                                    </div>

                                    {/* Palette Preview */}
                                    <div className="grid grid-cols-5 h-24 rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 mb-4">
                                        {res.colors.map((c, i) => (
                                            <div key={i} className="h-full flex items-end justify-center pb-2 group/color relative" style={{ background: c }}>
                                                <span className="font-mono text-[10px] font-bold bg-white/90 backdrop-blur px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover/color:opacity-100 transition-opacity">
                                                    {c.replace('#', '')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mini Semantic Preview */}
                                    <div className="flex gap-3">
                                        {Object.entries(res.semantic).slice(0, 3).map(([role, color]) => (
                                            <div key={role} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                                <span className="text-xs font-semibold capitalize text-gray-600">{role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AIPaletteGeneratorPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-300" size={32} />
                </div>
            }>
                <AIPaletteGeneratorContent />
            </Suspense>
        </DashboardLayout>
    );
}
