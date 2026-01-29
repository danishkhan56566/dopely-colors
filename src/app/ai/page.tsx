import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AIAssistant from '@/components/ai/AIAssistant';
import { LockedUI } from '@/components/ai/LockedUI';
import { createClient } from '@/lib/supabase-server';
import { AIGeneratorGuide } from '@/components/content/AIGeneratorGuide';
import { AIFaq, AIHowTo } from '@/components/content/PageFAQs';

export default async function AIPaletteGeneratorPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
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
