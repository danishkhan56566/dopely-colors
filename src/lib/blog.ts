import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// --- Configuration ---
const supabaseUrl = 'https://cafwmpzdgatxpavuwnvh.supabase.co';
const supabaseKey = 'sb_publishable_S5cNoYZ_FXWt9nHOwWGHjg_N1mVxbvV';
const supabase = createClient(supabaseUrl, supabaseKey);

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// --- Types ---
export interface BlogPost {
    id?: string;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    content: string;
    featured_image?: string;
    coverImage?: string; // Legacy support
    author?: string;
    country_focus?: string;
    seo_title?: string;
    seo_description?: string;
}

// --- DB Functions ---

async function getPostsFromDB(): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) throw error; // Allow fallback to catch this

    return (data || []).map((post: any) => ({
        ...post,
        date: post.published_at ? new Date(post.published_at).toLocaleDateString() : '',
        category: post.country_focus ? post.country_focus + ' Focus' : 'Design',
    }));
}

async function getPostFromDB(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) return null;

    return {
        ...data,
        date: data.published_at ? new Date(data.published_at).toLocaleDateString() : '',
        category: data.country_focus ? data.country_focus + ' Focus' : 'Design',
    };
}

// --- File Functions (Fallback) ---

function getPostsFromFiles(): BlogPost[] {
    if (!fs.existsSync(postsDirectory)) return [];

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                content,
                title: data.title,
                excerpt: data.excerpt,
                date: data.date,
                category: data.category,
                coverImage: data.coverImage,
                ...(data as any),
            } as BlogPost;
        });

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function getPostFromFile(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        if (!fs.existsSync(fullPath)) return null;

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            title: data.title,
            excerpt: data.excerpt,
            date: data.date,
            category: data.category,
            coverImage: data.coverImage,
            ...(data as any),
        } as BlogPost;
    } catch (e) {
        return null;
    }
}

// --- Hybrid Exports ---

export async function getAllPosts(): Promise<BlogPost[]> {
    let dbPosts: BlogPost[] = [];
    try {
        dbPosts = await getPostsFromDB();
    } catch (e: any) {
        console.error('Fetching from DB failed:', e.message);
    }

    const filePosts = getPostsFromFiles();

    // Combine posts, prioritizing DB versions if duplicates exist
    const dbSlugs = new Set(dbPosts.map(p => p.slug));
    const allPosts = [...dbPosts];

    filePosts.forEach(post => {
        if (!dbSlugs.has(post.slug)) {
            allPosts.push(post);
        }
    });

    // Sort by date descending
    return allPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    // 1. Try DB first
    try {
        const dbPost = await getPostFromDB(slug);
        if (dbPost) return dbPost;
    } catch (e) {
        console.warn('DB lookup failed for:', slug);
    }

    // 2. Fallback to local file
    return getPostFromFile(slug);
}
