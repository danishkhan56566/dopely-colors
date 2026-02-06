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
                '/colors/*', // STOP THE BLEEDING: Disallow infinite color pages
                '/palette/*', // STOP THE BLEEDING: Disallow infinite palette pages
            ],
        },
        sitemap: 'https://dopelycolors.com/sitemap.xml',
    };
}
