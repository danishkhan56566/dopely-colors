import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tailwind Color Generator | Dopely Colors',
    description: 'Generate 50-950 Tailwind CSS color scales from any base color. Export config and check contrast accessibility.',
    alternates: {
        canonical: 'https://dopelycolors.com/tailwind',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
