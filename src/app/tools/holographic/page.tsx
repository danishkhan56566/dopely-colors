'use client';

import { useState, useRef, useMemo, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, Sliders, Play, Maximize2, Box as BoxIcon, Circle, Waves, Zap, Droplets, Shield, Sun, Share2, Settings2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePaletteStore } from '@/store/usePaletteStore';
import clsx from 'clsx';
import { toast } from 'sonner';
import { HolographicGuide } from '@/components/content/GenerativeGuides';

// --- TYPES ---

type GeometryType = 'sphere' | 'torus' | 'cloth';
type MaterialMode = 'holographic' | 'soap' | 'metal' | 'glass';

interface MaterialPreset {
    name: string;
    id: MaterialMode;
    distortion: number;
    iridescence: number;
    opacity: number;
    roughness: number;
    metalness: number;
    refraction: number;
    baseColor?: string;
}

const PRESETS: MaterialPreset[] = [
    { id: 'holographic', name: 'Nano Hologram', distortion: 0.15, iridescence: 0.8, opacity: 1, roughness: 0.1, metalness: 0.5, refraction: 0 },
    { id: 'soap', name: 'Soap Bubble', distortion: 0.4, iridescence: 1.0, opacity: 0.3, roughness: 0.0, metalness: 0.0, refraction: 1.0 },
    { id: 'metal', name: 'Iridescent Chrome', distortion: 0.02, iridescence: 0.6, opacity: 1, roughness: 0.1, metalness: 1.0, refraction: 0 },
    { id: 'glass', name: 'Prism Glass', distortion: 0.05, iridescence: 0.3, opacity: 0.6, roughness: 0.0, metalness: 0.0, refraction: 1.5 },
];

// --- SHADERS ---

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

uniform float uTime;
uniform float uDistortion;
uniform float uSpeed;

// Simplex 3D Noise 
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  
  float noiseVal = snoise(position * 1.5 + uTime * uSpeed * 0.5);
  vec3 pos = position + normal * noiseVal * uDistortion;
  
  vPosition = pos;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

uniform float uTime;
uniform vec3 uBaseColor;
uniform float uIridescence;
uniform float uOpacity;
uniform float uMetalness;
uniform float uRoughness;
uniform float uRefraction;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);
  
  // Fresnel effect
  float fresnel = dot(viewDir, normal);
  fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
  
  // Holographic rainbow mapping
  vec3 holoColor = 0.5 + 0.5 * cos(uTime * 0.5 + vPosition.xyx * 0.5 + vec3(0, 2, 4));
  
  // Refraction simulation (shifting UVs based on normal)
  vec3 refDir = refract(-viewDir, normal, 1.0 / (1.0 + uRefraction));
  vec3 refColor = 0.5 + 0.5 * cos(vPosition.xyz + refDir + uTime * 0.2);
  
  // Composite final color
  vec3 finalColor = mix(uBaseColor, holoColor, fresnel * uIridescence);
  
  // Metalness / Specular
  vec3 reflectDir = reflect(-viewDir, normal);
  float specular = pow(max(dot(reflectDir, vec3(0, 1, 0)), 0.0), 32.0 * (1.1 - uRoughness));
  finalColor += specular * uMetalness * 0.5;
  
  // Add refraction shimmer
  finalColor = mix(finalColor, refColor, uRefraction * 0.2 * fresnel);

  gl_FragColor = vec4(finalColor, uOpacity);
}
`;

// --- 3D SUB-COMPONENTS ---

function MaterialObject({ settings, geometry }: { settings: any; geometry: GeometryType }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uBaseColor: { value: new THREE.Color(settings.color) },
            uDistortion: { value: settings.distortion },
            uIridescence: { value: settings.iridescence },
            uOpacity: { value: settings.opacity },
            uMetalness: { value: settings.metalness },
            uRoughness: { value: settings.roughness },
            uRefraction: { value: settings.refraction },
            uSpeed: { value: settings.speed },
        }),
        []
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
            materialRef.current.uniforms.uBaseColor.value.set(settings.color);
            materialRef.current.uniforms.uDistortion.value = settings.distortion;
            materialRef.current.uniforms.uIridescence.value = settings.iridescence;
            materialRef.current.uniforms.uOpacity.value = settings.opacity;
            materialRef.current.uniforms.uMetalness.value = settings.metalness;
            materialRef.current.uniforms.uRoughness.value = settings.roughness;
            materialRef.current.uniforms.uRefraction.value = settings.refraction;
            materialRef.current.uniforms.uSpeed.value = settings.speed;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += settings.speed * 0.005;
        }
    });

    return (
        <mesh ref={meshRef} scale={1.8}>
            {geometry === 'sphere' && <sphereGeometry args={[1, 128, 128]} />}
            {geometry === 'torus' && <torusKnotGeometry args={[0.7, 0.25, 256, 32]} />}
            {geometry === 'cloth' && <planeGeometry args={[2.5, 2.5, 128, 128]} />}

            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={settings.opacity < 1}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// --- MAIN PAGE ---

export default function MaterialStudioPage() {
    const { colors } = usePaletteStore();
    const [geometry, setGeometry] = useState<GeometryType>('sphere');
    const [activePreset, setActivePreset] = useState<MaterialMode>('holographic');

    const [settings, setSettings] = useState({
        color: '#8b5cf6',
        distortion: 0.15,
        iridescence: 0.8,
        opacity: 1,
        roughness: 0.1,
        metalness: 0.5,
        refraction: 0,
        speed: 1.0
    });

    const applyPreset = (preset: MaterialPreset) => {
        setActivePreset(preset.id);
        setSettings(prev => ({
            ...prev,
            distortion: preset.distortion,
            iridescence: preset.iridescence,
            opacity: preset.opacity,
            roughness: preset.roughness,
            metalness: preset.metalness,
            refraction: preset.refraction
        }));
    };

    const copyConfig = () => {
        const config = JSON.stringify({ geometry, ...settings }, null, 2);
        navigator.clipboard.writeText(config);
        toast.success('Material configuration copied to clipboard!');
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-[#050505] text-white font-sans">

                {/* 3D Canvas Area */}
                <div className="flex-1 relative order-2 lg:order-1 bg-gradient-to-b from-[#0a0a0a] to-[#000]">
                    <div className="absolute top-8 left-8 z-10 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-2xl border border-white/10 px-5 py-2.5 rounded-2xl">
                                <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30">
                                    <Sparkles size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black tracking-widest uppercase text-white/90">Material Studio 2.0</h2>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Ray-Trace Simulation Beta</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="absolute top-8 right-8 z-10 flex gap-2">
                        {(['sphere', 'torus', 'cloth'] as GeometryType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setGeometry(type)}
                                className={clsx(
                                    "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all",
                                    geometry === type
                                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                        : "bg-black/40 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {type === 'sphere' && <Circle size={20} />}
                                {type === 'torus' && <BoxIcon size={20} />}
                                {type === 'cloth' && <Waves size={20} />}
                            </button>
                        ))}
                    </div>

                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-black animate-pulse text-white/20">Waking Geometry Engine...</div>}>
                        <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ antialias: true, alpha: true }}>
                            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                            <ambientLight intensity={0.4} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

                            <PresentationControls global rotation={[0, 0, 0]} polar={[-0.4, 0.2]} azimuth={[-1, 1]}>
                                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                                    <MaterialObject settings={settings} geometry={geometry} />
                                </Float>
                            </PresentationControls>

                            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
                            <Environment preset="city" />
                        </Canvas>
                    </Suspense>

                    <div className="absolute bottom-8 left-8 z-10">
                        <div className="bg-black/60 backdrop-blur-2xl border border-white/5 p-4 rounded-3xl max-w-xs shadow-2xl">
                            <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                                Currently viewing <span className="text-white font-black">{PRESETS.find(p => p.id === activePreset)?.name}</span>.
                                The simulation calculates real-time Fresnel reflection, light absorption, and micro-surface distortion.
                            </p>
                        </div>
                    </div>
                </div>

                {/* UI Sidebar */}
                <div className="w-full lg:w-[420px] bg-[#0c0c0c] border-l border-white/5 flex flex-col z-20 shadow-2xl overflow-y-auto custom-scrollbar">

                    <div className="p-8 border-b border-white/5 space-y-6">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter mb-1">Studio Lab</h1>
                            <p className="text-white/40 text-sm font-medium">Hyper-realistic color-material simulation.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {PRESETS.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => applyPreset(p)}
                                    className={clsx(
                                        "p-4 rounded-2xl border text-left transition-all relative overflow-hidden group",
                                        activePreset === p.id
                                            ? "bg-white border-white"
                                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                    )}
                                >
                                    <div className={clsx("font-black text-xs uppercase tracking-widest", activePreset === p.id ? "text-black" : "text-white/60")}>
                                        {p.name}
                                    </div>
                                    {activePreset === p.id && (
                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Color Grid */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Palette Integration</label>
                            <div className="flex flex-wrap gap-3">
                                {colors.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSettings(s => ({ ...s, color: c.hex }))}
                                        className={clsx(
                                            "w-12 h-12 rounded-2xl border-2 transition-all hover:scale-110",
                                            settings.color === c.hex ? "border-white scale-110 shadow-lg" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: c.hex }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={settings.color}
                                    onChange={(e) => setSettings(s => ({ ...s, color: e.target.value }))}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 cursor-pointer overflow-hidden p-0"
                                />
                            </div>
                        </div>

                        {/* Sliders Area */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center group">
                                    <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors flex items-center gap-2"><Maximize2 size={14} className="text-indigo-400" /> Distortion</span>
                                    <span className="text-[10px] font-mono text-white/40">{settings.distortion.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" value={settings.distortion} onChange={e => setSettings(s => ({ ...s, distortion: parseFloat(e.target.value) }))} className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center group">
                                    <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors flex items-center gap-2"><Sparkles size={14} className="text-pink-400" /> Iridescence</span>
                                    <span className="text-[10px] font-mono text-white/40">{settings.iridescence.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" value={settings.iridescence} onChange={e => setSettings(s => ({ ...s, iridescence: parseFloat(e.target.value) }))} className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <span className="text-xs font-bold text-white/40 flex items-center gap-2"><Droplets size={14} /> Opacity</span>
                                    <input type="range" min="0.1" max="1" step="0.01" value={settings.opacity} onChange={e => setSettings(s => ({ ...s, opacity: parseFloat(e.target.value) }))} className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none" />
                                </div>
                                <div className="space-y-4">
                                    <span className="text-xs font-bold text-white/40 flex items-center gap-2"><Zap size={14} /> Metalness</span>
                                    <input type="range" min="0" max="1" step="0.01" value={settings.metalness} onChange={e => setSettings(s => ({ ...s, metalness: parseFloat(e.target.value) }))} className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none" />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-white/60 flex items-center gap-2"><Play size={14} className="text-green-400" /> Animation Speed</span>
                                    <span className="text-white/30 text-[10px] uppercase font-black">{settings.speed > 0 ? settings.speed.toFixed(1) + 'x' : 'Paused'}</span>
                                </div>
                                <input type="range" min="0" max="4" step="0.1" value={settings.speed} onChange={e => setSettings(s => ({ ...s, speed: parseFloat(e.target.value) }))} className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6">
                            <button
                                onClick={copyConfig}
                                className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/1"
                            >
                                <Copy size={16} /> Export JSON Bundle
                            </button>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-white/5 border border-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white hover:text-black transition-all">
                                    <Share2 size={14} className="inline mr-2" /> Share
                                </button>
                                <button className="flex-1 bg-white/5 border border-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white hover:text-black transition-all">
                                    <Settings2 size={14} className="inline mr-2" /> Source
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <HolographicGuide />
            </div>
        </DashboardLayout>
    );
}
