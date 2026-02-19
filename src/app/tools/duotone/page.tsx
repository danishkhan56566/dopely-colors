import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
        <DashboardLayout>
            <DuotoneContent />
        </DashboardLayout>
    );
}
