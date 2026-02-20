import { MeshGuide } from '@/components/content/generated_guides/MeshGuide';
import { Wand2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import MeshGradientContent from './mesh-content';

export const metadata = {
    title: 'Mesh Gradient Studio - Create Aurora & Multi-Point Gradients | Dopely Colors',
    description: 'Craft complex, multi-point mesh gradients. Drag and drop color nodes to create soft, dreamlike auroras and backgrounds for your modern UI.',
    alternates: {
        canonical: '/tools/mesh',
    },
};

export default function MeshGradientPage() {
    return (
        <PremiumToolLayout
            guide={<MeshGuide />}
            hideHeader={true}
            title="Mesh Gradient Maker"
            description="Visually drag and drop control nodes to create ultra-smooth organic multi-color gradients."
            icon={Wand2}
            badgeText="Tool"
        >
            <MeshGradientContent />
        </PremiumToolLayout>
    );
}
