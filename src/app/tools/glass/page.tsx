import { GlassGuide } from '@/components/content/generated_guides/GlassGuide';
import { Wand2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
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
        <PremiumToolLayout
            guide={<GlassGuide />}
            hideHeader={true}
            title="Glassmorphism CSS Generator"
            description="Create premium frosted glass UI elements with customizable blur, transparency, noise, and specular highlights."
            icon={Wand2}
            badgeText="Tool"
        >
            <GlassmorphismContent />
        </PremiumToolLayout>
    );
}
