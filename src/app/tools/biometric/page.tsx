import { BiometricGuide } from '@/components/content/generated_guides/BiometricGuide';
import { Wand2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import BiometricContent from './biometric-content';

export const metadata = {
    title: 'Biometric Color Simulator - Adaptive Interface Design | Dopely Colors',
    description: 'Simulate how your interface adapts to user stress levels and biometric data. distinct from standard dark/light mode testing.',
    alternates: {
        canonical: '/tools/biometric',
    },
};

export default function BiometricPage() {
    return (
        <PremiumToolLayout
            guide={<BiometricGuide />}
            hideHeader={true}
            title="Biometric Color Engine"
            description="Simulate and measure emotional and physiological responses to complete color systems using AI pattern matching."
            icon={Wand2}
            badgeText="Tool"
        >
            <BiometricContent />
        </PremiumToolLayout>
    );
}
