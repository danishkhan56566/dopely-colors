import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const LinterGuide = () => {
    return (
        <DocumentationHub
            title="Color Accessibility Linter"
            description="Paste your raw CSS, SCSS, or Tailwind code to automatically find and fix color contrast and accessibility violations."
            benefits={[
                "Audit bulk codebases in seconds",
                "Automatically receive mathematically corrected fallback colors",
                "Ensure strict adherence to WCAG standards",
                "Integrate directly into your copy/paste workflow"
            ]}
            howToSteps={[
                { title: "Paste Code", desc: "Dump your massive CSS file or component code into the engine." },
                { title: "Run Audit", desc: "The linter will parse AST and abstract out all color combinations." },
                { title: "Apply Fixes", desc: "Accept the AIs suggested AAA-compliant replacements." }
            ]}
            faqs={[
                { question: "Can it read CSS variables?", answer: "Yes, the parser tracks var() chains to determine the final computed contrast ratios." }
            ]}
        />
    );
};
