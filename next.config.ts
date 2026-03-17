import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-colorful', 'framer-motion', 'date-fns', 'clsx', 'tailwind-merge'],
  },
  images: {
    unoptimized: true, // CRITICAL: Disable server-side image optimization to save Vercel Usage (Fast Origin Transfer)
  },
  async redirects() {
    return [
      // Renames to Canonical
      { source: '/about', destination: '/company', permanent: true },
      { source: '/privacy-policy', destination: '/legal/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/legal/terms', permanent: true },
      { source: '/cookie-policy', destination: '/legal/cookie-policy', permanent: true },
      { source: '/disclaimer', destination: '/legal/disclaimer', permanent: true },
      { source: '/license', destination: '/legal/license', permanent: true },
      { source: '/generator', destination: '/generate', permanent: true },
      { source: '/palette-generator', destination: '/generate', permanent: true },
      { source: '/palettes', destination: '/explore', permanent: true },
      { source: '/saved', destination: '/favorites', permanent: true },
      { source: '/ai-palette-generator', destination: '/ai', permanent: true },
      { source: '/image-to-palette', destination: '/image', permanent: true },
      { source: '/&', destination: '/', permanent: true },
      // Favicon fallback for broken/hashed links
      { source: '/favicon.ico(.+)', destination: '/favicon.ico', permanent: true, has: [{ type: 'query', key: 'favicon' }] },
    ];
  },
  async rewrites() {
    return [
      // Marketing Paths -> Internal Routes (Only if non-permanent or internal only)
      // Tools
      { source: '/tools/generate-palettes', destination: '/generate' },
      { source: '/tools/explore-popular', destination: '/explore' },
      { source: '/tools/extract-from-image', destination: '/image' },
      { source: '/tools/ai-palette-generator', destination: '/ai' },
      { source: '/tools/contrast-checker', destination: '/contrast' },
      { source: '/tools/preview-on-designs', destination: '/generate' }, // Defaults to visualize view via query params?
      { source: '/tools/color-picker', destination: '/picker' },
      { source: '/tools/gradient-generator', destination: '/gradients' },
      { source: '/tools/tailwind-colors', destination: '/tailwind' },
      { source: '/tools/design-system-builder', destination: '/design-system' },
      { source: '/tools/typography-generator', destination: '/design-system' }, // Fallback

      // Discover
      { source: '/discover', destination: '/explore' },
      { source: '/discover/list-of-colors', destination: '/explore' },
      { source: '/discover/browse-gradients', destination: '/gradients' },
      { source: '/discover/industry-palettes', destination: '/explore' },
      { source: '/discover/trending-palettes', destination: '/explore' },
      { source: '/discover/community-palettes', destination: '/explore' },

      // Legacy/SEO Specific (Keep previous ones if needed, or remove if superceded)
      { source: '/gradient-generator', destination: '/gradients' },
      { source: '/contrast-checker', destination: '/contrast' },
      { source: '/tailwind-colors', destination: '/tailwind' },
      { source: '/design-system-builder', destination: '/design-system' },
    ];
  },
};

export default nextConfig;
