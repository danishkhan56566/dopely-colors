import React from 'react';
import { ToolGuide } from './ToolGuide';

export const ConverterGuide = () => (
    <ToolGuide
        title="Universal Color Converter"
        description="Convert between Hex, RGB, HSL, CMYK, LAB, LCH, and OKLCH. precise translation for print, web, and digital art."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Why so many formats?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Different industries speak different color languages. <strong className="text-white">Hex</strong> is for web, <strong className="text-white">CMYK</strong> is for printers, and <strong className="text-white">LAB/LCH</strong> are for scientists who need to model human perception accurately.
                </p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-3xl">
                <h4 className="font-bold text-white mb-4">Quick Reference</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li><strong className="text-white">Hex:</strong> #FF5733 (Web Design)</li>
                    <li><strong className="text-white">RGB:</strong> 255, 87, 51 (Digital Screens)</li>
                    <li><strong className="text-white">CMYK:</strong> 0, 66, 80, 0 (Process Printing)</li>
                    <li><strong className="text-white">HSL:</strong> 14, 100%, 60% (Human Intuitive)</li>
                </ul>
            </div>
        </div>
    </ToolGuide>
);

export const MixerGuide = () => (
    <ToolGuide
        title="Color Mixer & Blender"
        description="Simulate real-world paint mixing or digital interpolation. Mix varying ratios of colors to find the perfect midpoint."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Subtractive vs. Additive</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Mixing light (digital) is different from mixing paint (pigment). Red + Green light makes Yellow, but Red + Green paint makes Brown. This tool lets you switch between <strong className="text-white">RGB Mixing</strong> and <strong className="text-white">Pigment Simulation</strong> (Kubelka-Munk theory).
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const WheelGuide = () => (
    <ToolGuide
        title="Interactive Color Wheel"
        description="Explore color theory in action. Find Complementary, Split-Complementary, Analogous, and Triadic harmonies instantly."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">The Rules of Harmony</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Sir Isaac Newton invented the color wheel in 1666, and it remains the gold standard for finding colors that look good together. Rules like "Complementary" (opposite sides) create high contrast, while "Analogous" (neighbors) create soothing, low-contrast vibes.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const TonerGuide = () => (
    <ToolGuide
        title="Tints, Tones & Shades Generator"
        description="Generate a complete monochromatic scale. Create tints (add white), shades (add black), and tones (add gray) for any color."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Expanding your Palette</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    A single base color is rarely enough for a UI. You need lighter versions for backgrounds (Tints) and darker versions for text or borders (Shades). This tool automates that process.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const DuotoneGuide = () => (
    <ToolGuide
        title="Duotone Effect Generator"
        description="Apply Spotify-style duotone filters to your images. Map the highlights and shadows to two specific colors for a bold, branded look."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Stylizing Imagery</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Duotones simplify an image's color palette, making it easier to read text on top of it. It's a popular technique in web design to make diverse stock photos look like a cohesive part of a brand.
                </p>
            </div>
        </div>
    </ToolGuide>
);
