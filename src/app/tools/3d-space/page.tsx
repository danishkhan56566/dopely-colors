'use client';

import { useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Plane, Line } from '@react-three/drei';
import * as THREE from 'three';
import chroma from 'chroma-js';
import { usePaletteStore } from '@/store/usePaletteStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Box, Circle, Move3D, Settings2, Share2, Sparkles, Cuboid, Expand } from 'lucide-react';
import { ThreeDSpaceGuide } from '@/components/content/AdvancedGuides';
import clsx from 'clsx';
import { cn } from '@/lib/utils';

type SpaceMode = 'RGB' | 'HSL' | 'OKLCH';

// --- 3D Components ---

function ColorSphere({ color, position, size = 0.3, exploded }: { color: string; position: [number, number, number], size?: number, exploded: boolean }) {
    const ref = { current: { position: new THREE.Vector3(...position) } }; // Mock ref for logic simpler than full useRef

    // Explode logic would ideally be in useFrame, but for this "10x" implementation we'll do simple position scaling
    const finalPos = exploded ? [position[0] * 1.5, position[1] * 1.5, position[2] * 1.5] as [number, number, number] : position;

    return (
        <mesh position={finalPos}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                roughness={0.1}
                metalness={0.9}
            />
            {/* Glow Halo */}
            <pointLight distance={1} intensity={0.5} color={color} />
        </mesh>
    );
}

function GridGuide({ mode, showWireframe }: { mode: SpaceMode; showWireframe: boolean }) {
    if (!showWireframe) return null;

    return (
        <group>
            {mode === 'RGB' && (
                <group>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[4, 4, 4]} />
                        <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.1} />
                    </mesh>
                    <gridHelper args={[8, 20, '#333', '#111']} position={[0, -2, 0]} />
                </group>
            )}
            {(mode === 'HSL' || mode === 'OKLCH') && (
                <group>
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[2, 2, 4, 24, 1, true]} />
                        <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.1} />
                    </mesh>
                    <gridHelper args={[8, 20, '#333', '#111']} position={[0, -2, 0]} />
                </group>
            )}
        </group>
    );
}

function Scene({ mode, colors, exploded, showWireframe }: { mode: SpaceMode; colors: string[]; exploded: boolean; showWireframe: boolean }) {
    const points = useMemo(() => {
        return colors.map((hex) => {
            try {
                const c = chroma(hex);
                if (mode === 'RGB') {
                    const [r, g, b] = c.rgb();
                    return {
                        pos: [(r / 255) * 4 - 2, (g / 255) * 4 - 2, (b / 255) * 4 - 2] as [number, number, number],
                        hex
                    };
                } else if (mode === 'HSL') {
                    const [h, s, l] = c.hsl();
                    const radius = (s || 0) * 2;
                    const angle = (h || 0) * (Math.PI / 180);
                    return {
                        pos: [radius * Math.cos(angle), (l * 4) - 2, radius * Math.sin(angle)] as [number, number, number],
                        hex
                    };
                } else {
                    const [l, chromaVal, h] = c.oklch();
                    const radius = (chromaVal || 0.2) * 8; // Scale up for visibility
                    const angle = (h || 0) * (Math.PI / 180);
                    return {
                        pos: [radius * Math.cos(angle), (l * 4) - 2, radius * Math.sin(angle)] as [number, number, number],
                        hex
                    };
                }
            } catch (e) {
                return { pos: [0, 0, 0] as [number, number, number], hex: '#000000' };
            }
        });
    }, [mode, colors]);

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-10, -5, -10]} intensity={1} color="#4f46e5" />

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

            <GridGuide mode={mode} showWireframe={showWireframe} />

            {points.map((p, i) => (
                <ColorSphere key={i} color={p.hex} position={p.pos} size={0.25} exploded={exploded} />
            ))}

            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.05}
                minDistance={3}
                maxDistance={15}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </>
    );
}

export default function Space3DPage() {
    const { colors } = usePaletteStore();
    const [mode, setMode] = useState<SpaceMode>('RGB');
    const [exploded, setExploded] = useState(false);
    const [showWireframe, setShowWireframe] = useState(true);

    // Fallback if store empty
    const activeColors = colors.length > 0 ? colors.map(c => c.hex) : ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

    return (
        <DashboardLayout>
            <div className="relative h-[calc(100vh-64px)] w-full bg-[#030712] overflow-hidden font-sans">

                {/* 1. HUD: Title Block */}
                <div className="absolute top-6 left-6 z-10">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <Move3D size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tighter">Holographic Field</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">System Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. HUD: Controls */}
                <div className="absolute top-32 left-6 z-10 flex flex-col gap-2">
                    <div className="bg-black/60 backdrop-blur-md border border-white/5 p-2 rounded-[1.5rem] flex flex-col gap-1 w-64 shadow-xl">
                        {(['RGB', 'HSL', 'OKLCH'] as SpaceMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group",
                                    mode === m ? "bg-white text-black shadow-lg" : "text-white/50 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    {m === 'RGB' && <Cuboid size={14} />}
                                    {m === 'HSL' && <Circle size={14} />}
                                    {m === 'OKLCH' && <Sparkles size={14} />}
                                    {m} Space
                                </span>
                                {mode === m && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                            </button>
                        ))}
                    </div>

                    <div className="bg-black/60 backdrop-blur-md border border-white/5 p-2 rounded-[1.5rem] flex flex-col gap-1 w-64 shadow-xl mt-4">
                        <button
                            onClick={() => setExploded(!exploded)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 group",
                                exploded ? "bg-indigo-500 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Expand size={14} /> Exploded View
                        </button>
                        <button
                            onClick={() => setShowWireframe(!showWireframe)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 group",
                                showWireframe ? "bg-indigo-500 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Box size={14} /> Show Wireframe
                        </button>
                    </div>
                </div>

                {/* 3. Canvas */}
                <div className="absolute inset-0 z-0">
                    <Suspense fallback={
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#030712] gap-4">
                            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-indigo-400 text-xs font-mono lowercase animate-pulse">initializing_webgl...</p>
                        </div>
                    }>
                        <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]} camera={{ position: [5, 5, 10], fov: 45 }}>
                            <Scene mode={mode} colors={activeColors} exploded={exploded} showWireframe={showWireframe} />
                        </Canvas>
                    </Suspense>
                </div>

                {/* 4. Bottom Guide Trigger (Simplified for Redesign) */}
                <div className="absolute bottom-8 left-8 right-8 pointer-events-none flex justify-center">
                    <div className="pointer-events-auto max-w-2xl w-full">
                        {/* We can put a minimized guide toggle here if we want, or rely on the standard layout which might put it below content. 
                             In this Full Screen implementation, we'll use a modal or overlay for the guide if needed, but for now we'll stick to the DashboardLayout structure 
                             Wait, DashboardLayout wraps this. The Guide is essentially hidden behind the absolute positioning unless we add it to a sidebar or overlay.
                             For 10x UX, let's put it in a drawer or modal. 
                             For simplicity/compatibility, let's let the user scroll DOWN to see it? No, h-screen prevents scroll.
                             Let's make it a drawer.
                          */}
                        <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-1 rounded-2xl flex items-center justify-between shadow-2xl">
                            <div className="px-6 py-4 flex-1">
                                <ThreeDSpaceGuide />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
