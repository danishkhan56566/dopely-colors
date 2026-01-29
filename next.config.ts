import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-colorful', 'framer-motion', 'date-fns', 'clsx', 'tailwind-merge'],
  },
  async rewrites() {
    return [
      // Marketing Paths -> Internal Routes
      { source: '/about', destination: '/company' },
      { source: '/privacy-policy', destination: '/legal/privacy' },
      { source: '/terms-of-service', destination: '/legal/terms' },

      // Tools
      { source: '/tools', destination: '/' }, // Landing?
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
      { source: '/ai-palette-generator', destination: '/ai' },
      { source: '/image-to-palette', destination: '/image' },
      { source: '/gradient-generator', destination: '/gradients' },
      { source: '/contrast-checker', destination: '/contrast' },
      { source: '/tailwind-colors', destination: '/tailwind' },
      { source: '/design-system-builder', destination: '/design-system' },

      // Fixes for Search Console 404s
      { source: '/saved', destination: '/favorites' },
      { source: '/&', destination: '/' },

      // Development Proxy for Python Backend (Vercel handles this automatically in prod via vercel.json)
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/:path*' : '/api/:path*'
      },
    ];
  },
};

export default nextConfig;
