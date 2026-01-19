'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Download, ArrowRight, Wand2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { extractColors } from 'extract-colors';
import chroma from 'chroma-js';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { usePaletteStore } from '@/store/usePaletteStore';
import { ExportModal } from '@/components/ExportModal';

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
            // Extract colors using the library
            const colors = await extractColors(objectUrl, {
                pixels: 40000,
                distance: 0.22,
            });

            // Map and sort by area (dominance)
            const mappedColors = colors
                .map(c => ({
                    hex: c.hex,
                    area: c.area,
                    hue: c.hue,
                    saturation: c.saturation,
                    lightness: c.lightness,
                    intensity: c.intensity
                }))
                .sort((a, b) => b.area - a.area);

            setExtractedPalette(mappedColors.slice(0, 10)); // Keep top 10 candidates
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
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">

                {/* Header */}
                <ExportModal
                    isOpen={isExportOpen}
                    onClose={() => setIsExportOpen(false)}
                    colors={getExportableColors()}
                />
                <div className="text-center max-w-2xl mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4">
                        <ImageIcon size={24} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Image to Palette</h1>
                    <p className="text-gray-500 text-lg">
                        Upload any photo, screenshot, or logo. our AI will extract a balanced, production-ready color system instantly.
                    </p>
                </div>

                {/* Main Workspace */}
                <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">

                    {/* Left: Upload / Image Preview */}
                    <div className="flex-1 bg-gray-100/50 relative border-r border-gray-100 flex flex-col">
                        {imagePreview ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-[#F4F4F5] p-8">
                                <img
                                    src={imagePreview}
                                    alt="Uploaded"
                                    className="max-w-full max-h-[500px] object-contain shadow-lg rounded-lg"
                                />
                                <button
                                    onClick={() => { setImagePreview(null); setExtractedPalette([]); }}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-gray-500 hover:text-red-500 shadow-sm transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onDrop={handleDrop}
                                onDragOver={e => e.preventDefault()}
                                className="flex-1 flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-300 m-8 rounded-2xl"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Click or drop image here</h3>
                                <p className="text-gray-400">Supports JPG, PNG, WEBP, SVG</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Palette Analysis */}
                    <div className="flex-1 p-8 flex flex-col">
                        {!extractedPalette.length ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
                                <Wand2 size={48} className="mb-4 opacity-20" />
                                <p>Upload an image to see the magic happen</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Smart Analysis Results
                                </h3>

                                {/* Dominant Colors Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {extractedPalette.slice(0, 4).map((color, i) => (
                                        <div key={i} className="flex flex-col gap-2 group cursor-pointer">
                                            <div
                                                className="h-24 rounded-xl shadow-sm border border-black/5 relative group-hover:scale-[1.02] transition-transform"
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className={clsx("font-mono text-sm font-bold bg-white/20 backdrop-blur px-2 py-1 rounded",
                                                        chroma(color.hex).luminance() > 0.5 ? 'text-black' : 'text-white'
                                                    )}>
                                                        {color.hex}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-xs font-bold text-gray-500 uppercase">
                                                    {i === 0 ? 'Dominant' : i === 1 ? 'Primary' : 'Accent'}
                                                </span>
                                                <span className="text-xs text-gray-400">{(color.area * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Secondary Colors Strip */}
                                <div className="mb-auto">
                                    <h4 className="text-xs font-bold text-gray-400 mb-3">SECONDARY & NEUTRAL</h4>
                                    <div className="flex gap-2">
                                        {extractedPalette.slice(4, 9).map((color, i) => (
                                            <div
                                                key={i}
                                                className="h-12 w-12 rounded-lg border border-black/5 hover:scale-110 transition-transform cursor-pointer"
                                                style={{ backgroundColor: color.hex }}
                                                title={color.hex}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-3">
                                    <button
                                        onClick={openGenerator}
                                        className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
                                    >
                                        Open in Generator <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <Download size={18} /> Export Palette
                                    </button>
                                </div>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <span className="font-bold text-gray-900">Analyzing colors...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
