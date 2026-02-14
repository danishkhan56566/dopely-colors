'use client';

import { useState } from 'react';
import chroma from 'chroma-js';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Image as ImageIcon, Copy, Upload, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { DuotoneGuide } from '@/components/content/ScienceGuides';

export default function DuotoneLab() {
    const [image, setImage] = useState('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop');
    const [color1, setColor1] = useState('#220033'); // Dark
    const [color2, setColor2] = useState('#00ff00'); // Light

    const getMatrix = (c1: string, c2: string) => {
        const rgb1 = chroma(c1).rgb(); // [r, g, b] 0-255
        const rgb2 = chroma(c2).rgb();

        // Normalize 0-1
        const r1 = rgb1[0] / 255, g1 = rgb1[1] / 255, b1 = rgb1[2] / 255;
        const r2 = rgb2[0] / 255, g2 = rgb2[1] / 255, b2 = rgb2[2] / 255;

        // Luminance weights
        // Standard Rec. 709
        const Lr = 0.2126;
        const Lg = 0.7152;
        const Lb = 0.0722;

        // Target:
        // OutR = Lum * (r2 - r1) + r1
        // OutR = (Lr*InR + Lg*InG + Lb*InB) * (r2-r1) + r1
        // OutR = InR * (Lr*(r2-r1)) + InG * (Lg*(r2-r1)) + InB * (Lb*(r2-r1)) + r1 (constant shift?) -> feColorMatrix adds offsets in 5th column 

        const rDiff = r2 - r1;
        const gDiff = g2 - g1;
        const bDiff = b2 - b1;

        const m = [
            // R row
            Lr * rDiff + r1, Lg * rDiff, Lb * rDiff, 0, 0,
            // G row
            Lr * gDiff, Lg * gDiff + g1, Lb * gDiff, 0, 0, // Wait, logic might be simplifying.
            // Let's use the explicit map logic:
            // R = InR*Lr*Diff + InG*Lg*Diff + InB*Lb*Diff + Base1
            // Actually feColorMatrix is a linear transform. 
            // The 5th column is the offset (b).
            // So: R' = R*m00 + G*m01 + B*m02 + A*m03 + m04

            // If we want Duotone based on Luminance:
            // L = 0.21R + 0.72G + 0.07B
            // Target R = L * (R2 - R1) + R1
            // Target R = (0.21R + 0.72G + 0.07B) * R_Scale + R_Base
            // Target R = R*(0.21*R_Scale) + G*(0.72*R_Scale) + B*(0.07*R_Scale) + 0 + R_Base

            // Row 1 (Red Output):
            (Lr * rDiff), (Lg * rDiff), (Lb * rDiff), 0, r1,

            // Row 2 (Green Output):
            (Lr * gDiff), (Lg * gDiff), (Lb * gDiff), 0, g1,

            // Row 3 (Blue Output):
            (Lr * bDiff), (Lg * bDiff), (Lb * bDiff), 0, b1,

            // Alpha (Identity)
            0, 0, 0, 1, 0
        ];

        return m.join(' ');
    };

    const matrix = getMatrix(color1, color2);

    // SVG Filter ID
    const filterId = "duotone-filter";

    const svgCode = `
<svg xmlns="http://www.w3.org/2000/svg">
  <filter id="${filterId}">
    <feColorMatrix type="matrix" values="${matrix}" />
  </filter>
</svg>
    `.trim();

    const cssCode = `filter: url('data:image/svg+xml;utf8,${encodeURIComponent(svgCode.replace(/\n/g, ''))}#${filterId}');
/* Or if embedded in HTML: filter: url(#${filterId}); */`;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
                <div className="text-center max-w-2xl mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <div className="p-3 bg-fuchsia-100 rounded-2xl text-fuchsia-600">
                            <ImageIcon size={32} />
                        </div>
                        Duotone & SVG Lab
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Turn images into brand assets with SVG spectral filtering (Duotone/Monochrome).
                    </p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* Controls */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Map Blacks To (Shadows)</label>
                                <div className="flex gap-2">
                                    <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                                    <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Map Whites To (Highlights)</label>
                                <div className="flex gap-2">
                                    <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                                    <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="flex-1 px-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Image URL</label>
                                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm" />
                            </div>

                        </div>
                    </div>

                    {/* Preview */}
                    <div className="md:col-span-8 space-y-8">
                        {/* Hidden SVG Definition for Preview */}
                        <svg className="absolute w-0 h-0">
                            <filter id="preview-filter">
                                <feColorMatrix type="matrix" values={matrix} />
                            </filter>
                        </svg>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="aspect-video rounded-2xl overflow-hidden relative shadow-md group">
                                <img src={image} className="w-full h-full object-cover" />
                                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">Original</span>
                            </div>

                            <div className="aspect-video rounded-2xl overflow-hidden relative shadow-md group">
                                <img src={image} className="w-full h-full object-cover" style={{ filter: 'url(#preview-filter)' }} />
                                <span className="absolute bottom-2 left-2 bg-white/90 text-black text-[10px] px-2 py-1 rounded font-bold">Duotone</span>
                            </div>
                        </div>

                        {/* Code */}
                        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg relative">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">SVG Filter Code</h4>
                            <pre className="font-mono text-xs text-blue-300 whitespace-pre-wrap">{svgCode}</pre>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(svgCode);
                                    toast.success("Copied SVG");
                                }}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                </div>
                <DuotoneGuide />
            </div>
        </DashboardLayout>
    );
}
