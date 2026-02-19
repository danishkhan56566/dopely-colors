import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock, Twitter, Copy } from 'lucide-react';
import { marked } from 'marked';
import { AdUnit } from '@/components/ads/AdUnit';
import { ShareButtons } from '@/components/blog/ShareButtons';

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
        title: `${post.title} | Dopley Colors`,
        description: post.excerpt,
    };
}

export const revalidate = 3600; // Cache for 1 hour

export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const isHtml = post.content.trim().startsWith('<');
    const htmlContent = isHtml ? post.content : await marked(post.content);

    // Calculate read time (approximate)
    const wordCount = post.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Calculate full URL for sharing
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://dopelycolors.com'}/blog/${post.slug}`;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">
                {/* Global Blog Styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .blog-content {
                        font-family: 'Inter', sans-serif;
                        color: #1a1a1a;
                        line-height: 1.8;
                    }
                    .blog-content p {
                        margin-bottom: 2rem;
                        font-size: 1.125rem; /* 18px */
                        letter-spacing: -0.01em;
                        color: #374151; /* gray-700 */
                    }
                    .blog-content h2 {
                        font-size: 2rem;
                        font-weight: 800;
                        margin-top: 3.5rem;
                        margin-bottom: 1.5rem;
                        color: #111827;
                        letter-spacing: -0.03em;
                    }
                    .blog-content h3 {
                        font-size: 1.5rem;
                        font-weight: 700;
                        margin-top: 2.5rem;
                        margin-bottom: 1rem;
                        color: #1f2937;
                    }
                    .blog-content ul, .blog-content ol {
                        margin-bottom: 2rem;
                        padding-left: 1.5rem;
                    }
                    .blog-content li {
                        margin-bottom: 0.75rem;
                        padding-left: 0.5rem;
                         font-size: 1.125rem;
                         color: #374151;
                    }
                    .blog-content li::marker {
                        color: #3b82f6;
                    }
                    
                    /* Modern Blockquote */
                    .blog-content blockquote {
                        position: relative;
                        margin: 2.5rem 0;
                        padding: 2rem 2.5rem;
                        background: linear-gradient(to right, #f3f4f6, #fff);
                        border-left: 5px solid #3b82f6;
                        border-radius: 8px;
                    }
                    .blog-content blockquote p {
                        font-size: 1.25rem;
                        font-style: italic;
                        color: #4b5563;
                        margin: 0;
                        font-weight: 500;
                    }
                    
                    /* Tables */
                    .blog-content table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                        margin: 2.5rem 0;
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    }
                    .blog-content th {
                        background-color: #f9fafb;
                        color: #111827;
                        font-weight: 600;
                        text-align: left;
                        padding: 1rem 1.5rem;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .blog-content td {
                        padding: 1rem 1.5rem;
                        border-bottom: 1px solid #f3f4f6;
                        color: #4b5563;
                    }
                    .blog-content tr:last-child td {
                        border-bottom: none;
                    }

                    /* Code Blocks */
                    .blog-content pre {
                        background: #1e293b;
                        border-radius: 12px;
                        padding: 1.5rem;
                        margin: 2.5rem 0;
                        overflow-x: auto;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                    }
                    .blog-content code {
                        color: #e2e8f0;
                        font-family: 'JetBrains Mono', monospace;
                        font-size: 0.9em;
                    }
                    
                    /* Links */
                    .blog-content a {
                        color: #2563eb;
                        text-decoration: none;
                        border-bottom: 2px solid rgba(37, 99, 235, 0.1);
                        transition: all 0.2s;
                    }
                    .blog-content a:hover {
                         border-bottom-color: #2563eb;
                         background: rgba(37, 99, 235, 0.05);
                    }

                    /* Images */
                    .blog-content img {
                        border-radius: 12px;
                        margin: 2.5rem 0;
                        width: 100%;
                        height: auto;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                    }
                `}} />

                <article className="max-w-[72ch] mx-auto px-6 py-16">
                    {/* Navigation */}
                    <div className="mb-12">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                <ChevronLeft size={16} className="relative right-[1px]" />
                            </div>
                            Back to Articles
                        </Link>
                    </div>

                    {/* Header */}
                    <header className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {post.category || 'Design'}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar size={14} />
                                {post.date}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock size={14} />
                                {readTime} min read
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
                            {post.excerpt}
                        </p>
                    </header>

                    {/* Featured Image */}
                    {post.featured_image && (
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-16 shadow-xl ring-1 ring-gray-900/5">
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="object-cover w-full h-full transform transition-transform duration-[2s] hover:scale-105"
                            />
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="relative">
                        {/* Share - Desktop Sticky */}
                        <div className="hidden xl:flex flex-col gap-4 fixed top-48 left-[calc(50%-42rem)] w-16 z-10">
                            <ShareButtons url={shareUrl} title={post.title} layout="vertical" />
                        </div>

                        {/* Ad: Top Banner */}
                        <div className="mb-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 p-1">
                            <AdUnit slotId="post-banner-1" label="SPONSORED" className="min-h-[100px] w-full" />
                        </div>

                        {/* Article Text */}
                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />

                        {/* Article Footer / Tags / Share */}
                        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-8 justify-between items-center">
                            <div className="flex gap-2">
                                {/* Tags placeholders */}
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer">
                                    #Design
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer">
                                    #Colors
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-500">Share this article</span>
                                <ShareButtons url={shareUrl} title={post.title} layout="horizontal" />
                            </div>
                        </div>

                        {/* Ad: Bottom Banner */}
                        <div className="mt-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mx-auto max-w-xl">
                            <AdUnit slotId="post-footer-1" label="RECOMMENDED" className="h-[250px] w-full" />
                        </div>

                    </div>
                </article>
            </div>
        </DashboardLayout>
    );
}

// Add helpful CSS for vertical text if needed, or just remove if causing issues.
// .writing-mode-vertical { writing-mode: vertical-rl; }
