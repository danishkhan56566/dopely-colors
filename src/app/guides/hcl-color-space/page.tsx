import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'HCL vs HSL: The Science of Perceptually Uniform Color | Dopely Colors',
    description: 'Understand why standard color spaces fail UI design and how HCL (CIE L*C*h) solves perceptual uniformity for accessible color systems.',
};

export default function HCLGuide() {
    return (
        <article className="prose prose-slate prose-lg max-w-none">
            <Link href="/" className="no-underline text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-8 not-prose transition-colors">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">The Science of Color</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Why HSL is Broken: The Case for HCL</h1>
            <p className="lead text-xl text-slate-600 mb-10">
                If you have ever tried to pick a "light" color palette using HSL, you noticed something annoying: Yellow looks way lighter than Blue, even at the same "Lightness" value. Here is why purely mathematical color spaces fail UI design.
            </p>

            <hr className="my-10 border-slate-100" />

            <h2>The Lie of "Lightness"</h2>
            <p>
                In standard color spaces like RGB and HSL, colors are treated as points in a cylinder or cube.
                The <code>Lightness</code> parameter in HSL is simply a math equation: <code>(Max(RGB) + Min(RGB)) / 2</code>.
            </p>
            <p>
                <strong>The problem?</strong> Your eyes didn't read that math textbook. The human eye drastically over-indexes on Green and Red light, while struggling to see Blue.
            </p>

            <div className="my-12 grid md:grid-cols-2 gap-8 not-prose">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-4 text-red-500 font-bold uppercase text-xs tracking-widest">
                        <XCircle size={16} /> HSL Space (Broken)
                    </div>
                    <div className="space-y-4">
                        <div className="bg-[#FFFF00] h-20 rounded-xl flex items-center justify-center text-slate-900 font-bold shadow-sm">
                            Yellow (L=50%)
                        </div>
                        <div className="bg-[#0000FF] h-20 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                            Blue (L=50%)
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                        Both have 50% Lightness in HSL. Yet Yellow is blindingly bright, and Blue is dark. This breaks contrast ratios.
                    </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase text-xs tracking-widest">
                        <CheckCircle2 size={16} /> HCL Space (Uniform)
                    </div>
                    <div className="space-y-4">
                        <div className="bg-[#9c8900] h-20 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                            Yellow (L=50)
                        </div>
                        <div className="bg-[#7878ff] h-20 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                            Blue (L=50)
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                        In HCL (L*C*h), Lightness (L) measures <em>perceived</em> brightness. Colors with the same L value act the same in UI.
                    </p>
                </div>
            </div>

            <h2>What is HCL?</h2>
            <p>
                HCL stands for <strong>Hue, Chroma, Luminance</strong>. It is a polar transformation of the CIELAB color space, designed to model human vision.
            </p>
            <ul>
                <li><strong>Hue:</strong> The color family (0-360), similar to HSL.</li>
                <li><strong>Chroma:</strong> The colorfulness or intensity. Unlike 'Saturation', Chroma isn't relative to white/black. It is absolute.</li>
                <li><strong>Luminance:</strong> The perceptual brightness. This matches WCAG contrast requirements perfectly.</li>
            </ul>

            <h2>Why Dopely Uses HCL</h2>
            <p>
                When you ask Dopely to "Generate a Dark Mode Palette", we do not just invert the colors. We rotate the Hue in HCL space while maintaining strict Luminance constraints.
            </p>
            <p>
                This ensures that:
            </p>
            <ol>
                <li><strong>Contrast is Guaranteed:</strong> A text color with L=90 will always pass WCAG AA against a background of L=40, regardless of the Hue.</li>
                <li><strong>Gradients are Smooth:</strong> Interpolating in RGB creates "grey dead zones". Interpolating in HCL creates vibrant, rich transitions.</li>
            </ol>

            <div className="bg-slate-900 text-white p-8 rounded-2xl not-prose mt-12">
                <h3 className="text-2xl font-bold mb-4">See the difference</h3>
                <p className="text-slate-400 mb-6">
                    Use our free tools to inspect these values yourself.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link href="/generate" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors">
                        Launch AI Generator
                    </Link>
                    <Link href="/contrast" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors">
                        Check Contrast
                    </Link>
                </div>
            </div>
        </article>
    );
}
