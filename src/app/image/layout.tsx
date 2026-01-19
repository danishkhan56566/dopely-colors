import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image to Palette Generator | PalettePro',
    description: 'Upload an image and extract leading colors instantly. Create harmonious palettes from photos or logos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
