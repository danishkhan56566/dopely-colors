import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/profile/',
        '/settings/',
        '/generate/',   // Prevents indexing infinite AI generations
        '/favorites'    // Private user data
      ],
    },
    sitemap: 'https://dopelycolors.com/sitemap.xml',
  };
}
