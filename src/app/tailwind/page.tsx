'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HexColorPicker } from 'react-colorful';
import chroma from 'chroma-js';
import { Copy, Check, Info, Moon, Sun, Monitor, Code } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

// --- Components ---
const PreviewButton = ({ label, variant, colors }: { label: string, variant: 'primary' | 'secondary' | 'outline', colors: Record<number, string> }) => {
    let style = {};
    if (variant === 'primary') {
        style = { backgroundColor: colors[600], color: '#ffffff' };
    } else if (variant === 'secondary') {
        style = { backgroundColor: colors[100], color: colors[900] };
    } else {
        style = { border: `1px solid ${colors[300]}`, color: colors[700] };
    }

    return (
        <button className="px-5 py-2.5 rounded-lg font-medium text-sm transition-opacity hover:opacity-90 active:scale-95 shadow-sm" style={style}>
            {label}
        </button>
    );
};

// --- Main Page ---
export default function TailwindGeneratorPage() {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'export'>('preview');

    // Generate Scale
    const scale = useMemo(() => {
        try {
            const base = chroma(baseColor);

            // Generate a balanced scale
            // Algorithm: 
            // 50: Very light tint (97% lightness)
            // 500: The base color (or close to it)
            // 950: Very dark shade (10% lightness)

            // We use chroma.scale to create a smooth gradient
            // We force white at start and black at end, but pass through the base color to ensure it's represented
            // Actually, a better typical Tailwind approach is mixing with white/black or adjusting lightness/saturation

            const lightness = base.get('hsl.l');
            let domain = [0, 1];

            // Adjust domain to make sure 500 is roughly where the base color is
            // This is a naive approximation, for a "real" tailwind feel we might want standard steps

            const generated = chroma.scale(['#fff', baseColor, '#000'])
                .domain([0, 0.5, 1])
                .mode('lch') // LCH often produces smoother gradients than RGB/HSL
                .colors(21); // Generate more steps to pick from? No, let's map specifically

            // Custom scale generation for Tailwind-like stops
            // Steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
            const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

            const createShade = (targetLightness: number) => {
                return base.set('hsl.l', targetLightness).hex();
            };

            // If we just set lightness, saturation might look weird at extremes.
            // Better approach: Mix with white for light, mix with black for dark, keeping the base at 500.

            const scaleMap: Record<number, string> = {};

            // 500 is base
            scaleMap[500] = base.hex();

            // Lighter shades (mix with white)
            scaleMap[50] = chroma.mix(base, 'white', 0.95, 'lch').hex();
            scaleMap[100] = chroma.mix(base, 'white', 0.85, 'lch').hex();
            scaleMap[200] = chroma.mix(base, 'white', 0.65, 'lch').hex();
            scaleMap[300] = chroma.mix(base, 'white', 0.45, 'lch').hex();
            scaleMap[400] = chroma.mix(base, 'white', 0.25, 'lch').hex();

            // Darker shades (mix with black) - usually mixed with a cool black for better generic look, but pure black is safer
            scaleMap[600] = chroma.mix(base, 'black', 0.15, 'lch').hex();
            scaleMap[700] = chroma.mix(base, 'black', 0.35, 'lch').hex();
            scaleMap[800] = chroma.mix(base, 'black', 0.55, 'lch').hex();
            scaleMap[900] = chroma.mix(base, 'black', 0.75, 'lch').hex();
            scaleMap[950] = chroma.mix(base, 'black', 0.85, 'lch').hex();

            return scaleMap;
        } catch (e) {
            return {};
        }
    }, [baseColor]);


    const copyCode = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const exportConfig = useMemo(() => {
        const objStr = `colors: {\n  primary: {\n${Object.entries(scale).map(([k, v]) => `    ${k}: '${v}',`).join('\n')}\n  },\n}`;
        const cssStr = `:root {\n${Object.entries(scale).map(([k, v]) => `  --color-primary-${k}: ${v};`).join('\n')}\n}`;
        const jsonStr = JSON.stringify(scale, null, 2);

        return { objStr, cssStr, jsonStr };
    }, [scale]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-6">
                <div className="max-w-6xl mx-auto w-full">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tailwind Generator</h1>
                            <p className="text-gray-500">Create balanced, accessible color scales for your design system.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                            <button
                                onClick={() => setIsDarkMode(false)}
                                className={clsx("p-2 rounded-lg transition-colors", !isDarkMode ? "bg-gray-100 text-black shadow-sm" : "text-gray-400 hover:text-gray-600")}
                            >
                                <Sun size={20} />
                            </button>
                            <button
                                onClick={() => setIsDarkMode(true)}
                                className={clsx("p-2 rounded-lg transition-colors", isDarkMode ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-600")}
                            >
                                <Moon size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT: Controls & Scale (4 cols) */}
                        <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">

                            {/* Color Picker */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <label className="block text-sm font-bold text-gray-900 mb-4">Base Color</label>
                                <div className="flex flex-col items-center">
                                    <div className="w-full aspect-video md:aspect-square mb-4 custom-picker-wrapper">
                                        <HexColorPicker color={baseColor} onChange={setBaseColor} style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <div className="w-full flex items-center gap-3 p-2 border border-gray-200 rounded-xl focus-within:ring-2 ring-blue-500/20 bg-gray-50">
                                        <div className="w-8 h-8 rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: baseColor }} />
                                        <input
                                            type="text"
                                            value={baseColor}
                                            onChange={(e) => setBaseColor(e.target.value)}
                                            className="flex-1 bg-transparent font-mono text-gray-900 outline-none uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Generated Scale List */}
                            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 mb-4 px-2">Generated Scale</h3>
                                <div className="flex flex-col gap-1">
                                    {Object.entries(scale).map(([step, hex]) => {
                                        const contrastWhite = chroma.contrast(hex, '#fff');
                                        const contrastBlack = chroma.contrast(hex, '#000');
                                        const textColor = contrastWhite > 4.5 ? 'white' : 'black';

                                        return (
                                            <div key={step} className="group flex items-center justify-between p-2 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer" style={{ backgroundColor: hex, color: textColor }} onClick={() => copyCode(hex)}>
                                                <span className="text-xs font-bold w-10">{step}</span>
                                                <span className="text-xs font-mono opacity-80 group-hover:opacity-100">{hex}</span>
                                                <div className="flex items-center gap-1 opacity-60">
                                                    {textColor === 'white' && contrastWhite >= 4.5 && <span className="text-[10px] border border-white/30 px-1 rounded">AA</span>}
                                                    {textColor === 'black' && contrastBlack >= 4.5 && <span className="text-[10px] border border-black/30 px-1 rounded">AA</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT: Preview & Export (8 cols) */}
                        <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">

                            {/* Tabs */}
                            <div className="flex gap-2 border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={clsx("px-6 py-3 font-bold text-sm border-b-2 transition-colors", activeTab === 'preview' ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-800")}
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => setActiveTab('export')}
                                    className={clsx("px-6 py-3 font-bold text-sm border-b-2 transition-colors", activeTab === 'export' ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-800")}
                                >
                                    Export Code
                                </button>
                            </div>

                            {activeTab === 'preview' ? (
                                <div className={clsx("p-8 rounded-3xl transition-colors min-h-[500px] border shadow-sm", isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100")}>

                                    {/* Mockup UI */}
                                    <div className="max-w-xl mx-auto space-y-8">

                                        {/* Dashboard Header */}
                                        <div className={clsx("p-6 rounded-2xl border flex items-center justify-between", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: scale[600] }}>
                                                    <span className="font-bold">A</span>
                                                </div>
                                                <div>
                                                    <div className={clsx("h-4 w-32 rounded mb-2", isDarkMode ? "bg-gray-700" : "bg-gray-200")} />
                                                    <div className={clsx("h-3 w-20 rounded", isDarkMode ? "bg-gray-700" : "bg-gray-300")} />
                                                </div>
                                            </div>
                                            <PreviewButton label="Upgrade Plan" variant="primary" colors={scale} />
                                        </div>

                                        {/* Buttons Row */}
                                        <div className="space-y-4">
                                            <h4 className={clsx("text-xs font-bold uppercase tracking-wider", isDarkMode ? "text-gray-500" : "text-gray-400")}>Interactive Elements</h4>
                                            <div className="flex flex-wrap gap-4">
                                                <PreviewButton label="Primary Action" variant="primary" colors={scale} />
                                                <PreviewButton label="Secondary" variant="secondary" colors={scale} />
                                                <PreviewButton label="Outline" variant="outline" colors={scale} />
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <div className={clsx("p-6 rounded-2xl border space-y-4", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: scale[100], color: scale[800] }}>NEW</span>
                                                <h4 className={clsx("font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Project Update</h4>
                                            </div>
                                            <p className={clsx("text-sm leading-relaxed", isDarkMode ? "text-gray-300" : "text-gray-500")}>
                                                This demonstrates how your color scale adapts to <span style={{ color: scale[600], fontWeight: 600 }}>highlighted text</span> and badges within a card component.
                                            </p>
                                            <div className="pt-4 border-t border-dashed" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                                                <a href="#" className="text-sm font-medium hover:underline" style={{ color: scale[600] }}>Read more -&gt;</a>
                                            </div>
                                        </div>

                                        {/* Form Input */}
                                        <div className="space-y-2">
                                            <label className={clsx("text-sm font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>Email Address</label>
                                            <input
                                                type="text"
                                                className={clsx("w-full px-4 py-3 rounded-xl border outline-none ring-offset-2 transition-all", isDarkMode ? "bg-gray-800 border-gray-700 text-white ring-offset-gray-900" : "bg-white border-gray-200 text-gray-900")}
                                                style={{ ['--tw-ring-color' as any]: scale[500] }}
                                                placeholder="focus-visible:ring-2"
                                                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${scale[500]}40, 0 0 0 1px ${scale[500]}`}
                                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                                            />
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <ExportBlock title="Tailwind Config (tailwind.config.js)" code={exportConfig.objStr} onCopy={() => copyCode(exportConfig.objStr)} />
                                    <ExportBlock title="CSS Variables" code={exportConfig.cssStr} onCopy={() => copyCode(exportConfig.cssStr)} />
                                    <ExportBlock title="JSON Tokens" code={exportConfig.jsonStr} onCopy={() => copyCode(exportConfig.jsonStr)} />
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    .custom-picker-wrapper .react-colorful {
                        width: 100%;
                        height: 100%;
                        border-radius: 1rem;
                    }
                 `}</style>
            </div>
        </DashboardLayout>
    );
}

const ExportBlock = ({ title, code, onCopy }: { title: string, code: string, onCopy: () => void }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Code size={16} className="text-gray-400" /> {title}
            </h3>
            <button onClick={onCopy} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Copy size={12} /> COPY
            </button>
        </div>
        <div className="p-0 overflow-x-auto">
            <pre className="p-6 text-xs font-mono text-gray-600 leading-relaxed">{code}</pre>
        </div>
    </div>
);
