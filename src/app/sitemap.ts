import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { COLOR_NAMES, getSystematicColors } from '@/lib/color-utils';
import { colorPsychologyDb } from '@/data/colorPsychology';
import { colorTheoryDb } from '@/data/colorTheory';
import chroma from 'chroma-js';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dopelycolors.com';

    // 1. Core Pages
    const coreRoutes = [
        { url: '/', priority: 1.0 },
        { url: '/legal/license', priority: 0.5 },
        { url: '/legal/terms', priority: 0.5 },
        { url: '/legal/privacy', priority: 0.5 },
        { url: '/legal/cookie-policy', priority: 0.5 },
    ];

    // 2. Tools (Rewrites mapped to actual internal routes usually, but if these are the public URLs...)
    // Assuming the public URLs are cleaned up as intended in the comment
    // 2. Tools
    const toolRoutes = [
        '/generate',
        '/explore',
        '/image',
        '/ai',
        '/contrast',
        '/picker',
        '/gradients',
        '/tailwind',
        '/design-system',
        '/color-wheel',
        '/color-mixer',
        '/color-blindness-simulator',
        '/compare-generators',
        // Specific Tools
        '/tools/ai-prompt',
        '/tools/art-extractor',
        '/tools/biometric',
        '/tools/blind-viz',
        '/tools/blindness',
        '/tools/brand',
        '/tools/cognitive-load',
        '/tools/collab-lab',
        '/tools/contrast-grid',
        '/tools/converter',
        '/tools/cross-platform',
        '/tools/cultural',
        '/tools/delta',
        '/tools/design-tokens',
        '/tools/duotone',
        '/tools/dynamic-contrast',
        '/tools/eco-impact',
        '/tools/eco-palette',
        '/tools/fluid',
        '/tools/gamified',
        '/tools/gesture-mix',
        '/tools/glass',
        '/tools/interpolator',
        '/tools/lighting-sim',
        '/tools/linter',
        '/tools/mesh',
        '/tools/micro-interactions',
        '/tools/migrator',
        '/tools/multi-variable',
        '/tools/perf-palette',
        '/tools/seasonal',
        '/tools/shade-generator',
        '/tools/shadows',
        '/tools/spatial',
        '/tools/temporal',
        '/tools/themes',
        '/tools/tokens',
        '/tools/toner',
        '/tools/trend-predictor',
        '/tools/variable-fonts',
        '/tools/voice-color',
        '/tools/wearable',
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

    // 5.5. Color Psychology Hub
    const colorPsychologyIndex = [{ url: '/color-psychology', priority: 0.9 }];
    const colorPsychologyPages = colorPsychologyDb.map((color) => ({
        url: `/color-psychology/${color.slug}`,
        priority: 0.8,
    }));

    // 5.6. Color Theory Hub
    const colorTheoryPages = colorTheoryDb.map((page) => ({
        url: `/color-theory/${page.slug}`,
        priority: 0.8,
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
    // Uses centralized logic from lib/color-utils to ensure sitemap matches allowed specific/static pages
    const systematicColors = getSystematicColors();

    systematicColors.forEach(color => {
        const cleanHex = color.hex.replace('#', '').toUpperCase();
        if (!seenColors.has(cleanHex)) {
            colorRoutes.push({
                url: `${baseUrl}/colors/${cleanHex}/about`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
            });
            seenColors.add(cleanHex);
        }
    });

    // Combine all
    const staticRoutes = [
        ...coreRoutes,
        ...toolRoutes,
        ...discoverRoutes,
        ...guideRoutes,
        ...blogIndex,
        ...colorPsychologyIndex,
    ].map(route => ({
        url: `${baseUrl}${route.url}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route.priority,
    }));

    const dynamicBlogRoutes = [
        ...blogPosts,
        ...colorPsychologyPages,
        ...colorTheoryPages,
    ].map(post => ({
        url: `${baseUrl}${post.url}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: post.priority,
    }));

    return [...staticRoutes, ...dynamicBlogRoutes, ...colorRoutes];
}
