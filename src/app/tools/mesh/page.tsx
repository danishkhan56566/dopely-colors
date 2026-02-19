import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
        <DashboardLayout>
            <MeshGradientContent />
        </DashboardLayout>
    );
}
