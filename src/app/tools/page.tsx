'use client';

// Tool Data
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ALL_TOOLS } from '@/data/tools';


export default function ToolsPage() {
    const [search, setSearch] = useState('');

    const filteredSections = ALL_TOOLS.map(section => ({
        ...section,
        items: section.items.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.desc.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(section => section.items.length > 0);

    return (
        <DashboardLayout>
            <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Color Tools Suite
                    </h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Everything you need to create, convert, and analyze colors.
                        All in one place.
                    </p>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tools (e.g. 'Contrast', 'Gradient')..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all text-lg"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="space-y-12">
                    {filteredSections.map((section) => (
                        <div key={section.category}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                                {section.category}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {section.items.map((tool) => (
                                    <Link
                                        key={tool.name}
                                        href={tool.href}
                                        className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500">
                                            <ArrowRight size={20} />
                                        </div>

                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                            <tool.icon size={24} />
                                        </div>

                                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {tool.desc}
                                        </p>

                                        {tool.badge && (
                                            <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-sm">
                                                {tool.badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {filteredSections.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p>No tools found matching "{search}"</p>
                            <button
                                onClick={() => setSearch('')}
                                className="text-purple-600 font-bold mt-2 hover:underline"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
