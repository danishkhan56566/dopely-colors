'use client';

import { useState } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search, TriangleAlert, CircleCheck, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function ColorLinter() {
    const [input, setInput] = useState('#ffffff, #fcfcfc, #fefefe, #000000, #3b82f6, #3b83f6');
    const [threshold, setThreshold] = useState(2); // Delta E
    const [clusters, setClusters] = useState<any[]>([]);

    const analyze = () => {
        try {
            console.log("Starting analysis...");
            // Extract hexes
            const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
            const matches = input.match(hexRegex) || [];
            console.log("Found matches:", matches);

            const unique = Array.from(new Set(matches.map(h => chroma(h).hex())));
            console.log("Unique colors:", unique);

            if (unique.length < 2) {
                toast.error("Need at least 2 unique colors to compare");
                return;
            }

            // Clustering Algorithm
            const visited = new Set<string>();
            const newClusters = [];

            for (const hex of unique) {
                if (visited.has(hex)) continue;

                const cluster = [hex];
                visited.add(hex);

                for (const other of unique) {
                    if (visited.has(other)) continue;

                    const dist = chroma.deltaE(hex, other);
                    if (dist < threshold) {
                        cluster.push(other);
                        visited.add(other);
                    }
                }

                if (cluster.length > 1) {
                    newClusters.push({
                        type: 'zombie',
                        colors: cluster,
                        avg: chroma.average(cluster).hex()
                    });
                } else {
                    newClusters.push({
                        type: 'clean',
                        colors: cluster
                    });
                }
            }

            // Sort: Zombie clusters first
            const sortedClusters = newClusters.sort((a, b) => (a.type === 'zombie' ? -1 : 1));
            setClusters(sortedClusters);

            const conflictCount = sortedClusters.filter(c => c.type === 'zombie').length;
            toast.success(`Analysis Complete: Found ${conflictCount} conflict groups`);
            console.log("Analysis complete", sortedClusters);

        } catch (error: any) {
            console.error("Linter Error:", error);
            toast.error("Analysis failed: " + (error.message || "Unknown error"));
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                            <Search size={32} />
                        </div>
                        Zombie Color Linter
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Detect accidents, inconsistencies, and "zombie colors" (near-duplicates) in your codebase.
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Input */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-4 block">Paste Hex Codes (CSS/JSON)</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-64 p-4 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs focus:ring-2 ring-orange-100 outline-none resize-none"
                                placeholder="#ffffff, #f0f0f0..."
                            />

                            <div className="mt-6">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex justify-between">
                                    Similarity Threshold (Delta E)
                                    <span>{threshold}</span>
                                </label>
                                <input type="range" min="0.5" max="10" step="0.5" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-orange-500" />
                                <p className="text-[10px] text-gray-400 mt-2">Lower = Stricter (Finds only very close matches). Higher = Looser.</p>
                            </div>

                            <button onClick={analyze} className="mt-6 w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg">
                                <Search size={18} /> Analyze Colors
                            </button>
                        </div>
                    </div>

                    {/* Report */}
                    <div className="lg:col-span-7 space-y-6">
                        {clusters.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Analysis Report</h3>

                                {clusters.map((cluster, i) => (
                                    <div key={i} className={clsx(
                                        "p-6 rounded-2xl border transition-all hover:scale-[1.01]",
                                        cluster.type === 'zombie' ? "bg-white border-red-100 shadow-sm" : "bg-white/50 border-gray-100 opacity-80"
                                    )}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                {cluster.type === 'zombie' ? (
                                                    <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <TriangleAlert size={12} /> Conflict Found
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <CircleCheck size={12} /> Clean
                                                    </div>
                                                )}
                                            </div>
                                            {cluster.type === 'zombie' && (
                                                <button className="text-xs font-bold text-blue-600 hover:underline">Merge All</button>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-4 items-center">
                                            {cluster.colors.map((hex: string) => (
                                                <div key={hex} className="flex flex-col items-center gap-1">
                                                    <div className="w-12 h-12 rounded-xl shadow-sm border border-gray-100 relative group" style={{ backgroundColor: hex }}>
                                                        <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {hex}
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-gray-400">{hex}</span>
                                                </div>
                                            ))}

                                            {cluster.type === 'zombie' && (
                                                <>
                                                    <ArrowRight className="text-gray-300" size={20} />
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="w-12 h-12 rounded-xl shadow-md ring-2 ring-green-400 bg-stripes" style={{ backgroundColor: cluster.avg }}>
                                                            {/* Recommended Merge */}
                                                        </div>
                                                        <span className="text-[10px] font-mono text-green-600 font-bold">Merge</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {cluster.type === 'zombie' && (
                                            <p className="mt-4 text-xs text-gray-500">
                                                These colors are visually indistinguishable ({threshold} ΔE). Consider merging them into <span className="font-mono font-bold">{cluster.avg}</span> to reduce bundle size.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 border-2 border-dashed border-gray-200 rounded-[2rem]">
                                <Search size={48} className="mb-4" />
                                <p>Paste colors and click analyze</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
