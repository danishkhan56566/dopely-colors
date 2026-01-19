'use client';

import { Color } from '@/store/usePaletteStore';
import { useState, useMemo } from 'react';
import chroma from 'chroma-js';
import clsx from 'clsx';
import { Copy, Check } from 'lucide-react';

interface CodePanelProps {
    colors: Color[];
}

// Helper to generate a scale (50-950) from a single color
const generateScale = (hex: string) => {
    return chroma.scale(['white', hex, 'black'])
        .mode('lch')
        .colors(21) // We need steps to map to 50, 100...900, 950. 
    // 50, 100, 200, 300, 400, 500(base), 600, 700, 800, 900, 950 -> 11 steps
    // This is a naive scale. Better is to domain/colors mapping.
    // Let's use a simpler mapping:
    // 50: lightness 98%
    // 950: lightness 5%
};

// Robust Tailwind Scale Generator
const getTailwindScale = (baseColor: string, name: string) => {
    const scale: Record<string, string> = {};
    const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    // We treat the base color as ~500. 
    // We generate a scale from white -> base -> black.
    // Domain: [0, 0.5, 1] relative to linear gradient?

    // Using chroma.scale with domain for better results
    const base = chroma(baseColor);

    // Correct way: use a domain that pins the base color to roughly the middle
    // Simple approach: 
    // Lighten for <500, Darken for >500

    levels.forEach(level => {
        let hex = '';
        if (level === 500) {
            hex = base.hex();
        } else if (level < 500) {
            // Lighten
            // 500 -> 0 (no lighten), 50 -> 2 (max lighten)
            // factor range: 0 to ~3?
            const f = (500 - level) / 500 * 2.5;
            hex = base.brighten(f).hex();
            // Clamp to avoid pure white too early
            if (level === 50 && chroma(hex).luminance() < 0.95) hex = base.brighten(3).hex();
        } else {
            // Darken
            // 500 -> 0, 950 -> 2
            const f = (level - 500) / 500 * 2.5;
            hex = base.darken(f).hex();
        }
        scale[level] = hex;
    });

    return scale;
};

export const CodePanel = ({ colors }: CodePanelProps) => {
    const [activeTab, setActiveTab] = useState<'tailwind' | 'css' | 'json'>('tailwind');
    const [copied, setCopied] = useState(false);

    // Names for colors: Primary, Secondary, etc.
    const namedColors = ['primary', 'secondary', 'accent', 'neutral', 'success'];

    const generatedCode = useMemo(() => {
        if (activeTab === 'tailwind') {
            let output = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;

            colors.forEach((color, i) => {
                const name = namedColors[i] || `color-${i + 1}`;
                const scale = getTailwindScale(color.hex, name);

                output += `        '${name}': {\n`;
                Object.entries(scale).forEach(([key, val]) => {
                    output += `          ${key}: '${val}',\n`;
                });
                output += `        },\n`;
            });

            output += `      }\n    }\n  }\n}`;
            return output;
        }

        if (activeTab === 'css') {
            let output = `:root {\n`;
            colors.forEach((color, i) => {
                const name = namedColors[i] || `color-${i + 1}`;
                const scale = getTailwindScale(color.hex, name);
                output += `  /* ${name} (${color.hex}) */\n`;
                Object.entries(scale).forEach(([key, val]) => {
                    output += `  --${name}-${key}: ${val};\n`;
                });
                output += `\n`;
            });
            output += `}`;
            return output;
        }

        if (activeTab === 'json') {
            const outputObj: any = {};
            colors.forEach((color, i) => {
                const name = namedColors[i] || `color-${i + 1}`;
                outputObj[name] = getTailwindScale(color.hex, name);
            });
            return JSON.stringify(outputObj, null, 2);
        }

        return '';
    }, [colors, activeTab]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full h-full flex flex-col bg-gray-50 text-sm">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {['tailwind', 'css', 'json'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={clsx(
                                "px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                                activeTab === tab ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors active:scale-95"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Code Editor Preview */}
                <div className="flex-1 overflow-auto bg-[#1e1e1e] text-gray-300 p-6 font-mono text-sm leading-relaxed">
                    <pre className="whitespace-pre-wrap">
                        {generatedCode}
                    </pre>
                </div>

                {/* Visual Scale Preview (Sidebar) */}
                <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto hidden xl:block">
                    <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-6">Generated Scales</h3>

                        <div className="flex flex-col gap-8">
                            {colors.map((color, i) => {
                                const name = namedColors[i] || `color-${i + 1}`;
                                const scale = getTailwindScale(color.hex, name);
                                return (
                                    <div key={color.id}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium capitalize text-gray-700">{name}</span>
                                            <span className="text-xs text-gray-400 font-mono">{color.hex}</span>
                                        </div>
                                        <div className="flex rounded-lg overflow-hidden h-8 w-full ring-1 ring-gray-100">
                                            {/* Minimal strip preview */}
                                            {Object.values(scale).map((hex, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex-1 h-full"
                                                    style={{ backgroundColor: hex }}
                                                    title={hex}
                                                />
                                            ))}
                                        </div>
                                        {/* Detailed grid */}
                                        <div className="grid grid-cols-4 gap-2 mt-2">
                                            {[50, 500, 900].map(level => (
                                                <div key={level} className="flex flex-col gap-1 items-start">
                                                    <div className="w-8 h-8 rounded border border-gray-100" style={{ backgroundColor: scale[level] }} />
                                                    <span className="text-[10px] text-gray-500">{level}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
