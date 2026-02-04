'use client';

import { useState, useRef, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, Sliders, Play, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

// --- SHADERS ---

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uDistortion;

// Simplex 3D Noise 
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

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

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vUv = uv;
  vNormal = normal;
  
  // Distortion logic
  float noiseVal = snoise(position * 2.5 + uTime * 0.5);
  vec3 pos = position + normal * noiseVal * uDistortion;
  
  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uBaseColor;
uniform float uIridescence;

void main() {
  vec3 viewDir = normalize(cameraPosition - vPosition);
  vec3 normal = normalize(vNormal);
  
  // Iridescence based on view angle (Fresnel-ish)
  float fresnel = dot(viewDir, normal);
  
  // Holographic spectrum generation
  vec3 holoColor = 0.5 + 0.5 * cos(uTime + vPosition.xyx + vec3(0, 2, 4));
  
  // Combine base color with holographic shimmer
  vec3 finalColor = mix(uBaseColor, holoColor, (1.0 - fresnel) * uIridescence);
  
  // Add some metallic shine
  float shine = pow(max(dot(reflect(-viewDir, normal), vec3(0,1,0)), 0.0), 32.0);
  finalColor += shine * 0.5;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// --- COMPONENTS ---

function HolographicOrb({ settings }: { settings: any }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uBaseColor: { value: new THREE.Color(settings.color) },
            uDistortion: { value: settings.distortion },
            uIridescence: { value: settings.iridescence },
        }),
        [] // Create once
    );

    useFrame((state) => {
        if (meshRef.current && materialRef.current) {
            meshRef.current.rotation.y += settings.speed * 0.01;
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
            materialRef.current.uniforms.uBaseColor.value.set(settings.color);
            materialRef.current.uniforms.uDistortion.value = settings.distortion;
            materialRef.current.uniforms.uIridescence.value = settings.iridescence;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <mesh ref={meshRef} scale={2}>
                <sphereGeometry args={[1, 128, 128]} />
                <shaderMaterial
                    ref={materialRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                // transparent
                />
            </mesh>
        </Float>
    );
}

// --- MAIN PAGE ---

export default function HolographicPage() {
    const [settings, setSettings] = useState({
        color: '#8b5cf6', // Initial Purple
        distortion: 0.2,
        iridescence: 0.8,
        speed: 1.0
    });

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-black text-white">

                {/* 3D Canvas Area */}
                <div className="flex-1 relative order-2 lg:order-1">
                    <div className="absolute top-6 left-6 z-10 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2"
                        >
                            <Sparkles size={16} className="text-purple-400" />
                            <span className="font-bold text-sm tracking-widest uppercase">Holo-Engine v1.0</span>
                        </motion.div>
                    </div>

                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <color attach="background" args={['#050505']} />
                        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />

                        <HolographicOrb settings={settings} />

                        <OrbitControls enableZoom={false} />
                    </Canvas>
                </div>

                {/* Controls Sidebar */}
                <div className="w-full lg:w-96 bg-[#0a0a0a] border-l border-white/10 p-8 flex flex-col gap-8 z-20 order-1 lg:order-2 shadow-2xl">

                    <div>
                        <h1 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Holographic
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Generate iridescent fluid materials using WebGL fragment shaders.
                        </p>
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Base Color</label>
                        <div className="grid grid-cols-5 gap-3">
                            {['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#000000', '#ffffff'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setSettings(s => ({ ...s, color: c }))}
                                    className={`w-full aspect-square rounded-full border-2 transition-all ${settings.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                    style={{ background: c }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300 font-medium flex items-center gap-2"><Maximize2 size={14} /> Distortion</span>
                                <span className="text-gray-500 font-mono text-xs">{settings.distortion.toFixed(2)}</span>
                            </div>
                            <input
                                type="range" min="0" max="0.8" step="0.01"
                                value={settings.distortion}
                                onChange={e => setSettings(s => ({ ...s, distortion: parseFloat(e.target.value) }))}
                                className="w-full accent-purple-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300 font-medium flex items-center gap-2"><Sparkles size={14} /> Iridescence</span>
                                <span className="text-gray-500 font-mono text-xs">{settings.iridescence.toFixed(2)}</span>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={settings.iridescence}
                                onChange={e => setSettings(s => ({ ...s, iridescence: parseFloat(e.target.value) }))}
                                className="w-full accent-pink-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300 font-medium flex items-center gap-2"><Play size={14} /> Speed</span>
                                <span className="text-gray-500 font-mono text-xs">{settings.speed.toFixed(1)}x</span>
                            </div>
                            <input
                                type="range" min="0" max="5" step="0.1"
                                value={settings.speed}
                                onChange={e => setSettings(s => ({ ...s, speed: parseFloat(e.target.value) }))}
                                className="w-full accent-blue-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10">
                        <button className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 uppercase tracking-tight">
                            Export Texture (Pro)
                        </button>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
