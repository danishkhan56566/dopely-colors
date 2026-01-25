import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How to Create Professional Color Gradients | Dopely Colors',
    description: 'Gradients add depth and visual interest to modern UI designs. Gradient generators help designers create smooth transitions between colors.',
};

export default function GradientGeneratorGuide() {
    return (
        <article className="prose prose-indigo prose-lg max-w-none">
            <Link href="/guides" className="no-underline text-sm font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-2 mb-8 not-prose">
                <ArrowLeft size={16} /> Back to Guides
            </Link>

            <h1>How to Create Professional Color Gradients</h1>

            <p className="lead text-xl text-gray-600">
                Gradients add depth and visual interest to modern UI designs. Gradient generators help designers create smooth transitions between colors without manual tweaking.
            </p>

            <p>
                By previewing gradients on cards and backgrounds, designers can ensure readability and visual harmony. Exporting gradients in CSS-ready formats makes implementation easy for developers.
            </p>
            <p>
                Gradients are widely used in hero sections, buttons, and branding visuals.
            </p>

            <hr className="my-10 border-gray-100" />

            <h2>Why This Matters</h2>
            <p>
                Flat design is evolving. Subtle gradients (often called "mesh" or "aurora" gradients) make interfaces feel more organic and premium. However, coding complex multi-stop gradients in CSS manually is difficult and prone to syntax errors. A generator visualizes changes in real-time and provides the exact code snippet.
            </p>

            <h2>Try the Tool</h2>
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 not-prose my-8">
                <h3 className="font-bold text-indigo-900 text-lg mb-2">Create CSS Gradients</h3>
                <p className="text-indigo-800 mb-4">
                    Build linear, radial, and conic gradients with unlimited color stops.
                </p>
                <Link href="/gradients" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                    Open Gradient Studio
                </Link>
            </div>

            <h2>Frequently Asked Questions</h2>

            <h3>What is a Conic Gradient?</h3>
            <p>
                Unlike linear (straight line) or radial (circle from center) gradients, conic gradients rotate around a center point. They are perfect for creating pie charts, color wheels, or shiny metallic effects on buttons.
            </p>

            <h3>Does this work with Tailwind CSS?</h3>
            <p>
                Yes! Dopely Colors generates the standard CSS `linear-gradient(...)` syntax, which can be plugged into Tailwind's `bg-[...]` arbitrary value syntax or added to your `tailwind.config.js`.
            </p>
        </article>
    );
}
