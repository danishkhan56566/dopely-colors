import Link from 'next/link';
import { Metadata } from 'next';
import { Book, Palette, Zap, Layout, Image, Eye, Command, Layers } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Color Design Guides for Designers & Developers | Dopely Colors',
    description: 'Learn how to create color palettes, gradients, Tailwind colors, and accessible design systems using professional tools and AI.',
};

const GUIDES = [
    {
        title: "How to Extract Color Palettes from Images",
        description: "Extracting colors from images is a powerful technique for designers who want to recreate visual styles, branding themes, or UI inspiration from photos and screenshots.",
        href: "/guides/image-to-palette",
        icon: Image,
        color: "text-blue-600 bg-blue-50"
    },
    {
        title: "How AI Generates Perfect Color Palettes",
        description: "AI color palette generators use color harmony rules, contrast analysis, and visual balance to create palettes automatically.",
        href: "/guides/ai-palette-generator",
        icon: Zap,
        color: "text-purple-600 bg-purple-50"
    },
    {
        title: "WCAG Contrast Checker for Accessible Design",
        description: "Contrast checkers help ensure that text and background color combinations meet accessibility standards defined by WCAG.",
        href: "/guides/contrast-checker",
        icon: Eye,
        color: "text-green-600 bg-green-50"
    },
    {
        title: "Preview Color Palettes on Real UI Designs",
        description: "Previewing color palettes on real design layouts allows designers to see how colors behave in actual interfaces.",
        href: "/guides/preview-on-designs",
        icon: Layout,
        color: "text-orange-600 bg-orange-50"
    },
    {
        title: "Using HSL, RGB, and CMYK Color Pickers",
        description: "Advanced color pickers allow designers to work with HSL, RGB, and CMYK formats. Each color model serves a different purpose.",
        href: "/guides/color-picker",
        icon: Palette,
        color: "text-pink-600 bg-pink-50"
    },
    {
        title: "How to Create Professional Color Gradients",
        description: "Gradients add depth and visual interest to modern UI designs. Gradient generators help designers create smooth transitions between colors.",
        href: "/guides/gradient-generator",
        icon: Layers,
        color: "text-indigo-600 bg-indigo-50"
    },
    {
        title: "Tailwind Color Scales Explained",
        description: "Tailwind CSS uses structured color scales to maintain consistency across UI components. Each color includes multiple shades.",
        href: "/guides/tailwind-colors",
        icon: Command,
        color: "text-cyan-600 bg-cyan-50"
    },
    {
        title: "How to Build a Scalable Design System",
        description: "A design system defines colors, typography, and components used across a product. Building a design system ensures consistency.",
        href: "/guides/design-system-builder",
        icon: Book,
        color: "text-amber-600 bg-amber-50"
    },
    {
        title: "The Ultimate Guide to Color Theory",
        description: "Stop guessing which colors look good together. Understand the science and psychology behind color theory.",
        href: "/guides/color-theory",
        icon: Palette,
        color: "text-rose-600 bg-rose-50"
    }
];

export default function GuidesIndexPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                    Color Design Guides for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Designers & Developers</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    The Dopely Colors Guides help designers and developers understand color theory, accessibility, and modern design workflows. Each guide explains how to use color tools effectively for UI, branding, and frontend development.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {GUIDES.map((guide) => (
                    <Link
                        key={guide.href}
                        href={guide.href}
                        className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col h-full"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${guide.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                            <guide.icon size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {guide.title}
                        </h2>
                        <p className="text-gray-500 leading-relaxed flex-1">
                            {guide.description}
                        </p>
                        <div className="mt-4 font-bold text-sm text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                            Read Guide &rarr;
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
