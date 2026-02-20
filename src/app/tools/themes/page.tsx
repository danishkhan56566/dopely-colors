'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Layout, Moon, Sun, Monitor, Smartphone, Tablet, Copy, Wand2 } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ThemeGuide } from '@/components/content/UtilityGuides';

export default function ThemeGenerator() {
    // Theme State
    const [primary, setPrimary] = useState('#3b82f6');
    const [secondary, setSecondary] = useState('#10b981');
    const [bg, setBg] = useState('#ffffff');
    const [text, setText] = useState('#0f172a');
    const [radius, setRadius] = useState('0.75rem'); // 12px
    const [font, setFont] = useState('Inter');
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

    const presets = {
        light: { bg: '#ffffff', text: '#0f172a' },
        dark: { bg: '#0f172a', text: '#f8fafc' }
    };

    const toggleMode = (m: 'light' | 'dark') => {
        setMode(m);
        setBg(presets[m].bg);
        setText(presets[m].text);
    };

    const containerStyle = {
        '--primary': primary,
        '--secondary': secondary,
        '--bg': bg,
        '--text': text,
        '--radius': radius,
        '--font': font
    } as React.CSSProperties;

    const copyCSS = () => {
        const css = `
:root {
  --primary: ${primary};
  --secondary: ${secondary};
  --bg: ${bg};
  --text: ${text};
  --radius: ${radius};
  --font-family: ${font};
}
        `.trim();
        navigator.clipboard.writeText(css);
        toast.success("Copied Theme CSS");
    };

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<ThemeGuide />}
        >
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
                            <Layout size={32} />
                        </div>
                        Responsive Theme Generator
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Preview how your color choices look on a real UI interface. Switch modes and devices instantly.
                    </p>
                </div>

                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-8">

                            {/* Colors */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Brand Colors</h3>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Primary Color</label>
                                    <div className="flex gap-2">
                                        <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                                        <input type="text" value={primary} onChange={(e) => setPrimary(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Secondary Color</label>
                                    <div className="flex gap-2">
                                        <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                                        <input type="text" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* UI Properties */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">UI Tokens</h3>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Border Radius</label>
                                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                                        {['0px', '0.5rem', '0.75rem', '1.5rem'].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setRadius(r)}
                                                className={clsx(
                                                    "flex-1 py-1.5 rounded-md text-xs font-bold transition-all",
                                                    radius === r ? "bg-white shadow-sm text-black" : "text-gray-500"
                                                )}
                                            >
                                                {r === '0px' ? 'Square' : r === '1.5rem' ? 'Round' : 'Soft'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Export */}
                            <button
                                onClick={copyCSS}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-colors"
                            >
                                <Copy size={18} /> Copy Variables
                            </button>
                        </div>
                    </div>

                    {/* Preview Window */}
                    <div className="lg:col-span-8 flex flex-col gap-4">

                        {/* Preview Toolbar */}
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setDevice('desktop')}
                                    className={clsx("p-2 rounded-lg transition-all", device === 'desktop' ? "bg-white shadow-sm text-black" : "text-gray-400")}
                                >
                                    <Monitor size={18} />
                                </button>
                                <button
                                    onClick={() => setDevice('mobile')}
                                    className={clsx("p-2 rounded-lg transition-all", device === 'mobile' ? "bg-white shadow-sm text-black" : "text-gray-400")}
                                >
                                    <Smartphone size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => toggleMode('light')}
                                    className={clsx("p-2 rounded-lg transition-all", mode === 'light' ? "bg-white shadow-sm text-yellow-500" : "text-gray-400")}
                                >
                                    <Sun size={18} />
                                </button>
                                <button
                                    onClick={() => toggleMode('dark')}
                                    className={clsx("p-2 rounded-lg transition-all", mode === 'dark' ? "bg-white shadow-sm text-blue-500" : "text-gray-400")}
                                >
                                    <Moon size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Live CSS Injection */}
                        <style jsx>{`
                            .theme-preview {
                                --p: ${primary};
                                --s: ${secondary};
                                --bg: ${bg};
                                --fg: ${text};
                                --br: ${radius};
                            }
                        `}</style>

                        {/* Device Frame */}
                        <div className={clsx(
                            "mx-auto transition-all duration-500 ease-in-out border-[8px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden relative theme-preview",
                            device === 'mobile' ? "w-[375px] h-[700px] rounded-[3rem]" : "w-full h-[600px] rounded-[1.5rem]"
                        )}>
                            {/* Notch (Mobile) */}
                            {device === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20" />}

                            <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
                                {/* Fake App Content */}
                                <nav className="p-6 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--fg)]/10">
                                    <div className="font-black text-xl tracking-tight" style={{ color: 'var(--p)' }}>Brand.</div>
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--s)' }} />
                                </nav>

                                <div className="p-6 space-y-8">
                                    {/* Hero */}
                                    <div className="space-y-4 py-8">
                                        <h1 className="text-4xl font-bold leading-tight">
                                            Build better <span style={{ color: 'var(--p)' }}>Products</span> faster.
                                        </h1>
                                        <p className="opacity-60 leading-relaxed">
                                            Our platform provides the essential tools to grow your business without the complexity using your new theme.
                                        </p>
                                        <div className="flex gap-3 pt-2">
                                            <button className="px-6 py-3 font-bold text-white shadow-lg shadow-[var(--p)]/20 hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--p)', borderRadius: 'var(--br)' }}>
                                                Get Started
                                            </button>
                                            <button className="px-6 py-3 font-bold border hover:bg-[var(--fg)]/5 transition-colors" style={{ borderColor: 'var(--fg)', borderRadius: 'var(--br)', color: 'var(--fg)' }}>
                                                Learn More
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 border border-[var(--fg)]/10" style={{ borderRadius: 'var(--br)', backgroundColor: mode === 'light' ? '#f8fafc' : '#1e293b' }}>
                                            <div className="w-10 h-10 mb-3 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--p)', color: 'white' }}>
                                                <Layout size={20} />
                                            </div>
                                            <h3 className="font-bold mb-1">Components</h3>
                                            <p className="text-xs opacity-60">Ready to use elements.</p>
                                        </div>
                                        <div className="p-4 border border-[var(--fg)]/10" style={{ borderRadius: 'var(--br)', backgroundColor: mode === 'light' ? '#f8fafc' : '#1e293b' }}>
                                            <div className="w-10 h-10 mb-3 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--s)', color: 'white' }}>
                                                <Monitor size={20} />
                                            </div>
                                            <h3 className="font-bold mb-1">Responsive</h3>
                                            <p className="text-xs opacity-60">Fits all screens.</p>
                                        </div>
                                    </div>

                                    {/* Feature Section */}
                                    <div className="p-6 text-white" style={{ borderRadius: 'var(--br)', background: `linear-gradient(135deg, var(--p), var(--s))` }}>
                                        <h3 className="font-bold text-lg mb-2">Premium Feature</h3>
                                        <p className="text-sm opacity-90 mb-4">Unlock the full potential of your design system with our pro tools.</p>
                                        <button className="w-full py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold hover:bg-white/30 transition-colors">
                                            Upgrade Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </PremiumToolLayout>
    );
}
