import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const GlassGuide = () => {
    return (
        <DocumentationHub
            title="Glassmorphism CSS Generator"
            description="Create premium frosted glass UI elements with customizable blur, transparency, noise, and specular highlights."
            benefits={[
                "Master the modern Glassmorphism visual trend",
                "Instantly generate complex backdrop-filter CSS",
                "Preview glass layers over vibrant backgrounds",
                "Access custom lighting and noise textures"
            ]}
            howToSteps={[
                { title: "Adjust Backdrop", desc: "Set the backdrop blur intensity." },
                { title: "Refine Transparency", desc: "Tweak the white/black alpha channel for the glass material." },
                { title: "Add Details", desc: "Include a 1px bright border and minimal drop shadow for depth." }
            ]}
            faqs={[
                { question: "Is glassmorphism supported in all browsers?", answer: "Yes, modern browsers fully support the backdrop-filter property required for true frosted glass." }
            ]}
        />
    );
};
