'use client';

import { useState, useRef, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, ContactShadows, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Globe, Box, Maximize, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

// --- COMPONENTS ---

function ColorOrb({ position, color, label }: { position: [number, number, number], color: string, label: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle floating animation
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                    scale={hovered ? 1.2 : 1}
                >
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial
                        color={color}
                        roughness={0.1}
                        metalness={0.4}
                        emissive={color}
                        emissiveIntensity={hovered ? 0.5 : 0.1}
                    />
                </mesh>
                {hovered && (
                    <Text
                        position={[0, 0.8, 0]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="#000000"
                    >
                        {label}
                    </Text>
                )}
            </group>
        </Float>
    );
}

function GridFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#1a1a1a" transparent opacity={0.5} />
            <gridHelper args={[20, 20, 0x444444, 0x222222]} rotation={[-Math.PI / 2, 0, 0]} />
        </mesh>
    );
}

// --- MAIN PAGE ---

export default function ThreeDSpacePage() {
    const [envPreset, setEnvPreset] = useState<'city' | 'sunset' | 'dawn'>('city');

    const MOCK_PALETTE = [
        { color: '#FF3B30', pos: [-2, 0, 0], name: 'Neon Red' },
        { color: '#4CD964', pos: [0, 1.5, -1], name: 'Cyber Green' },
        { color: '#007AFF', pos: [2, 0, 0], name: 'Electric Blue' },
        { color: '#FFD700', pos: [0, -1, 1], name: 'Gold Dust' },
        { color: '#FF2D55', pos: [-1.5, 1, 1.5], name: 'Laser Pink' },
        { color: '#5856D6', pos: [1.5, -1, -1.5], name: 'Deep Void' },
    ];

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-64px)] w-full bg-black relative overflow-hidden flex flex-col">

                {/* Header Overlay */}
                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10"
                    >
                        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                            <span className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                <Box size={24} className="text-white" />
                            </span>
                            3D Space System
                        </h1>
                        <p className="text-gray-400 max-w-sm">
                            Visualize distinct colors in a spatial environment.
                            Rotate and zoom to understand depth relationships.
                        </p>
                    </motion.div>
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-4 pointer-events-auto">
                    <button
                        onClick={() => setEnvPreset('city')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${envPreset === 'city' ? 'bg-white text-black' : 'bg-black/50 text-white hover:bg-white/20'}`}
                    >
                        Night City
                    </button>
                    <button
                        onClick={() => setEnvPreset('sunset')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${envPreset === 'sunset' ? 'bg-white text-black' : 'bg-black/50 text-white hover:bg-white/20'}`}
                    >
                        Sunset
                    </button>
                    <button
                        onClick={() => setEnvPreset('dawn')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${envPreset === 'dawn' ? 'bg-white text-black' : 'bg-black/50 text-white hover:bg-white/20'}`}
                    >
                        Dawn
                    </button>
                </div>

                {/* 3D Scene */}
                <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
                    <Suspense fallback={<Text color="white" position={[0, 0, 0]}>Loading 3D Engine...</Text>}>

                        {/* Lighting */}
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />

                        {/* Environment */}
                        <Environment preset={envPreset} background blur={0.6} />
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                        {/* Objects */}
                        <group>
                            {MOCK_PALETTE.map((item, idx) => (
                                <ColorOrb
                                    key={idx}
                                    // @ts-ignore
                                    position={item.pos}
                                    color={item.color}
                                    label={item.name}
                                />
                            ))}
                        </group>

                        {/* Controls */}
                        <OrbitControls
                            minDistance={4}
                            maxDistance={12}
                            enablePan={false}
                            autoRotate={true}
                            autoRotateSpeed={0.5}
                        />

                        {/* Effects */}
                        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />

                    </Suspense>
                </Canvas>
            </div>
        </DashboardLayout>
    );
}
