import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/generate'],
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/profile/',
        '/settings/',
        '/generate/',   // Blocks sub-paths but allows the root tool
        '/favorites'    // Private user data
      ],
    },
    sitemap: 'https://dopelycolors.com/sitemap.xml',
  };
}
