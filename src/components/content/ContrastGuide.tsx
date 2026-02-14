import React from 'react';
import { ToolGuide } from './ToolGuide';

export const ContrastGuide = () => {
    return (
        <ToolGuide
            title="Mastering Color Contrast and Accessibility"
            description="Ensure your designs are readable for everyone. Understand WCAG guidelines, contrast ratios, and how to fix accessibility issues."
        >
            <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Contrast Matters</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Color contrast is the difference in light between a foreground element (like text) and its background. High contrast ensures content is legible, especially for users with visual impairments or those viewing screens in bright sunlight.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Accessibility isn't just a legal requirement; it's good design. Improvements made for accessibility often enhance the experience for all users (the "Curb Cut Effect").
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border border-green-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        WCAG 2.1 Success Criteria
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0"></span>
                            <strong>Level AA (Minimum):</strong> 4.5:1 for normal text, 3:1 for large text.
                        </li>
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0"></span>
                            <strong>Level AAA (Enhanced):</strong> 7:1 for normal text, 4.5:1 for large text.
                        </li>
                        <li className="flex gap-3 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0"></span>
                            <strong>Graphics/UI Components:</strong> 3:1 against adjacent colors.
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h3>
            <div className="space-y-6 mb-16">
                <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-2">What counts as "Large Text"?</h4>
                    <p className="text-gray-600 text-sm">WCAG defines large text as at least 18pt (24px) or 14pt (18.66px) bold. If your font is thin or unusual, consider treating it as normal text even at larger sizes.</p>
                </div>
                <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-2">Does this checker support APCA?</h4>
                    <p className="text-gray-600 text-sm">
                        Yes! While WCAG 2.1 is the current legal standard, we also provide experimental APCA (Advanced Perceptual Contrast Algorithm) scores, which better reflect how human eyes perceive contrast based on font weight and background luminance.
                    </p>
                </div>
            </div>
        </ToolGuide>
    );
};
