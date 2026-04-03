import { getAllPosts } from '@/lib/blog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { AdUnit } from '@/components/ads/AdUnit';

export const metadata = {
    title: 'Design & Color Blog | Dopley Colors',
    description: 'Expert articles on UI design, color theory, accessibility, and Tailwind CSS. Learn how to build better digital products.',
};



// export const dynamic = 'force-dynamic'; // DISABLED
export const revalidate = 3600; // Cache for 1 hour

export default async function BlogIndex() {
    const posts = await getAllPosts();

    // Helper to format Google Drive links to direct image links
    const getPreviewUrl = (url: string) => {
        if (!url) return '';
        const trimmed = url.trim();
        if (trimmed.includes('drive.google.com/file/d/')) {
            const match = trimmed.match(/\/d\/(.*?)\//);
            if (match && match[1]) {
                return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
            }
        }
        return trimmed;
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB]">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-jakarta">Latest Articles</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                    {/* Image Area */}
                                    <div className="w-full aspect-[16/10] bg-gray-100 relative overflow-hidden group-hover:opacity-95 transition-opacity border-b border-gray-100">
                                        {post.featured_image || post.coverImage ? (
                                            <img
                                                src={getPreviewUrl(post.featured_image || post.coverImage || '')}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center relative z-10">
                                                <span className="text-base font-bold text-gray-400 uppercase tracking-widest px-4 text-center">
                                                    {post.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            {post.date || 'LATEST'}
                                        </div>
                                        <h2 className="text-[17px] leading-tight font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3">
                                            {post.title}
                                        </h2>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / Ad Slot */}
                    <aside className="w-full lg:w-80 space-y-8">
                        {/* Search / Categories Placeholder */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {['UI Design', 'Color Theory', 'Accessibility', 'Tailwind CSS', 'Design Systems'].map(cat => (
                                    <li key={cat}>
                                        <Link 
                                            href={`/explore?tag=${cat.toLowerCase().replace(' ', '-')}`}
                                            className="hover:text-blue-600 cursor-pointer transition-colors block py-0.5"
                                        >
                                            • {cat}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>



                        {/* Ad Placeholder (Sidebar) */}
                        <AdUnit slotId="sidebar-123" label="SIDEBAR AD" className="h-[300px]" />
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
}
