import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Technical SEO Fix: Google currently reports 'Blocked by robots.txt' for /generate/ and /api/og/ 
 * because the live site is serving a stale robots.txt. This file forces a fresh generation 
 * and explicitly allows all routes required for indexing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/generate/',
        '/api/og/', // Explicitly allow OG images for social sharing & SEO previews
      ],
      disallow: [
        '/admin/',
        '/dashboard/',
        '/profile/',
        '/settings/',
        '/favorites',
        '/api/auth/', // Keep sensitive auth routes private
      ],
    },
    sitemap: 'https://dopelycolors.com/sitemap.xml',
  };
}
