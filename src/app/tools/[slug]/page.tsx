

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Hammer, ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';
import { ALL_TOOLS } from '@/data/tools';

export default async function ToolPlaceholder({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Find the tool definition to show real metadata
    const tool = ALL_TOOLS
        .flatMap(cat => cat.items)
        .find(t => t.href.endsWith(slug));

    const title = tool ? tool.name : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const description = tool?.desc || "This tool is currently under development.";
    const Icon = tool?.icon || Construction;

    return (
        <PremiumToolLayout
            hideHeader={true}
            title={title}
            description={description}
            icon={Icon}
            badgeText="Coming Soon"
        >
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 bg-white">
                <div className="w-24 h-24 bg-purple-50 rounded-3xl flex items-center justify-center mb-8 text-purple-600 shadow-xl shadow-purple-900/5">
                    <Icon size={48} />
                </div>

                <div className="space-y-4 mb-12 max-w-lg">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{title}</h1>
                    <p className="text-xl text-gray-500 leading-relaxed">
                        {description}
                    </p>

                    {('badge' in (tool || {}) && (tool as any).badge) && (
                        <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full">
                            {(tool as any).badge} Release
                        </span>
                    )}
                </div>

                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 max-w-xl w-full mb-12">
                    <h3 className="font-bold text-gray-900 mb-2">Development Status</h3>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-purple-500 h-full rounded-full w-[15%] animate-pulse"></div>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">In Progress</p>
                </div>

                <div className="flex gap-4">
                    <Link
                        href="/tools"
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:border-gray-300 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back to Suite
                    </Link>
                    <Link
                        href="/generate"
                        className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                    >
                        Use Generator Instead
                    </Link>
                </div>
            </div>
        </PremiumToolLayout>
    );
}
