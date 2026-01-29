'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AIAssistant from '@/components/ai/AIAssistant';
import { LockedUI } from '@/components/ai/LockedUI';
import { supabase } from '@/lib/supabase';
import { AIGeneratorGuide } from '@/components/content/AIGeneratorGuide';
import { AIFaq, AIHowTo } from '@/components/content/PageFAQs';
import { Loader2 } from 'lucide-react';

export default function AIPaletteGeneratorPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setHasSession(!!session);
            } catch (e) {
                console.error("Auth check failed", e);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Show locked UI immediately for bots/unauth (after check), 
    // but we can serve the static shell instantly.

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-neutral-50 p-4 md:p-8 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            </DashboardLayout>
        );
    }

    if (!hasSession) {
        return <LockedUI />;
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
                <AIAssistant />
                <AIGeneratorGuide />
                <AIFaq />
                <AIHowTo />
            </div>
        </DashboardLayout>
    );
}
