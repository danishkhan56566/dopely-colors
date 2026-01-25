import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Log In | Dopely Colors',
    description: 'Sign in to access your saved palettes, favorites, and design systems across devices.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
