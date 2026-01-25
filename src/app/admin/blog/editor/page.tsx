'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Globe, Image as ImageIcon, Eye, BarChart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { generateBlogPost, savePost } from '../actions';

function BlogEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        author: 'Danish Khan',
        country_focus: '',
        seo_title: '',
        seo_description: '',
        status: 'draft',
    });

    // Handle Auto Generate
    const handleAutoGenerate = async () => {
        const topic = window.prompt("What should this post be about? (e.g., 'Red Color Psychology', '2025 Trends', 'Dark Mode UI')");
        if (!topic) return;

        setIsGenerating(true);
        try {
            const generated = await generateBlogPost(topic);
            setFormData(prev => ({
                ...prev,
                ...generated,
                status: 'draft' // Keep as draft so user can review
            }));
            toast.success('✨ Blog post generated!');
        } catch (err) {
            toast.error('Failed to generate content');
        } finally {
            setIsGenerating(false);
        }
    };

    // Fetch existing post if editing
    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (data) {
                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    featured_image: data.featured_image || '',
                    author: data.author || 'Danish Khan',
                    country_focus: data.country_focus || '',
                    seo_title: data.seo_title || '',
                    seo_description: data.seo_description || '',
                    status: data.status || 'draft',
                });
            } else {
                toast.error('Failed to load post');
            }
            setIsLoading(false);
        };

        fetchPost();
    }, [postId]);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from title if slug is empty
        if (name === 'title' && !postId && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    // Handle Save
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Sanitize payload: Remove 'generated' flag if present
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { generated, ...cleanData } = formData as any;

            const payload = {
                ...cleanData,
                updated_at: new Date().toISOString(),
                published_at: formData.status === 'published' ? new Date().toISOString() : null,
            };

            // Pass ID if editing
            if (postId) {
                payload.id = postId;
            }

            // Use Server Action to bypass RLS
            const result = await savePost(payload);

            if (!result.success) throw new Error(result.error);

            toast.success('Post saved successfully!');
            router.push('/admin/blog');
        } catch (err: any) {
            console.error(err);
            toast.error(`Error saving post: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8">Loading editor...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/blog" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="font-bold text-gray-900 text-lg">
                            {postId ? 'Edit Post' : 'New Post'}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {formData.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAutoGenerate}
                            disabled={isGenerating || isSaving}
                            className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Sparkles size={18} className={isGenerating ? 'animate-spin' : ''} />
                            {isGenerating ? 'Dreaming...' : 'Auto Generate'}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isSaving ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Slug */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter impactful title..."
                                className="w-full px-4 py-2 text-lg font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                <span className="text-sm">dopelycolors.com/blog/</span>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="bg-transparent flex-1 outline-none font-mono text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Content (Markdown Supported)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={25}
                            placeholder="# Write your masterpiece here..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm leading-relaxed"
                        ></textarea>
                        <p className="text-xs text-gray-400 mt-2 text-right">Markdown is supported. Use # for headings, ** for bold.</p>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt (Summary)</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Short summary for SEO cards..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        ></textarea>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Publishing */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
                            <Eye size={18} />
                            Publishing
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
                            <ImageIcon size={18} />
                            Media
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Featured Image URL</label>
                            <input
                                type="text"
                                name="featured_image"
                                value={formData.featured_image}
                                onChange={(e) => {
                                    handleChange(e);
                                    setImageLoadError(false);
                                }}
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 mb-2"
                            />
                            {formData.featured_image && formData.featured_image.includes('unsplash.com/photos') && (
                                <div className="text-yellow-600 text-xs mb-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                                    <strong>Warning:</strong> This looks like an Unsplash <em>Page</em> URL. Right-click the image and select "Copy Image Address".
                                </div>
                            )}
                            {formData.featured_image && (
                                <div className="rounded-lg overflow-hidden border border-gray-200 aspect-video relative bg-gray-100 flex items-center justify-center">
                                    {!imageLoadError ? (
                                        <img
                                            src={formData.featured_image.trim()}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                            onError={(e: any) => {
                                                setImageLoadError(true);
                                            }}
                                        />
                                    ) : (
                                        <div className="text-red-500 text-xs p-4 text-center">
                                            <p className="font-bold mb-1">Failed to load image</p>
                                            <p className="text-gray-400">Check the URL or host permissions.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
                            <BarChart size={18} />
                            SEO & Targeting
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Country Focus</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        name="country_focus"
                                        value={formData.country_focus}
                                        onChange={handleChange}
                                        placeholder="US, UK, CA"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Helps with AdSense optimization.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">SEO Title</label>
                                <input
                                    type="text"
                                    name="seo_title"
                                    value={formData.seo_title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">SEO Description</label>
                                <textarea
                                    name="seo_description"
                                    value={formData.seo_description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminBlogEditor() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading Editor...</div>}>
            <BlogEditorContent />
        </Suspense>
    );
}
