import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const DuotoneGuide = () => {
    return (
        <DocumentationHub
            title="Duotone Image Generator"
            description="Upload images and apply striking Spotify-like duotone filters in seconds. Export in ultra high-resolution."
            benefits={[
                "Create cohesive brand imagery instantly",
                "No Photoshop or complex masking required",
                "Preserve high-resolution image quality",
                "Save and reuse custom duotone presets"
            ]}
            howToSteps={[
                { title: "Upload Media", desc: "Drag and drop any JPG, PNG, or WebP image." },
                { title: "Pick Colors", desc: "Select your highlight and shadow colors." },
                { title: "Adjust & Export", desc: "Tweak contrast intensity and download the final masterpiece." }
            ]}
            faqs={[
                { question: "What is the maximum file size?", answer: "You can process images up to 4K resolution directly in your browser without data leaving your device." }
            ]}
        />
    );
};
