import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tailwind Color Scales Explained | Dopely Colors',
    description: 'Tailwind CSS uses structured color scales to maintain consistency across UI components. Learn how to generate and use them.',
};

export default function TailwindGuide() {
    return (
        <article className="prose prose-cyan prose-lg max-w-none">
            <Link href="/guides" className="no-underline text-sm font-bold text-gray-500 hover:text-cyan-600 flex items-center gap-2 mb-8 not-prose">
                <ArrowLeft size={16} /> Back to Guides
            </Link>

            <h1>Tailwind Color Scales Explained</h1>

            <p className="lead text-xl text-gray-600">
                Tailwind CSS uses structured color scales to maintain consistency across UI components. Each color includes multiple shades for backgrounds, borders, and text.
            </p>

            <p>
                Tailwind color generators automate this process by creating balanced color scales from a single base color. This saves time and ensures predictable results.
            </p>
            <p>
                This guide explains how to use generated Tailwind colors effectively in frontend projects.
            </p>

            <hr className="my-10 border-gray-100" />

            <h2>Why This Matters</h2>
            <p>
                A single color (e.g., "Blue") isn't enough for a UI. You need a light shade for backgrounds (`bg-blue-50`), a medium shade for borders (`border-blue-200`), and a dark shade for text (`text-blue-900`). Creating these variations manually is inconsistent. A generator ensures mathematical precision across lightness and saturation curves.
            </p>

            <h2>Try the Tool</h2>
            <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100 not-prose my-8">
                <h3 className="font-bold text-cyan-900 text-lg mb-2">Generate Tailwind Scales</h3>
                <p className="text-cyan-800 mb-4">
                    Turn one hex code into a full 50-950 Tailwind palette ready for your config file.
                </p>
                <Link href="/tailwind" className="inline-block bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-700 transition-colors">
                    Generate Scales
                </Link>
            </div>

            <h2>Frequently Asked Questions</h2>

            <h3>Where do I paste the generated colors?</h3>
            <p>
                You paste them into your `tailwind.config.js` file under `theme.extend.colors`. This allows you to use them alongside the default Tailwind colors.
            </p>

            <h3>How is this different from opacity?</h3>
            <p>
                Using opacity (e.g., `bg-blue-500/10`) makes the color transparent, which can show elements behind it. A generated shade like `bg-blue-50` is a solid, opaque color, which is usually preferred for reliable backgrounds.
            </p>
        </article>
    );
}
