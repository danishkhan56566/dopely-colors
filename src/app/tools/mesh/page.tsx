'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Grid, Download, RefreshCw, Layers, Sparkles, Copy } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import clsx from 'clsx';
import { toast } from 'sonner';
import { MeshGuide } from '@/components/content/GenerativeGuides';

// --- Types ---
type MeshNode = {
    id: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    color: string;
    radius: number; // Size in px (or relative)
    opacity: number; // 0-1
};

const INITIAL_NODES: MeshNode[] = [
    { id: '1', x: 20, y: 20, color: '#ff0080', radius: 40, opacity: 1 },
    { id: '2', x: 80, y: 20, color: '#7928ca', radius: 35, opacity: 1 },
    { id: '3', x: 50, y: 50, color: '#4299e1', radius: 50, opacity: 0.8 },
    { id: '4', x: 20, y: 80, color: '#f6ad55', radius: 45, opacity: 1 },
    { id: '5', x: 80, y: 80, color: '#68d391', radius: 40, opacity: 1 },
];

export default function MeshGradientStudio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State
    const [nodes, setNodes] = useState<MeshNode[]>(INITIAL_NODES);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [showWireframe, setShowWireframe] = useState(true);
    const [noise, setNoise] = useState(0);

    // Active Node Helper
    const activeNode = useMemo(() => nodes.find(n => n.id === activeNodeId) || null, [nodes, activeNodeId]);

    // --- Rendering Engine ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize Canvas
        const { width, height } = canvas.getBoundingClientRect();
        // High text scaling
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Render Frame
        const render = () => {
            // Background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);

            // Render Nodes as Radial Gradients
            // We use transparency layers to blend them
            nodes.forEach(node => {
                const nx = (node.x / 100) * width;
                const ny = (node.y / 100) * height;
                const r = (node.radius / 100) * Math.min(width, height) * 2; // Approximate scale

                const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
                // Convert hex to rgba for blending
                // For now, simplify assuming full opacity on stop 0
                g.addColorStop(0, node.color);
                g.addColorStop(1, 'transparent');

                ctx.fillStyle = g;
                ctx.globalAlpha = node.opacity;
                // Composite mode can be 'screen' or 'source-over' depending on desired look
                // 'screen' gives that nice glowing overlap
                ctx.globalCompositeOperation = 'screen';

                ctx.beginPath();
                ctx.arc(nx, ny, r, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            });

            // Noise Overlay? (Can be done via CSS for performance, but canvas is okay too)
            // ...
        };

        render();

    }, [nodes, backgroundColor, activeNodeId]); // Re-render on changes

    // --- Interaction Handlers ---
    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setActiveNodeId(id);
    };

    const handleContainerMouseMove = (e: React.MouseEvent) => {
        if (!activeNodeId || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Clamp
        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        setNodes(prev => prev.map(n => n.id === activeNodeId ? { ...n, x: clampedX, y: clampedY } : n));
    };

    const handleContainerMouseUp = () => {
        // Don't clear active node, just stop dragging logic (which is implicit here since we don't have isDragging state separate)
        // Actually, we need to know if we are clicking vs dragging. 
        // For simple React MVP, activeNodeId stays selected.
    };

    // --- CSS Generation ---
    const generateCSS = () => {
        const layers = nodes.map(node => {
            return `radial-gradient(circle at ${Math.round(node.x)}% ${Math.round(node.y)}%, ${node.color} 0%, transparent ${node.radius}%)`;
        });
        return `background-color: ${backgroundColor};\nbackground-image: ${layers.join(',\n')};`;
    };

    const copyCSS = () => {
        navigator.clipboard.writeText(generateCSS());
        toast.success("CSS Copied!");
    };


    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row" onMouseUp={handleContainerMouseUp}>

                {/* Visual Workspace */}
                <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden bg-gray-100/50">

                    {/* The Canvas / Mesh Area */}
                    <div
                        ref={containerRef}
                        className="relative w-full max-w-4xl aspect-[16/9] bg-white shadow-2xl rounded-[2rem] overflow-hidden group cursor-crosshair border border-white/50 ring-1 ring-black/5"
                        onMouseMove={handleContainerMouseMove}
                    >
                        {/* Rendering Canvas */}
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                        />

                        {/* Noise Overlay (CSS) */}
                        <div
                            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
                            style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`, opacity: noise / 100 }}
                        />

                        {/* Interactive Nodes Overlay */}
                        {showWireframe && nodes.map(node => (
                            <div
                                key={node.id}
                                onMouseDown={(e) => handleMouseDown(e, node.id)}
                                className={clsx(
                                    "absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-md cursor-grab active:cursor-grabbing transition-transform z-10",
                                    activeNodeId === node.id ? "bg-black scale-125 ring-4 ring-black/10" : "bg-white/50 hover:bg-white"
                                )}
                                style={{
                                    left: `${node.x}%`,
                                    top: `${node.y}%`,
                                    boxShadow: `0 0 0 2px ${node.color}`
                                }}
                            />
                        ))}
                    </div>

                    {/* Quick Toolbar */}
                    <div className="absolute bottom-12 flex gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/50">
                        <button onClick={() => setShowWireframe(!showWireframe)} className={clsx("p-3 rounded-xl transition-colors", showWireframe ? "bg-gray-100 text-black" : "text-gray-500 hover:text-black")}>
                            <Layers size={20} />
                        </button>
                        <button onClick={copyCSS} className="px-6 py-3 rounded-xl bg-black text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                            <Copy size={16} /> Copy CSS
                        </button>
                    </div>
                </div>

                {/* Properties Sidebar */}
                <div className="w-full lg:w-96 bg-white border-l border-gray-100 p-6 flex flex-col gap-8 h-auto lg:h-screen overflow-y-auto">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-600 mb-2">
                            <Grid size={20} />
                            <span className="font-bold uppercase tracking-wider text-xs">Mesh Studio</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 leading-tight">Gradient Mesh</h1>
                        <p className="text-gray-500 text-sm">Drag points to sculpt light.</p>
                    </div>

                    {/* Global Settings */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 text-sm">Global Settings</h3>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer relative"
                                style={{ backgroundColor }}
                            >
                                <input type="color" className="absolute inset-0 opacity-0" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Background</span>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-2">
                                <span>Noise Grain</span>
                                <span>{noise}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={noise}
                                onChange={e => setNoise(Number(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                        </div>
                        <button
                            onClick={() => setNodes(INITIAL_NODES)}
                            className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <RefreshCw size={14} /> Reset Canvas
                        </button>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Active Node Selection */}
                    {activeNode ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm mb-4">Selected Point</h3>
                                <div className="w-full aspect-square relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6 custom-picker-wrapper">
                                    <HexColorPicker
                                        color={activeNode.color}
                                        onChange={(c) => setNodes(prev => prev.map(n => n.id === activeNode.id ? { ...n, color: c } : n))}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-2">
                                        <span>Size / Radius</span>
                                        <span>{activeNode.radius}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="150"
                                        value={activeNode.radius}
                                        onChange={(e) => setNodes(prev => prev.map(n => n.id === activeNode.id ? { ...n, radius: Number(e.target.value) } : n))}
                                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-2">
                                        <span>Opacity</span>
                                        <span>{Math.round(activeNode.opacity * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={activeNode.opacity * 100}
                                        onChange={(e) => setNodes(prev => prev.map(n => n.id === activeNode.id ? { ...n, opacity: Number(e.target.value) / 100 } : n))}
                                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center gap-2 opacity-50">
                            <Sparkles size={32} />
                            <p className="text-sm font-medium">Select a point to edit</p>
                        </div>
                    )}
                </div>

                <style jsx global>{`
                    .custom-picker-wrapper .react-colorful {
                        width: 100%;
                        height: 100%;
                    }
                `}</style>

            </div>
        </DashboardLayout>
    );
}
