'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Waves, Copy, Shuffle, Play, Pause } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function FluidGradientGenerator() {
    const [colors, setColors] = useState(['#ff80b5', '#9089fc', '#ff0000']);
    const [blur, setBlur] = useState(100);
    const [opacity, setOpacity] = useState(70);
    const [speed, setSpeed] = useState(10); // Check Animation duration
    const [isPlaying, setIsPlaying] = useState(true);

    // CSS Generation
    const generateCSS = () => {
        // We'll generate the HTML/CSS structure for the blobs
        return `
<div class="fluid-gradient">
  ${colors.map((c, i) => `<div class="blob blob-${i}"></div>`).join('\n  ')}
</div>

<style>
.fluid-gradient {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: white;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(${blur}px);
  opacity: ${opacity / 100};
  animation: float ${20 - speed}s infinite ease-in-out;
}
${colors.map((c, i) => `
.blob-${i} {
  background: ${c};
  width: ${300 + i * 50}px;
  height: ${300 + i * 50}px;
  left: ${10 + i * 20}%;
  top: ${10 + i * 10}%;
  animation-delay: -${i * 2}s;
}
`).join('')}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
</style>
        `.trim();
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateCSS());
        toast.success("Copied HTML/CSS");
    };

    const randomize = () => {
        setColors(colors.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)));
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">

                {/* Editor Overlay */}
                <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-xl max-w-sm w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Waves size={20} />
                        </div>
                        <h1 className="font-bold text-gray-900">Fluid Gradient</h1>
                    </div>

                    <div className="space-y-6">
                        {/* Colors */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Colors</label>
                                <button onClick={randomize} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                                    <Shuffle size={12} /> Randomize
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((c, i) => (
                                    <div key={i} className="relative w-10 h-10 rounded-full shadow-sm ring-2 ring-white cursor-pointer overflow-hidden transition-transform hover:scale-110">
                                        <input
                                            type="color"
                                            value={c}
                                            onChange={(e) => {
                                                const newColors = [...colors];
                                                newColors[i] = e.target.value;
                                                setColors(newColors);
                                            }}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Blur Strength: {blur}px</label>
                                <input type="range" min="20" max="200" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-indigo-600" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Opacity: {opacity}%</label>
                                <input type="range" min="10" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-indigo-600" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Animation Speed</label>
                                <input type="range" min="0" max="20" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-indigo-600" />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-900 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                            <button onClick={copyCode} className="flex-[2] py-3 bg-indigo-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                <Copy size={16} /> Copy CSS
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="w-full h-screen bg-white relative overflow-hidden">
                    {/* Blobs */}
                    {colors.map((c, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full mix-blend-multiply opacity-70 animate-blob"
                            style={{
                                backgroundColor: c,
                                width: `${400 + i * 100}px`,
                                height: `${400 + i * 100}px`,
                                left: `${20 + i * (i % 2 === 0 ? 10 : -10)}%`,
                                top: `${10 + i * 5}%`,
                                filter: `blur(${blur}px)`,
                                opacity: opacity / 100,
                                animationDuration: `${(20 - speed) + i * 2}s`,
                                animationPlayState: isPlaying ? 'running' : 'paused',
                                animationDelay: `-${i * 5}s`
                            }}
                        />
                    ))}
                    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                        <h2 className="text-8xl font-black text-white mix-blend-overlay tracking-tighter opacity-50 select-none">Fluid.</h2>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob {
                        animation: blob infinite ease-in-out;
                    }
                `}</style>
            </div>
        </DashboardLayout>
    );
}
