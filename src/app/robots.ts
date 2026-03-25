import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/profile/',
        '/settings/',
        '/favorites',
        '/api/auth/', // Keep auth private
      ],
    },
    sitemap: 'https://dopelycolors.com/sitemap.xml',
  };
}
