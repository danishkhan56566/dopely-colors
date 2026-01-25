'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, UploadCloud, X, Loader2, CheckCircle, Image as ImageIcon, Wand2, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import chroma from 'chroma-js';
import { extractColors } from 'extract-colors';
import { Globe } from 'lucide-react';
import { scrapePalettesFromUrl, sliceImagePalettes, publishPalettesAdmin } from './actions';

// Types
interface ProcessedPalette {
    id: string; // temp id
    file: File;
    preview: string;
    colors: string[];
    name: string;
    category: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
}

const CATEGORIES = ['SaaS', 'Nature', 'Food', 'Tech', 'Cyberpunk', 'Minimal', 'Pastel', 'Dark Mode'];
const ADJECTIVES = ['Vibrant', 'Muted', 'Neon', 'Pastel', 'Dark', 'Soft', 'Bold', 'Fresh', 'Warm', 'Cool', 'Electric', 'Cozy', 'Cyber'];
const NOUNS = ['Sunset', 'Ocean', 'Forest', 'Dream', 'Night', 'Sky', 'Berry', 'Tech', 'Minimal', 'Future', 'Wave', 'Harmony', 'Vibe'];

export default function BulkUploadPage() {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [processedItems, setProcessedItems] = useState<ProcessedPalette[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [useSmartSplit, setUseSmartSplit] = useState(true);

    // New States
    const [importMode, setImportMode] = useState<'file' | 'url'>('file');
    const [urlInput, setUrlInput] = useState('');
    const [importCount, setImportCount] = useState(50);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // 0. Persistence
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('admin_bulk_palettes');
        if (saved) {
            try {
                // Restore dates and files (files can't be restored fully but we can stub them)
                const parsed = JSON.parse(saved);
                // Safety: Ensure we don't load items that were already published
                const pendingOnly = parsed.filter((p: any) => p.status !== 'success');

                // Sanitize: Remove stale blob URLs which are invalid after reload
                const sanitized = pendingOnly.map((p: ProcessedPalette) => ({
                    ...p,
                    file: new File([], 'restored_placeholder'), // Stub file
                    preview: p.preview && p.preview.startsWith('blob:') ? '' : p.preview
                }));

                setProcessedItems(sanitized);
            } catch (e) {
                console.error('Failed to load saved palettes', e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        if (processedItems.length > 0) {
            // strip file objects before saving as they can't be serialized
            const toSave = processedItems.map(({ file, ...rest }) => rest);
            localStorage.setItem('admin_bulk_palettes', JSON.stringify(toSave));
        } else {
            localStorage.removeItem('admin_bulk_palettes');
        }
    }, [processedItems, isLoaded]);

    // Selection Helpers
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === processedItems.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(processedItems.map(p => p.id)));
        }
    };

    // Remix Logic
    const handleRemixSelected = () => {
        if (selectedIds.size === 0) return;
        setIsProcessing(true);

        const remixed = processedItems.map(item => {
            if (!selectedIds.has(item.id)) return item;

            // 1. Shuffle
            let newColors = [...item.colors].sort(() => Math.random() - 0.5);

            // 2. Hue/Sat Shift
            newColors = newColors.map(c => {
                let color = chroma(c);
                // Hue shift +/- 15 degrees
                color = color.set('hsl.h', (color.get('hsl.h') + (Math.random() * 30 - 15)) % 360);
                // Saturation +/- 10%
                color = color.saturate(Math.random() * 0.4 - 0.2); // -0.2 to +0.2
                // Brightness check to ensure not too dark/light? optional
                return color.hex();
            });

            // 3. New Name
            const newName = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;

            return {
                ...item,
                colors: newColors,
                name: newName,
                status: 'pending' as const
            };
        });

        setProcessedItems(remixed);
        toast.success(`Remixed ${selectedIds.size} palettes!`);
        setIsProcessing(false);
    };

    // 1. Handle File Drop
    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;
        await processFiles(files);
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        await processFiles(files);
    };

    const handleUrlImport = async () => {
        if (!urlInput) return;
        setIsProcessing(true);
        try {
            const result = await scrapePalettesFromUrl(urlInput, importCount);

            if ('error' in result && result.error) {
                toast.error(result.error);
            } else if ('palettes' in result) {
                // Convert scraped palettes to ProcessedPalette items
                const newItems: ProcessedPalette[] = result.palettes.map((p: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    file: new File([], 'url_import'), // Dummy file
                    preview: '', // No image preview for URL imports initially, could gen solid color
                    colors: p.colors,
                    name: `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`,
                    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
                    status: 'pending'
                }));

                setProcessedItems(prev => [...prev, ...newItems]);
                const debugMsg = 'debug' in result ? result.debug : null;
                toast.success(debugMsg || `Found ${newItems.length} palettes!`);
                setUrlInput('');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to import from URL');
        } finally {
            setIsProcessing(false);
        }
    };

    // 2. Process Files (Extract Colors & Generate Meta)
    const processFiles = async (files: File[]) => {
        setIsProcessing(true);
        const newItems: ProcessedPalette[] = [];

        // Helper to process a single image source (Blob URL or Base64)
        const processSource = async (source: string, originalFile: File, isSegment: boolean = false) => {
            try {
                // Extract Colors (Client-side)
                const extracted = await extractColors(source, { pixels: 64000, distance: 0.22 });
                // Sort by area (dominance) and take top 5
                let colors = extracted
                    .sort((a, b) => b.area - a.area)
                    .slice(0, 5)
                    .map(c => c.hex);

                // Fallback if < 5 colors: Fill with related shades
                if (colors.length < 5) {
                    const base = colors[0] || '#000000';
                    const fill = chroma.scale([base, '#ffffff']).colors(5 - colors.length);
                    colors = [...colors, ...fill];
                }

                // Generate Meta
                const randomName = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;
                const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

                // Create a File object for the segment if needed (so it can be uploaded later?)
                // Actually, for segments, 'source' is base64. We should convert to Blob/File for consistency?
                // For now, we store the original file reference but maybe we need the segment image for the Preview?
                // Yes, 'preview' will be the segment.

                newItems.push({
                    id: Math.random().toString(36).substr(2, 9),
                    file: originalFile, // Keep ref to original (or we should convert base64 to file)
                    preview: source,
                    colors,
                    name: isSegment ? `Split: ${randomName}` : randomName,
                    category: randomCategory,
                    status: 'pending'
                });
            } catch (err) {
                console.error('Extraction failed', err);
            }
        };

        for (const file of files) {
            try {
                if (useSmartSplit) {
                    // Try to slice on server
                    const formData = new FormData();
                    formData.append('file', file);

                    const result = await sliceImagePalettes(formData);

                    if (result && result.images && result.images.length > 1) {
                        toast.success(`Smart Split found ${result.images.length} palettes!`);
                        // Process each segment
                        for (const base64 of result.images) {
                            await processSource(base64, file, true);
                        }
                    } else {
                        // If no split elements found (or error), fallback to normal
                        if (result.error) console.warn('Split warning:', result.error);
                        const previewUrl = URL.createObjectURL(file);
                        await processSource(previewUrl, file, false);
                    }
                } else {
                    // Normal behavior
                    const previewUrl = URL.createObjectURL(file);
                    await processSource(previewUrl, file, false);
                }

            } catch (err) {
                console.error('Error processing file:', file.name, err);
                toast.error(`Failed to process ${file.name}`);
            }
        }

        setProcessedItems(prev => [...prev, ...newItems]);
        setIsProcessing(false);
    };

    // 3. Remove Item
    const removeItem = (id: string) => {
        setProcessedItems(prev => prev.filter(p => p.id !== id));
    };

    // Generate Gradients from Selected
    const handleGenerateGradients = async () => {
        const selected = processedItems.filter(p => selectedIds.has(p.id));
        if (selected.length === 0) {
            toast.error("Select at least one palette to generate gradients");
            return;
        }

        setIsProcessing(true);
        try {
            const payload = selected.map(p => ({
                name: p.name,
                colors: p.colors,
                category: p.category
            }));

            const res = await fetch('/api/admin/generate-gradients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ palettes: payload })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate');

            toast.success(`Successfully generated ${data.count} gradients!`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // 4. Batch Upload
    const handleUploadAll = async () => {
        const pendingItems = processedItems.filter(p => p.status !== 'success');
        if (pendingItems.length === 0) return;

        setIsUploading(true);

        // Reliable User Check
        const { data: { user } } = await supabase.auth.getUser();
        let userId = user?.id;

        // AUTH BYPASS FOR LOCALHOST TESTING
        if (!userId && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            console.warn('⚠️ Bypassing Auth for Localhost Testing');
            userId = 'd83527a0-292c-4b81-a671-629c9fb28074';
        }

        if (!userId) {
            toast.error('You must be logged in. Please refresh the page.');
            setIsUploading(false);
            return;
        }

        // Helper to update status of a subset of items
        const updateStatus = (ids: string[], status: 'uploading' | 'success' | 'error') => {
            setProcessedItems(prev => prev.map(p => ids.includes(p.id) ? { ...p, status } : p));
        };

        // Process in small chunks to ensure stability
        const CHUNK_SIZE = 5;
        const chunks = [];
        for (let i = 0; i < pendingItems.length; i += CHUNK_SIZE) {
            chunks.push(pendingItems.slice(i, i + CHUNK_SIZE));
        }

        let successCount = 0;

        for (const chunk of chunks) {
            const chunkIds = chunk.map(p => p.id);
            updateStatus(chunkIds, 'uploading');

            try {
                const payloads = chunk.map(item => ({
                    name: item.name,
                    colors: item.colors,
                    category: [item.category],
                    status: 'published',
                    is_featured: false,
                    seo_title: `${item.name} - ${item.category} Color Palette`,
                    created_by: userId
                }));

                let insertError = null;

                // Check auth again or reuse logic
                if (!user && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                    // Use API Route instead of Server Action to avoid AbortErrors
                    let retries = 2;
                    while (retries > 0) {
                        try {
                            const res = await fetch('/api/admin/bulk-publish', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ palettes: payloads })
                            });

                            if (!res.ok) {
                                const errData = await res.json();
                                throw new Error(errData.error || 'API Failed');
                            }

                            insertError = null;
                            break;
                        } catch (e: any) {
                            if (e.name === 'AbortError') {
                                console.warn('Caught AbortError in API fetch, retrying...');
                            }
                            retries--;
                            if (retries === 0) insertError = e;
                            await new Promise(r => setTimeout(r, 1000));
                        }
                    }
                } else {
                    // Client Insert (RLS Protected) for Prod
                    const { error } = await supabase.from('palettes').insert(payloads);
                    insertError = error;
                }

                if (insertError) throw insertError;

                updateStatus(chunkIds, 'success');
                successCount += chunk.length;

            } catch (err: any) {
                if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
                    console.warn('Batch aborted explicitly', err);
                    updateStatus(chunkIds, 'error');
                    // Don't toast for aborts to avoid spam
                } else {
                    console.error('Batch upload failed', err);
                    updateStatus(chunkIds, 'error');
                    toast.error(`Batch failed: ${err.message || 'Unknown error'}`);
                }
            }

            // Artificial delay to prevent flooding
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        setIsUploading(false);
        if (successCount > 0) {
            toast.success(`Successfully published ${successCount} palettes!`);
            // Auto-clear successfully published items
            setTimeout(() => {
                setProcessedItems(prev => prev.filter(p => p.status !== 'success'));
                setSelectedIds(new Set());
            }, 1000);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/palettes" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bulk Upload</h1>
                        <p className="text-gray-500 text-sm mt-1">Drag & drop images to auto-generate palettes.</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {processedItems.length > 0 && (
                    <>
                        <div className="flex items-center gap-2 mr-4 text-sm text-gray-500">
                            <input
                                type="checkbox"
                                checked={selectedIds.size === processedItems.length && processedItems.length > 0}
                                ref={input => {
                                    if (input) input.indeterminate = selectedIds.size > 0 && selectedIds.size < processedItems.length;
                                }}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span>{selectedIds.size} Selected</span>
                        </div>

                        {selectedIds.size > 0 && (
                            <>
                                <button
                                    onClick={handleRemixSelected}
                                    disabled={isProcessing}
                                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-200 transition-colors flex items-center gap-2"
                                    title="Hue shift, shuffle, and rename selected palettes"
                                >
                                    <Wand2 size={18} />
                                    Remix Safe
                                </button>

                                <button
                                    onClick={handleGenerateGradients}
                                    disabled={isProcessing}
                                    className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg font-bold hover:bg-pink-200 transition-colors flex items-center gap-2"
                                    title="Create linear gradients from these palettes"
                                >
                                    <Layers size={18} />
                                    Gen Gradients
                                </button>
                            </>
                        )}

                        {processedItems.some(p => p.status === 'success') && (
                            <button
                                onClick={() => {
                                    setProcessedItems(prev => prev.filter(p => p.status !== 'success'));
                                    setSelectedIds(new Set());
                                    toast.success('Cleared published items from workspace');
                                }}
                                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-200 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle size={18} />
                                Clear Published
                            </button>
                        )}

                        <button
                            onClick={handleUploadAll}
                            disabled={isUploading || processedItems.length === 0}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                            {isUploading ? 'Publishing...' : `Publish ${processedItems.filter(i => i.status !== 'success').length} Palettes`}
                        </button>
                    </>
                )}
            </div>

            {/* Drag Drop Zone or URL Input */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => setImportMode('file')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${importMode === 'file' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <UploadCloud size={16} className="inline mr-2" /> Upload Images
                    </button>
                    <button
                        onClick={() => setImportMode('url')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${importMode === 'url' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <Globe size={16} className="inline mr-2" /> Import from URL
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-gray-600">
                            <input
                                type="checkbox"
                                checked={useSmartSplit}
                                onChange={e => setUseSmartSplit(e.target.checked)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            Auto-Split Grids (AI)
                        </label>
                    </div>
                </div>

                {importMode === 'file' ? (
                    <div
                        className={`bg-white border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input')?.click()}
                    >
                        <input
                            type="file"
                            id="file-input"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                        />

                        {isProcessing ? (
                            <div className="flex flex-col items-center py-6">
                                <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">Extracting Colors...</h3>
                                <p className="text-gray-500">Analyzing pixels and finding harmonies.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-6">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <ImageIcon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Click to Upload or Drag Images</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Select up to 100 images. We will automatically extract the colors, name them, and prepare them for publishing.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white border text-center border-gray-200 rounded-2xl p-10">
                        <div className="max-w-xl mx-auto space-y-4">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Import from Website</h3>
                                <p className="text-gray-500">
                                    Paste a URL (e.g. ColorHunt, Coolors) and we'll scrape all palettes found on that page.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <div className="w-24">
                                    <input
                                        type="number"
                                        min="1"
                                        max="500"
                                        value={importCount}
                                        onChange={(e) => setImportCount(Number(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-500 font-medium text-center"
                                        placeholder="Qty"
                                        title="Number of palettes to fetch"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://colorhunt.co/palettes/popular"
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50/50 transition-all font-medium"
                                />
                                <button
                                    onClick={handleUrlImport}
                                    disabled={isProcessing || !urlInput}
                                    className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                                >
                                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                                    Fetch
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 text-left pl-1">
                                Note: This works best on pages that list multiple palettes. We'll group colors automatically.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Grid */}
            {processedItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {processedItems.map((item, index) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            {/* Preview Header */}
                            <div className="h-40 relative bg-gray-100">
                                {/* Image Overlay */}
                                {item.preview ? (
                                    <img src={item.preview} alt="Source" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${item.colors[0]}88, ${item.colors[1] || item.colors[0]}88)` }}>
                                        <Wand2 className="text-white/50" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"
                                        title="Remove"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="absolute top-2 left-2 z-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(item.id)}
                                        onChange={() => toggleSelection(item.id)}
                                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 shadow-sm cursor-pointer"
                                    />
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                    {item.status === 'success' && (
                                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                            <CheckCircle size={12} /> Published
                                        </span>
                                    )}
                                    {item.status === 'uploading' && (
                                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                            <Loader2 size={12} className="animate-spin" /> Uploading
                                        </span>
                                    )}
                                    {item.status === 'error' && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                            Error
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="h-8 flex">
                                {item.colors.map((c, i) => (
                                    <div key={i} style={{ backgroundColor: c }} className="flex-1" />
                                ))}
                            </div>

                            {/* Meta */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono truncate">
                                    {item.colors.join(', ')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
