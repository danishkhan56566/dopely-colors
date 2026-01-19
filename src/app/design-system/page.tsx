'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HexColorPicker } from 'react-colorful';
import {
    Layout,
    Type,
    Palette,
    Box,
    Code,
    Copy,
    Check,
    ChevronRight,
    Bell,
    Search,
    User,
    Settings,
    Menu,
    Plus
} from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

// --- Types ---
type SystemConfig = {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
    };
    typography: {
        family: 'inter' | 'roboto' | 'serif' | 'mono';
        scale: 'sm' | 'md' | 'lg';
    };
    radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    spacing: 'compact' | 'comfortable' | 'spacious';
};

const DEFAULT_CONFIG: SystemConfig = {
    colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#0f172a',
    },
    typography: {
        family: 'inter',
        scale: 'md',
    },
    radius: 'md',
    spacing: 'comfortable',
};

// --- Main Page ---
export default function DesignSystemBuilderPage() {
    const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
    const [activeTab, setActiveTab] = useState<'build' | 'export'>('build');
    const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'shape'>('colors');

    // Generate CSS Variables for the preview wrapper
    const previewStyles = useMemo(() => {
        const radiusMap = { none: '0px', sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' };
        const spacingMap = { compact: '0.75', comfortable: '1', spacious: '1.25' };
        const fontMap = {
            inter: 'Inter, sans-serif',
            roboto: 'Roboto, sans-serif',
            serif: 'Georgia, serif',
            mono: 'monospace'
        };
        const scaleMap = { sm: 0.875, md: 1, lg: 1.125 };

        return {
            '--ds-primary': config.colors.primary,
            '--ds-secondary': config.colors.secondary,
            '--ds-bg': config.colors.background,
            '--ds-surface': config.colors.surface,
            '--ds-text': config.colors.text,
            '--ds-radius': radiusMap[config.radius],
            '--ds-spacing': spacingMap[config.spacing],
            '--ds-font': fontMap[config.typography.family],
            '--ds-scale': scaleMap[config.typography.scale],
        } as React.CSSProperties;
    }, [config]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">

                {/* Sidebar Controls */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto shrink-0">
                    <div className="p-6 border-b border-gray-100">
                        <h1 className="text-xl font-bold text-gray-900">Design System</h1>
                        <p className="text-xs text-gray-500 mt-1">Define your tokens</p>
                    </div>

                    <div className="flex-1 p-6 space-y-8">

                        {/* Section Selection */}
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
                            {(['colors', 'typography', 'shape'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setActiveSection(s)}
                                    className={clsx(
                                        "flex-1 py-2 rounded-md text-xs font-bold capitalize transition-all",
                                        activeSection === s ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {activeSection === 'colors' && (
                            <div className="space-y-6">
                                <ColorControl
                                    label="Primary"
                                    color={config.colors.primary}
                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, primary: c } })}
                                />
                                <ColorControl
                                    label="Secondary"
                                    color={config.colors.secondary}
                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, secondary: c } })}
                                />
                                <ColorControl
                                    label="Background"
                                    color={config.colors.background}
                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, background: c } })}
                                />
                                <ColorControl
                                    label="Surface"
                                    color={config.colors.surface}
                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, surface: c } })}
                                />
                                <ColorControl
                                    label="Text"
                                    color={config.colors.text}
                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, text: c } })}
                                />
                            </div>
                        )}

                        {activeSection === 'typography' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Font Family</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['inter', 'roboto', 'serif', 'mono'] as const).map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setConfig({ ...config, typography: { ...config.typography, family: f } })}
                                                className={clsx(
                                                    "px-3 py-2 text-sm border rounded-lg capitalize transition-colors",
                                                    config.typography.family === f ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Base Size</label>
                                    <div className="flex gap-2">
                                        {(['sm', 'md', 'lg'] as const).map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setConfig({ ...config, typography: { ...config.typography, scale: s } })}
                                                className={clsx(
                                                    "flex-1 px-3 py-2 text-sm border rounded-lg capitalize transition-colors",
                                                    config.typography.scale === s ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                {s === 'sm' ? 'Compact' : s === 'md' ? 'Normal' : 'Large'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'shape' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Border Radius</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['none', 'sm', 'md', 'lg', 'full'] as const).map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setConfig({ ...config, radius: r })}
                                                className={clsx(
                                                    "px-3 py-2 text-sm border rounded-lg capitalize transition-colors",
                                                    config.radius === r ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Spacing Density</label>
                                    <div className="flex gap-2">
                                        {(['compact', 'comfortable', 'spacious'] as const).map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setConfig({ ...config, spacing: s })}
                                                className={clsx(
                                                    "flex-1 px-3 py-2 text-sm border rounded-lg capitalize transition-colors",
                                                    config.spacing === s ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setActiveTab('export')}
                                className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                <Code size={18} /> Export Tokens
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Preview Area */}
                <div className="flex-1 overflow-y-auto p-8 relative" style={previewStyles}>
                    {activeTab === 'build' ? (
                        <div className="max-w-5xl mx-auto space-y-12 pb-20">

                            {/* Hero Section of Preview */}
                            <div className="text-center space-y-4">
                                <h2
                                    className="text-4xl font-bold"
                                    style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)' }}
                                >
                                    Component Library
                                </h2>
                                <p style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)', opacity: 0.6 }}>
                                    Live preview of your design system foundation.
                                </p>
                            </div>

                            {/* Component Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                                {/* Buttons Card */}
                                <PreviewCard title="Actions">
                                    <div className="space-y-4">
                                        <DSButton variant="primary">Primary Button</DSButton>
                                        <DSButton variant="secondary">Secondary Button</DSButton>
                                        <DSButton variant="ghost">Ghost Button</DSButton>
                                        <div className="flex gap-2">
                                            <DSButton variant="primary" icon><Plus size={18} /></DSButton>
                                            <DSButton variant="secondary" icon><Settings size={18} /></DSButton>
                                            <DSButton variant="ghost" icon><Menu size={18} /></DSButton>
                                        </div>
                                    </div>
                                </PreviewCard>

                                {/* Form Inputs Card */}
                                <PreviewCard title="Forms">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)', opacity: 0.5 }}>Label</label>
                                            <DSInput placeholder="Enter value..." />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: 'var(--ds-primary)' }} defaultChecked />
                                            <span style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)', fontSize: '0.875rem' }}>Remember me</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-6 rounded-full relative transition-colors" style={{ backgroundColor: 'var(--ds-primary)', borderRadius: '99px' }}>
                                                <div className="absolute top-1 left-5 w-4 h-4 bg-white rounded-full shadow-sm" />
                                            </div>
                                            <span style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)', fontSize: '0.875rem' }}>Toggle</span>
                                        </div>
                                    </div>
                                </PreviewCard>

                                {/* Cards & Feedback */}
                                <PreviewCard title="Feedback & Layout">
                                    <div className="space-y-4">
                                        <div
                                            className="p-3 rounded border flex items-center gap-3"
                                            style={{
                                                backgroundColor: 'color-mix(in srgb, var(--ds-primary) 10%, transparent)',
                                                color: 'var(--ds-primary)',
                                                borderRadius: 'var(--ds-radius)',
                                                borderColor: 'transparent',
                                            }}
                                        >
                                            <Bell size={18} />
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>System alert message</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 text-xs font-bold rounded" style={{ backgroundColor: 'var(--ds-primary)', color: 'white', borderRadius: 'var(--ds-radius)' }}>NEW</span>
                                            <span className="px-2 py-1 text-xs font-bold rounded" style={{ backgroundColor: 'var(--ds-secondary)', color: 'white', borderRadius: 'var(--ds-radius)' }}>BETA</span>
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden" style={{ borderRadius: 'var(--ds-radius)' }}>
                                                <User size={20} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold" style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)' }}>User Name</div>
                                                <div className="text-xs opacity-50" style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)' }}>Administrator</div>
                                            </div>
                                        </div>
                                    </div>
                                </PreviewCard>
                            </div>

                            {/* Expanded Preview (Dashboard) */}
                            <div className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--ds-surface)', borderRadius: 'calc(var(--ds-radius) * 2)' }}>
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                    <div className="font-bold flex items-center gap-2" style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)' }}>
                                        <Layout size={18} /> Dashboard Preview
                                    </div>
                                    <DSButton variant="primary"><Plus size={16} /> New Item</DSButton>
                                </div>
                                <div className="p-8 grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div
                                            key={i}
                                            className="p-6 border border-gray-100 rounded-xl space-y-3"
                                            style={{ borderRadius: 'var(--ds-radius)', backgroundColor: 'var(--ds-bg)' }}
                                        >
                                            <div className="w-8 h-8 rounded mb-2 opacity-20" style={{ backgroundColor: 'var(--ds-primary)', borderRadius: 'var(--ds-radius)' }} />
                                            <div className="h-4 w-24 rounded opacity-10" style={{ backgroundColor: 'var(--ds-text)' }} />
                                            <div className="h-3 w-32 rounded opacity-5" style={{ backgroundColor: 'var(--ds-text)' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto pt-10">
                            <button onClick={() => setActiveTab('build')} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
                                <ChevronRight className="rotate-180" size={16} /> Back to Builder
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Export Configuration</h2>
                            <div className="space-y-8">
                                <ExportBlock
                                    title="CSS Variables (root)"
                                    code={`:root { \n  --primary: ${config.colors.primary};\n  --secondary: ${config.colors.secondary};\n  --bg: ${config.colors.background};\n  --surface: ${config.colors.surface};\n  --text: ${config.colors.text};\n  --radius: ${(previewStyles as any)['--ds-radius']};\n  --font-family: ${(previewStyles as any)['--ds-font']};\n}`}
                                    onCopy={() => handleCopy(`:root { \n  --primary: ${config.colors.primary};\n  --secondary: ${config.colors.secondary};\n  --bg: ${config.colors.background};\n  --surface: ${config.colors.surface};\n  --text: ${config.colors.text};\n  --radius: ${(previewStyles as any)['--ds-radius']};\n  --font-family: ${(previewStyles as any)['--ds-font']};\n}`)}
                                />
                                <ExportBlock
                                    title="Tailwind Config (theme.extend)"
                                    code={`colors: {\n  primary: '${config.colors.primary}',\n  secondary: '${config.colors.secondary}',\n  background: '${config.colors.background}',\n  surface: '${config.colors.surface}',\n  text: '${config.colors.text}',\n},\nborderRadius: {\n  DEFAULT: '${(previewStyles as any)['--ds-radius']}',\n},`}
                                    onCopy={() => handleCopy(`colors: {\n  primary: '${config.colors.primary}',\n  secondary: '${config.colors.secondary}',\n  background: '${config.colors.background}',\n  surface: '${config.colors.surface}',\n  text: '${config.colors.text}',\n},\nborderRadius: {\n  DEFAULT: '${(previewStyles as any)['--ds-radius']}',\n},`)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

// --- Sub-Components ---

function ColorControl({ label, color, onChange }: { label: string, color: string, onChange: (c: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400 uppercase">{color}</span>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-6 h-6 rounded border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                    />
                </div>
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-2">
                    <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
                    <div className="relative z-10 custom-picker-wrapper shadow-xl rounded-xl overflow-hidden bg-white p-2 border border-gray-100">
                        <HexColorPicker color={color} onChange={onChange} />
                    </div>
                </div>
            )}
        </div>
    );
}

function PreviewCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div
            className="p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4"
            style={{
                backgroundColor: 'var(--ds-surface)',
                borderRadius: 'var(--ds-radius)',
                color: 'var(--ds-text)'
            }}
        >
            <h3 className="text-sm font-bold opacity-40 uppercase tracking-widest">{title}</h3>
            {children}
        </div>
    );
}

function DSButton({ children, variant, icon }: { children: React.ReactNode, variant: 'primary' | 'secondary' | 'ghost', icon?: boolean }) {
    return (
        <button
            className={clsx(
                "font-medium transition-all active:scale-95 flex items-center justify-center gap-2",
                icon ? "p-2 aspect-square" : "px-4 py-2 w-full"
            )}
            style={{
                backgroundColor: variant === 'primary' ? 'var(--ds-primary)' : variant === 'secondary' ? 'var(--ds-secondary)' : 'transparent',
                color: variant === 'ghost' ? 'var(--ds-text)' : '#ffffff',
                borderRadius: 'var(--ds-radius)',
                border: variant === 'ghost' ? '1px solid transparent' : 'none',
                fontFamily: 'var(--ds-font)',
                fontSize: '0.875rem',
                opacity: variant === 'ghost' ? 0.7 : 1,
            }}
        >
            {children}
        </button>
    );
}

function DSInput({ placeholder }: { placeholder: string }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className="w-full px-4 py-2 border outline-none transition-all placeholder:opacity-40"
            style={{
                backgroundColor: 'var(--ds-bg)',
                borderColor: 'var(--ds-secondary)', // Using secondary as border for now
                borderRadius: 'var(--ds-radius)',
                color: 'var(--ds-text)',
                fontFamily: 'var(--ds-font)',
                fontSize: '0.875rem',
            }}
        />
    )
}

const ExportBlock = ({ title, code, onCopy }: { title: string, code: string, onCopy: () => void }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
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
