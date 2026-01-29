'use client';

import { useState } from 'react';
import {
    Search,
    Globe,
    Zap,
    BarChart,
    Settings,
    Plus,
    ExternalLink,
    Eye,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCw
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

interface SEOPage {
    path: string;
    title: string;
    description: string;
    status: 'Optimized' | 'Missing Meta' | 'Low Content';
    score: number;
    lastChecked: string;
}

export default function SEOManager() {
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const pages: SEOPage[] = [
        { path: '/', title: 'Dopely Colors - Advanced Palette Generator', description: 'Generate beautiful color palettes and export design system tokens.', status: 'Optimized', score: 98, lastChecked: '2h ago' },
        { path: '/explore', title: 'Explore Trending Palettes | Dopely', description: 'Browse thousands of curated color palettes for your next project.', status: 'Optimized', score: 92, lastChecked: '5h ago' },
        { path: '/blog/color-theory', title: 'Color Theory Basics', description: '', status: 'Missing Meta', score: 45, lastChecked: '1d ago' },
        { path: '/p/summer-ocean', title: 'Summer Ocean Palette', description: 'A refreshing blue and teal palette.', status: 'Low Content', score: 65, lastChecked: '3h ago' },
        { path: '/ai', title: 'AI Palette Generator - Neural Engine', description: 'Use natural language to design your next brand colors.', status: 'Optimized', score: 95, lastChecked: 'Just now' },
    ];

    const handleCrawl = () => {
        setIsLoading(true);
        toast.info("Starting site-wide SEO crawl...");
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Crawl completed. 142 pages indexed.");
        }, 3000);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Globe className="text-blue-600" size={32} />
                        SEO Intelligence
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage indexing, meta tags, and organic performance.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCrawl}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} className="text-amber-500 fill-amber-500" />}
                        {isLoading ? 'Crawling...' : 'Crawl Site'}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                        <Plus size={18} />
                        Add Custom Page
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Health Score</span>
                        <CheckCircle2 size={20} className="text-emerald-500" />
                    </div>
                    <div className="text-4xl font-black text-gray-900">89%</div>
                    <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[89%]" />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Indexed Pages</span>
                        <Eye size={20} className="text-blue-500" />
                    </div>
                    <div className="text-4xl font-black text-gray-900">1,452</div>
                    <div className="text-xs font-bold text-blue-600 mt-2">+12 this week</div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">SEO Errors</span>
                        <XCircle size={20} className="text-rose-500" />
                    </div>
                    <div className="text-4xl font-black text-gray-900">23</div>
                    <div className="text-xs font-bold text-gray-400 mt-2 italic">Requires manual review</div>
                </div>
            </div>

            {/* Page List Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-gray-900">Page Catalog</h3>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by path..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-gray-50 pl-12 pr-6 py-3 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm w-full md:w-80"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-4">URL Path</th>
                                <th className="px-6 py-4">Title Tag</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-4 py-4">Score</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pages.map((page) => (
                                <tr key={page.path} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-gray-900 text-sm">{page.path}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">Checked {page.lastChecked}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-medium text-gray-600 truncate max-w-[300px]" title={page.title}>
                                            {page.title || <span className="text-rose-500 font-bold italic">Missing!</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                            page.status === 'Optimized' ? "bg-emerald-50 text-emerald-600" :
                                                page.status === 'Missing Meta' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {page.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className={clsx(
                                            "font-black text-sm",
                                            page.score > 90 ? "text-emerald-500" :
                                                page.score > 60 ? "text-amber-500" : "text-rose-500"
                                        )}>
                                            {page.score}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-gray-50 text-center">
                    <button className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">
                        Load More Pages
                    </button>
                </div>
            </div>

            {/* Settings Sidebar Grid */}
            <div className="grid md:grid-cols-2 gap-8 mt-10">
                <section className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                    <h3 className="text-xl font-bold mb-4">Sitemap Settings</h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Dopely automatically generates individual sitemaps for Palettes, Gradients, and Blog posts to maximize crawl efficiency.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-sm font-medium">Auto-ping Search Engines</span>
                            <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-sm font-medium">Include Drafts</span>
                            <div className="w-10 h-5 bg-white/10 rounded-full relative">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Info size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Optimization Tip</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                Most of your "Low Content" pages are automatically generated palette detail pages. Ensure you have high-quality descriptive titles for these to improve CTR.
                            </p>
                        </div>
                    </div>
                    <button className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all">
                        View Detailed Recommendations
                    </button>
                </section>
            </div>
        </div>
    );
}
