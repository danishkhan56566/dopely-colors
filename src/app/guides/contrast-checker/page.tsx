import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'WCAG Contrast Checker for Accessible Design | Dopely Colors',
    description: 'Contrast checkers help ensure that text and background color combinations meet accessibility standards defined by WCAG.',
};

export default function ContrastCheckerGuide() {
    return (
        <article className="prose prose-green prose-lg max-w-none">
            <Link href="/guides" className="no-underline text-sm font-bold text-gray-500 hover:text-green-600 flex items-center gap-2 mb-8 not-prose">
                <ArrowLeft size={16} /> Back to Guides
            </Link>

            <h1>WCAG Contrast Checker for Accessible Design</h1>

            <p className="lead text-xl text-gray-600">
                Contrast checkers help ensure that text and background color combinations meet accessibility standards defined by WCAG. Proper contrast improves readability for users with visual impairments.
            </p>

            <p>
                Accessible color design is critical for modern websites and applications. Using contrast tools early in the design process prevents usability issues and ensures compliance with accessibility guidelines.
            </p>
            <p>
                This guide helps designers understand AA and AAA contrast ratios and apply them effectively in UI design.
            </p>

            <hr className="my-10 border-gray-100" />

            <h2>Why This Matters</h2>
            <p>
                Over 2.2 billion people have a vision impairment. If your text doesn't have enough contrast against its background, millions of users simply cannot read your content. Ensuring WCAG compliance is not just about legality; it's about inclusivity and good user experience.
            </p>

            <h2>Try the Tool</h2>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 not-prose my-8">
                <h3 className="font-bold text-green-900 text-lg mb-2">Check Accessibility</h3>
                <p className="text-green-800 mb-4">
                    Instantly validate your color pairs against WCAG AA and AAA standards.
                </p>
                <Link href="/contrast" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
                    Open Contrast Checker
                </Link>
            </div>

            <h2>Frequently Asked Questions</h2>

            <h3>What is the minimum contrast ratio?</h3>
            <p>
                For normal text (body copy), the minimum ratio for <strong>AA level</strong> is 4.5:1. For large text (headings), it is 3:1.
            </p>

            <h3>What if my brand colors fail contrast checks?</h3>
            <p>
                You don't have to change your logo. However, for UI elements like buttons or text, you should adjust the lightness of the background or text color until it passes. Often a slight tweak is all that is needed.
            </p>
        </article>
    );
}
