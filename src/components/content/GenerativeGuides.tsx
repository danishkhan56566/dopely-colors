import React from 'react';
import { ToolGuide } from './ToolGuide';

export const ArtExtractorGuide = () => (
    <ToolGuide
        title="Extract Palettes from Art & Images"
        description="Turn your favorite masterpieces into usable color palettes. Our AI analyzes the dominant colors, mood, and lighting of any image to create a cohesive scheme."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">From Image to System</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Great artists like Van Gogh or Monet didn't just pick random colors; they understood harmony. By extracting palettes from their work, you can borrow their genius for your own UI designs or illustrations.
                </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100">
                <h4 className="font-bold text-gray-900 mb-4">How it works</h4>
                <ul className="space-y-3 text-sm text-gray-700">
                    <li>• <strong>K-Means Clustering:</strong> We group pixels to find the most mathematically dominant colors.</li>
                    <li>• <strong>Saliency Detection:</strong> We identify the "focal point" colors that draw the eye, even if they aren't the most frequent.</li>
                </ul>
            </div>
        </div>
    </ToolGuide>
);

export const SemanticGuide = () => (
    <ToolGuide
        title="Semantic Color Generation"
        description="Generate colors based on their meaning. Map abstract concepts like 'Trust', 'Urgency', or 'Eco-friendly' to precise color codes."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Psychology of Color</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Semantic generation bridges the gap between language and design. Instead of searching for "Hex code for blue," you can search for "Colors that inspire confidence for a fintech app."
                </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl">
                <h4 className="font-bold text-gray-900 mb-4">Common Associations</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Trust / Stability</span> <span className="font-mono text-blue-600">Blue</span></div>
                    <div className="flex justify-between"><span>Energy / Hunger</span> <span className="font-mono text-red-500">Red</span></div>
                    <div className="flex justify-between"><span>Growth / Money</span> <span className="font-mono text-green-600">Green</span></div>
                    <div className="flex justify-between"><span>Luxury / Mystery</span> <span className="font-mono text-purple-600">Purple</span></div>
                </div>
            </div>
        </div>
    </ToolGuide>
);

export const BrandGuide = () => (
    <ToolGuide
        title="AI Brand Identity Maker"
        description="Create a complete brand color system in seconds. Primary, secondary, and accent colors tailored to your industry and brand personality."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Building a Visual Identity</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    A brand is more than just a logo. It's a consistent visual language. This tool uses AI to suggest color combinations that set the right tone for your target audience, ensuring you stand out from competitors.
                </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-4">What's included?</h4>
                <ul className="space-y-3 text-sm text-gray-700">
                    <li>• <strong>Primary Color:</strong> The core of your brand (e.g., Coca-Cola Red).</li>
                    <li>• <strong>Secondary Colors:</strong> For variety and support.</li>
                    <li>• <strong>Neutrals:</strong> For typography and backgrounds.</li>
                    <li>• <strong>Semantic States:</strong> Success, Error, and Warning colors that match your brand vibe.</li>
                </ul>
            </div>
        </div>
    </ToolGuide>
);

export const FluidGuide = () => (
    <ToolGuide
        title="Fluid Gradient Generator"
        description="Create organic, moving, and liquid-like gradients. Perfect for modern, dynamic backgrounds that feel alive."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The "Lava Lamp" Effect</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Fluid gradients use complex SVG filters (like feTurbulence and feGaussianBlur) to distort color stops, creating a liquid appearance. Unlike standard linear gradients, they feel natural and unpredictable.
                </p>
            </div>
            <div className="bg-gray-900 text-white p-8 rounded-3xl">
                <h4 className="font-bold mb-4">Performance Tip</h4>
                <p className="text-sm text-gray-300">
                    Fluid animations can be GPU-intensive. If your site is lagging, try exporting the result as a video or a static image instead of rendering the live CSS/SVG on mobile devices.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const MeshGuide = () => (
    <ToolGuide
        title="Mesh Gradient Studio"
        description="Craft complex, multi-point gradients. Drag and drop color nodes to create soft, dreamlike auroras and backgrounds."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Beyond Linear</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Mesh gradients allow for freeform color blending. By placing multiple "color points" on a 2D plane, you can create complex interactions of light and shadow that are impossible with standard CSS gradients.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const GlassGuide = () => (
    <ToolGuide
        title="Glassmorphism CSS Generator"
        description="Generate the perfect frosted glass effect. Control blur, transparency, and outline to create modern, sleek UI cards."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Frosted Look</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Glassmorphism relies on background-blur to create depth. It mimics the look of frosted glass floating above the content, establishing visual hierarchy without blocking the background entirely.
                </p>
            </div>
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-200 shadow-xl">
                <h4 className="font-bold text-gray-900 mb-4">The Secret Sauce</h4>
                <code className="text-xs bg-gray-100 p-2 rounded block font-mono text-pink-600">
                    backdrop-filter: blur(16px);<br />
                    background: rgba(255, 255, 255, 0.4);<br />
                    border: 1px solid rgba(255, 255, 255, 0.2);
                </code>
            </div>
        </div>
    </ToolGuide>
);

export const HolographicGuide = () => (
    <ToolGuide
        title="Holographic Material Studio"
        description="Design iridescent, shifting foil textures. Simulate the physics of light interference to create 3D holographic surfaces."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Iridescence Explained</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Holographic materials change color based on the viewing angle. This tool simulates that effect using CSS mix-blend-modes and linear gradients to create a "rainbow spill" look common in cyberpunk and futuristic design.
                </p>
            </div>
        </div>
    </ToolGuide>
);
