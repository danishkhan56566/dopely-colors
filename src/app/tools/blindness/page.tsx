'use client';

import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Upload, Image as ImageIcon, X, Eye, EyeOff } from 'lucide-react';
import { BlindVizGuide } from '@/components/content/AdvancedGuides';
import clsx from 'clsx';

// Color Blindness Simulation Matrices (SVG ColorMatrix)
// Source: https://www.w3.org/TR/filter-effects-1/
const SIMULATIONS = [
    {
        id: 'normal',
        name: 'Normal Vision',
        desc: 'Standard trichromatic vision',
        matrix: null
    },
    {
        id: 'protanopia',
        name: 'Protanopia',
        desc: 'Red-blind (1% of males)',
        matrix: "0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
    },
    {
        id: 'deuteranopia',
        name: 'Deuteranopia',
        desc: 'Green-blind (1% of males)',
        matrix: "0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
    },
    {
        id: 'tritanopia',
        name: 'Tritanopia',
        desc: 'Blue-blind (Rare)',
        matrix: "0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
    },
    {
        id: 'achromatopsia',
        name: 'Achromatopsia',
        desc: 'Total color blindness',
        matrix: "0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0"
    }
];

export default function ColorBlindnessPage() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [activeSim, setActiveSim] = useState('protanopia');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">

                {/* Header */}
                <div className="text-center max-w-3xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Color Blindness Simulator</h1>
                    <p className="text-gray-500 text-lg">
                        Visualize how your designs appear to people with different types of color vision deficiencies.
                    </p>
                </div>

                {/* SVG Filters Definition */}
                <svg className="absolute w-0 h-0 pointer-events-none">
                    <defs>
                        {SIMULATIONS.map(sim => (
                            sim.matrix && (
                                <filter key={sim.id} id={sim.id}>
                                    <feColorMatrix type="matrix" values={sim.matrix} />
                                </filter>
                            )
                        ))}
                    </defs>
                </svg>

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Controls */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Simulation Type</label>
                        <div className="space-y-3">
                            {SIMULATIONS.map(sim => (
                                <button
                                    key={sim.id}
                                    onClick={() => setActiveSim(sim.id)}
                                    className={clsx(
                                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                                        activeSim === sim.id
                                            ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200"
                                            : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                                    )}
                                >
                                    <div>
                                        <div className={clsx("font-bold text-sm", activeSim === sim.id ? "text-blue-700" : "text-gray-700")}>
                                            {sim.name}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">{sim.desc}</div>
                                    </div>
                                    {activeSim === sim.id && <Eye size={18} className="text-blue-500" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 text-sm hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 cursor-pointer transition-colors"
                            >
                                <Upload size={24} className="mb-2" />
                                <span>Upload custom image</span>
                                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFile} accept="image/*" />
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Comparison Slider / Grid */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col">

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900">Visual Comparison</h3>
                                <div className="flex gap-2">
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500">Original</span>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-600 capitalize">{SIMULATIONS.find(s => s.id === activeSim)?.name}</span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full">
                                {/* Original */}
                                <div className="flex-1 rounded-2xl overflow-hidden relative group bg-gray-50 border border-gray-100">
                                    <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">Original</div>
                                    {previewImage ? (
                                        <img src={previewImage} className="w-full h-full object-contain" alt="Original" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                                            <div className="grid grid-cols-2 gap-2 w-32 h-32 rotate-12 opacity-80">
                                                <div className="bg-red-500 rounded-lg" />
                                                <div className="bg-green-500 rounded-lg" />
                                                <div className="bg-blue-500 rounded-lg" />
                                                <div className="bg-yellow-500 rounded-lg" />
                                            </div>
                                            <p className="text-sm text-gray-400 font-medium">Default Test Pattern</p>
                                        </div>
                                    )}
                                </div>

                                {/* Simulated */}
                                <div className="flex-1 rounded-2xl overflow-hidden relative group bg-gray-50 border border-gray-100 flex items-center justify-center">
                                    <div className="absolute top-4 left-4 z-10 bg-blue-600/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
                                        {SIMULATIONS.find(s => s.id === activeSim)?.name}
                                    </div>
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            className="w-full h-full object-contain"
                                            style={{ filter: activeSim !== 'normal' ? `url(#${activeSim})` : 'none' }}
                                            alt="Simulated"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                                            <div
                                                className="grid grid-cols-2 gap-2 w-32 h-32 rotate-12 opacity-80"
                                                style={{ filter: activeSim !== 'normal' ? `url(#${activeSim})` : 'none' }}
                                            >
                                                <div className="bg-red-500 rounded-lg" />
                                                <div className="bg-green-500 rounded-lg" />
                                                <div className="bg-blue-500 rounded-lg" />
                                                <div className="bg-yellow-500 rounded-lg" />
                                            </div>
                                            <p className="text-sm text-gray-400 font-medium">Simulated View</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <BlindVizGuide />
            </div>
        </DashboardLayout>
    );
}
