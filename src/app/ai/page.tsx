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
    LayoutTemplate,
    Heart
} from 'lucide-react';
import { AIGuide } from '@/components/content/PageGuides';
import { AIFaq, AIHowTo } from '@/components/content/PageFAQs';
import { Footer } from '@/components/layout/Footer';
import { toast } from 'sonner';
import clsx from 'clsx';
import { generateFromText, generateFromBase, generateFromImage, AIResult } from '@/lib/mock-ai';
import { HexColorPicker } from 'react-colorful';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useRouter, useSearchParams } from 'next/navigation';

function AIPaletteGeneratorContent() {
    const [isMounted, setIsMounted] = useState(false);
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
    const { setColors, toggleFavorite, savedPalettes } = usePaletteStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
            {/* Immersive Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
            </div>

            <main className="relative z-10 w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">

                {/* Premium Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <Sparkles size={14} className="text-violet-600" />
                        <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                            AI Powered V2.0
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                        Generate from <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-500 saturate-150 drop-shadow-lg">
                            Pure Imagination
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 font-medium">
                        Describe your idea, upload an image, or start with a color. <br className="hidden sm:block" />
                        Our AI will craft the <span className="text-gray-900 font-bold">perfect palette</span> for your project.
                    </p>
                </div>

                {/* Main Interaction Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white/50 overflow-hidden max-w-5xl mx-auto w-full ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">

                    {/* Mode Selection Tabs */}
                    <div className="flex border-b border-gray-100/50 bg-white/50 backdrop-blur-sm">
                        {[
                            { id: 'text', label: 'Text Prompt', icon: Wand2, color: 'text-violet-600' },
                            { id: 'image', label: 'Image Upload', icon: ImageIcon, color: 'text-blue-600' },
                            { id: 'base', label: 'Base Color', icon: Palette, color: 'text-pink-600' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setMode(tab.id as any);
                                    setResults(null);
                                }}
                                className={clsx(
                                    "flex-1 py-6 flex items-center justify-center gap-3 text-sm font-bold transition-all outline-none relative group overflow-hidden",
                                    mode === tab.id
                                        ? "text-gray-900 bg-white/80 shadow-sm z-10"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                                )}
                            >
                                <div className={clsx(
                                    "p-2 rounded-lg transition-colors",
                                    mode === tab.id ? "bg-gray-100" : "group-hover:bg-gray-100"
                                )}>
                                    <tab.icon size={20} className={clsx(mode === tab.id ? tab.color : "text-gray-400 group-hover:text-gray-600")} />
                                </div>
                                <span className="text-base">{tab.label}</span>
                                {mode === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="p-8 md:p-12">
                        <div className="min-h-[300px] flex flex-col justify-center">
                            {mode === 'text' && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Describe your dream palette... e.g., 'Sunset in Tokyo, cyberpunk vibes, neon pinks and deep blues'"
                                            className="relative w-full h-40 p-6 rounded-2xl border-none outline-none text-xl md:text-2xl font-medium bg-white shadow-sm resize-none placeholder-gray-300 text-gray-900 focus:ring-0"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-3 items-center text-sm text-gray-500">
                                        <span className="font-bold uppercase tracking-wider text-xs mr-2 opacity-50">Try:</span>
                                        {['Cyperpunk City', 'Organic Skincare', 'Fintech Dashboard', 'Retro 80s'].map(ex => (
                                            <button
                                                key={ex}
                                                onClick={() => setPrompt(ex)}
                                                className="px-4 py-1.5 bg-white border border-gray-200 hover:border-violet-300 hover:text-violet-700 rounded-full font-medium transition-all shadow-sm hover:shadow-md"
                                            >
                                                {ex}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {mode === 'image' && (
                                <div className="animate-in fade-in zoom-in-95 duration-500 w-full max-w-2xl mx-auto">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={clsx(
                                            "w-full aspect-video border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group bg-gray-50/50",
                                            imagePreview ? "border-transparent shadow-2xl" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/30"
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
                                                <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                                    <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 text-white font-bold flex items-center gap-3 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                        <ImageIcon size={20} /> Change Image
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center space-y-4 p-8 pointer-events-none">
                                                <div className="w-20 h-20 bg-white shadow-xl shadow-blue-100 rounded-[2rem] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white">
                                                        <Upload size={24} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900 mb-2">Drop your image here</p>
                                                    <p className="text-gray-500 font-medium">Support for SVG, PNG, JPG (Max 10MB)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {mode === 'base' && (
                                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
                                    <div className="p-8 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
                                        <div className="relative">
                                            <div className="absolute -inset-4 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full blur-xl opacity-50" />
                                            <HexColorPicker color={baseColor} onChange={setBaseColor} style={{ width: 250, height: 250 }} />
                                        </div>

                                        <div className="space-y-6 text-center md:text-left">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Selected Hex</label>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl shadow-inner ring-1 ring-black/5" style={{ backgroundColor: baseColor }} />
                                                    <input
                                                        type="text"
                                                        value={baseColor.toUpperCase()}
                                                        onChange={(e) => setBaseColor(e.target.value)}
                                                        className="w-40 text-4xl font-black text-gray-900 border-b-4 border-transparent focus:border-gray-900 outline-none bg-transparent transition-colors font-mono"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-gray-500 font-medium max-w-xs leading-relaxed">
                                                We'll generate a harmonious palette based on this primary color using advanced color theory rules.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => handleGenerate()}
                                disabled={isLoading}
                                className="group relative bg-gray-900 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-violet-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 animate-pulse">Dreaming...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={24} className="text-yellow-300" />
                                            <span>Generate Palette</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-32">
                        <div className="flex items-center justify-center gap-3 opacity-0 animate-in fade-in delay-500 fill-mode-forwards">
                            <h2 className="text-3xl font-black text-gray-900">
                                {results.length > 1 ? `Generated ${results.length} Ideas` : "Your Palette"}
                            </h2>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                Success
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {results.map((res, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 ring-1 ring-black/5 hover:ring-2 hover:ring-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 group transform hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <div className="text-xs font-bold text-violet-500 mb-2 uppercase tracking-wider">Option {idx + 1}</div>
                                            <p className="font-bold text-gray-900 text-2xl leading-tight">
                                                {res.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openInEditor(res)}
                                                className="bg-gray-50 text-gray-900 hover:bg-black hover:text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                                            >
                                                Open Editor <ArrowRight size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const isFav = savedPalettes.some(p => p.colors.join('-') === res.colors.join('-'));
                                                    toggleFavorite(res.colors);
                                                    toast.success(isFav ? 'Removed from favorites' : 'Saved to favorites');
                                                }}
                                                className={clsx(
                                                    "p-3 rounded-xl border transition-all",
                                                    isMounted && savedPalettes.some(p => p.colors.join('-') === res.colors.join('-'))
                                                        ? "bg-red-50 border-red-200 text-red-500"
                                                        : "bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                                                )}
                                                title="Save to Favorites"
                                            >
                                                <Heart size={20} className={clsx(isMounted && savedPalettes.some(p => p.colors.join('-') === res.colors.join('-')) && "fill-current")} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Palette Preview */}
                                    < div className="h-32 rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 mb-6 flex" >
                                        {
                                            res.colors.map((c, i) => (
                                                <div key={i} className="flex-1 h-full flex items-end justify-center pb-4 group/color relative transition-all duration-500 hover:flex-[1.5]" style={{ background: c }}>
                                                    <div className="opacity-0 group-hover/color:opacity-100 transform translate-y-2 group-hover/color:translate-y-0 transition-all duration-300 absolute bottom-4">
                                                        <span className="font-mono text-xs font-bold bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg text-gray-900">
                                                            {c.replace('#', '')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {/* Mini Semantic Preview */}
                                    <div className="flex flex-wrap gap-3">
                                        {Object.entries(res.semantic).slice(0, 3).map(([role, color]) => (
                                            <div key={role} className="flex items-center gap-2 pr-4 pl-1.5 py-1.5 rounded-full bg-gray-50 border border-gray-100 group-hover:border-gray-200 transition-colors">
                                                <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                                                <span className="text-xs font-bold capitalize text-gray-600">{role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div >
                )
                }
            </main >

            <AIGuide />
            <AIFaq />
            <AIHowTo />
            <Footer />
        </div >
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
