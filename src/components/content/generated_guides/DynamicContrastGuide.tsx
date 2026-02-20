import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const DynamicContrastGuide = () => {
    return (
        <DocumentationHub
            title="Dynamic Contrast Checker"
            description="Beyond basic WCAG. Test legibility against different font weights, dynamic textures, and environmental screen glare."
            benefits={[
                "Test typography legibility in real-world scenarios",
                "Simulate low-brightness mobile displays",
                "Evaluate text over complex gradient backgrounds",
                "Ensure your typography scales safely"
            ]}
            howToSteps={[
                { title: "Set Background", desc: "Apply a solid color, gradient, or image map." },
                { title: "Configure Typography", desc: "Adjust font size, weight, and anti-aliasing." },
                { title: "Simulate Environment", desc: "Test how sunlight or low screen brightness affects reading." }
            ]}
            faqs={[
                { question: "Why is this different than the standard contrast checker?", answer: "Standard checkers only analyze solid colors. Dynamic Contrast analyzes variables like font weight and background noise." }
            ]}
        />
    );
};
