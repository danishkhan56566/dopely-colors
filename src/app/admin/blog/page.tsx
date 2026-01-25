'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, ExternalLink, RefreshCw, AlertTriangle, FileText, Globe } from 'lucide-react';
import { toast } from 'sonner';

// Define Interface
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    status: 'published' | 'draft';
    published_at: string;
    created_at: string;
    country_focus?: string;
}

export default function AdminBlogPage() {
    // Forced rebuild to clear module cache error
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, slug, status, published_at, created_at, country_focus')
                .order('created_at', { ascending: false });

            if (error) {
                // Determine if it's a "Missing Table" error
                if (error.code === '42P01') { // undefined_table
                    throw new Error('MISSING_TABLE');
                }
                throw error;
            }

            setPosts(data || []);
        } catch (err: any) {
            // Ignore AbortErrors which happen on unmounting/re-renders
            if (err.name === 'AbortError' || err.message?.includes('aborted')) return;

            console.error('Error fetching posts:', err);

            if (err.message === 'MISSING_TABLE' || err?.code === '42P01') {
                setError('MISSING_TABLE');
            } else {
                setError(err?.message || 'Unknown error occurred');
                toast.error(`Failed to load posts: ${err?.message || 'Unknown error'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Post deleted successfully');
            fetchPosts();
        } catch (err) {
            toast.error('Failed to delete post');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // ERROR STATE: Missing Table (SQL Guide)
    if (error === 'MISSING_TABLE') {
        const sqlCode = `
CREATE TABLE IF NOT EXISTS posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  featured_image text,
  author text DEFAULT 'Dopely Team',
  country_focus text,
  seo_title text,
  seo_description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamp with time zone
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage posts" ON posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-amber-900">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                        <h2 className="text-2xl font-bold">Database Not Setup</h2>
                    </div>
                    <p className="mb-6 text-lg">
                        The <code>posts</code> table is missing from your Supabase database. You need to create it before you can manage content.
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Run this SQL in Supabase:</label>
                        <div className="relative">
                            <pre className="bg-white p-4 rounded-xl border border-amber-200 overflow-x-auto text-sm font-mono text-gray-800">
                                {sqlCode}
                            </pre>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(sqlCode);
                                    toast.success('SQL copied to clipboard!');
                                }}
                                className="absolute top-2 right-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                            >
                                Copy SQL
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="https://supabase.com/dashboard/project/_/sql"
                            target="_blank"
                            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition-colors flex items-center gap-2"
                        >
                            <ExternalLink size={18} />
                            Open Supabase SQL Editor
                        </Link>
                        <button
                            onClick={fetchPosts}
                            className="bg-white border border-amber-200 text-amber-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-50 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Check Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Manager</h1>
                    <p className="text-gray-500 mt-1">Manage articles, SEO, and publishing status.</p>
                </div>
                <Link
                    href="/admin/blog/editor"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20} />
                    New Post
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading posts...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No blog posts found</h3>
                    <p className="text-gray-500 mb-6">Create your first article to start ranking on Google.</p>
                    <Link
                        href="/admin/blog/editor"
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Create Post &rarr;
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Focus</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">
                                        /{post.slug}
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.country_focus ? (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md w-fit">
                                                <Globe size={12} />
                                                {post.country_focus}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Live"
                                            >
                                                <ExternalLink size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/blog/editor?id=${post.id}`}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}
