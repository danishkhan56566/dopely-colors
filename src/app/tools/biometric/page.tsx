import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
        <DashboardLayout>
            <BiometricContent />
        </DashboardLayout>
    );
}
