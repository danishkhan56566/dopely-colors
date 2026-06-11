import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { ArrowRight, BookOpen } from 'lucide-react';

export async function RelatedLinks({ currentSlug }: { currentSlug?: string }) {
    const posts = await getAllPosts();
    
    // Filter out the current post, and grab 3 random or latest posts
    const availablePosts = posts.filter(p => p.slug !== currentSlug);
    
    // Find category of current post, if any, to prioritize related content
    const currentPost = posts.find(p => p.slug === currentSlug);
    
    const relatedByCategory = currentPost?.category 
        ? availablePosts.filter(p => p.category === currentPost.category) 
        : [];
    
    const remainingPosts = availablePosts.filter(p => p.category !== currentPost?.category);
    
    // Prioritize same category, then fallback to latest
    const selected = [...relatedByCategory, ...remainingPosts].slice(0, 3);

    if (selected.length === 0) return null;

    return (
        <div className="mt-16 py-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center gap-2 mb-8">
                    <BookOpen size={24} className="text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Related Learning & Tools</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selected.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3 block">
                                    {post.category || 'Article'}
                                </span>
                                <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center text-sm font-bold text-blue-600 gap-1 mt-auto">
                                    Read Article
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
