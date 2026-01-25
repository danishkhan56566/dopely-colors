import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How to Build a Scalable Design System | Dopely Colors',
    description: 'A design system defines colors, typography, and components used across a product. Building a design system ensures consistency.',
};

export default function DesignSystemGuide() {
    return (
        <article className="prose prose-amber prose-lg max-w-none">
            <Link href="/guides" className="no-underline text-sm font-bold text-gray-500 hover:text-amber-600 flex items-center gap-2 mb-8 not-prose">
                <ArrowLeft size={16} /> Back to Guides
            </Link>

            <h1>How to Build a Scalable Design System</h1>

            <p className="lead text-xl text-gray-600">
                A design system defines colors, typography, and components used across a product. Building a design system ensures consistency, scalability, and faster development.
            </p>

            <p>
                Design system builders help teams generate color tokens, UI components, and variants automatically. These systems can be shared between designers and developers.
            </p>
            <p>
                This guide explains how design systems improve collaboration and reduce design debt.
            </p>

            <hr className="my-10 border-gray-100" />

            <h2>Why This Matters</h2>
            <p>
                Without a system, every button might have a slightly different padding, or every grey background might be a slightly different hex code. "Design Debt" accumulates, making the product look unpolished and hard to maintain. A Design System provides a Single Source of Truth for all visual decisions.
            </p>

            <h2>Try the Tool</h2>
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 not-prose my-8">
                <h3 className="font-bold text-amber-900 text-lg mb-2">Build Your System</h3>
                <p className="text-amber-800 mb-4">
                    Define global tokens for color, type, and spacing, and see them apply to live components.
                </p>
                <Link href="/design-system" className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-amber-700 transition-colors">
                    Open System Builder
                </Link>
            </div>

            <h2>Frequently Asked Questions</h2>

            <h3>What is a Design Token?</h3>
            <p>
                A token is a variable that stores a design decision. Instead of hardcoding `#3B82F6`, you use a token named `color-primary`. This allows you to change the primary color in one place and have it update everywhere.
            </p>

            <h3>Do I need a design system for a small project?</h3>
            <p>
                Even for small projects, having a "mini-system" (defined colors and fonts) saves time. You don't need a massive documentation site, but you should have a consistent set of variables.
            </p>
        </article>
    );
}
