'use client';

import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Image as ImageIcon, Download, Upload, Trash2, CheckCircle2, RefreshCw, Layers, FileType } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

type ConvertingFile = {
    id: string;
    file: File;
    preview: string;
    status: 'pending' | 'converting' | 'completed' | 'error';
    result?: string;
    targetFormat: 'png' | 'jpeg' | 'webp';
};

export default function ImageConverterPage() {
    const [files, setFiles] = useState<ConvertingFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        const addedFiles: ConvertingFile[] = Array.from(newFiles).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            status: 'pending',
            targetFormat: 'png'
        }));

        setFiles(prev => [...prev, ...addedFiles]);
    };

    const removeFile = (id: string) => {
        setFiles(prev => {
            const filtered = prev.filter(f => f.id !== id);
            const removed = prev.find(f => f.id === id);
            if (removed) URL.revokeObjectURL(removed.preview);
            return filtered;
        });
    };

    const convertFile = async (item: ConvertingFile) => {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'converting' } : f));

        try {
            const img = new Image();
            img.src = item.preview;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.drawImage(img, 0, 0);

            const mimeType = `image/${item.targetFormat}`;
            const resultData = canvas.toDataURL(mimeType, 0.9);

            setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'completed', result: resultData } : f));
            toast.success(`Converted ${item.file.name}`);
        } catch (e) {
            console.error(e);
            setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error' } : f));
            toast.error(`Failed to convert ${item.file.name}`);
        }
    };

    const convertAll = () => {
        files.filter(f => f.status === 'pending').forEach(convertFile);
    };

    const downloadAll = () => {
        files.filter(f => f.status === 'completed' && f.result).forEach(f => {
            const link = document.createElement('a');
            link.href = f.result!;
            link.download = `converted_${f.file.name.split('.')[0]}.${f.targetFormat}`;
            link.click();
        });
    };

    const updateFormat = (id: string, format: 'png' | 'jpeg' | 'webp') => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, targetFormat: format, status: 'pending' } : f));
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-purple-100">
                                <FileType size={14} />
                                <span>Bulk Image Converter</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                Convert images instantly.
                            </h1>
                            <p className="text-gray-500 font-medium">
                                Change file formats in bulk. PNG, JPG, or WebP. Processed entirely in your browser for 100% privacy.
                            </p>
                        </div>

                        {(files.length > 0) && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFiles([])}
                                    className="px-6 py-3 bg-white text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all border border-gray-200"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={convertAll}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    <RefreshCw size={18} /> Convert All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Upload Area */}
                    <div
                        className={clsx(
                            "relative mb-12 group p-12 md:p-20 border-4 border-dashed rounded-[3rem] transition-all flex flex-col items-center text-center cursor-pointer",
                            isDragging ? "border-indigo-400 bg-indigo-50/50" : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-gray-50/50"
                        )}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                            <Upload size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Drop your images here</h2>
                        <p className="text-gray-500 text-lg font-medium max-w-md">
                            Upload multiple images to convert them to PNG, JPG, or WebP formats at once.
                        </p>
                        <div className="mt-8 flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <span>Supports: PNG, JPG, WebP, SVG</span>
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between mb-2 px-4">
                                <h3 className="text-lg font-bold text-gray-900">Queue ({files.length} items)</h3>
                                {files.some(f => f.status === 'completed') && (
                                    <button onClick={downloadAll} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                                        <Download size={18} /> Download All
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {files.map((item) => (
                                    <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-50 border border-gray-100">
                                            <img src={item.preview} className="w-full h-full object-cover" alt="Preview" />

                                            {item.status === 'completed' && (
                                                <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center text-white p-4 text-center animate-in fade-in">
                                                    <CheckCircle2 size={40} className="mb-2" />
                                                    <span className="font-bold">Conversion Complete</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const link = document.createElement('a');
                                                            link.href = item.result!;
                                                            link.download = `converted_${item.file.name.split('.')[0]}.${item.targetFormat}`;
                                                            link.click();
                                                        }}
                                                        className="mt-4 bg-white text-emerald-600 px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                                                    >
                                                        Download
                                                    </button>
                                                </div>
                                            )}

                                            {item.status === 'converting' && (
                                                <div className="absolute inset-0 bg-indigo-600/90 flex flex-col items-center justify-center text-white">
                                                    <RefreshCw size={40} className="animate-spin mb-2" />
                                                    <span className="font-bold">Processing...</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 truncate mb-1">{item.file.name}</h4>
                                            <p className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-wider">
                                                {(item.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>

                                            <div className="flex gap-2 mb-6">
                                                {['png', 'jpeg', 'webp'].map((fmt) => (
                                                    <button
                                                        key={fmt}
                                                        onClick={() => updateFormat(item.id, fmt as any)}
                                                        className={clsx(
                                                            "flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
                                                            item.targetFormat === fmt
                                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                                                : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                                                        )}
                                                    >
                                                        {fmt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                            <button
                                                onClick={() => convertFile(item)}
                                                disabled={item.status === 'converting'}
                                                className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <RefreshCw size={14} className={item.status === 'converting' ? "animate-spin" : ""} />
                                                {item.status === 'completed' ? 'Re-convert' : 'Convert'}
                                            </button>
                                            <button
                                                onClick={() => removeFile(item.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
