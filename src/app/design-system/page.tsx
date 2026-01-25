'use client';

import { useState, useMemo, useEffect } from 'react';
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
    Plus,
    Component,
    Layers,
    Move3d,
    Sparkles,
    BarChart3,
    Compass,
    Play,
    Image as ImageIcon,
    Moon,
    Sun
} from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignSystemGuide } from '@/components/content/PageGuides';
import { DesignSystemFAQ, DesignSystemHowTo } from '@/components/content/PageFAQs';

// --- Types ---
type SystemConfig = {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        success: string;
        warning: string;
        error: string;
        info: string;
    };
    typography: {
        headingFamily: 'inter' | 'roboto' | 'serif' | 'mono';
        bodyFamily: 'inter' | 'roboto' | 'serif' | 'mono';
        scale: 'sm' | 'md' | 'lg';
        weight: 'regular' | 'medium' | 'bold';
    };
    radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    spacing: 'compact' | 'comfortable' | 'spacious';
    effects: {
        shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
        blur: 'none' | 'sm' | 'md' | 'lg';
    };
};

const DEFAULT_CONFIG: SystemConfig = {
    colors: {
        primary: '#6366f1',
        secondary: '#0f172a',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#0f172a',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
    },
    typography: {
        headingFamily: 'inter',
        bodyFamily: 'inter',
        scale: 'md',
        weight: 'regular',
    },
    radius: 'lg',
    spacing: 'comfortable',
    effects: {
        shadow: 'md',
        blur: 'none',
    },
};

// --- Main Page ---
export default function DesignSystemBuilderPage() {
    const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
    const [activeTab, setActiveTab] = useState<'build' | 'export'>('build');
    const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'effects'>('colors');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Apply simulation styles to the preview container
    const previewContainerStyles = useMemo(() => {
        return {
            backgroundColor: isDarkMode ? '#0f172a' : 'rgba(248, 250, 252, 0.5)',
            color: isDarkMode ? '#f8fafc' : undefined,
            transition: 'background-color 0.3s ease, color 0.3s ease',
        } as React.CSSProperties;
    }, [isDarkMode]);

    // Generate CSS Variables for the preview wrapper
    // Generate CSS Variables for the preview wrapper
    const previewStyles = useMemo(() => {
        const radiusMap = { none: '0px', sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' };
        const spacingMap = { compact: '0.75', comfortable: '1', spacious: '1.25' };
        const fontMap = {
            inter: 'Inter, sans-serif',
            roboto: 'Roboto, sans-serif',
            serif: 'Georgia, serif',
            mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
        };
        const scaleMap = { sm: 0.875, md: 1, lg: 1.125 };
        const shadowMap = {
            none: 'none',
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
        };
        const blurMap = { none: '0', sm: '4px', md: '8px', lg: '12px' };

        return {
            '--ds-primary': config.colors.primary,
            '--ds-secondary': config.colors.secondary,
            '--ds-bg': config.colors.background,
            '--ds-surface': config.colors.surface,
            '--ds-text': config.colors.text,
            '--ds-success': config.colors.success,
            '--ds-warning': config.colors.warning,
            '--ds-error': config.colors.error,
            '--ds-info': config.colors.info,
            '--ds-radius': radiusMap[config.radius],
            '--ds-spacing': spacingMap[config.spacing],
            '--ds-font-heading': fontMap[config.typography.headingFamily],
            '--ds-font-body': fontMap[config.typography.bodyFamily],
            '--ds-scale': scaleMap[config.typography.scale],
            '--ds-shadow': shadowMap[config.effects.shadow],
            '--ds-blur': blurMap[config.effects.blur],
        } as React.CSSProperties;
    }, [config]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50/50 backdrop-blur-sm">

                {/* Immersive Background */}
                <div className="fixed inset-0 pointer-events-none -z-10 bg-[#f8fafc]">
                    {/* Dot Pattern */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)'
                    }} />

                    {/* Floating Orbs */}
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/30 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-300/30 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-2000" />
                    <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000" />
                </div>

                {/* Sidebar Controls */}
                {/* Sidebar Controls */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-[340px] bg-white/80 backdrop-blur-2xl border-r border-black/5 flex flex-col overflow-y-auto shrink-0 z-20 shadow-2xl shadow-indigo-900/10 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                    <div className="p-6 border-b border-black/5 relative z-10 bg-white/40">
                        <div className="flex items-center justify-between mb-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/50 border border-indigo-100/50 rounded-full shadow-sm">
                                <Sparkles size={10} className="text-indigo-600 fill-indigo-600" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-900/80">Builder</span>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Design System</h1>
                    </div>

                    <div className="flex-1 p-5 space-y-6 relative z-10">

                        {/* Section Selection */}
                        <div className="flex gap-1 p-1.5 bg-gray-100/50 rounded-2xl mb-6 ring-1 ring-black/5 backdrop-blur-sm">
                            {(['colors', 'typography', 'effects'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setActiveSection(s as any)}
                                    className={clsx(
                                        "flex-1 py-3 rounded-xl text-[11px] font-bold capitalize transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden",
                                        activeSection === s
                                            ? "bg-white shadow-lg shadow-indigo-500/10 text-indigo-950 ring-1 ring-black/5 scale-100"
                                            : "text-gray-400 hover:text-gray-600 hover:bg-white/50 scale-95"
                                    )}
                                >
                                    {activeSection === s && (
                                        <motion.div layoutId="activeTab" className="absolute inset-0 bg-indigo-50/10" transition={{ duration: 0.3 }} />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {s === 'colors' && <Palette size={14} />}
                                        {s === 'typography' && <Type size={14} />}
                                        {s === 'effects' && <Layers size={14} />}
                                        {s}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                {activeSection === 'colors' && (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Brand Colors</h3>
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
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Base Colors</h3>
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
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Semantic Colors</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <ColorControl
                                                    label="Success"
                                                    color={config.colors.success}
                                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, success: c } })}
                                                />
                                                <ColorControl
                                                    label="Warning"
                                                    color={config.colors.warning}
                                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, warning: c } })}
                                                />
                                                <ColorControl
                                                    label="Error"
                                                    color={config.colors.error}
                                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, error: c } })}
                                                />
                                                <ColorControl
                                                    label="Info"
                                                    color={config.colors.info}
                                                    onChange={(c) => setConfig({ ...config, colors: { ...config.colors, info: c } })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'typography' && (
                                    <div className="space-y-8">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4 ml-1">Heading Family</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(['inter', 'roboto', 'serif', 'mono'] as const).map(f => (
                                                    <button
                                                        key={f}
                                                        onClick={() => setConfig({ ...config, typography: { ...config.typography, headingFamily: f } })}
                                                        className={clsx(
                                                            "px-4 py-3 text-sm border-2 rounded-xl capitalize transition-all duration-200",
                                                            config.typography.headingFamily === f
                                                                ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold shadow-sm"
                                                                : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 font-medium"
                                                        )}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4 ml-1">Body Family</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(['inter', 'roboto', 'serif', 'mono'] as const).map(f => (
                                                    <button
                                                        key={f}
                                                        onClick={() => setConfig({ ...config, typography: { ...config.typography, bodyFamily: f } })}
                                                        className={clsx(
                                                            "px-4 py-3 text-sm border-2 rounded-xl capitalize transition-all duration-200",
                                                            config.typography.bodyFamily === f
                                                                ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold shadow-sm"
                                                                : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 font-medium"
                                                        )}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4 ml-1">Base Size</label>
                                            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                                {(['sm', 'md', 'lg'] as const).map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setConfig({ ...config, typography: { ...config.typography, scale: s } })}
                                                        className={clsx(
                                                            "flex-1 px-3 py-2 text-xs font-bold border rounded-lg capitalize transition-all",
                                                            config.typography.scale === s
                                                                ? "border-black/5 bg-white text-black shadow-sm"
                                                                : "border-transparent text-gray-400 hover:text-gray-600"
                                                        )}
                                                    >
                                                        {s === 'sm' ? 'Compact' : s === 'md' ? 'Normal' : 'Large'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(activeSection === 'effects') && (
                                    <div className="space-y-8">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4 ml-1">Border Radius</label>
                                            <div className="flex flex-wrap gap-3">
                                                {(['none', 'sm', 'md', 'lg', 'full'] as const).map(r => (
                                                    <button
                                                        key={r}
                                                        onClick={() => setConfig({ ...config, radius: r })}
                                                        className={clsx(
                                                            "flex-1 min-w-[3rem] py-3 text-sm border-2 rounded-xl capitalize transition-all",
                                                            config.radius === r
                                                                ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold"
                                                                : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 font-medium"
                                                        )}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4 ml-1">Spacing</label>
                                            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                                {(['compact', 'comfortable', 'spacious'] as const).map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setConfig({ ...config, spacing: s })}
                                                        className={clsx(
                                                            "flex-1 px-3 py-2 text-xs font-bold border rounded-lg capitalize transition-all",
                                                            config.spacing === s
                                                                ? "border-black/5 bg-white text-black shadow-sm"
                                                                : "border-transparent text-gray-400 hover:text-gray-600"
                                                        )}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4 ml-1">Shadow Depth</label>
                                            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                                {(['none', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setConfig({ ...config, effects: { ...config.effects, shadow: s } })}
                                                        className={clsx(
                                                            "flex-1 px-3 py-2 text-xs font-bold border rounded-lg capitalize transition-all",
                                                            config.effects.shadow === s
                                                                ? "border-black/5 bg-white text-black shadow-sm"
                                                                : "border-transparent text-gray-400 hover:text-gray-600"
                                                        )}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="pt-8 mt-auto border-t border-black/5 relative z-10">
                            <button
                                onClick={() => setActiveTab('export')}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                <Code size={20} className="text-indigo-400 group-hover:text-white transition-colors" />
                                <span className="relative z-10">Export Tokens</span>
                            </button>
                        </div>
                    </div>
                </motion.div>



                {/* Main Preview Area */}
                <div
                    className="flex-1 overflow-y-auto relative custom-scrollbar z-10 transition-colors duration-300"
                    style={previewContainerStyles}
                >

                    {/* Floating Toolbar */}
                    {/* Floating Toolbar */}
                    <div className="sticky top-6 z-50 flex justify-center mb-[-60px] pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-xl border border-black/5 shadow-lg rounded-full px-2 p-1.5 flex items-center gap-1 pointer-events-auto ring-1 ring-black/5 scale-90 hover:scale-100 transition-transform">
                            <button
                                onClick={() => toast.info('Desktop View Active')}
                                className="p-2 hover:bg-black/5 rounded-full text-indigo-600 bg-indigo-50 transition-colors"
                                title="Desktop"
                            >
                                <Layout size={16} />
                            </button>
                            <div className="w-px h-4 bg-black/10 mx-1" />
                            <button
                                onClick={() => {
                                    setIsDarkMode(!isDarkMode);
                                    toast.success(isDarkMode ? 'Light Mode Active' : 'Dark Mode Active');
                                }}
                                className="p-2 hover:bg-black/5 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                                title="Toggle Theme"
                            >
                                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <button
                                onClick={() => {
                                    toast.success('View Reset');
                                }}
                                className="p-2 hover:bg-black/5 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                                title="Reset View"
                            >
                                <Move3d size={16} />
                            </button>
                            <div className="w-px h-4 bg-black/10 mx-1" />
                            <span className="text-[10px] font-bold px-2 text-gray-400 tabular-nums">100%</span>
                        </div>
                    </div>

                    <div className="relative min-h-full" style={previewStyles}>
                        {activeTab === 'build' ? (
                            <div className="min-h-full p-8 md:p-12 pb-32">
                                <div className="max-w-6xl mx-auto space-y-12">

                                    {/* Hero Section of Preview */}
                                    <div className="space-y-2 mb-12">
                                        <div className="flex items-center gap-3 mb-4 opacity-60">
                                            <Layout size={20} style={{ color: 'var(--ds-primary)' }} />
                                            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--ds-text)', fontFamily: 'var(--ds-font)' }}>Live Preview</span>
                                        </div>
                                        <h2
                                            className="text-5xl md:text-6xl font-black tracking-tight"
                                            style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)' }}
                                        >
                                            Component Library
                                        </h2>
                                        <p className="text-xl max-w-2xl" style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)', opacity: 0.6 }}>
                                            Real-time preview of your generated design system foundation. Adjust tokens in the sidebar to see instant updates.
                                        </p>
                                    </div>

                                    {/* Component Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                                        {/* Buttons Card */}
                                        <PreviewCard title="Actions & Buttons" icon={<Move3d size={18} />}>
                                            <div className="space-y-4">
                                                <DSButton variant="primary">Primary Action</DSButton>
                                                <DSButton variant="secondary">Secondary Action</DSButton>
                                                <DSButton variant="ghost">Tertiary / Ghost</DSButton>
                                                <div className="flex gap-3 pt-2">
                                                    <DSButton variant="primary" icon><Plus size={20} /></DSButton>
                                                    <DSButton variant="secondary" icon><Settings size={20} /></DSButton>
                                                    <DSButton variant="ghost" icon><Menu size={20} /></DSButton>
                                                </div>
                                            </div>
                                        </PreviewCard>

                                        {/* Form Inputs Card */}
                                        <PreviewCard title="Inputs & Data" icon={<Component size={18} />}>
                                            <div className="space-y-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1" style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)', opacity: 0.5 }}>Label Name</label>
                                                    <DSInput placeholder="Enter value..." />
                                                </div>
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/5">
                                                    <input type="checkbox" className="w-5 h-5 rounded cursor-pointer" style={{ accentColor: 'var(--ds-primary)' }} defaultChecked />
                                                    <span style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)', fontSize: '0.875rem', fontWeight: 500 }}>Remember preferences</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span style={{ fontFamily: 'var(--ds-font)', color: 'var(--ds-text)', fontSize: '0.875rem', fontWeight: 500 }}>Notifications</span>
                                                    <div className="w-11 h-6 rounded-full relative transition-colors cursor-pointer" style={{ backgroundColor: 'var(--ds-primary)', borderRadius: '99px' }}>
                                                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </PreviewCard>

                                        {/* Cards & Feedback */}
                                        <PreviewCard title="Feedback & Content" icon={<Layers size={18} />}>
                                            <div className="space-y-4">
                                                <DSAlert variant="success" title="System Update">
                                                    Your new design tokens have been applied successfully.
                                                </DSAlert>
                                                <DSAlert variant="warning" title="Maintenance Mode">
                                                    Scheduled maintenance in 2 hours.
                                                </DSAlert>

                                                <div className="flex gap-2">
                                                    <DSBadge variant="success">Active</DSBadge>
                                                    <DSBadge variant="warning">Pending</DSBadge>
                                                    <DSBadge variant="error">Failed</DSBadge>
                                                    <DSBadge variant="primary">New</DSBadge>
                                                </div>

                                                <div className="flex items-center gap-4 pt-3 border-t border-black/5">
                                                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0" style={{ borderRadius: 'var(--ds-radius)' }}>
                                                        <User size={20} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold" style={{ fontFamily: 'var(--ds-font-heading)', color: 'var(--ds-text)' }}>User Name</div>
                                                        <div className="text-xs opacity-50 font-medium" style={{ fontFamily: 'var(--ds-font-body)', color: 'var(--ds-text)' }}>Administrator</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </PreviewCard>
                                    </div>

                                    {/* Expanded Preview (Dashboard) */}
                                    <div className="relative isolate overflow-hidden shadow-2xl ring-1 ring-black/5" style={{ borderRadius: 'calc(var(--ds-radius) * 2)', height: '700px' }}>
                                        <div className="flex h-full">

                                            {/* Sidebar - Dark Theme Fixed */}
                                            <div className="w-64 flex-col gap-1 hidden md:flex bg-[#111827] text-white p-4 border-r border-white/5">
                                                <div className="h-10 flex items-center gap-3 px-2 mb-6 cursor-pointer">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                                        <Layers size={18} className="text-white" />
                                                    </div>
                                                    <span className="font-bold text-lg tracking-tight">NexusAdmin</span>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="px-3 py-2 rounded-lg bg-white/10 text-white font-medium text-sm flex items-center gap-3 cursor-pointer">
                                                        <Layout size={16} /> Dashboard
                                                    </div>
                                                    <div className="px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white font-medium text-sm flex items-center gap-3 cursor-pointer transition-colors">
                                                        <BarChart3 size={16} /> Analytics
                                                    </div>
                                                    <div className="px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white font-medium text-sm flex items-center gap-3 cursor-pointer transition-colors">
                                                        <User size={16} /> Customers
                                                    </div>
                                                    <div className="px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white font-medium text-sm flex items-center gap-3 cursor-pointer transition-colors">
                                                        <Component size={16} /> Products
                                                    </div>
                                                    <div className="px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white font-medium text-sm flex items-center gap-3 cursor-pointer transition-colors">
                                                        <Settings size={16} /> Settings
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-white/5">
                                                    <div className="flex items-center gap-3 px-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 p-[1px]">
                                                            <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center">
                                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-6 h-6 rounded-full" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-white truncate">Alex Designer</div>
                                                            <div className="text-xs text-gray-500 truncate">Pro Plan</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Main Content Area */}
                                            <div className="flex-1 flex flex-col min-w-0 bg-white/50 backdrop-blur-sm" style={{ backgroundColor: 'var(--ds-surface)' }}>

                                                {/* Header */}
                                                <div className="h-16 border-b border-black/5 flex items-center justify-between px-6 bg-white/40 backdrop-blur-md sticky top-0 z-10">
                                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--ds-text)', opacity: 0.6 }}>
                                                        <span>Home</span>
                                                        <ChevronRight size={14} />
                                                        <span style={{ color: 'var(--ds-text)', opacity: 1, fontWeight: 600 }}>Overview</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center cursor-pointer transition-colors" style={{ color: 'var(--ds-text)' }}>
                                                            <Search size={18} />
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center cursor-pointer transition-colors relative" style={{ color: 'var(--ds-text)' }}>
                                                            <Bell size={18} />
                                                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dashboard Content */}
                                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                                    <div className="flex items-end justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: 'var(--ds-font-heading)', color: 'var(--ds-text)' }}>Performance</h3>
                                                            <p className="text-sm opacity-60" style={{ fontFamily: 'var(--ds-font-body)', color: 'var(--ds-text)' }}>Tuesday, Oct 24th</p>
                                                        </div>
                                                        <DSButton variant="primary" icon><Plus size={16} /> New Report</DSButton>
                                                    </div>

                                                    {/* Stats Grid */}
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        {[{ label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up' }, { label: 'Active Users', value: '2,350', change: '+180.1%', trend: 'up' }, { label: 'Bounce Rate', value: '12.5%', change: '-4.3%', trend: 'down' }].map((stat, i) => (
                                                            <div key={i} className="p-5 rounded-2xl border border-black/5 shadow-sm bg-white/60 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300" style={{ borderRadius: 'var(--ds-radius)' }}>
                                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--ds-primary)' }}>
                                                                    <BarChart3 size={64} />
                                                                </div>
                                                                <div className="text-sm font-medium opacity-60 mb-2" style={{ fontFamily: 'var(--ds-font-heading)', color: 'var(--ds-text)' }}>{stat.label}</div>
                                                                <div className="text-3xl font-black mb-3" style={{ fontFamily: 'var(--ds-font-body)', color: 'var(--ds-text)' }}>{stat.value}</div>
                                                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                                    {stat.change} from last month
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-64">
                                                        {/* Main Chart Area */}
                                                        <div className="lg:col-span-2 p-6 rounded-2xl border border-black/5 shadow-sm bg-white/60 flex flex-col" style={{ borderRadius: 'var(--ds-radius)' }}>
                                                            <div className="flex items-center justify-between mb-6">
                                                                <div className="font-bold" style={{ color: 'var(--ds-text)' }}>Usage Trends</div>
                                                                <div className="flex gap-2">
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--ds-primary)' }} />
                                                                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between gap-2 px-2">
                                                                {[40, 70, 45, 90, 65, 85, 55, 75, 60, 95, 80, 50].map((h, i) => (
                                                                    <div key={i} className="w-full bg-black/5 rounded-t-sm relative group h-full">
                                                                        <motion.div
                                                                            initial={{ height: 0 }}
                                                                            whileInView={{ height: `${h}%` }}
                                                                            className="absolute bottom-0 left-0 right-0 rounded-t-sm transition-opacity hover:opacity-80"
                                                                            style={{ backgroundColor: 'var(--ds-primary)', borderRadius: 'calc(var(--ds-radius) / 2)' }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Recent Sales/Activity */}
                                                        <div className="p-6 rounded-2xl border border-black/5 shadow-sm bg-white/60 flex flex-col" style={{ borderRadius: 'var(--ds-radius)' }}>
                                                            <div className="font-bold mb-4" style={{ color: 'var(--ds-text)' }}>Recent Sales</div>
                                                            <div className="space-y-4 overflow-y-auto custom-scrollbar">
                                                                {[1, 2, 3].map((_, i) => (
                                                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors">
                                                                        <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center font-bold text-xs" style={{ color: 'var(--ds-text)' }}>
                                                                            OM
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="text-sm font-bold truncate" style={{ color: 'var(--ds-text)' }}>Olivia Martin</div>
                                                                            <div className="text-xs opacity-50 truncate" style={{ color: 'var(--ds-text)' }}>olivia.martin@email.com</div>
                                                                        </div>
                                                                        <div className="font-bold text-sm" style={{ color: 'var(--ds-text)' }}>+$1,999.00</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto pt-20 px-8">
                                <button onClick={() => setActiveTab('build')} className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 group">
                                    <div className="p-1 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors"><ChevronRight className="rotate-180" size={14} /></div>
                                    Back to Builder
                                </button>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                                        <Code size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900">Export Configuration</h2>
                                </div>
                                <p className="text-gray-500 text-lg mb-10 max-w-2xl">Use these tokens to instantly apply your design system across your entire application.</p>

                                <div className="space-y-10 pb-20">
                                    <ExportBlock
                                        title="CSS Variables (:root)"
                                        code={`:root {
  /* Brand */
  --primary: ${config.colors.primary};
  --secondary: ${config.colors.secondary};
  
  /* Base */
  --bg: ${config.colors.background};
  --surface: ${config.colors.surface};
  --text: ${config.colors.text};

  /* Semantics */
  --success: ${config.colors.success};
  --warning: ${config.colors.warning};
  --error: ${config.colors.error};
  --info: ${config.colors.info};

  /* Typography */
  --font-heading: ${(previewStyles as any)['--ds-font-heading']};
  --font-body: ${(previewStyles as any)['--ds-font-body']};
  
  /* Shapes & Effects */
  --radius: ${(previewStyles as any)['--ds-radius']};
  --shadow: ${(previewStyles as any)['--ds-shadow']};
  --blur: ${(previewStyles as any)['--ds-blur']};
}`}
                                        onCopy={() => handleCopy(`:root {
  /* Brand */
  --primary: ${config.colors.primary};
  --secondary: ${config.colors.secondary};
  
  /* Base */
  --bg: ${config.colors.background};
  --surface: ${config.colors.surface};
  --text: ${config.colors.text};

  /* Semantics */
  --success: ${config.colors.success};
  --warning: ${config.colors.warning};
  --error: ${config.colors.error};
  --info: ${config.colors.info};

  /* Typography */
  --font-heading: ${(previewStyles as any)['--ds-font-heading']};
  --font-body: ${(previewStyles as any)['--ds-font-body']};
  
  /* Shapes & Effects */
  --radius: ${(previewStyles as any)['--ds-radius']};
  --shadow: ${(previewStyles as any)['--ds-shadow']};
  --blur: ${(previewStyles as any)['--ds-blur']};
}`)}
                                    />
                                    <ExportBlock
                                        title="Tailwind Config (theme.extend)"
                                        code={`extend: {
  colors: {
    primary: '${config.colors.primary}',
    secondary: '${config.colors.secondary}',
    background: '${config.colors.background}',
    surface: '${config.colors.surface}',
    text: '${config.colors.text}',
    success: '${config.colors.success}',
    warning: '${config.colors.warning}',
    error: '${config.colors.error}',
    info: '${config.colors.info}',
  },
  borderRadius: {
    DEFAULT: '${(previewStyles as any)['--ds-radius']}',
  },
  fontFamily: {
    heading: ['${config.typography.headingFamily}', 'sans-serif'],
    body: ['${config.typography.bodyFamily}', 'sans-serif'],
  },
  boxShadow: {
    DEFAULT: '${(previewStyles as any)['--ds-shadow']}',
  }
}`}
                                        onCopy={() => handleCopy(`extend: {
  colors: {
    primary: '${config.colors.primary}',
    secondary: '${config.colors.secondary}',
    background: '${config.colors.background}',
    surface: '${config.colors.surface}',
    text: '${config.colors.text}',
    success: '${config.colors.success}',
    warning: '${config.colors.warning}',
    error: '${config.colors.error}',
    info: '${config.colors.info}',
  },
  borderRadius: {
    DEFAULT: '${(previewStyles as any)['--ds-radius']}',
  },
  fontFamily: {
    heading: ['${config.typography.headingFamily}', 'sans-serif'],
    body: ['${config.typography.bodyFamily}', 'sans-serif'],
  },
  boxShadow: {
    DEFAULT: '${(previewStyles as any)['--ds-shadow']}',
  }
}`)}
                                    />
                                </div>
                            </div>


                        )}
                    </div>
                </div>
            </div>

            <DesignSystemGuide />
            <DesignSystemFAQ />
            <DesignSystemHowTo />
        </DashboardLayout >
    );
}

// --- Sub-Components ---

const ColorControl = ({ label, color, onChange }: { label: string, color: string, onChange: (c: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`group relative ${isOpen ? 'z-50' : 'z-0'}`}>
            <div className="flex items-center justify-between group-hover:bg-white/50 p-2 -mx-2 rounded-xl transition-colors duration-200">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-indigo-500 transition-colors">{label}</label>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{color}</span>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-8 h-8 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.5)] border border-white transition-transform active:scale-90 hover:scale-110 ring-2 ring-transparent hover:ring-indigo-100"
                        style={{ backgroundColor: color }}
                    />
                </div>
            </div>
            {isOpen && (
                <div className="absolute right-0 top-full z-[100] mt-2">
                    <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative z-10 shadow-2xl rounded-2xl overflow-hidden bg-white p-2 border border-black/5 ring-4 ring-black/5"
                    >
                        <HexColorPicker color={color} onChange={onChange} />
                    </motion.div>
                </div>
            )}
        </div>
    );
}

const PreviewCard = ({ title, children, icon }: { title: string, children: React.ReactNode, icon: React.ReactNode }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2rem] border border-white/40 shadow-xl flex flex-col gap-6 relative overflow-hidden group backdrop-blur-md transition-all duration-300"
            style={{
                backgroundColor: 'color-mix(in srgb, var(--ds-surface) 80%, transparent)',
                borderRadius: 'var(--ds-radius)',
                color: 'var(--ds-text)',
                boxShadow: '0 20px 40px -12px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,0.2)'
            }}
        >
            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12">
                {/* Clone icon for background element */}
                <div style={{ scale: 4, transformOrigin: 'top right' }}>{icon}</div>
            </div>

            <h3 className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
                <span className="p-1.5 rounded-md bg-black/5 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">{icon}</span>
                {title}
            </h3>
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

function DSButton({ children, variant, icon }: { children: React.ReactNode, variant: 'primary' | 'secondary' | 'ghost', icon?: boolean }) {
    return (
        <button
            className={clsx(
                "font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02]",
                icon ? "p-3 aspect-square" : "px-6 py-3 w-full"
            )}
            style={{
                backgroundColor: variant === 'primary' ? 'var(--ds-primary)' : variant === 'secondary' ? 'var(--ds-secondary)' : 'transparent',
                color: variant === 'ghost' ? 'var(--ds-text)' : '#ffffff',
                borderRadius: 'var(--ds-radius)',
                border: variant === 'ghost' ? '1px solid transparent' : 'none',
                fontFamily: 'var(--ds-font)',
                fontSize: '0.875rem',
                opacity: variant === 'ghost' ? 0.6 : 1,
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
            className="w-full px-4 py-3 border outline-none transition-all placeholder:opacity-40 focus:ring-2 focus:ring-opacity-20 shadow-sm"
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

const ExportBlock = ({ title, code, onCopy }: { title: string, code: string, onCopy: () => void }) => {
    const [copied, setCopied] = useState(false);

    // Auto-reset copied state
    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [copied]);

    const handleCopyClick = () => {
        onCopy();
        setCopied(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden ring-1 ring-black/5 group shadow-2xl shadow-indigo-500/10"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
            }}
        >
            <div className="px-6 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 ring-1 ring-red-400/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20 ring-1 ring-amber-400/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/20 ring-1 ring-green-400/50" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 select-none">Config</span>
                    <span className="text-sm font-bold text-gray-700 mx-1">/</span>
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">{title}</h3>
                </div>
                <button
                    onClick={handleCopyClick}
                    className={clsx(
                        "text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2",
                        copied
                            ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-105"
                            : "bg-gray-900 text-white hover:bg-black hover:shadow-lg active:scale-95"
                    )}
                >
                    {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>
            <div className="relative group/code">
                <div className="absolute top-0 left-0 w-8 bottom-0 border-r border-white/10 bg-white/5 z-10 hidden sm:block" />
                <pre className="p-6 sm:pl-14 text-sm font-mono overflow-x-auto custom-scrollbar" style={{ backgroundColor: '#1e1e1e', color: '#e2e8f0' }}>
                    <code>{code}</code>
                </pre>
            </div>
        </motion.div>
    );
}

function DSAlert({ variant, title, children }: { variant: 'success' | 'warning' | 'error' | 'info', title: string, children: React.ReactNode }) {
    const iconMap = {
        success: <Check size={18} />,
        warning: <Bell size={18} />, // Using Bell as generic warning for now
        error: <Bell size={18} />,
        info: <Bell size={18} />
    };

    return (
        <div
            className="p-4 rounded border flex items-start gap-4"
            style={{
                backgroundColor: `color-mix(in srgb, var(--ds-${variant}) 10%, transparent)`,
                color: `var(--ds-${variant})`,
                borderRadius: 'var(--ds-radius)',
                borderColor: `color-mix(in srgb, var(--ds-${variant}) 20%, transparent)`,
            }}
        >
            <div className="shrink-0 mt-0.5">{iconMap[variant]}</div>
            <div className="space-y-1">
                <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'block', fontFamily: 'var(--ds-font-heading)' }}>{title}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9, lineHeight: 1.4, display: 'block', fontFamily: 'var(--ds-font-body)' }}>{children}</span>
            </div>
        </div>
    );
}

function DSBadge({ variant, children }: { variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info', children: React.ReactNode }) {
    return (
        <span
            className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded shadow-sm"
            style={{
                backgroundColor: `var(--ds-${variant})`,
                color: 'white',
                borderRadius: 'var(--ds-radius)',
                fontFamily: 'var(--ds-font-heading)'
            }}
        >
            {children}
        </span>
    );
}

function DSModal({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="p-6 bg-white border border-gray-100"
            style={{
                borderRadius: 'var(--ds-radius)',
                boxShadow: 'var(--ds-shadow)',
                backdropFilter: `blur(var(--ds-blur))`
            }}
        >
            {children}
        </div>
    );
}
