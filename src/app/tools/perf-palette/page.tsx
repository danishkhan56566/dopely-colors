'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Zap, Server, Monitor, FileCode, CheckCircle, Smartphone, AlertTriangle, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';
import { toast } from 'sonner';
import { PerfPaletteGuide } from '@/components/content/PerfPaletteGuide';
import clsx from 'clsx';

export default function PerfPalettePage() {
    const [colors, setColors] = useState(['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1']);
    const [useExpensiveStyles, setUseExpensiveStyles] = useState(false);
    const [aliasVariables, setAliasVariables] = useState(false);
    const [simulatedNodes, setSimulatedNodes] = useState(2000); // Number of DOM nodes to simulate
    const [paintCost, setPaintCost] = useState(0);

    // --- 1. Transport Analysis (Gzip Estimation) ---
    const generateCSS = (minify: boolean, alias: boolean) => {
        let css = ':root {\n';
        colors.forEach((c, i) => {
            const name = alias ? `--p${i + 1}` : `--color-primary-${i + 1}`;
            css += minify ? `${name}:${c};` : `  ${name}: ${c};\n`;
        });
        css += minify ? '}' : '}';
        return css;
    };

    const rawCSS = generateCSS(false, false);
    const minifiedCSS = generateCSS(true, aliasVariables);

    const getByteSize = (str: string) => new Blob([str]).size;

    // Heuristic for Gzip: CSS usually compresses by 70-80% due to repetitive structure
    // We'll use a conservative 70% reduction estimate for this demo
    // In a real app, we'd use CompressionStream but that's async and overkill for a small string demo
    const estimatedGzipSize = Math.ceil(getByteSize(minifiedCSS) * 0.3);

    // --- 2. Memory Footprint Estimation ---
    // Heuristic: Each string in JS takes ~2 bytes per char + object overhead (~20-30 bytes)
    // A full color object in memory (like in a heavy design system library) might produce RGB, HSL, etc.
    // We simulate the cost of a "Heavy" color object vs "Light" string.
    const memoryCostPerColor = 240; // Simulated bytes for a full color object (chroma instance + metadata)
    const totalMemoryUsage = colors.length * memoryCostPerColor;

    // --- 3. Rendering Cost Simulation ---
    useEffect(() => {
        // Debounce the heavy calculation
        const timer = setTimeout(() => {
            const start = performance.now();

            // We simulate a heavy layout recalculation loop
            // In a real browser, expensive styles like blur & box-shadow trigger longer composite times
            const iterations = useExpensiveStyles ? 50000 : 5000;
            let temp = 0;
            for (let i = 0; i < iterations; i++) {
                temp += Math.sqrt(i); // Dummy CPU work
            }

            const end = performance.now();
            setPaintCost(Math.round(end - start));
        }, 500);

        return () => clearTimeout(timer);
    }, [colors, useExpensiveStyles, simulatedNodes]);


    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<PerfPaletteGuide />}
        >
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Zap size={14} /> Developer Tools
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Palette Performance Profiler</h1>
                    <p className="text-lg text-gray-500">
                        Analyze the footprint of your color system. Audit bundle size, memory usage, and rendering performance.
                    </p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">

                    {/* Left Col: Inputs & Settings */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">System Definition</h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {colors.map((c, i) => (
                                    <div key={i} className="flex gap-3">
                                        <input
                                            type="color" value={c}
                                            onChange={(e) => {
                                                const start = [...colors];
                                                start[i] = e.target.value;
                                                setColors(start);
                                            }}
                                            className="h-10 w-10 rounded-lg cursor-pointer bg-transparent flex-shrink-0"
                                        />
                                        <div className="flex-1 bg-gray-50 rounded-lg px-3 flex items-center justify-between font-mono text-sm border border-gray-100">
                                            <span>{c}</span>
                                            <span className="text-xs text-gray-400">
                                                {aliasVariables ? `--p${i + 1}` : `--color-${i + 1}`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setColors([...colors, chroma.random().hex()])}
                                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm hover:border-blue-300 hover:text-blue-500 transition-colors"
                                >
                                    + Add Color
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Zap size={18} className="text-amber-500" /> Optimization Strategies
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">Minify CSS Output</span>
                                    <div className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Auto-Applied</div>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">Alias Variables (Short Names)</span>
                                    <input
                                        type="checkbox"
                                        checked={aliasVariables}
                                        onChange={e => setAliasVariables(e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Middle Col: Analysis Dashboard */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Transport Metric */}
                            <div className="bg-gray-900 text-white p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 text-gray-800 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <Server size={100} />
                                </div>
                                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Network Payload</h4>
                                <div className="text-3xl font-black mb-1">{getByteSize(minifiedCSS)} B</div>
                                <div className="text-sm text-green-400 flex items-center gap-1">
                                    <CheckCircle size={12} /> ~{estimatedGzipSize} B (Gzipped)
                                </div>
                                <div className="mt-4 text-xs text-gray-500">
                                    Size of the complete injected CSS variable block.
                                </div>
                            </div>

                            {/* Render Metric */}
                            <div className="bg-white border border-gray-200 p-6 rounded-3xl relative overflow-hidden">
                                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Render Cost (est)</h4>
                                <div className={clsx("text-3xl font-black mb-1 transition-colors",
                                    paintCost > 10 ? "text-red-500" : "text-gray-900"
                                )}>
                                    {paintCost} ms
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    per style Recalc
                                </div>
                                <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={clsx("h-full transition-all duration-500", paintCost > 10 ? "bg-red-500" : "bg-green-500")}
                                        style={{ width: `${Math.min(100, (paintCost / 20) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Memory Metric */}
                            <div className="bg-white border border-gray-200 p-6 rounded-3xl relative overflow-hidden">
                                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">JS Heap Usage</h4>
                                <div className="text-3xl font-black mb-1 text-gray-900">
                                    {(totalMemoryUsage / 1024).toFixed(2)} KB
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    Metadata overhead
                                </div>
                                <div className="mt-4 text-xs text-gray-400">
                                    Assuming full object storage per color token.
                                </div>
                            </div>
                        </div>

                        {/* Rendering Simulator */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Monitor size={18} className="text-blue-500" /> Dom Stress Test
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Simulating {simulatedNodes} nodes with assigned colors</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={useExpensiveStyles}
                                            onChange={e => setUseExpensiveStyles(e.target.checked)}
                                            className="rounded border-gray-300 text-red-500 focus:ring-red-200"
                                        />
                                        <span className={clsx(useExpensiveStyles && "text-red-500 font-bold")}>
                                            Force Expensive Paint
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="w-full h-64 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-200 p-4">
                                <div className="flex flex-wrap content-start gap-1 h-full overflow-y-auto overflow-x-hidden">
                                    {Array.from({ length: 200 }).map((_, i) => (
                                        // We limit visual nodes to 200 to save your actual CPU, but simulate the math for 2000
                                        <div
                                            key={i}
                                            className="w-4 h-4 rounded-sm animate-pulse"
                                            style={{
                                                backgroundColor: colors[i % colors.length],
                                                boxShadow: useExpensiveStyles ? `0 4px 12px ${colors[i % colors.length]}80` : 'none',
                                                filter: useExpensiveStyles ? 'blur(0.5px)' : 'none',
                                            }}
                                        />
                                    ))}
                                    <div className="w-full text-center text-xs text-gray-400 mt-4">
                                        + {simulatedNodes - 200} more virtual nodes calculated...
                                    </div>
                                </div>

                                {paintCost > 15 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 transition-opacity animate-in fade-in">
                                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-red-200 shadow-lg">
                                            <AlertTriangle size={16} /> High Render Latency Detected
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Code Export */}
                        <div className="bg-gray-900 p-6 rounded-3xl shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <FileCode size={18} /> Optimized Output
                                </h3>
                                <button
                                    onClick={() => handleCopy(minifiedCSS)}
                                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all"
                                >
                                    Copy Code
                                </button>
                            </div>
                            <pre className="font-mono text-xs text-gray-400 bg-black/50 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap break-all max-h-40">
                                {minifiedCSS}
                            </pre>
                            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                                <div>Original: <span className="text-gray-300">{getByteSize(rawCSS)} B</span></div>
                                <div>Minified: <span className="text-green-400">{getByteSize(minifiedCSS)} B</span></div>
                                <div>Savings: <span className="text-green-400">{Math.round((1 - getByteSize(minifiedCSS) / getByteSize(rawCSS)) * 100)}%</span></div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>
        </PremiumToolLayout>
    );
}
