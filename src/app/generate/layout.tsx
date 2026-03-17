import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Color Palette Generator | Dopely Colors',
    description: 'The world\'s most intelligent AI color palette generator. Experience the future of color inspiration with predictive AI and professional design systems.',
    alternates: {
        canonical: 'https://dopelycolors.com/generate',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
