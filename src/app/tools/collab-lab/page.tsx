'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';

// Simulate Other Users
const FAKE_USERS = [
    { id: 'alice', name: 'Alice', color: '#ff0000', cursor: { x: 20, y: 30 } },
    { id: 'bob', name: 'Bob', color: '#00ff00', cursor: { x: 80, y: 50 } },
    { id: 'charlie', name: 'Charlie', color: '#0000ff', cursor: { x: 50, y: 80 } },
];

export default function CollabLabPage() {
    const [palette, setPalette] = useState(['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']);
    const [users, setUsers] = useState(FAKE_USERS);
    const [activeUser, setActiveUser] = useState<string | null>(null); // "Who is editing"

    // Simulate Cursor Movement & Edits
    useEffect(() => {
        const interval = setInterval(() => {
            setUsers(prev => prev.map(u => ({
                ...u,
                cursor: {
                    x: Math.max(0, Math.min(100, u.cursor.x + (Math.random() - 0.5) * 10)),
                    y: Math.max(0, Math.min(100, u.cursor.y + (Math.random() - 0.5) * 10))
                }
            })));

            // Randomly "edit" a color
            if (Math.random() > 0.8) {
                const randomUserIndex = Math.floor(Math.random() * FAKE_USERS.length);
                const randomUser = FAKE_USERS[randomUserIndex];
                const randomColorIndex = Math.floor(Math.random() * 5);

                setActiveUser(randomUser.id);
                setPalette(prev => {
                    const newP = [...prev];
                    newP[randomColorIndex] = chroma.random().hex();
                    return newP;
                });

                setTimeout(() => setActiveUser(null), 500);
            }

        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 relative overflow-hidden">
                <header className="max-w-4xl mx-auto mb-12 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Users size={14} /> Beta
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Real-Time Palette Lab</h1>
                    <p className="text-lg text-gray-500">
                        Collaborate with your team. See cursors and edits in real-time. (Simulation Mode)
                    </p>
                </header>

                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[500px] relative z-0 p-12 flex flex-col items-center justify-center">

                    {/* Palette Cards */}
                    <div className="flex gap-4 w-full">
                        {palette.map((c, i) => (
                            <motion.div
                                layout
                                key={i}
                                className="h-64 flex-1 rounded-2xl relative shadow-sm group"
                                style={{ backgroundColor: c }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-black/50 text-white font-mono text-xs px-2 py-1 rounded">{c}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Fake Cursors Overlay */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {users.map(u => (
                            <motion.div
                                key={u.id}
                                animate={{ left: `${u.cursor.x}%`, top: `${u.cursor.y}%` }}
                                transition={{ duration: 1, ease: "linear" }}
                                className="absolute flex flex-col items-start z-50"
                            >
                                <MousePointer2
                                    size={24}
                                    color={u.color}
                                    fill={u.color}
                                    className="transform -rotate-12"
                                />
                                <div
                                    className="bg-white text-[10px] font-bold px-2 py-0.5 rounded shadow ml-4 -mt-2 whitespace-nowrap"
                                    style={{ color: u.color }}
                                >
                                    {u.name} {activeUser === u.id && '(Editing...)'}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>

                <div className="max-w-xl mx-auto mt-12 text-center text-gray-400 text-sm">
                    This is a simulation of the websocket architecture. In the production version,
                    this connects to a Firebase Realtime Database to sync state across real clients.
                </div>
            </div>
        </DashboardLayout>
    );
}
