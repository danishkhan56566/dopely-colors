'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Download, ArrowRight, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { extractPalette } from '@/lib/image-extraction';
import { useRouter } from 'next/navigation';
import { usePaletteStore } from '@/store/usePaletteStore';
import { ExportModal } from '@/components/ExportModal';
import { ToolContentBlock } from '@/components/seo/ToolContentBlock';
import { imageSEOData } from '@/content/seo/image';

interface ExtractedColor {
    hex: string;
    area: number; // area/dominance
    hue: number;
    saturation: number;
    lightness: number;
    intensity: number;
}

export default function ImageExtractorPage() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [extractedPalette, setExtractedPalette] = useState<ExtractedColor[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { setColors } = usePaletteStore();
    const [isExportOpen, setIsExportOpen] = useState(false);

    const processFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) return;

        setIsAnalyzing(true);
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);

        try {
            // Extract colors using custom high-perf extractor
            const result = await extractPalette(objectUrl);
            setExtractedPalette(result.palette); // Extractor already sorts and filtering
        } catch (error) {
            console.error("Extraction failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const openGenerator = () => {
        if (extractedPalette.length === 0) return;

        // Take top 5 distinct Colors for the generator
        const top5 = extractedPalette.slice(0, 5).map(c => ({
            id: crypto.randomUUID(),
            hex: c.hex,
            isLocked: true // Lock them so they don't disappear on next gen immediately
        }));

        // Fill if less than 5?
        while (top5.length < 5) {
            top5.push({ id: crypto.randomUUID(), hex: '#ffffff', isLocked: false });
        }

        setColors(top5);
        router.push('/generate');
    };

    const handleExport = () => {
        if (extractedPalette.length === 0) return;
        setIsExportOpen(true);
    };

    const getExportableColors = () => {
        return extractedPalette.slice(0, 5).map(c => ({
            id: c.hex,
            hex: c.hex,
            isLocked: false
        }));
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
                </div>

                <div className="w-full max-w-7xl px-4 py-16 sm:px-6 relative z-10">
                    <ExportModal
                        isOpen={isExportOpen}
                        onClose={() => setIsExportOpen(false)}
                        colors={getExportableColors()}
                    />

                    {/* Premium Header */}
                    <div className="text-center space-y-6 mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <ImageIcon size={14} className="text-blue-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Image Intelligence V2.0
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                            Capture Colors from <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 saturate-150 drop-shadow-lg">
                                Any Image
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 font-medium">
                            Upload photos, screenshots, or art. <br className="hidden sm:block" />
                            Our AI instantly extracts the <span className="text-gray-900 font-bold">perfect palette</span> for you.
                        </p>
                    </div>

                    {/* Main Workspace Card */}
                    <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white/50 overflow-hidden ring-1 ring-black/5 flex flex-col lg:flex-row min-h-[700px] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">

                        {/* Left: Upload / Image Preview */}
                        <div className="flex-1 bg-gray-50/50 relative border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col group/upload">
                            {imagePreview ? (
                                <div className="relative w-full h-full flex items-center justify-center p-8 lg:p-12 overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                    <img
                                        src={imagePreview}
                                        alt="Uploaded"
                                        className="relative z-10 max-w-full max-h-[500px] object-contain shadow-2xl rounded-2xl ring-1 ring-black/5 transform transition-transform duration-700 hover:scale-[1.02]"
                                    />
                                    <button
                                        onClick={() => { setImagePreview(null); setExtractedPalette([]); }}
                                        className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 shadow-lg border border-white/50 transition-all z-20 group-hover/upload:opacity-100 opacity-0 transform translate-y-2 group-hover/upload:translate-y-0 duration-300"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    className="flex-1 flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-white/50 transition-all m-8 rounded-[2rem] border-4 border-dashed border-gray-200 hover:border-blue-400 group hover:shadow-lg hover:shadow-blue-500/5"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                    <div className="w-24 h-24 bg-white shadow-xl shadow-blue-100/50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                                            <Upload size={28} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3">Drop your image here</h3>
                                    <p className="text-lg text-gray-500 font-medium">Supports JPG, PNG, WEBP (Max 10MB)</p>
                                </div>
                            )}
                        </div>

                        {/* Right: Palette Analysis */}
                        <div className="flex-1 p-8 lg:p-12 flex flex-col bg-white/40">
                            {!extractedPalette.length ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                        <Wand2 size={40} className="text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900 mb-2">Waiting for Magic</p>
                                        <p className="max-w-xs mx-auto">Upload an image to see the AI extract colors instantly.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-700">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                        Analysis Complete
                                    </h3>

                                    {/* Dominant Colors Grid */}
                                    <div className="grid grid-cols-2 gap-6 mb-12">
                                        {extractedPalette.slice(0, 4).map((color, i) => (
                                            <div key={i} className="flex flex-col gap-3 group cursor-pointer">
                                                <div
                                                    className="h-32 rounded-2xl shadow-sm border border-black/5 relative group-hover:scale-[1.03] group-hover:shadow-xl transition-all duration-300 overflow-hidden"
                                                    style={{ backgroundColor: color.hex }}
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
                                                        <span className="font-mono text-xs font-bold bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg text-gray-900 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                            {color.hex}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                                                        {i === 0 ? 'Dominant' : i === 1 ? 'Primary' : 'Accent'}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-900">{(color.area * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Secondary Colors Strip */}
                                    <div className="mb-auto">
                                        <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Secondary Matches</h4>
                                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                            {extractedPalette.slice(4, 9).map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="h-16 w-16 min-w-[4rem] rounded-xl border border-black/5 hover:scale-110 hover:shadow-lg transition-all cursor-pointer relative group"
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.hex}
                                                >
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {color.hex}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-12 pt-8 border-t border-gray-100/50 flex flex-col gap-4">
                                        <button
                                            onClick={openGenerator}
                                            className="w-full py-5 bg-gray-900 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-black hover:shadow-xl hover:shadow-blue-500/20 transition-all group"
                                        >
                                            <Sparkles size={20} className="text-blue-400 group-hover:rotate-12 transition-transform" />
                                            Edit in Generator
                                            <ArrowRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </button>
                                        <button
                                            onClick={handleExport}
                                            className="w-full py-5 bg-white border border-gray-200 text-gray-700 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <Download size={20} /> Export Palette
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20 rounded-[2.5rem]">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 size={48} className="animate-spin text-blue-600" />
                                        <span className="font-bold text-xl text-gray-900 animate-pulse">Extracting magic...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <ToolContentBlock {...imageSEOData} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
