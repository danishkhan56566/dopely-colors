'use client';

import { useEffect, useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import dynamic from 'next/dynamic';
import { LockedUI } from '@/components/ai/LockedUI';
import { supabase } from '@/lib/supabase';
import { ToolContentBlock } from '@/components/seo/ToolContentBlock';
import { aiSEOData } from '@/content/seo/ai';
import { Loader2 } from 'lucide-react';

// Dynamically import AIAssistant to reduce initial bundle size
const AIAssistant = dynamic(() => import('@/components/ai/AIAssistant'), {
    loading: () => (
        <div className="w-full h-[600px] flex items-center justify-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm mb-12">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                <p className="text-sm font-medium text-gray-400">Initializing AI Engine...</p>
            </div>
        </div>
    ),
    ssr: false
});

export default function AIPaletteGeneratorPage() {
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Race between auth check and a 4-second timeout
                // This prevents the UI from hanging if Supabase is unreachable/slow
                const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) => {
                    setTimeout(() => resolve({ data: { session: null } }), 4000);
                });

                const authPromise = supabase.auth.getSession();

                const { data: { session } } = await Promise.race([authPromise, timeoutPromise]);
                setHasSession(!!session);
            } catch (e) {
                console.error("Auth check failed", e);
                // Default to no session on error
                setHasSession(false);
            } finally {
                setIsLoadingAuth(false);
            }
        };

        checkAuth();
    }, []);

    // If auth failed/not logged in, show Locked UI
    if (!isLoadingAuth && !hasSession) {
        return <LockedUI />;
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-neutral-50 px-4 md:px-8 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* The AI Tool (Protected/Dynamic) */}
                    {isLoadingAuth ? (
                        <div className="w-full h-[600px] flex items-center justify-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm mb-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <AIAssistant />
                    )}

                    {/* Static Content (Immediate Load) */}
                    <div className="mt-20">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                            <ToolContentBlock {...aiSEOData} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
