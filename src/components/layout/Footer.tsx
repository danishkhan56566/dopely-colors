import Link from 'next/link';
import { Twitter, Github, Dribbble, Instagram } from 'lucide-react';

const FOOTER_LINKS = {
    tools: {
        title: "Tools",
        links: [
            { label: "Generate Palettes", href: "/generate" },
            { label: "Explore Popular", href: "/explore?sort=popular" },
            { label: "Extract from Image", href: "/image" },
            { label: "AI Palette Generator", href: "/" },
            { label: "Contrast Checker", href: "/contrast" },
            { label: "Preview on Designs", href: "/generate?view=visualize" },
            { label: "Color Picker", href: "/picker" },
            { label: "Gradient Generator", href: "/generate" },
            { label: "Tailwind Colors", href: "/generate" },
            { label: "Design System Builder", href: "/generate" },
        ]
    },
    discover: {
        title: "Discover",
        links: [
            { label: "List of Colors", href: "/explore" },
            { label: "Browse Gradients", href: "/explore" },
            { label: "Industry Palettes", href: "/explore?tag=saas" },
            { label: "Trending Palettes", href: "/explore?sort=popular" },
            { label: "Community Palettes", href: "/explore" },
            { label: "Typography Generator", href: "/generate?view=visualize" },
        ]
    },
    apps: {
        title: "Apps",
        links: [
            { label: "Web App", href: "/apps#web" },
            { label: "iOS App", href: "/apps#ios" },
            { label: "Android App", href: "/apps#android" },
            { label: "Figma Plugin", href: "/apps#figma" },
            { label: "Chrome Extension", href: "/apps#chrome" },
            { label: "API Access (Pro)", href: "/apps#api" },
        ]
    },
    company: {
        title: "Company",
        links: [
            { label: "Pricing", href: "/pricing" },
            { label: "License", href: "/license" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Cookie Policy", href: "/cookies" },
            { label: "Help Center", href: "/help" },
            { label: "Feature Requests", href: "/requests" },
            { label: "Contact", href: "/contact" },
        ]
    }
};

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    {Object.entries(FOOTER_LINKS).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="font-bold text-gray-900 mb-6">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white text-xs font-bold bg-rainbow">D</div>
                        <span className="text-gray-900 font-bold">Dopely Colors</span>
                        <span className="text-gray-400 text-sm ml-2">© 2026 — Let's build better color systems. Made by Danish Khan.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Twitter size={20} /></Link>
                        <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Github size={20} /></Link>
                        <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Dribbble size={20} /></Link>
                        <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Instagram size={20} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
