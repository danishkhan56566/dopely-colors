import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Ultimate Guide to Color Theory for UI Design | Dopely Colors',
    description: 'Learn the fundamentals of color theory, harmonies, and psychology to build better user interfaces.',
};

export default function ColorTheoryGuide() {
    return (
        <article className="prose prose-blue prose-lg max-w-none">
            <Link href="/" className="no-underline text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center gap-2 mb-8 not-prose">
                <ArrowLeft size={16} /> Back to Tools
            </Link>

            <h1>The Ultimate Guide to Color Theory for UI Design</h1>
            <p className="lead text-xl text-gray-600">
                Stop guessing which colors look good together. By understanding the science and psychology behind color theory, you can create professional, harmonious designs every time.
            </p>

            <hr className="my-10 border-gray-100" />

            <h2>The Basics: The Color Wheel</h2>
            <p>
                Sir Isaac Newton developed the first circular diagram of colors in 1666. Today, the color wheel is the standard tool for understanding relationships between colors. It is divided into three categories:
            </p>
            <ul>
                <li><strong>Primary Colors:</strong> Red, Yellow, Blue. These are the source of all other colors.</li>
                <li><strong>Secondary Colors:</strong> Green, Orange, Purple. Formed by mixing two primary colors.</li>
                <li><strong>Tertiary Colors:</strong> Blue-Green, Red-Orange, etc. Formed by mixing a primary and a secondary color.</li>
            </ul>

            <h2>Color Harmonies</h2>
            <p>
                Harmonies are formulas for creating balanced palettes. Dopely Colors' generator uses these rules algorithmically.
            </p>

            <h3>1. Analogous</h3>
            <p>
                Three colors side-by-side on the wheel (e.g., Blue, Blue-Green, Green). This creates a serene and comfortable design, often seen in nature.
                <em>Best for: Wellness apps, eco-friendly brands.</em>
            </p>

            <h3>2. Complementary</h3>
            <p>
                Two colors opposite each other (e.g., Blue and Orange). This creates high contrast and high impact.
                <em>Best for: Call-to-action buttons, alerts, and sports brands.</em>
            </p>

            <h3>3. Triadic</h3>
            <p>
                Three colors evenly spaced around the wheel (e.g., Red, Yellow, Blue). This is vibrant and balanced.
                <em>Best for: Playful designs, children's products.</em>
            </p>

            <h2>The 60-30-10 Rule</h2>
            <p>
                This is the golden rule of UI color balance. It suggests:
            </p>
            <ul>
                <li><strong>60% Primary Color:</strong> Usually your neutral background (White, Cream, Grey).</li>
                <li><strong>30% Secondary Color:</strong> Your brand color, used for headers, cards, and large elements.</li>
                <li><strong>10% Accent Color:</strong> The "pop" color, strictly reserved for CTAs and critical interactions.</li>
            </ul>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8 not-prose">
                <h4 className="font-bold text-blue-900 mb-2 text-lg">Try it yourself</h4>
                <p className="text-blue-800">
                    Ready to apply these rules? Use the <Link href="/ai" className="underline font-bold">Dopely Colors AI Generator</Link> to instantly create a palette based on these harmonies.
                </p>
            </div>

            <h2>Color Psychology</h2>
            <p>
                Colors evoke emotion. Before choosing a hex code, ask "How should the user feel?"
            </p>
            <div className="grid sm:grid-cols-2 gap-4 not-prose my-6">
                <div className="bg-red-50 p-4 rounded-lg">
                    <strong className="text-red-800">Red:</strong> Passion, Urgency, Danger.
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-blue-800">Blue:</strong> Trust, Stability, Tech.
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <strong className="text-green-800">Green:</strong> Growth, Money, Nature.
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <strong className="text-purple-800">Purple:</strong> Luxury, Mystery, Creativity.
                </div>
            </div>

            <p>
                Mastering these fundamentals will elevate your design work from "good enough" to professional grade.
            </p>
        </article>
    );
}
