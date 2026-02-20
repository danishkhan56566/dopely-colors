import { LandingPage } from '@/components/landing/LandingPage';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Dopely Colors – AI Color Palette Generator for Designers & Developers',
  description: 'Generate beautiful color palettes, gradients, and design systems with AI. The world\'s most intelligent color toolkit for designers and developers.',
  alternates: {
    canonical: 'https://dopelycolors.com',
  },
  openGraph: {
    title: 'Dopely Colors – AI Color Palette Generator',
    description: 'Build smarter color systems instantly with our AI-powered engine.',
    url: 'https://dopelycolors.com',
    siteName: 'Dopely Colors',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dopely Colors – AI Color Toolkit',
    description: 'Generate production-ready color systems in seconds.',
  },
};

// Vercel Optimization: Force Static Generation
// This ensures the page is built ONCE at build time and cached at the Edge.
// It will not use Serverless Function execution on every request.
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour (incremental static regeneration)

export default async function Page() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);
  return <LandingPage recentPosts={recentPosts} />;
}
