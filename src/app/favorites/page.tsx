import { DashboardLayout } from '@/components/layout/DashboardLayout';
import FavoritesContent from './favorites-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Favorites - Dopely Colors',
    robots: {
        index: false,
        follow: false,
    },
};

export default function Favorites() {
    return (
        <DashboardLayout>
            <FavoritesContent />
        </DashboardLayout>
    );
}
