'use client';

import { DashboardLayout } from '../layout/DashboardLayout';
import { PaletteCard } from './PaletteCard';
import { Heart, Image as ImageIcon, Link2, ExternalLink, X, Check, Eye, Code, FileCode, Sparkles } from 'lucide-react';
import Link from 'next/link';
import chroma from 'chroma-js';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePaletteStore } from '@/store/usePaletteStore';
import { downloadPaletteAsPng } from '@/utils/download';
import clsx from 'clsx';

interface PaletteDetailProps {
    colors: string[];
}

export const PaletteDetail = ({ colors }: PaletteDetailProps) => {
    // Mock Data
    const likes = 340;
    const date = '8 hours ago';

    const [copiedColor, setCopiedColor] = useState<string | null>(null);
    const [isEmbedOpen, setIsEmbedOpen] = useState(false);

    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 1500);
    };

    // Validate colors
    if (!colors || colors.length === 0) return notFound();

    const { toggleFavorite, savedPalettes } = usePaletteStore();

    // Check if saved
    const isSaved = savedPalettes.some(p => p.colors.join('-') === colors.join('-'));

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedColor('Link');
        setTimeout(() => setCopiedColor(null), 1500);
    };

    const handleDownload = () => {
        downloadPaletteAsPng(colors.map(c => ({ hex: c })));
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB] flex flex-col relative">
                {/* Close/Back Button */}
                <Link
                    href="/"
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors z-20"
                >
                    <X size={20} className="text-slate-600" />
                </Link>

                {/* Copied Toast */}
                <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${copiedColor ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 font-semibold">
                        {copiedColor !== 'Link' && copiedColor !== 'Embed Code' && (
                            <div
                                className="w-4 h-4 rounded-full border border-white/20"
                                style={{ backgroundColor: copiedColor || 'transparent' }}
                            />
                        )}
                        <span>
                            {copiedColor === 'Link' ? 'Link Copied!' :
                                copiedColor === 'Embed Code' ? 'Snippet Copied!' :
                                    `Copied ${copiedColor}!`}
                        </span>
                        <Check size={16} className="text-green-400" />
                    </div>
                </div>

                {/* Main Center Content */}
                <div className="flex-1 flex flex-col items-center justify-start p-8 pt-20 gap-16">
                    <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        {/* Big Color Block */}
                        <div className="h-[400px] flex flex-col sm:flex-row">
                            {colors.map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => copyToClipboard(color)}
                                    className="flex-1 w-full h-full relative group focus:outline-none"
                                    style={{ backgroundColor: color }}
                                >
                                    <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/10 text-white font-bold tracking-wider transition-opacity sm:rotate-0">
                                        COPY
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Actions Row */}
                        <div className="px-8 py-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex items-center gap-3 flex-wrap">
                                <button
                                    onClick={() => toggleFavorite(colors)}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold transition-colors",
                                        isSaved ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100" : "border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200"
                                    )}
                                >
                                    <Heart size={20} className={isSaved ? "fill-current" : ""} />
                                    {isSaved ? 'Saved' : 'Save'}
                                </button>
                                <Link
                                    href={`/generate/${colors.map(c => c.replace('#', '')).join('-')}?view=visualize`}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-bold shadow-lg shadow-black/10 hover:shadow-black/20"
                                >
                                    <Eye size={20} />
                                    Visualize
                                </Link>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-100 hover:border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <ImageIcon size={20} />
                                    Image
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-100 hover:border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <Link2 size={20} />
                                    Link
                                </button>
                                <button
                                    onClick={() => setIsEmbedOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-100 hover:border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <Code size={20} />
                                    Embed
                                </button>
                            </div>

                            <span className="text-sm font-medium text-slate-400">{date}</span>
                        </div>

                        {/* Info Row (Circles + Codes) */}
                        <div className="px-8 py-8">
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
                                {colors.map((color, i) => (
                                    <button
                                        key={`${color}-${i}`}
                                        onClick={() => copyToClipboard(color)}
                                        className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-full shadow-inner border border-black/5 group-hover:scale-110 transition-transform flex items-center justify-center"
                                            style={{ backgroundColor: color }}
                                        >
                                            <Check size={20} className={`text-white drop-shadow-md transition-all duration-200 ${copiedColor === color ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                                        </div>
                                        <span className="font-bold text-slate-700 font-mono text-sm uppercase group-hover:text-blue-600 transition-colors">
                                            {color.replace('#', '')}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            {chroma(color).css('rgb')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="px-8 pb-8 flex flex-wrap gap-2">
                            {['Beige', 'Green', 'Sage', 'Spring', 'Nature', 'Light', 'Pastel', 'Vintage', 'Summer', 'Food'].map(tag => (
                                <button
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- ADSENSE CONTENT INJECTION --- */}
                    <div className="w-full max-w-2xl px-6 mb-8 text-center md:text-left">
                        <div className="prose prose-slate prose-sm max-w-none bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mx-auto">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-500" />
                                Palette Analysis
                            </h3>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                This professional color scheme, composed of
                                {colors.map((c, i) => <span key={c} className="font-mono font-bold mx-1 text-slate-800 bg-slate-100 px-1 rounded">{c}</span>)},
                                is optimized for digital product design.
                                The dominant color temperature is <strong>{chroma(colors[0]).get('hsl.h') < 180 ? 'Warm' : 'Cool'}</strong>, evoking a
                                {chroma(colors[0]).get('hsl.h') < 180 ? ' grounded and energetic ' : ' calm and professional '}
                                atmosphere.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                <strong>UX Recommendation:</strong> Use the darkest shade (<strong>{colors.slice().sort((a, b) => chroma(a).luminance() - chroma(b).luminance())[0]}</strong>) for primary typography to ensure WCAG compliance.
                                The lightest shade (<strong>{colors.slice().sort((a, b) => chroma(b).luminance() - chroma(a).luminance())[0]}</strong>) serves as an ideal background layer.
                            </p>
                        </div>
                    </div>

                    {/* Related Palettes */}
                    <div className="w-full max-w-6xl mt-16 px-4">
                        <h3 className="text-2xl font-bold mb-8 text-center text-slate-700">You might also like</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {Array.from({ length: 8 }).map((_, i) => ({
                                id: `related-${i}`,
                                likes: Math.floor(Math.random() * 2000),
                                date: '1 day ago',
                                colors: chroma.scale([chroma.random(), chroma.random()]).mode('lch').colors(5),
                            })).map(palette => (
                                <PaletteCard key={palette.id} {...palette} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Embed Modal */}
                {isEmbedOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
                            <button
                                onClick={() => setIsEmbedOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-bold mb-2">Embed Palette</h3>
                            <p className="text-slate-500 mb-6 text-sm">Copy this code to your website to display this palette with a link back.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Preview</label>
                                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-4">
                                        <div className="flex rounded-lg overflow-hidden h-12 w-32 shadow-sm ring-1 ring-black/5">
                                            {colors.map(c => <div key={c} style={{ backgroundColor: c }} className="flex-1" />)}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <span className="font-bold text-slate-900 block">Dopely Palette</span>
                                            Powered by Dopely Colors
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-400 block mb-2">HTML Code</label>
                                    <textarea
                                        readOnly
                                        className="w-full h-32 p-4 bg-slate-900 text-slate-300 font-mono text-xs rounded-xl focus:outline-none resize-none"
                                        value={`<a href="${typeof window !== 'undefined' ? window.location.href : '#'}" title="Color Palette ${colors.join(', ')} - Dopely Colors" target="_blank" style="display: flex; gap: 0; border-radius: 8px; overflow: hidden; width: 200px; height: 50px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">\n  ${colors.map(c => `<span style="background-color: ${c}; flex: 1; height: 100%;"></span>`).join('\n  ')}\n</a>\n<div style="font-family: sans-serif; font-size: 10px; color: #64748b; margin-top: 4px;">\n  Palette by <a href="https://dopelycolors.com" style="color: #000; text-decoration: none; font-weight: bold;">Dopely Colors</a>\n</div>`}
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        const code = `<a href="${window.location.href}" title="Color Palette ${colors.join(', ')} - Dopely Colors" target="_blank" style="display: flex; gap: 0; border-radius: 8px; overflow: hidden; width: 200px; height: 50px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">\n  ${colors.map(c => `<span style="background-color: ${c}; flex: 1; height: 100%;"></span>`).join('\n  ')}\n</a>\n<div style="font-family: sans-serif; font-size: 10px; color: #64748b; margin-top: 4px;">\n  Palette by <a href="https://dopelycolors.com" style="color: #000; text-decoration: none; font-weight: bold;">Dopely Colors</a>\n</div>`;
                                        navigator.clipboard.writeText(code);
                                        setCopiedColor('Embed Code');
                                        setTimeout(() => setCopiedColor(null), 1500);
                                    }}
                                    className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    {copiedColor === 'Embed Code' ? <Check size={18} /> : <FileCode size={18} />}
                                    {copiedColor === 'Embed Code' ? 'Code Copied!' : 'Copy Snippet'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
