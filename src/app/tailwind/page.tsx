'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HexColorPicker } from 'react-colorful';
import chroma from 'chroma-js';
import { Copy, Check, Info, Moon, Sun, Monitor, Code, Wind, Palette } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { TailwindGuide } from '@/components/content/PageGuides';
import { TailwindFAQ, TailwindHowTo } from '@/components/content/PageFAQs';

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
        <button className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105 active:scale-95 shadow-sm" style={style}>
            {label}
        </button>
    );
};

// --- Main Page ---
export default function TailwindGeneratorPage() {
    const [baseColor, setBaseColor] = useState('#06b6d4');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'export'>('preview');

    // Generate Scale
    const scale = useMemo(() => {
        try {
            const base = chroma(baseColor);

            const scaleMap: Record<number, string> = {};

            // 500 is base
            scaleMap[500] = base.hex();

            // Lighter shades (mix with white) - using LCH for better perceptual interpolation
            scaleMap[50] = chroma.mix(base, 'white', 0.95, 'lch').hex();
            scaleMap[100] = chroma.mix(base, 'white', 0.85, 'lch').hex();
            scaleMap[200] = chroma.mix(base, 'white', 0.65, 'lch').hex();
            scaleMap[300] = chroma.mix(base, 'white', 0.45, 'lch').hex();
            scaleMap[400] = chroma.mix(base, 'white', 0.25, 'lch').hex();

            // Darker shades (mix with black)
            scaleMap[600] = chroma.mix(base, 'black', 0.1, 'lch').hex();
            scaleMap[700] = chroma.mix(base, 'black', 0.25, 'lch').hex();
            scaleMap[800] = chroma.mix(base, 'black', 0.45, 'lch').hex();
            scaleMap[900] = chroma.mix(base, 'black', 0.65, 'lch').hex();
            scaleMap[950] = chroma.mix(base, 'black', 0.8, 'lch').hex();

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
        const objStr = `colors: {\n  brand: {\n${Object.entries(scale).map(([k, v]) => `    ${k}: '${v}',`).join('\n')}\n  },\n}`;
        const cssStr = `:root {\n${Object.entries(scale).map(([k, v]) => `  --color-brand-${k}: ${v};`).join('\n')}\n}`;
        const jsonStr = JSON.stringify(scale, null, 2);

        return { objStr, cssStr, jsonStr };
    }, [scale]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[20%] w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob" />
                    <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000" />
                </div>

                <div className="w-full max-w-7xl px-4 py-16 sm:px-6 relative z-10 space-y-12">

                    {/* Premium Header */}
                    <div className="text-center space-y-6 mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <Wind size={14} className="text-cyan-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                                System Creator V2.0
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                            Tailwind <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 saturate-150">Scale Generator</span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 font-medium">
                            Generate balanced, accessible color systems. <br className="hidden sm:block" />
                            Export instantly to <span className="text-gray-900 font-bold">Tailwind CSS</span> config.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">

                        {/* LEFT: Controls & Scale (4 cols) */}
                        <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">

                            {/* Color Picker */}
                            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-cyan-900/5 border border-white/50 ring-1 ring-black/5">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-1">Base Color</label>
                                <div className="flex flex-col items-center">
                                    <div className="w-full aspect-square mb-6 custom-picker-wrapper shadow-lg rounded-[1.5rem] border border-gray-100">
                                        <HexColorPicker color={baseColor} onChange={setBaseColor} style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <div className="w-full flex items-center gap-4 p-3 border border-gray-200 rounded-2xl focus-within:ring-4 ring-cyan-500/10 bg-white shadow-sm transition-all group hover:border-cyan-200">
                                        <div className="w-12 h-12 rounded-xl shadow-inner border border-black/5 ring-1 ring-white" style={{ backgroundColor: baseColor }} />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={baseColor.toUpperCase()}
                                                onChange={(e) => setBaseColor(e.target.value)}
                                                className="w-full bg-transparent font-mono text-xl font-bold text-gray-900 outline-none uppercase"
                                                maxLength={7}
                                            />
                                            <div className="text-xs text-gray-400 font-medium">Hex Color</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Generated Scale List */}
                            <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-gray-100 ring-1 ring-black/5">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Generated Brand Scale</h3>
                                <div className="flex flex-col gap-2">
                                    {Object.entries(scale).map(([step, hex]) => {
                                        const contrastWhite = chroma.contrast(hex, '#fff');
                                        const contrastBlack = chroma.contrast(hex, '#000');
                                        const textColor = contrastWhite > 4.5 ? 'white' : 'black';

                                        return (
                                            <div
                                                key={step}
                                                className="group flex items-center justify-between p-3 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg cursor-copy relative overflow-hidden"
                                                style={{ backgroundColor: hex, color: textColor }}
                                                onClick={() => copyCode(hex)}
                                            >
                                                <div className="flex items-center gap-3 relative z-10">
                                                    <span className="text-xs font-bold w-8 opacity-80">{step}</span>
                                                    <span className="text-xs font-mono font-medium opacity-90">{hex}</span>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-60 relative z-10">
                                                    {textColor === 'white' && contrastWhite >= 4.5 && <span className="text-[10px] font-bold border border-white/30 px-1.5 py-0.5 rounded">AA</span>}
                                                    {textColor === 'black' && contrastBlack >= 4.5 && <span className="text-[10px] font-bold border border-black/30 px-1.5 py-0.5 rounded">AA</span>}
                                                </div>
                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT: Preview & Export (8 cols) */}
                        <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">

                            {/* Tabs */}
                            <div className="flex p-1.5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm w-fit">
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={clsx(
                                        "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                                        activeTab === 'preview' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                    )}
                                >
                                    <Monitor size={16} /> Live Preview
                                </button>
                                <button
                                    onClick={() => setActiveTab('export')}
                                    className={clsx(
                                        "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                                        activeTab === 'export' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                    )}
                                >
                                    <Code size={16} /> Export Config
                                </button>
                            </div>

                            {activeTab === 'preview' ? (
                                <div className={clsx("flex-1 p-8 md:p-12 rounded-[2.5rem] transition-all duration-500 border shadow-xl relative overflow-hidden group", isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-white/60")}>
                                    {/* Theme Toggle Overlay */}
                                    <div className="absolute top-8 right-8 flex gap-2 z-20">
                                        <button
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                            className={clsx(
                                                "p-3 rounded-full transition-all shadow-lg backdrop-blur-md border",
                                                isDarkMode ? "bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700" : "bg-white text-gray-400 border-gray-100 hover:text-yellow-500"
                                            )}
                                        >
                                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                                        </button>
                                    </div>

                                    {/* Mockup UI */}
                                    <div className="max-w-2xl mx-auto space-y-10 relative z-10">
                                        <div className="text-center space-y-2 mb-12">
                                            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: scale[100], color: scale[800] }}>
                                                System Preview
                                            </div>
                                            <h2 className={clsx("text-3xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                                                Your <span style={{ color: scale[500] }}>Brand Code</span> in Action
                                            </h2>
                                            <p className={clsx("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>Sees how your generated scale applies to real UI components.</p>
                                        </div>

                                        {/* Dashboard Header Component */}
                                        <div className={clsx("p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm", isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50/80 border-gray-100")}>
                                            <div className="flex items-center gap-5 w-full md:w-auto">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transform rotate-3" style={{ backgroundColor: scale[600] }}>
                                                    <Palette size={24} />
                                                </div>
                                                <div>
                                                    <div className={clsx("h-5 w-32 rounded-lg mb-2", isDarkMode ? "bg-gray-700" : "bg-gray-200")} />
                                                    <div className={clsx("h-3 w-20 rounded-md", isDarkMode ? "bg-gray-700" : "bg-gray-300")} />
                                                </div>
                                            </div>
                                            <div className="flex gap-3 w-full md:w-auto">
                                                <PreviewButton label="Cancel" variant="outline" colors={scale} />
                                                <PreviewButton label="Save Changes" variant="primary" colors={scale} />
                                            </div>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="grid grid-cols-3 gap-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className={clsx("p-5 rounded-2xl border text-center", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100")}>
                                                    <div className="text-3xl font-black mb-1" style={{ color: scale[600] }}>{94 + i}%</div>
                                                    <div className={clsx("text-xs font-bold uppercase tracking-wide", isDarkMode ? "text-gray-500" : "text-gray-400")}>Metric</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Interactive Elements */}
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className={clsx("text-sm font-bold uppercase tracking-wide ml-1", isDarkMode ? "text-gray-400" : "text-gray-400")}>Input Field Focus</label>
                                                <input
                                                    type="text"
                                                    className={clsx(
                                                        "w-full px-5 py-4 rounded-xl border outline-none transition-all shadow-sm text-lg",
                                                        isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-white border-gray-200 text-gray-900 placeholder-gray-300"
                                                    )}
                                                    style={{ caretColor: scale[600] }}
                                                    placeholder="Click to see focus ring color..."
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = scale[500];
                                                        e.target.style.boxShadow = `0 0 0 4px ${scale[500]}20`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>

                                            <div className={clsx("p-6 rounded-2xl border relative overflow-hidden", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100")}>
                                                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: scale[500] }} />
                                                <h4 className={clsx("font-bold text-lg mb-2", isDarkMode ? "text-white" : "text-gray-900")}>Notification Card</h4>
                                                <p className={clsx("text-sm leading-relaxed mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                                                    Using <span style={{ color: scale[600], fontWeight: 700 }}>{baseColor}</span> as the primary accent color creates a cohesive brand experience across dark and light modes.
                                                </p>
                                                <button className="text-sm font-bold hover:underline" style={{ color: scale[700] }}>View Details &rarr;</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <ExportBlock title="tailwind.config.ts" code={exportConfig.objStr} onCopy={() => copyCode(exportConfig.objStr)} />
                                    <ExportBlock title="CSS Variables (:root)" code={exportConfig.cssStr} onCopy={() => copyCode(exportConfig.cssStr)} />
                                    <ExportBlock title="Design Tokens (JSON)" code={exportConfig.jsonStr} onCopy={() => copyCode(exportConfig.jsonStr)} />
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    .custom-picker-wrapper .react-colorful {
                        width: 100%;
                        height: 100%;
                        border-radius: 1.25rem;
                         box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
                    }
                    .custom-picker-wrapper .react-colorful__saturation {
                        border-radius: 1.25rem 1.25rem 0 0;
                    }
                    .custom-picker-wrapper .react-colorful__hue {
                        border-radius: 0 0 1.25rem 1.25rem;
                        height: 24px;
                    }
                     .custom-picker-wrapper .react-colorful__pointer {
                        width: 28px;
                        height: 28px;
                        border-width: 4px;
                        border-color: white;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                 `}</style>
                <TailwindGuide />
                <TailwindFAQ />
                <TailwindHowTo />
            </div>
        </DashboardLayout>
    );
}

const ExportBlock = ({ title, code, onCopy }: { title: string, code: string, onCopy: () => void }) => (
    <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white/50 ring-1 ring-black/5 overflow-hidden group">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Code size={16} className="text-gray-400" /> {title}
            </h3>
            <button onClick={onCopy} className="text-xs font-bold text-white bg-black px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-sm">
                <Copy size={12} /> COPY
            </button>
        </div>
        <div className="p-0 overflow-x-auto relative">
            <pre className="p-6 text-xs font-mono text-gray-600 leading-relaxed tab-4">{code}</pre>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]" />
        </div>
    </div>
);
