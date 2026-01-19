import { Heart } from 'lucide-react';
import { PaletteCard } from '../explore/PaletteCard';
import chroma from 'chroma-js';

// Mock popular palettes for the landing page
const POPULAR_PALETTES = [
    { id: '1', likes: 2450, date: '1d ago', colors: ['#2E2E3A', '#EB5E28', '#F25F4C', '#E53170', '#FF8906'], tags: 'dark' },
    { id: '2', likes: 1832, date: '3d ago', colors: ['#0047AB', '#407BA7', '#FFFFFF', '#D9D9D9', '#000814'], tags: 'tech' },
    { id: '3', likes: 1540, date: '5h ago', colors: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'], tags: 'finance' },
    { id: '4', likes: 1200, date: '2d ago', colors: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'], tags: 'retro' },
];

export const CommunitySection = () => {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Loved by designers worldwide</h2>
                    <p className="text-xl text-gray-500">Join thousands creators exploring new color combinations every day.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {POPULAR_PALETTES.map(p => (
                        <PaletteCard key={p.id} {...p} />
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" className="w-full h-full" />
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-2xl text-gray-900 mb-1">10,000+ Palettes Saved</div>
                        <div className="text-gray-500">and counting...</div>
                    </div>
                    <button className="px-8 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors">
                        Explore Community
                    </button>
                </div>
            </div>
        </section>
    );
};
