import React from 'react';
import { ToolGuide } from './ToolGuide';

export const BlindnessGuide = () => {
    return (
        <ToolGuide
            title="Designing for Color Vision Deficiency"
            description="Simulate how your designs appear to the 300 million people worldwide with color blindness. Protanopia, Deuteranopia, Tritanopia, and more."
        >
            <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Understanding CVD</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Color Vision Deficiency (CVD) affects approximately 1 in 12 men and 1 in 200 women. It's usually caused by genetic mutations that affect the photopigments in the eye's cones.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Designers often rely on color to convey status (Red = Error, Green = Success). For a user with Deuteranopia (Red-Green blindness), these two states might look identical. This tool helps you catch those issues early.
                    </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Common Types
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                            <strong>Deuteranopia:</strong> Reduced sensitivity to green light (most common).
                        </li>
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                            <strong>Protanopia:</strong> Reduced sensitivity to red light.
                        </li>
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                            <strong>Tritanopia:</strong> Reduced sensitivity to blue light (rare).
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-8">Design Tips</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="bg-gray-50 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Double Encoding</h4>
                    <p className="text-gray-600 text-sm">Don't rely on color alone. Use icons, text labels, or patterns alongside color to convey meaning.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">High Contrast</h4>
                    <p className="text-gray-600 text-sm">Ensuring high luminance contrast helps distinct elements stand out even if their hues blend together.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Avoid Bad Pairs</h4>
                    <p className="text-gray-600 text-sm">Red/Green, Blue/Purple, and Light Green/Yellow are classic trouble spots for CVD users.</p>
                </div>
            </div>
        </ToolGuide>
    );
};
