import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const GestureMixGuide = () => {
    return (
        <DocumentationHub
            title="Gesture-Based Color Mixer"
            description="Use your webcam and bare hands to mix virtual colors in the air, translating physical motion into digital palettes."
            benefits={[
                "A wildly creative, tactile way to discover palettes",
                "Break out of algorithmic color boredom",
                "Great for interactive installations and exhibitions",
                "Completely private; video never leaves your browser"
            ]}
            howToSteps={[
                { title: "Enable Camera", desc: "Allow browser access to track your hand movements." },
                { title: "Pinch & Mix", desc: "Use pinch gestures to grab virtual paint and throw it on the canvas." },
                { title: "Capture Palette", desc: "Hold up a peace sign to snap and save the resulting chaos." }
            ]}
            faqs={[
                { question: "Is my video data sent to a server?", answer: "No. The AI vision model runs entirely client-side using WebGL. Your privacy is 100% guaranteed." }
            ]}
        />
    );
};
