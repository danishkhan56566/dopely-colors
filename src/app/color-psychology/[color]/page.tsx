import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { colorPsychologyDb } from '@/data/colorPsychology';
import { Brain, ArrowLeft, Target, Sparkles, Building2, Palette, Info, CheckCircle2, XCircle, Briefcase, Lightbulb, History, BookOpen } from 'lucide-react';
import clsx from 'clsx';

export async function generateStaticParams() {
    return colorPsychologyDb.map((color) => ({
        color: color.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ color: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const colorData = colorPsychologyDb.find((c) => c.slug === resolvedParams.color);
    if (!colorData) return {};

    return {
        title: `The Psychology of ${colorData.name} Color | Dopely Colors`,
        description: colorData.shortDescription,
        alternates: {
            canonical: `/color-psychology/${colorData.slug}`,
        },
    };
}

export default async function ColorPsychologyDetail({ params }: { params: Promise<{ color: string }> }) {
    const resolvedParams = await params;
    const colorData = colorPsychologyDb.find((c) => c.slug === resolvedParams.color);
    if (!colorData) {
        notFound();
    }

    const isLight = ['yellow', 'white'].includes(colorData.slug);
    const textColor = isLight ? 'text-gray-900' : 'text-white';
    const mutedTextColor = isLight ? 'text-gray-700' : 'text-white/80';
    const borderColor = isLight ? 'border-gray-900/10' : 'border-white/10';

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB] pb-32">
                {/* Advanced Immersive Hero Section */}
                <header
                    className="relative pt-32 pb-32 px-6 md:px-12 overflow-hidden border-b border-gray-200 shadow-sm"
                    style={{ backgroundColor: colorData.hex }}
                >
                    {/* Organic Noise Overlay */}
                    <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                    {/* Gradient Bloom */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-40 translate-x-1/3 -translate-y-1/3"></div>

                    <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-start">
                        <Link href="/color-psychology" className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${mutedTextColor} hover:${textColor} transition-all hover:-translate-x-1 mb-12 bg-black/5 hover:bg-black/10 px-4 py-2 rounded-full backdrop-blur-md`}>
                            <ArrowLeft size={16} /> Color Index
                        </Link>

                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end md:justify-between w-full">
                            <div className="max-w-3xl">
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${isLight ? 'bg-white/40' : 'bg-white/10'} ${borderColor} border text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md`}>
                                    <Brain size={14} className={textColor} />
                                    <span className={textColor}>Psychology Profile</span>
                                </div>

                                <h1 className={`text-7xl md:text-8xl font-black mb-4 tracking-tighter ${textColor} capitalize drop-shadow-sm`}>
                                    {colorData.name}.
                                </h1>
                                <p className={`text-2xl md:text-3xl font-medium leading-snug ${mutedTextColor} drop-shadow-sm`}>
                                    {colorData.shortDescription}
                                </p>
                            </div>

                            {/* Color Block Visualizer */}
                            <div className="shrink-0 flex flex-col items-center gap-3">
                                <div className="w-24 h-24 rounded-full border-4 shadow-2xl relative group" style={{ borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)', backgroundColor: colorData.hex }}>
                                    {/* Inner shadow trick */}
                                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 pointer-events-none"></div>
                                </div>
                                <span className={`font-mono text-sm tracking-widest font-bold ${textColor} uppercase opacity-90 bg-black/5 px-3 py-1 rounded-md backdrop-blur-md`}>
                                    {colorData.hex}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 space-y-12">

                    {/* 1. Core Introductions (History & Science) */}
                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><BookOpen size={24} /></div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">The Psychology</h2>
                            </div>
                            <div className="space-y-4">
                                {colorData.description.map((paragraph, i) => (
                                    <p key={i} className="text-lg text-gray-600 leading-relaxed font-medium relative z-10">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl"><History size={24} /></div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">The History</h2>
                            </div>
                            <div className="space-y-4">
                                {colorData.history.map((paragraph, i) => (
                                    <p key={i} className="text-lg text-gray-600 leading-relaxed font-medium relative z-10">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 2. Massive Deep Psychology Grid (Bento) */}
                    <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><Sparkles size={28} /></div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Deep Psychological Impact</h2>
                                <p className="text-gray-500 font-medium mt-1">How the brain biologically responds to this wavelength.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {colorData.deepPsychology.map((trait, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: colorData.hex, opacity: 0.15 }}></div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 -mt-10">{trait.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {trait.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. The Personality Profile (Split View) */}
                    <section className="grid lg:grid-cols-12 gap-8 items-start">
                        <div className="bg-gray-900 lg:col-span-5 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
                            {/* Inner ambient glow */}
                            <div className="absolute -top-[20%] -right-[20%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-40 pointer-events-none" style={{ backgroundColor: colorData.hex }}></div>

                            <div className="relative z-10">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white inline-block mb-6"><Brain size={28} /></div>
                                <h2 className="text-3xl font-black mb-4 leading-tight">The "{colorData.name}" Personality</h2>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    {colorData.personalityProfile.intro}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 h-full">
                            {/* Positives */}
                            <div className="bg-emerald-50/50 rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
                                    <h3 className="text-xl font-bold text-emerald-900">Positive Traits</h3>
                                </div>
                                <ul className="space-y-4 text-emerald-800 font-medium">
                                    {colorData.personalityProfile.positive.map((trait, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                            {trait}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Negatives */}
                            <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl"><XCircle size={24} /></div>
                                    <h3 className="text-xl font-bold text-rose-900">Negative Traits</h3>
                                </div>
                                <ul className="space-y-4 text-rose-800 font-medium">
                                    {colorData.personalityProfile.negative.map((trait, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                                            {trait}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 4. Business & Branding (Two-Column Editorial) */}
                    <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Briefcase size={24} /></div>
                                    <h2 className="text-2xl font-black text-gray-900">Corporate Strategy</h2>
                                </div>
                                <div className="space-y-4">
                                    {colorData.businessApplications.map((paragraph, i) => (
                                        <p key={i} className="text-lg text-gray-600 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Target size={24} /></div>
                                    <h2 className="text-2xl font-black text-gray-900">Marketing & UI</h2>
                                </div>
                                <div className="space-y-4">
                                    {colorData.marketingAndBranding.map((paragraph, i) => (
                                        <p key={i} className="text-lg text-gray-600 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. Symbolism & Random Facts */}
                    <section className="grid md:grid-cols-2 gap-8">
                        {/* Cultural Symbolism */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
                            <div className="absolute -bottom-[20%] right-[0%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: colorData.hex }}></div>
                            <div className="relative z-10">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl inline-block mb-6">
                                    <Building2 size={24} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-black mb-4">Cultural Symbolism</h2>
                                <p className="text-lg text-indigo-100/80 leading-relaxed">
                                    {colorData.symbolism}
                                </p>
                            </div>
                        </div>

                        {/* Random Facts */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-yellow-100 text-yellow-700 rounded-2xl"><Lightbulb size={24} /></div>
                                <h2 className="text-2xl font-black text-gray-900">Did You Know?</h2>
                            </div>
                            <ul className="space-y-5">
                                {colorData.randomFacts.map((fact, idx) => (
                                    <li key={idx} className="flex gap-4 text-gray-600 items-start">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-gray-500 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <span className="leading-relaxed font-medium pt-1">{fact}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* 6. Detailed Popular Shades */}
                    <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="p-3.5 bg-pink-50 text-pink-600 rounded-2xl"><Palette size={28} /></div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Meaning of Shades</h2>
                                    <p className="text-gray-500 font-medium mt-1">Nuances matter. Different hues evoke different emotions.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {colorData.detailedShades.map((shade) => (
                                <div key={shade.name} className="flex flex-col rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-28 flex flex-col items-center justify-center relative group p-4" style={{ backgroundColor: shade.hex }}>
                                        {/* Internal shadow for pop */}
                                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none"></div>
                                        <span className={clsx(
                                            "font-bold text-xl tracking-tight z-10",
                                            chroma(shade.hex).luminance() > 0.5 ? 'text-black/80' : 'text-white/95'
                                        )}>
                                            {shade.name}
                                        </span>
                                        <span className={clsx(
                                            "font-mono text-xs uppercase z-10 opacity-80 mt-1",
                                            chroma(shade.hex).luminance() > 0.5 ? 'text-black/60' : 'text-white/70'
                                        )}>
                                            {shade.hex}
                                        </span>
                                    </div>
                                    <div className="p-6 bg-white flex-1">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {shade.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>
            </div>
        </DashboardLayout>
    );
}

// Ensure Chroma exists for the luminance check
import chroma from 'chroma-js';
