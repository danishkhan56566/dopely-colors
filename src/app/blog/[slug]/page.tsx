import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { marked } from 'marked';
import { AdUnit } from '@/components/ads/AdUnit';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Not Found',
        };
    }

    return {
        title: `${post.title} | Dopley Colors Blog`,
        description: post.excerpt,
    };
}



// export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const isHtml = post.content.trim().startsWith('<');
    const htmlContent = isHtml ? post.content : await marked(post.content);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB]">
                {/* Style override for Tiptap Tables and Blocks */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .blog-content table {
                        border-collapse: collapse;
                        table-layout: fixed;
                        width: 100%;
                        margin: 2rem 0;
                        overflow: hidden;
                    }
                    .blog-content table td, .blog-content table th {
                        border: 1px solid #e2e8f0;
                        padding: 12px 16px;
                        min-width: 1em;
                        position: relative;
                        text-align: left;
                        vertical-align: top;
                    }
                    .blog-content table th {
                        background-color: #f8fafc;
                        font-weight: bold;
                    }
                    .blog-content blockquote {
                        border-left: 4px solid #3b82f6;
                        padding-left: 1.5rem;
                        font-style: italic;
                        color: #475569;
                        background: #f1f5f9;
                        padding: 1rem 1.5rem;
                        border-radius: 0 0.5rem 0.5rem 0;
                    }
                `}} />

                <article className="max-w-4xl mx-auto px-6 py-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                        <ChevronLeft size={20} />
                        Back to Blog
                    </Link>

                    <header className="mb-12">
                        {post.featured_image && (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-sm border border-gray-100">
                                <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium text-xs uppercase tracking-wide">
                                {post.category}
                            </span>
                            <span>{post.date}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight font-jakarta">
                            {post.title}
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            {post.excerpt}
                        </p>
                    </header>

                    {/* Content & Sidebar Layout */}
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-1">
                            {/* In-Content Ad Placeholder (Top) */}
                            <AdUnit slotId="post-banner-1" label="TOP BANNER AD" className="h-[100px] mb-8" />

                            <div
                                className="prose prose-lg prose-slate max-w-none blog-content
                                prose-headings:font-bold prose-headings:text-gray-900
                                prose-p:text-gray-600 prose-p:leading-relaxed
                                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-gray-900"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </div>

                        {/* Article Sidebar (TOC / Ads) */}
                        <aside className="w-full lg:w-64 space-y-8 hidden lg:block">
                            <div className="sticky top-24 space-y-8">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Share this</h4>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                            Twitter
                                        </button>
                                        <button className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <AdUnit slotId="post-sidebar-1" label="SKYSCRAPER AD" className="h-[600px]" />
                            </div>
                        </aside>
                    </div>
                </article>
            </div>
        </DashboardLayout>
    );
}
