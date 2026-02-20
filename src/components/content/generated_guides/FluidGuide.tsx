import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const FluidGuide = () => {
    return (
        <DocumentationHub
            title="Fluid Gradients"
            description="Create organic, beautifully moving gradient meshes that feel alive. Export directly as CSS or animated SVG."
            benefits={[
                "Design state-of-the-art WebGL-like backgrounds",
                "Zero external dependencies required for the CSS export",
                "Highly performant animations optimized for the GPU",
                "Complete control over chaotic liquid physics"
            ]}
            howToSteps={[
                { title: "Add Colors", desc: "Select 3 to 6 colors for the gradient mixture." },
                { title: "Tweak Physics", desc: "Adjust flow speed, blur radius, and complexity." },
                { title: "Copy Code", desc: "Grab the single-div pure CSS or SVG output for your project." }
            ]}
            faqs={[
                { question: "Do fluid gradients hurt website performance?", answer: "Our CSS output utilizes hardware-accelerated transforms, ensuring a smooth 60fps without CPU spiking." }
            ]}
        />
    );
};
