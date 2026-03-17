import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Explore Color Palettes & Trends | Dopely Colors',
    description: 'Discover thousands of beautiful color palettes, trending combinations, and expert-curated design schemes for your next project.',
    alternates: {
        canonical: 'https://dopelycolors.com/explore',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
