import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Using HSL, RGB, and CMYK Color Pickers | Dopely Colors',
    description: 'Advanced color pickers allow designers to work with HSL, RGB, and CMYK formats depending on digital or print requirements.',
};

export default function ColorPickerGuide() {
    return (
        <article className="prose prose-pink prose-lg max-w-none">
            <Link href="/guides" className="no-underline text-sm font-bold text-gray-500 hover:text-pink-600 flex items-center gap-2 mb-8 not-prose">
                <ArrowLeft size={16} /> Back to Guides
            </Link>

            <h1>Using HSL, RGB, and CMYK Color Pickers</h1>

            <p className="lead text-xl text-gray-600">
                Advanced color pickers allow designers to work with HSL, RGB, and CMYK formats. Each color model serves a different purpose depending on digital or print requirements.
            </p>

            <p>
                HSL is useful for adjusting lightness and saturation, while RGB is commonly used in web development. CMYK is essential for print design.
            </p>
            <p>
                This guide explains how to switch between formats and maintain color consistency across platforms.
            </p>

            <hr className="my-10 border-gray-100" />

            <h2>Why This Matters</h2>
            <p>
                Not all color models are created equal. <strong>RGB</strong> (Red, Green, Blue) is additive and meant for screens. <strong>CMYK</strong> (Cyan, Magenta, Yellow, Key) is subtractive and meant for ink. If you design in RGB but print in CMYK, your vibrant blues might look dull. Understanding which model to use prevents costly production mistakes.
            </p>

            <h2>Try the Tool</h2>
            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 not-prose my-8">
                <h3 className="font-bold text-pink-900 text-lg mb-2">Advanced Color Picker</h3>
                <p className="text-pink-800 mb-4">
                    Convert between HEX, RGB, HSL, and CMYK instantly with our precision picker.
                </p>
                <Link href="/picker" className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-700 transition-colors">
                    Open Color Picker
                </Link>
            </div>

            <h2>Frequently Asked Questions</h2>

            <h3>Why is HSL better for design than HEX?</h3>
            <p>
                HSL (Hue, Saturation, Lightness) is more intuitive for humans. Providing "Lightness" as a separate value makes it incredibly easy to create lighter or darker shades of the same color, whereas HEX codes are cryptic alphanumeric strings.
            </p>

            <h3>Can I convert RGB to CMYK perfectly?</h3>
            <p>
                Not always. RGB has a wider "gamut" (range of colors) than CMYK. Some very bright neon screens colors simply cannot be reproduced with standard printer ink. Our tools try to find the closest match.
            </p>
        </article>
    );
}
