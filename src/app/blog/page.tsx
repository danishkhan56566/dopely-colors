import { getAllPosts } from '@/lib/blog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { AdUnit } from '@/components/ads/AdUnit';

export const metadata = {
    title: 'Design & Color Blog | Dopley Colors',
    description: 'Expert articles on UI design, color theory, accessibility, and Tailwind CSS. Learn how to build better digital products.',
};

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB]">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-jakarta">Latest Articles</h1>
                        <div className="grid gap-8">
                            {posts.map((post) => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium text-xs uppercase tracking-wide">
                                                {post.category}
                                            </span>
                                            <span>{post.date}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <span className="text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 w-fit">
                                            Read Article &rarr;
                                        </span>
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
                                    <li key={cat} className="hover:text-blue-600 cursor-pointer transition-colors">• {cat}</li>
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
