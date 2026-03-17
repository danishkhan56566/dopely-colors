import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Color Mixer & Blender | Dopely Colors',
    description: 'Mix and blend colors to discover unique shades. Create smooth color transitions and gradients for professional UI design.',
    alternates: {
        canonical: 'https://dopelycolors.com/color-mixer',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
