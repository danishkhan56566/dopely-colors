'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Copy, ArrowLeft, Share2, Info, ChevronRight,
    Palette, Layers, Zap, Eye, Check, AlertTriangle, Sparkles, Heart, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    getFullConversions, getHarmonies, getBlindnessSims, getColorPsychology,
    getSimilarColors, getLibraryMatches, getNearestColorName, type ColorPsychology
} from '@/lib/color-utils';
import { supabase } from '@/lib/supabase';
import { SaveColorButton } from '@/components/colors/SaveColorButton';
import { ExportModal, type Format } from '@/components/ExportModal';


// Helper for contrast text color
const getContrastColor = (hex: string) => {
    return chroma.contrast(hex, 'white') > 4.5 ? 'white' : 'black';
};

interface ColorDetailViewProps {
    hex: string;
    initialDbColor?: {
        name: string;
        hex: string;
        description?: string;
        psychology?: string;
        meaning?: string;
        usage_info?: string;
    } | null;
}

export function ColorDetailView({ hex: initialHex, initialDbColor }: ColorDetailViewProps) {
    // Ensure hex is formatted correctly
    const hex = useMemo(() => {
        if (!initialHex) return '#000000';
        return initialHex.startsWith('#') ? initialHex : `#${initialHex}`;
    }, [initialHex]);

    const [mounted, setMounted] = useState(false);
    const [dbColor, setDbColor] = useState(initialDbColor);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState<Format>('css');


    useEffect(() => {
        setMounted(true);
        // If we didn't get initial data (or if client navigates), ensure we have it.
        // But for now, we rely on the server passed prompt.
        // We could re-fetch here if needed, but the server data is likely fresh.
        if (!initialDbColor) {
            const fetchColor = async () => {
                const normalized = hex.replace('#', '').toUpperCase();
                const { data } = await supabase
                    .from('colors')
                    .select('name, hex, description, psychology, meaning, usage_info')
                    .ilike('hex', `%${normalized}%`)
                    .maybeSingle();

                if (data) setDbColor(data);
            };
            fetchColor();
        }
    }, [hex, initialDbColor]);

    const conversions = useMemo(() => getFullConversions(hex), [hex]);
    const harmonies = useMemo(() => getHarmonies(hex), [hex]);
    const blindness = useMemo(() => getBlindnessSims(hex), [hex]);
    const dummyPsychology = useMemo(() => getColorPsychology(hex), [hex]);
    const psychology: ColorPsychology = useMemo(() => {
        if (!dbColor) return dummyPsychology;

        const overrides: any = {};
        if (dbColor.description) overrides.description = dbColor.description;

        try { if (dbColor.psychology) overrides.psychology = JSON.parse(dbColor.psychology); } catch (e) { console.error('Error parsing psychology', e); }
        try { if (dbColor.meaning) overrides.meaning = JSON.parse(dbColor.meaning); } catch (e) { console.error('Error parsing meaning', e); }
        try { if (dbColor.usage_info) overrides.usage = JSON.parse(dbColor.usage_info); } catch (e) { console.error('Error parsing usage', e); }

        return { ...dummyPsychology, ...overrides };
    }, [dummyPsychology, dbColor]);
    const similarColors = useMemo(() => getSimilarColors(hex), [hex]);
    const colorName = useMemo(() => getNearestColorName(hex), [hex]);

    const variations = useMemo(() => {
        const generateScale = (mode: 'lab', target: string) => chroma.scale([hex, target]).mode(mode).colors(12);
        return {
            shades: generateScale('lab', '#000000'),
            tints: generateScale('lab', '#ffffff'),
            tones: generateScale('lab', '#808080'),
        };
    }, [hex]);

    const contrastWhite = chroma.contrast(hex, '#FFFFFF');
    const contrastBlack = chroma.contrast(hex, '#000000');
    const textColor = getContrastColor(hex);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text}`);
    };

    const exportColors = useMemo(() => {
        // Create a rich palette for export: Main + Analogous + Complementary
        const palette = [
            hex,
            ...harmonies.analogous.slice(0, 2),
            ...harmonies.complementary.slice(0, 1),
            ...harmonies.triadic.slice(0, 1)
        ].slice(0, 5); // Ensure max 5

        return palette.map(h => ({ id: h, hex: h, isLocked: false }));
    }, [hex, harmonies]);

    const handleDownloadPalette = () => {
        setExportFormat('image');
        setIsExportOpen(true);
    };



    if (!mounted) return null;

    return (
        <DashboardLayout>

            <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-indigo-100">
                {/* Immersive Hero */}
                <div className="relative w-full h-[85vh] overflow-hidden flex flex-col justify-end p-8 md:p-16">
                    <div
                        className="absolute inset-0 transition-colors duration-700 ease-in-out"
                        style={{ backgroundColor: hex }}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 w-full max-w-[1920px] mx-auto"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-white shadow-sm"
                                >
                                    <Sparkles size={12} /> Premium Color
                                </motion.div>
                                <h1
                                    className="text-7xl md:text-[180px] font-black tracking-tighter leading-[0.85] select-text"
                                    style={{ color: 'white', textShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                                >
                                    {hex.replace('#', '')}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white/90">
                                        {dbColor ? dbColor.name : colorName}
                                    </h2>
                                    <button
                                        onClick={() => copyToClipboard(hex)}
                                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors border border-white/20 shadow-sm"
                                    >
                                        <Copy size={24} className="text-white" />
                                    </button>
                                    <SaveColorButton hex={hex} name={dbColor?.name || colorName} className="bg-white/20 text-white hover:bg-white/30 border border-white/20 w-12 h-12" />
                                    <button
                                        onClick={handleDownloadPalette}
                                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors border border-white/20 shadow-sm group"
                                        title="Download Palette"
                                    >
                                        <Download size={24} className="text-white group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 w-64 space-y-4 shadow-lg">
                                    <div className="flex justify-between items-center text-sm font-medium text-white/80">
                                        <span>RGB</span>
                                        <Copy size={14} className="cursor-pointer hover:text-white" onClick={() => copyToClipboard(conversions.rgb)} />
                                    </div>
                                    <div className="text-2xl font-mono text-white">{conversions.rgb}</div>
                                </div>
                                <div className="hidden md:block p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 w-64 space-y-4 shadow-lg">
                                    <div className="flex justify-between items-center text-sm font-medium text-white/80">
                                        <span>CMYK</span>
                                        <Copy size={14} className="cursor-pointer hover:text-white" onClick={() => copyToClipboard(conversions.cmyk)} />
                                    </div>
                                    <div className="text-2xl font-mono text-white">{conversions.cmyk}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="max-w-[1920px] mx-auto px-8 md:px-16 py-24 space-y-32">

                    {/* Conversions Ribbon */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
                    >
                        {Object.entries(conversions).map(([key, value]) => (
                            <div
                                key={key}
                                onClick={() => copyToClipboard(value)}
                                className="group p-5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 group-hover:text-indigo-500 transition-colors">{key}</div>
                                <div className="text-sm font-mono truncate text-neutral-900">{value}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Psychology & Meaning - Bento Grid */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-neutral-200" />
                            <h3 className="text-xl font-medium tracking-tight text-neutral-400 uppercase">The Logic</h3>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]"
                        >
                            {/* Main Description */}
                            <div className="md:col-span-2 bg-white rounded-[3rem] p-12 flex flex-col justify-between border border-neutral-100 shadow-xl shadow-neutral-100/50 relative overflow-hidden group">
                                <div
                                    className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-[100px] opacity-10 transition-opacity duration-500 group-hover:opacity-20"
                                    style={{ backgroundColor: hex }}
                                />
                                <div>
                                    <h4 className="text-3xl font-bold mb-6 text-neutral-900">About this color</h4>
                                    <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed font-light">
                                        {psychology.description}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-8 mt-12">
                                    {psychology.psychology.traits.slice(0, 2).map(trait => (
                                        <div key={trait.name}>
                                            <div className="text-4xl font-black mb-2" style={{ color: hex }}>{trait.name}</div>
                                            <div className="text-neutral-500">{trait.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Usage/Action */}
                            <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-xl shadow-neutral-100/50 flex flex-col gap-6">
                                <h4 className="text-xl font-bold text-neutral-900">Best Applications</h4>
                                <div className="space-y-4 flex-1">
                                    {psychology.applications.areas.map((area, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                            <div className="font-bold text-lg mb-1 text-neutral-800">{area.name}</div>
                                            <div className="text-sm text-neutral-500">{area.desc}</div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </motion.div>
                    </section>

                    {/* Interactive Variations Stream */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-neutral-200" />
                            <h3 className="text-xl font-medium tracking-tight text-neutral-400 uppercase">The Spectrum</h3>
                        </div>

                        <div className="space-y-8">
                            {/* Shades */}
                            <div className="h-40 w-full rounded-3xl overflow-hidden flex shadow-2xl shadow-neutral-200/50 bg-white p-2">
                                {variations.shades.map((c) => (
                                    <div
                                        key={c}
                                        className="flex-1 h-full rounded-2xl group relative cursor-pointer hover:flex-[2] transition-all duration-500 ease-out mx-[1px]"
                                        style={{ backgroundColor: c }}
                                        onClick={() => copyToClipboard(c)}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="font-mono text-xs font-bold uppercase tracking-widest text-shadow-sm mix-blend-difference text-white">
                                                {c}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tints */}
                            <div className="h-40 w-full rounded-3xl overflow-hidden flex shadow-2xl shadow-neutral-200/50 bg-white p-2">
                                {variations.tints.map((c) => (
                                    <div
                                        key={c}
                                        className="flex-1 h-full rounded-2xl group relative cursor-pointer hover:flex-[2] transition-all duration-500 ease-out mx-[1px]"
                                        style={{ backgroundColor: c }}
                                        onClick={() => copyToClipboard(c)}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="font-mono text-xs font-bold uppercase tracking-widest text-shadow-sm mix-blend-difference text-white">
                                                {c}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Harmony Circles */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-neutral-200" />
                            <h3 className="text-xl font-medium tracking-tight text-neutral-400 uppercase">Harmonic Systems</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { name: 'Analogous', colors: harmonies.analogous },
                                { name: 'Complementary', colors: harmonies.complementary },
                                { name: 'Triadic', colors: harmonies.triadic },
                            ].map(sys => (
                                <div key={sys.name} className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-xl shadow-neutral-100/50 hover:border-neutral-200 transition-colors aspect-square flex flex-col">
                                    <h4 className="text-2xl font-bold mb-8 text-neutral-900">{sys.name}</h4>
                                    <div className="relative flex-1 flex items-center justify-center">
                                        {/* Artistic overlapping circles */}
                                        {sys.colors.map((c, i) => (
                                            <div
                                                key={i}
                                                onClick={() => copyToClipboard(c)}
                                                className="w-32 h-32 rounded-full absolute shadow-xl transition-transform hover:z-20 hover:scale-110 cursor-pointer border-4 border-white"
                                                style={{
                                                    backgroundColor: c,
                                                    left: `calc(50% + ${(i - (sys.colors.length - 1) / 2) * 50}px - 64px)`,
                                                    zIndex: i
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-8 border-t border-neutral-100 pt-6">
                                        {sys.colors.map(c => (
                                            <span key={c} className="text-xs font-mono text-neutral-400 hover:text-neutral-900 cursor-pointer" onClick={() => copyToClipboard(c)}>{c}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Blindness Simulations */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-neutral-200" />
                            <h3 className="text-xl font-medium tracking-tight text-neutral-400 uppercase">Vision Simulation</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { name: 'Protanopia', color: blindness.protanopia, desc: 'No red perception' },
                                { name: 'Deuteranopia', color: blindness.deuteranopia, desc: 'No green perception' },
                                { name: 'Tritanopia', color: blindness.tritanopia, desc: 'No blue perception' },
                                { name: 'Achromatopsia', color: blindness.achromatopsia, desc: 'No color perception' },
                            ].map((sim) => (
                                <div key={sim.name} className="group bg-white rounded-[2.5rem] p-6 border border-neutral-100 shadow-xl shadow-neutral-100/50 hover:-translate-y-1 transition-transform">
                                    <div className="aspect-[4/3] rounded-2xl mb-6 relative overflow-hidden shadow-inner ring-1 ring-black/5">
                                        {/* Split view for comparison */}
                                        <div className="absolute inset-0 flex">
                                            <div className="flex-1 h-full" style={{ backgroundColor: hex }} />
                                            <div className="flex-1 h-full" style={{ backgroundColor: sim.color }} />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-widest text-neutral-500">
                                                Orig vs Sim
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-lg text-neutral-900 mb-1">{sim.name}</h4>
                                    <p className="text-sm text-neutral-500 mb-4">{sim.desc}</p>
                                    <div
                                        onClick={() => copyToClipboard(sim.color)}
                                        className="text-xs font-mono bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 py-2 px-3 rounded-xl w-full text-center text-neutral-600 cursor-pointer transition-colors"
                                    >
                                        {sim.color}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Accessibility Badges */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-neutral-200" />
                            <h3 className="text-xl font-medium tracking-tight text-neutral-400 uppercase">Accessibility</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[2.5rem] p-10 border border-neutral-100 shadow-xl shadow-neutral-100/50">
                                <div className="flex justify-between items-start mb-8">
                                    <h4 className="text-2xl font-bold text-neutral-900">White Context</h4>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${contrastWhite >= 4.5 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {contrastWhite >= 4.5 ? 'PASS' : 'FAIL'}
                                    </span>
                                </div>
                                <div className="bg-white rounded-2xl p-8 h-48 flex flex-col justify-center border border-neutral-100 shadow-inner">
                                    <h1 className="text-4xl font-black mb-2" style={{ color: hex }}>Large Text</h1>
                                    <p className="text-lg font-medium" style={{ color: hex }}>Normal body text preview for reading.</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-10 border border-neutral-100 shadow-xl shadow-neutral-100/50">
                                <div className="flex justify-between items-start mb-8">
                                    <h4 className="text-2xl font-bold text-neutral-900">Black Context</h4>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${contrastBlack >= 4.5 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {contrastBlack >= 4.5 ? 'PASS' : 'FAIL'}
                                    </span>
                                </div>
                                <div className="bg-black rounded-2xl p-8 h-48 flex flex-col justify-center border border-neutral-800 shadow-inner">
                                    <h1 className="text-4xl font-black mb-2" style={{ color: hex }}>Large Text</h1>
                                    <p className="text-lg font-medium" style={{ color: hex }}>Normal body text preview for reading.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer / Similar */}
                    <div className="pt-24 border-t border-neutral-200">
                        <div className="flex justify-between items-end mb-12">
                            <h2 className="text-4xl font-black tracking-tight text-neutral-900">Discover More</h2>
                            <Link href="/colors" className="text-neutral-500 hover:text-neutral-900 flex items-center gap-2">View All Colors <ChevronRight size={16} /></Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {similarColors.map(c => (
                                <Link
                                    href={`/colors/${c.hex.replace('#', '')}`}
                                    key={c.hex}
                                    className="group aspect-[4/5] rounded-3xl relative overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                                >
                                    <div
                                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundColor: c.hex }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                        <div className="font-bold text-lg text-white">{c.name}</div>
                                        <div className="text-xs font-mono text-white/80">{c.hex}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                colors={exportColors}
                initialFormat={exportFormat}
            />
        </DashboardLayout >
    );
}
