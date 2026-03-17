import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Compare Color Palette Generators | Dopely Colors',
    description: 'Compare Dopely Colors with other popular tools. See why our AI-driven approach provides superior color balance and professional export options.',
    alternates: {
        canonical: 'https://dopelycolors.com/compare-generators',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
