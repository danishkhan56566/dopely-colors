import React from 'react';
import { ToolGuide } from './ToolGuide';

export const PerfPaletteGuide = () => {
    return (
        <ToolGuide
            title="High-Performance Color Systems"
            description="Optimize your color palette for web performance. Analyze CSS payload size, rendering rendering costs, and memory footprint."
        >
            <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Does Color Affect Performance?</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Surprisingly, yes. Defining hundreds of unused CSS variables bloats your stylesheet, delaying the First Contentful Paint (FCP). Complex styles like blurred backgrounds or extensive box-shadows (often used in modern "glassmorphism" palettes) can trigger expensive Paint and Layout recalculations in the browser.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        This tool helps you audit your system before you ship, ensuring your beautiful design doesn't come at the cost of 60fps scrolling.
                    </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-3xl border border-red-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Optimization Strategies
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0"></span>
                            <strong>Variable Aliasing:</strong> Map semantic names (surface-primary) to short tokens (s1) to reduce CSS size.
                        </li>
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0"></span>
                            <strong>Tree Shaking:</strong> Only export the shades you actually use (e.g., 500, 600, 700) instead of the full 50-950 range.
                        </li>
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0"></span>
                            <strong>Paint Complexity:</strong> Avoid high-blur backdrops on mobile devices where GPU resources are limited.
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-8">Metrics Explained</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="bg-gray-50 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Transport Size</h4>
                    <p className="text-gray-600 text-sm">The estimated Gzip size of your generated CSS. Smaller is better for fast initial loads.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Render Cost</h4>
                    <p className="text-gray-600 text-sm">A simulated score (0-100) based on how many expensive properties (blur, shadow) your system uses.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Memory Footprint</h4>
                    <p className="text-gray-600 text-sm">How much RAM the browser needs to hold your color tokens in the JS heap.</p>
                </div>
            </div>
        </ToolGuide>
    );
};
