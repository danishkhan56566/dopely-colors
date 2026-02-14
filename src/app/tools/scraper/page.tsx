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
                                <button
                                    onClick={() => {
                                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
                                        const downloadAnchorNode = document.createElement('a');
                                        downloadAnchorNode.setAttribute("href", dataStr);
                                        downloadAnchorNode.setAttribute("download", `palette-${new URL(result.url).hostname}.json`);
                                        document.body.appendChild(downloadAnchorNode);
                                        downloadAnchorNode.click();
                                        downloadAnchorNode.remove();
                                        toast.success('Palette JSON exported!');
                                    }}
                                    className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200"
                                >
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

                            {/* Stats & Frameworks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 text-white p-8 rounded-3xl overflow-hidden relative">
                                    <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                        Dominant Colors
                                    </h3>
                                    <div className="flex -space-x-4 mb-6">
                                        {result.colors.slice(0, 5).map((c: any) => (
                                            <div
                                                key={c.hex}
                                                className="w-12 h-12 rounded-full border-2 border-gray-900 shadow-xl"
                                                style={{ backgroundColor: c.hex }}
                                                title={`${c.count} occurrences`}
                                            />
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        {result.colors.slice(0, 4).map((c: any) => (
                                            <div key={c.hex} className="flex items-center gap-2 text-xs">
                                                <div className="w-16 text-right font-mono text-gray-500">{c.hex}</div>
                                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-white opacity-20" style={{ width: `${Math.min(100, (c.count / result.colors[0].count) * 100)}%` }} />
                                                </div>
                                                <div className="w-8 text-gray-500">{Math.round((c.count / result.colors[0].count) * 100)}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Site Intelligence</h3>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Detected Tech Stack</label>
                                            <div className="flex flex-wrap gap-2">
                                                {result.frameworks && result.frameworks.length > 0 ? (
                                                    result.frameworks.map((f: string) => (
                                                        <span key={f} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold border border-indigo-100">
                                                            {f}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic text-sm">No frameworks detected</span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Asset Analysis</label>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="p-3 bg-gray-50 rounded-xl flex flex-col">
                                                    <span className="text-2xl font-black text-gray-900">{result.colors.length}</span>
                                                    <span className="text-gray-500">Colors Found</span>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-xl flex flex-col">
                                                    <span className="text-2xl font-black text-gray-900">
                                                        {result.colors.reduce((acc: number, c: any) => acc + c.count, 0)}
                                                    </span>
                                                    <span className="text-gray-500">Total Samples</span>
                                                </div>
                                            </div>
                                        </div>
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
