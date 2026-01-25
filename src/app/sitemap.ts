import { MetadataRoute } from 'next';


import { getAllPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dopelycolors.com';

    // 1. Core Pages
    const coreRoutes = [
        // ... (omitted similar lines for brevity, wait, replace_file_content needs exact match. I should use multi_replace for targeted edits)

        { url: '/', priority: 1.0 },
        { url: '/license', priority: 0.5 },
        { url: '/terms-of-service', priority: 0.5 },
        { url: '/privacy-policy', priority: 0.5 },
        { url: '/cookie-policy', priority: 0.5 },
    ];

    // 2. Tools (Rewrites needed for most)
    const toolRoutes = [
        { url: '/tools', priority: 0.9 }, // Needs page or redirect? Maybe rewrite to /
        { url: '/tools/generate-palettes', priority: 0.9 }, // Rewrite to /generate
        { url: '/tools/explore-popular', priority: 0.8 }, // Rewrite to /explore
        { url: '/tools/extract-from-image', priority: 0.9 }, // Rewrite to /image
        { url: '/tools/ai-palette-generator', priority: 1.0 }, // Rewrite to /ai
        { url: '/tools/contrast-checker', priority: 0.8 }, // Rewrite to /contrast
        { url: '/tools/preview-on-designs', priority: 0.8 }, // Rewrite to /visualize (if exists) or /generate?view=visualize
        { url: '/tools/color-picker', priority: 0.9 }, // Rewrite to /picker
        { url: '/tools/gradient-generator', priority: 0.9 }, // Rewrite to /gradients
        { url: '/tools/tailwind-colors', priority: 1.0 }, // Rewrite to /tailwind
        { url: '/tools/design-system-builder', priority: 1.0 }, // Rewrite to /design-system
        { url: '/tools/typography-generator', priority: 0.8 }, // Placeholder? Rewrite to /design-system for now?
    ];

    // 3. Discover
    const discoverRoutes = [
        { url: '/discover', priority: 0.8 }, // Rewrite to /explore
        { url: '/discover/list-of-colors', priority: 0.7 }, // Rewrite to /explore
        { url: '/discover/browse-gradients', priority: 0.8 }, // Rewrite to /gradients
        { url: '/discover/industry-palettes', priority: 0.8 }, // Rewrite to /explore
        { url: '/discover/trending-palettes', priority: 0.9 }, // Rewrite to /explore
        { url: '/discover/community-palettes', priority: 0.9 }, // Rewrite to /explore
    ];

    // 4. Guides
    const guideRoutes = [
        { url: '/guides', priority: 0.8 },
        { url: '/guides/image-to-palette', priority: 0.7 },
        { url: '/guides/ai-palette-generator', priority: 0.7 },
        { url: '/guides/contrast-checker', priority: 0.7 },
        { url: '/guides/preview-on-designs', priority: 0.7 },
        { url: '/guides/color-picker', priority: 0.7 },
        { url: '/guides/gradient-generator', priority: 0.7 },
        { url: '/guides/tailwind-colors', priority: 0.7 },
        { url: '/guides/design-system-builder', priority: 0.7 },
        { url: '/guides/color-theory', priority: 0.7 },
    ];

    // 4. Blog
    const blogIndex = [{ url: '/blog', priority: 0.8 }];

    // 5. Blog Posts
    const posts = await getAllPosts();
    const blogPosts = posts.map((post) => ({
        url: `/blog/${post.slug}`,
        priority: 0.7, // As requested in XML snippet? Not explicitly there but implies standard blog priority
    }));

    // Combine all
    const allRoutes = [
        ...coreRoutes,
        ...toolRoutes,
        ...discoverRoutes,
        ...guideRoutes,
        ...blogIndex,
    ].map(route => ({
        url: `${baseUrl}${route.url}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route.priority,
    }));

    const dynamicBlogRoutes = blogPosts.map(post => ({
        url: `${baseUrl}${post.url}`,
        lastModified: new Date(), // Should rely on post date ideally
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...allRoutes, ...dynamicBlogRoutes];
}
