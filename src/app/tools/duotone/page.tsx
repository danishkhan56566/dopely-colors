import { DuotoneGuide } from '@/components/content/generated_guides/DuotoneGuide';
import { Wand2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import DuotoneContent from './duotone-content';

export const metadata = {
    title: 'Duotone Generator - Create Spotify-Style SVG Effects | Dopely Colors',
    description: 'Turn images into brand assets with SVG spectral filtering. Map highlights and shadows to specific brand colors for a cohesive look.',
    alternates: {
        canonical: '/tools/duotone',
    },
};

export default function DuotoneLab() {
    return (
        <PremiumToolLayout
            guide={<DuotoneGuide />}
            hideHeader={true}
            title="Duotone Image Generator"
            description="Upload images and apply striking Spotify-like duotone filters in seconds. Export in ultra high-resolution."
            icon={Wand2}
            badgeText="Tool"
        >
            <DuotoneContent />
        </PremiumToolLayout>
    );
}
