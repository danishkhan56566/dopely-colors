import Generator from '@/components/Generator';
import { Suspense } from 'react';

export function generateStaticParams() {
    return [];
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Generator />
        </Suspense>
    );
}
