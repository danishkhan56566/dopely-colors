'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Sun, Monitor, Projector, Book, Smartphone, Eye, Battery, CheckCircle2, AlertTriangle, CloudRain, Cpu, Settings2, Sliders, Wand2 } from 'lucide-react';
import { LightingSimGuide } from '@/components/content/AdvancedGuides';
import { cn } from '@/lib/utils';

const HARDWARE_PROFILES = [
    { id: 'retina', name: 'Pro Display XDR', nits: 1000, contrast: 1000000, gamut: 'Display P3', icon: Monitor },
    { id: 'office', name: 'Standard Office LCD', nits: 250, contrast: 1000, gamut: 'sRGB', icon: Monitor },
    { id: 'eink', name: 'E-Ink Tablet', nits: 0, contrast: 12, gamut: 'Monochrome', icon: Book },
    { id: 'mobile', name: 'Mobile (Outdoors)', nits: 2000, contrast: 2000000, gamut: 'OLED', icon: Smartphone },
    { id: 'projector', name: 'Meeting Projector', nits: 1500, contrast: 500, gamut: 'Rec. 709', icon: Projector },
];

export default function LightingSimPage() {
    const [profile, setProfile] = useState(HARDWARE_PROFILES[0]);
    const [brightness, setBrightness] = useState(100); // %
    const [ambientLight, setAmbientLight] = useState(500); // lux
    const [warmth, setWarmth] = useState(6500); // Kelvin

    // Simulation Physics
    const getSimulationFilter = () => {
        // Kelvin to Sepia/Hue approx
        const tempFactor = (6500 - warmth) / 5000;

        // Lux to Dimming
        const glareOpacity = Math.min(0.8, ambientLight / 10000);

        // Profile Hardware Baseline
        const contrastMult = Math.log10(profile.contrast) / 6; // 6 = 1,000,000 => 1.0

        return {
            filter: `brightness(${brightness}%) contrast(${contrastMult * 100}%) sepia(${tempFactor > 0 ? tempFactor : 0}) hue-rotate(${tempFactor * -10}deg)`,
            glare: glareOpacity
        };
    };

    const sim = getSimulationFilter();
    const isWcagCompliant = (profile.contrast > 500 && brightness > 50 && ambientLight < 5000);

    return (
        <PremiumToolLayout
            hideHeader={true}
            title="Tool"
            description="Tool Description"
            icon={Wand2}
            badgeText="Tool"
            guide={<LightingSimGuide />}
        >
            <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">

                {/* 1. Header (System Config Style) */}
                <header className="bg-white border-b border-gray-200 px-8 py-6 mb-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                                <Settings2 size={16} /> System Configuration
                            </div>
                            <h1 className="text-3xl font-black text-gray-900">Display Calibrator <span className="text-gray-300 font-light">v4.0</span></h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-400 uppercase">Status</div>
                                <div className="flex items-center gap-2 font-mono text-sm font-bold text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    ONLINE
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-400 uppercase">Hardware ID</div>
                                <div className="font-mono text-sm font-bold text-gray-600">
                                    {profile.id.toUpperCase()}-X99
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-12 gap-8">

                    {/* 2. Configuration Wizard (Left) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Hardware Selection */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
                                <Cpu size={16} /> Select Hardware Profile
                            </h3>
                            <div className="space-y-3">
                                {HARDWARE_PROFILES.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setProfile(p)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group",
                                            profile.id === p.id
                                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                                : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-lg transition-colors", profile.id === p.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500")}>
                                            <p.icon size={20} />
                                        </div>
                                        <div>
                                            <div className={cn("font-bold text-sm", profile.id === p.id ? "text-blue-900" : "text-gray-700")}>{p.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                {p.contrast}:1 • {p.gamut}
                                            </div>
                                        </div>
                                        {profile.id === p.id && <CheckCircle2 size={16} className="ml-auto text-blue-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Environment Sliders */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
                                <Sliders size={16} /> Environment Constraints
                            </h3>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-600 flex items-center gap-2"><Sun size={14} /> Screen Brightness</label>
                                        <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 rounded">{brightness}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="120" value={brightness}
                                        onChange={(e) => setBrightness(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-100 rounded-lg accent-blue-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                        <span>OFF</span>
                                        <span>MAX (NITS)</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-600 flex items-center gap-2"><CloudRain size={14} /> Ambient Light (Lux)</label>
                                        <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 rounded">{ambientLight} lx</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="10000" step="100" value={ambientLight}
                                        onChange={(e) => setAmbientLight(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-100 rounded-lg accent-blue-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                        <span>DARK ROOM</span>
                                        <span>DIRECT SUN</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-600 flex items-center gap-2"><Eye size={14} /> Color Temp (Kelvin)</label>
                                        <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 rounded">{warmth}K</span>
                                    </div>
                                    <input
                                        type="range" min="2000" max="10000" step="100" value={warmth}
                                        onChange={(e) => setWarmth(Number(e.target.value))}
                                        className="w-full h-2 bg-gradient-to-r from-orange-300 via-white to-blue-300 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md border border-gray-200"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 3. Simulation viewport (Right) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Validation Alert */}
                        <div className={cn(
                            "rounded-2xl p-4 flex items-start gap-4 border transition-colors",
                            isWcagCompliant
                                ? "bg-green-50 border-green-200 text-green-900"
                                : "bg-amber-50 border-amber-200 text-amber-900"
                        )}>
                            <div className={cn("mt-1 p-1 rounded-full text-white", isWcagCompliant ? "bg-green-500" : "bg-amber-500")}>
                                {isWcagCompliant ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1">
                                    {isWcagCompliant ? "Optimization Complete" : "Readability Warning"}
                                </h4>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    {isWcagCompliant
                                        ? "System parameters are within optimal ranges for extended readability and color accuracy."
                                        : "Current environmental factors (Glare/Contrast) may degrade user experience. Recommend increasing brightness or switching contrast modes."}
                                </p>
                            </div>
                        </div>

                        {/* Viewport */}
                        <div className="bg-gray-900 rounded-[2.5rem] border-[12px] border-gray-800 shadow-2xl relative overflow-hidden aspect-[16/10] group">

                            {/* "Physical" Screen Layer */}
                            <div
                                className="absolute inset-0 bg-white transition-all duration-300"
                                style={{
                                    filter: sim.filter
                                }}
                            >
                                {/* Sample Interface content */}
                                <div className="h-full w-full p-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 rounded-3xl bg-blue-600 mb-8 shadow-xl flex items-center justify-center">
                                        <Sun className="text-white" size={40} />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 mb-4">Interface Preview</h2>
                                    <p className="text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">
                                        This simulates how your design components render on the selected hardware.
                                    </p>
                                    <div className="mt-8 flex gap-4">
                                        <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Primary</button>
                                        <button className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold">Secondary</button>
                                    </div>
                                </div>
                            </div>

                            {/* Glare/Reflection Overlay */}
                            <div
                                className="absolute inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-transparent via-white/50 to-transparent transition-opacity duration-300"
                                style={{ opacity: sim.glare }}
                            />

                            {/* E-Ink Texture */}
                            {profile.id === 'eink' && (
                                <div className="absolute inset-0 z-20 opacity-30 bg-noise pointer-events-none mix-blend-multiply" />
                            )}

                        </div>

                        {/* Technical Readout */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Effective Contrast', value: `${(profile.contrast * (brightness / 100)).toFixed(0)}:1` },
                                { label: 'P3 Coverage', value: profile.gamut === 'Display P3' ? '99.8%' : '72.4%' },
                                { label: 'Power Draw', value: `${Math.round(brightness * 0.8)}W` },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{stat.label}</div>
                                    <div className="text-lg font-mono font-bold text-gray-900">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-8 mt-12">
                    
                </div>
            </div>
        </PremiumToolLayout>
    );
}
