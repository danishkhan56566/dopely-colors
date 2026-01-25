import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { COLOR_NAMES } from '@/lib/color-utils';
import chroma from 'chroma-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dopelycolors.com';

    // 1. Core Pages
    const coreRoutes = [
        { url: '/', priority: 1.0 },
        { url: '/license', priority: 0.5 },
        { url: '/terms-of-service', priority: 0.5 },
        { url: '/privacy-policy', priority: 0.5 },
        { url: '/cookie-policy', priority: 0.5 },
    ];

    // 2. Tools (Rewrites mapped to actual internal routes usually, but if these are the public URLs...)
    // Assuming the public URLs are cleaned up as intended in the comment
    const toolRoutes = [
        '/generate',
        '/explore',
        '/image',
        '/ai',
        '/contrast',
        '/picker',
        '/gradients',
        '/tailwind',
        '/design-system'
    ].map(slug => ({ url: slug, priority: 0.9 }));

    // 3. Discover (Mapped to cleanest public URL)
    const discoverRoutes = [
        '/colors',
        '/gradients',
        '/palettes',
    ].map(slug => ({ url: slug, priority: 0.8 }));

    // 4. Guides
    const guideRoutes = [
        '/guides',
        '/guides/image-to-palette',
        '/guides/ai-palette-generator',
        '/guides/contrast-checker',
        '/guides/preview-on-designs',
        '/guides/color-picker',
        '/guides/gradient-generator',
        '/guides/tailwind-colors',
        '/guides/design-system-builder',
        '/guides/color-theory',
    ].map(slug => ({ url: slug, priority: 0.7 }));

    // 5. Blog
    const blogIndex = [{ url: '/blog', priority: 0.8 }];

    const posts = await getAllPosts();
    const blogPosts = posts.map((post) => ({
        url: `/blog/${post.slug}`,
        priority: 0.7,
    }));

    // 6. Colors (Popular & Named)
    const colorRoutes: MetadataRoute.Sitemap = [];
    const seenColors = new Set<string>();

    // A. Named Colors
    Object.keys(COLOR_NAMES).forEach(hex => {
        const cleanHex = hex.replace('#', '').toUpperCase();
        if (!seenColors.has(cleanHex)) {
            colorRoutes.push({
                url: `${baseUrl}/colors/${cleanHex}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            });
            seenColors.add(cleanHex);
        }
    });

    // B. Generated Popular Colors (Systematic sampling of the color wheel)
    // ~1000 colors ensuring coverage of standard palette
    for (let h = 0; h < 360; h += 10) { // 36 hues
        for (let s = 0.2; s <= 1.0; s += 0.2) { // 5 saturations (0.2, 0.4, 0.6, 0.8, 1.0)
            for (let l = 0.1; l <= 0.9; l += 0.1) { // 9 lightnesses
                const hex = chroma.hsl(h, s, l).hex().replace('#', '').toUpperCase();
                if (!seenColors.has(hex)) {
                    colorRoutes.push({
                        url: `${baseUrl}/colors/${hex}/about`,
                        lastModified: new Date(),
                        changeFrequency: 'yearly',
                        priority: 0.5,
                    });
                    seenColors.add(hex);
                }
            }
        }
    }

    // Combine all
    const staticRoutes = [
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
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicBlogRoutes, ...colorRoutes];
}
