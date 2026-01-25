import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Color Palette Generator | Dopely Colors',
    description: 'Generate stunning color palettes from text prompts, images, or base colors using artificial intelligence.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
