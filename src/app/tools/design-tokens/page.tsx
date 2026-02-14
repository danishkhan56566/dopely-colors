'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Code, Copy, Check, FileJson, FileCode, Smartphone, Terminal, Settings2 } from 'lucide-react';
import { usePaletteStore } from '@/store/usePaletteStore';
import { toast } from 'sonner';
import { DesignTokensGuide } from '@/components/content/DevGuides';
import clsx from 'clsx';
import chroma from 'chroma-js';

// --- Types ---
type ExportFormat = 'css' | 'scss' | 'json' | 'swift' | 'android';
type CaseStyle = 'kebab' | 'camel' | 'snake' | 'pascal';

// --- Helper Functions ---
const toKebab = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
const toCamel = (str: string) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
const toSnake = (str: string) => str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || str;
const toPascal = (str: string) => str.replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '');

const getColorName = (index: number) => {
    const names = ['primary', 'secondary', 'accent', 'neutral', 'surface'];
    return names[index] || `color-${index + 1}`;
};

export default function DesignTokenGenerator() {
    const { colors } = usePaletteStore();

    // State
    const [format, setFormat] = useState<ExportFormat>('css');
    const [prefix, setPrefix] = useState('brand');
    const [caseStyle, setCaseStyle] = useState<CaseStyle>('kebab');

    // Generated Code
    const code = useMemo(() => {
        const palette = colors.map((c, i) => ({
            hex: c.hex,
            name: getColorName(i),
            originalName: getColorName(i)
        }));

        const formatName = (name: string) => {
            const raw = prefix ? `${prefix} ${name}` : name;
            switch (caseStyle) {
                case 'kebab': return toKebab(raw);
                case 'camel': return toCamel(raw);
                case 'snake': return toSnake(raw);
                case 'pascal': return toPascal(raw);
                default: return raw;
            }
        };

        switch (format) {
            case 'css':
                return `:root {\n${palette.map(c => `  --${formatName(c.name)}: ${c.hex};`).join('\n')}\n}`;

            case 'scss':
                return `${palette.map(c => `$${formatName(c.name)}: ${c.hex};`).join('\n')}`;

            case 'json':
                const tokenObj = palette.reduce((acc, c) => ({
                    ...acc,
                    [formatName(c.name)]: {
                        value: c.hex,
                        type: 'color'
                    }
                }), {});
                return JSON.stringify(tokenObj, null, 2);

            case 'swift':
                // Swift typically uses PascalCase for structs or camelCase for static vars
                // We'll enforce camel for vars usually
                return `import SwiftUI\n\nextension Color {\n${palette.map(c => `    static let ${toCamel(prefix ? `${prefix} ${c.name}` : c.name)} = Color(hex: "${c.hex}")`).join('\n')}\n}`;

            case 'android':
                return `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n${palette.map(c => `    <color name="${toSnake(prefix ? `${prefix} ${c.name}` : c.name)}">${c.hex}</color>`).join('\n')}\n</resources>`;

            default:
                return '';
        }
    }, [colors, format, prefix, caseStyle]);


    const copyCode = () => {
        navigator.clipboard.writeText(code);
        toast.success(`Copied ${format.toUpperCase()} tokens!`);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6">

                {/* Header */}
                <div className="text-center space-y-4 mb-12 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Code size={12} /> Developer Tools
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Design Token Generator</h1>
                    <p className="text-lg text-gray-500">Export your color palette to semantic definitions for Web, iOS, and Android.</p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Controls Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Settings2 size={16} /> Configuration
                            </h3>

                            {/* Format Selection */}
                            <div className="space-y-4 mb-8">
                                <label className="text-xs font-bold text-gray-400 uppercase">Export Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'css', label: 'CSS Variables', icon: FileCode },
                                        { id: 'scss', label: 'SCSS / Sass', icon: FileCode },
                                        { id: 'json', label: 'JSON Tokens', icon: FileJson },
                                        { id: 'swift', label: 'Swift (iOS)', icon: Smartphone },
                                        { id: 'android', label: 'Android XML', icon: Terminal },
                                    ].map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => {
                                                setFormat(f.id as ExportFormat);
                                                // Auto-switch case style based on common functionality
                                                if (f.id === 'swift') setCaseStyle('camel');
                                                if (f.id === 'android') setCaseStyle('snake');
                                                if (f.id === 'css') setCaseStyle('kebab');
                                            }}
                                            className={clsx(
                                                "flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all",
                                                format === f.id
                                                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                                                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                            )}
                                        >
                                            <f.icon size={16} />
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Naming Conventions */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-400 uppercase">Naming Rules</label>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Token Prefix</label>
                                    <input
                                        type="text"
                                        value={prefix}
                                        onChange={(e) => setPrefix(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. brand, ui, theme"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Case Style</label>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        {(['kebab', 'camel', 'snake', 'pascal'] as const).map(style => (
                                            <button
                                                key={style}
                                                onClick={() => setCaseStyle(style)}
                                                className={clsx(
                                                    "flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all",
                                                    caseStyle === style ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                                                )}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Palette Preview (Mini) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Source Palette</h3>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((c, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full shadow-sm ring-1 ring-black/5" style={{ backgroundColor: c.hex }} title={c.hex} />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-4">
                                Generated from Global Palette State.
                            </p>
                        </div>
                    </div>

                    {/* Code Preview */}
                    <div className="lg:col-span-8">
                        <div className="bg-[#1e1e1e] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-800 flex flex-col h-[600px]">
                            {/* Editor Header */}
                            <div className="bg-[#2d2d2d] px-6 py-4 flex items-center justify-between border-b border-gray-700">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="text-xs font-mono text-gray-400">
                                    tokens.{format === 'android' ? 'xml' : format}
                                </div>
                                <button
                                    onClick={copyCode}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-bold transition-colors"
                                >
                                    <Copy size={14} /> Copy
                                </button>
                            </div>

                            {/* Code Area */}
                            <div className="flex-1 p-6 overflow-auto custom-scrollbar">
                                <pre className="font-mono text-sm text-gray-300 leading-relaxed">
                                    <code>{code}</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                </div>
                <DesignTokensGuide />
            </div>
        </DashboardLayout>
    );
}
