import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const MicroInteractionsGuide = () => {
    return (
        <DocumentationHub
            title="Color Micro-Interactions Preview"
            description="Visualize and fine-tune how your colors behave during hover, active, and focus states on actual UI components."
            benefits={[
                "Ensure interactive elements have noticeable feedback",
                "Perfect the timing of color transitions",
                "Test focus-ring contrast for keyboard navigation",
                "Export the exact CSS transition properties needed"
            ]}
            howToSteps={[
                { title: "Select Component", desc: "Choose a Button, Input, or Card to test." },
                { title: "Define Timeline", desc: "Set the base, hover, and active color tokens." },
                { title: "Interact", desc: "Play with the element to feel the tactical feedback." }
            ]}
            faqs={[
                { question: "Why test micro-interactions?", answer: "A button changing color on press provides critical psychological confirmation to the user that action was taken." }
            ]}
        />
    );
};
