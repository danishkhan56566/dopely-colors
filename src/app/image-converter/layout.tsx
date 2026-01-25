import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Converter | Dopely Colors',
    description: 'Bulk convert images between PNG, JPG, and WebP formats. Secure, fast, and processed entirely in your browser.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
