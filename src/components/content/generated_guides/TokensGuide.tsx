import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const TokensGuide = () => {
    return (
        <DocumentationHub
            title="Design Token Exporter"
            description="The ultimate source of truth. Manage semantic tokens, aliases, and export your systems to JSON, tailwind.config, or iOS Swift."
            benefits={[
                "Establish a single source of truth for all projects",
                "Eliminate hardcoded values in your codebase",
                "Seamlessly export to multiple language environments",
                "Visually map aliases like `brand-primary` to raw `blue-500`"
            ]}
            howToSteps={[
                { title: "Define Base", desc: "Create your raw scale primitives (e.g., slate-50 to slate-900)." },
                { title: "Build Semantics", desc: "Map abstract usage names like `surface-default` to primitive scales." },
                { title: "Export", desc: "Download the compiled Style Dictionary or Tailwind configuration." }
            ]}
            faqs={[
                { question: "Does this output W3C standard tokens?", answer: "Yes, our JSON exporter complies with the latest W3C Design Tokens Community Group format." }
            ]}
        />
    );
};
