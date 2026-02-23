import Link from 'next/link';
import { Twitter, Github, Dribbble, Instagram } from 'lucide-react';

const FOOTER_LINKS = {
    tools: {
        title: "Tools",
        links: [
            { label: "Generate Palettes", href: "/generate" },
            { label: "Explore Popular", href: "/explore?sort=popular" },
            { label: "Extract from Image", href: "/image" },
            { label: "AI Palette Generator", href: "/ai" },
            { label: "Color Wheel", href: "/color-wheel" },
            { label: "Color Blindness", href: "/color-blindness-simulator" },
            { label: "Color Mixer", href: "/color-mixer" },
            { label: "Contrast Checker", href: "/contrast-checker" },
            { label: "Preview on Designs", href: "/generate?view=visualize" },
            { label: "Color Picker", href: "/picker" },
            { label: "Gradient Generator", href: "/explore" },
            { label: "Tailwind Colors", href: "/tailwind" },
            { label: "Design System Builder", href: "/design-system" },
        ]
    },
    discover: {
        title: "Discover",
        links: [
            { label: "Blog & Articles", href: "/blog" },
            { label: "Guides & Tutorials", href: "/guides" },
            { label: "Compare Generators", href: "/compare-generators" },
            { label: "Color Theory & Science", href: "/color-theory" },
            { label: "Color Psychology", href: "/color-psychology" },
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
            { label: "About Us", href: "/company" },
            { label: "Embed Badges", href: "/badges" },
            { label: "Pricing", href: "/pricing" },
            { label: "License", href: "/legal/license" },
            { label: "Terms of Service", href: "/legal/terms" },
            { label: "Privacy Policy", href: "/legal/privacy" },
            { label: "Cookie Policy", href: "/legal/cookie-policy" },
            { label: "Disclaimer", href: "/legal/disclaimer" },
            { label: "Help Center", href: "/help" },
            { label: "Feature Requests", href: "/requests" },
            { label: "Contact", href: "/contact" },
        ]
    },
    categories: {
        title: "Popular Categories",
        links: [
            { label: "Vintage Palettes", href: "/palettes/vintage" },
            { label: "Neon Palettes", href: "/palettes/neon" },
            { label: "Pastel Palettes", href: "/palettes/pastel" },
            { label: "Dark Mode Palettes", href: "/palettes/dark" },
            { label: "Cyberpunk Palettes", href: "/palettes/cyberpunk" },
            { label: "Sunset Palettes", href: "/palettes/sunset" },
            { label: "Winter Palettes", href: "/palettes/winter" },
            { label: "Retro Palettes", href: "/palettes/retro" },
            { label: "Earth Palettes", href: "/palettes/earth" },
        ]
    }
};

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 max-w-7xl mx-auto px-6 py-16">
                    {Object.values(FOOTER_LINKS).map((section, index) => (
                        <div key={section.title || index}>
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
                        <div className="flex flex-col ml-2">
                            <span className="text-gray-500 text-sm">© 2026 — Let's build better color systems. Made by Danish Khan.</span>
                            <span className="text-gray-300 text-[10px] mt-1">This website uses Google AdSense, a service for displaying advertisements. Google may use cookies to show relevant ads to users.</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="#" aria-label="Twitter" className="text-gray-500 hover:text-gray-900 transition-colors"><Twitter size={20} /></Link>
                        <Link href="#" aria-label="Github" className="text-gray-500 hover:text-gray-900 transition-colors"><Github size={20} /></Link>
                        <Link href="#" aria-label="Dribbble" className="text-gray-500 hover:text-gray-900 transition-colors"><Dribbble size={20} /></Link>
                        <Link href="#" aria-label="Instagram" className="text-gray-500 hover:text-gray-900 transition-colors"><Instagram size={20} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
