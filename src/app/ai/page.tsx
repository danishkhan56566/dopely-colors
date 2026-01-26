'use client';

import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AIAssistant from '@/components/ai/AIAssistant';
import { Loader2 } from 'lucide-react';

export default function AIPaletteGeneratorPage() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
                <Suspense fallback={
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <Loader2 className="animate-spin text-gray-300" size={32} />
                    </div>
                }>
                    <AIAssistant />
                </Suspense>
            </div>
        </DashboardLayout>
    );
}
