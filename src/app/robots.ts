import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/tools/*',
                    '/api/*',
                    '/admin/*',
                    '/dashboard/*',
                    '/profile/*',
                    '/settings/*',
                    '/colors/*',
                    '/palette/*',
                    '/generate/*' // Stop generating palettes
                ],
            },
            {
                userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'FacebookBot', 'Anthropic-AI'],
                disallow: ['/']
            }
        ],
        sitemap: 'https://dopelycolors.com/sitemap.xml',
    };
}
