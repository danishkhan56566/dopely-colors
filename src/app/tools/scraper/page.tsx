'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Globe, Search, ArrowRight, Download, ExternalLink } from 'lucide-react';
import { scrapeColors } from './actions';
import { toast } from 'sonner';
import clsx from 'clsx';
import chroma from 'chroma-js';

export default function WebsiteScraper() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleScrape = async () => {
        if (!url) return;
        setLoading(true);
        try {
            const res = await scrapeColors(url);
            if (res.success && res.colors) {
                setResult(res);
                toast.success(`Found ${res.colors.length} palette colors!`);
            } else {
                toast.error(res.error || "Failed to analyze site");
            }
        } catch (e) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
                            <Globe size={32} />
                        </div>
                        Website Color Scraper
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Extract the exact color palette from any live website in seconds.
                    </p>
                </div>

                <div className="w-full max-w-5xl space-y-12">

                    {/* Search Bar */}
                    <div className="bg-white p-3 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-6 bg-gray-50 rounded-2xl">
                            <span className="text-gray-400 font-bold mr-2">https://</span>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value.replace(/^https?:\/\//, ''))}
                                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                                placeholder="apple.com"
                                className="flex-1 py-4 bg-transparent outline-none text-lg text-gray-900 font-medium"
                            />
                        </div>
                        <button
                            onClick={handleScrape}
                            disabled={loading}
                            className={clsx(
                                "px-8 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg min-w-[160px]",
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700 hover:scale-105"
                            )}
                        >
                            {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <>Scan Site <Search size={18} /></>}
                        </button>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Extracted Palette</h2>
                                    <a href={'https://' + result.url} target="_blank" className="text-sm text-pink-600 hover:underline flex items-center gap-1 mt-1">
                                        {result.url} <ExternalLink size={12} />
                                    </a>
                                </div>
                                <button className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                                    <Download size={14} /> Export JSON
                                </button>
                            </div>

                            {/* Color Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {result.colors.map((c: any) => (
                                    <div
                                        key={c.hex}
                                        className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3"
                                        onClick={() => {
                                            navigator.clipboard.writeText(c.hex);
                                            toast.success(`Copied ${c.hex}`);
                                        }}
                                    >
                                        <div
                                            className="w-full aspect-[4/3] rounded-xl relative overflow-hidden"
                                            style={{ backgroundColor: c.hex }}
                                        >
                                            {/* Smart Text Color based on luminance */}
                                            <div className={clsx(
                                                "absolute inset-0 flex items-center justify-center font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity",
                                                c.lum > 0.5 ? "text-black/50" : "text-white/80"
                                            )}>
                                                Copy
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-900">{c.hex}</span>
                                                <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                                                    {c.count} hits
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 capitalize truncate" title={c.name}>{c.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="bg-gray-900 text-white p-8 rounded-3xl overflow-hidden relative">
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                            Dominant Colors
                                        </h3>
                                        <p className="text-gray-400 mt-2">Based on frequency analysis of the source code.</p>
                                    </div>
                                    <div className="flex -space-x-4">
                                        {result.colors.slice(0, 5).map((c: any) => (
                                            <div
                                                key={c.hex}
                                                className="w-16 h-16 rounded-full border-4 border-gray-900 shadow-xl relative"
                                                style={{ backgroundColor: c.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
