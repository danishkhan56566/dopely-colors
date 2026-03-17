import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/generate', '/generate/'],
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/profile/',
        '/settings/',
        // '/generate/',  <-- REMOVED BLOCK: Allow crawlers to see the noindex tag
        '/favorites'    // Private user data
      ],
    },
    sitemap: 'https://dopelycolors.com/sitemap.xml',
  };
}
