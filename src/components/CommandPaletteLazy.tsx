'use client';

import dynamic from 'next/dynamic';

const CommandPaletteDynamic = dynamic(
    () => import('./CommandPalette').then(mod => mod.CommandPalette),
    { ssr: false }
);

export function CommandPaletteLazy() {
    return <CommandPaletteDynamic />;
}
