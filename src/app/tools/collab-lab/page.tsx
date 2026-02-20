'use client';
import { CollabLabGuide } from '@/components/content/generated_guides/CollabLabGuide';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Users, MousePointer2, AlertTriangle, Wifi, WifiOff, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Types
type UserPresence = {
    id: string;
    name: string;
    color: string;
    cursor: { x: number, y: number } | null;
    last_active: number;
};

type PaletteUpdate = {
    colors: string[];
    updatedBy: string;
};

// Throttle helper
const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

export default function CollabLabPage() {
    // State
    const [palette, setPalette] = useState(['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']);
    const [myUser, setMyUser] = useState<UserPresence | null>(null);
    const [otherUsers, setOtherUsers] = useState<UserPresence[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isConfigured, setIsConfigured] = useState(true);

    // Refs for realtime tracking
    const channelRef = useRef<RealtimeChannel | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize
    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setIsConfigured(false);
            return;
        }

        // Generate Random User Identity
        const identity: UserPresence = {
            id: crypto.randomUUID(),
            name: `Designer ${Math.floor(Math.random() * 1000)}`,
            color: chroma.random().hex(),
            cursor: null,
            last_active: Date.now()
        };
        setMyUser(identity);

        // Connect to Supabase
        const channel = supabase.channel('collab-lab', {
            config: {
                presence: {
                    key: identity.id,
                },
            },
        });

        channelRef.current = channel;

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState<UserPresence>();
                const users: UserPresence[] = [];

                // Flatten presence state
                Object.values(state).forEach(presences => {
                    presences.forEach(p => {
                        if (p.id !== identity.id) users.push(p);
                    });
                });

                setOtherUsers(users);
            })
            .on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
                setOtherUsers(prev => prev.map(u =>
                    u.id === payload.id ? { ...u, cursor: payload.cursor } : u
                ));
            })
            .on('broadcast', { event: 'color-change' }, ({ payload }: { payload: PaletteUpdate }) => {
                if (payload.updatedBy !== identity.id) {
                    setPalette(payload.colors);
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true);
                    channel.track(identity);
                } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                    setIsConnected(false);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Broadcast Handlers
    const broadcastCursor = useCallback(
        throttle((x: number, y: number) => {
            if (!channelRef.current || !myUser) return;

            channelRef.current.send({
                type: 'broadcast',
                event: 'cursor-move',
                payload: { id: myUser.id, cursor: { x, y } }
            });
        }, 50),
        [myUser]
    );

    const broadcastPalette = (newColors: string[]) => {
        setPalette(newColors);
        if (!channelRef.current || !myUser) return;

        channelRef.current.send({
            type: 'broadcast',
            event: 'color-change',
            payload: { colors: newColors, updatedBy: myUser.id }
        });
    };

    // UI Handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        broadcastCursor(x, y);
    };

    const handleColorChange = (index: number, newColor: string) => {
        const newPalette = [...palette];
        newPalette[index] = newColor;
        broadcastPalette(newPalette);
    };

    return (
        <PremiumToolLayout
            guide={<CollabLabGuide />}
            hideHeader={true}
            title="Real-time Color Lab"
            description="Multiplayer color palette editing and design system building. Work synchronously with your entire design team."
            icon={Wand2}
            badgeText="Tool"
        >
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 relative overflow-hidden">
                <header className="max-w-4xl mx-auto mb-12 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Users size={14} /> Beta
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Real-Time Collaborative Lab</h1>
                    <p className="text-lg text-gray-500 mb-6">
                        Work together. Share links. Create in sync.
                    </p>

                    {/* Connection Status */}
                    {!isConfigured ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-200 text-sm font-medium">
                            <AlertTriangle size={16} /> Supabase Not Configured (Offline Mode)
                        </div>
                    ) : (
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                            {isConnected ? `${otherUsers.length + 1} Active Editor${otherUsers.length !== 0 ? 's' : ''}` : 'Connecting...'}
                        </div>
                    )}
                </header>

                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 min-h-[600px] relative z-0 p-12 flex flex-col items-center justify-center cursor-none hover:cursor-none"
                // Custom cursor logic handled by React rendering
                >

                    {/* Palette Cards */}
                    <div className="flex gap-4 w-full h-80">
                        {palette.map((c, i) => (
                            <motion.div
                                layout
                                key={i}
                                className="flex-1 rounded-3xl relative shadow-sm group hover:flex-[1.2] transition-all duration-300"
                                style={{ backgroundColor: c }}
                            >
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                                    <input
                                        type="color"
                                        value={c}
                                        onChange={(e) => handleColorChange(i, e.target.value)}
                                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="bg-black/20 backdrop-blur-md text-white font-mono text-sm px-3 py-1.5 rounded-xl pointer-events-none">
                                        {c.toUpperCase()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* My Custom Cursor (Visible only inside container) */}
                    {myUser && (
                        <div
                            className="pointer-events-none fixed z-50 flex items-center gap-2"
                            style={{
                                left: 0,
                                top: 0,
                                transform: 'translate(var(--cursor-x), var(--cursor-y))' // Handled via CSS var or state? 
                                // Actually, standard cursor is hidden via CSS class 'cursor-none', 
                                // but we need to track mouse to render OUR cursor. 
                                // simpler: just let default cursor exist but show names for others.
                            }}
                        >
                            {/* We typically don't render our own remote cursor, we use the specific OS cursor. 
                                 But if we wanted a "multiplayer" feel we could hide system cursor. 
                                 For now, let's keep system cursor for better UX. */}
                        </div>
                    )}

                    {/* Remote Cursors Overlay */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
                        <AnimatePresence>
                            {otherUsers.map(u => u.cursor && (
                                <motion.div
                                    key={u.id}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{
                                        left: `${u.cursor.x}%`,
                                        top: `${u.cursor.y}%`,
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1, ease: 'linear' }}
                                    className="absolute z-50"
                                >
                                    <div className="relative">
                                        <MousePointer2
                                            size={24}
                                            color={u.color}
                                            fill={u.color}
                                            className="transform -rotate-12 drop-shadow-md"
                                        />
                                        <div
                                            className="absolute left-6 top-2 px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm whitespace-nowrap"
                                            style={{ backgroundColor: u.color }}
                                        >
                                            {u.name}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 text-center text-gray-400 text-sm max-w-lg">
                        {isConfigured
                            ? "Move your cursor and change colors to verify real-time sync with other open tabs."
                            : "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable real-time features."
                        }
                    </div>

                </div>
            </div>
        </PremiumToolLayout>
    );
}
