import { Star } from 'lucide-react';
import FeaturedManager from './FeaturedManager';
import { getFeaturedPalettes } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminFeaturedPage() {
    const featuredPalettes = await getFeaturedPalettes();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Featured Palettes</h1>
                    <p className="text-gray-500 text-sm mt-1">Control what appears on the homepage to all users.</p>
                </div>
                <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-yellow-200 shadow-sm text-sm">
                    <Star size={16} className="fill-yellow-500 text-yellow-500" />
                    Changes reflect immediately
                </div>
            </div>

            <FeaturedManager initialPalettes={featuredPalettes} />
        </div>
    );
}
