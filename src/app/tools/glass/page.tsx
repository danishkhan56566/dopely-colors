import { DashboardLayout } from '@/components/layout/DashboardLayout';
import GlassmorphismContent from './glass-content';

export const metadata = {
    title: 'Glassmorphism Generator - CSS Frosted Glass Effect | Dopely Colors',
    description: 'Generate the perfect frosted glass effect for your UI. Customize blur, transparency, and saturation to create modern, sleek glass cards.',
    alternates: {
        canonical: '/tools/glass',
    },
};

export default function GlassmorphismPage() {
    return (
        <DashboardLayout>
            <GlassmorphismContent />
        </DashboardLayout>
    );
}
