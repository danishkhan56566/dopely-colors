import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Explore Tailwind CSS Colors | Dopely Colors',
    description: 'Browse curated Tailwind CSS color palettes and production-ready design systems. Get instant config snippets for your Next.js and React apps.',
    alternates: {
        canonical: 'https://dopelycolors.com/explore/tailwind',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
