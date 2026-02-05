import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/tools/*', // Stop indexing dynamic tools to save ISR
                '/api/*',   // Stop hitting API
                '/admin/*',
                '/dashboard/*',
                '/profile/*',
                '/settings/*',
            ],
        },
        sitemap: 'https://dopelycolors.com/sitemap.xml',
    };
}
