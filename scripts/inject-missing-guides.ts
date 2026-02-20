const fs = require('fs');
const path = require('path');

const contentData = {
    'biometric': {
        componentName: 'BiometricGuide',
        title: 'Biometric Color Engine',
        description: 'Simulate and measure emotional and physiological responses to complete color systems using AI pattern matching.',
        benefits: [
            'Optimize conversions by targeting psychological triggers',
            'Test color combinations against demographic visual data',
            'Reduce A/B testing cycles with AI-predicted emotional resonance',
            'Design universally appealing palettes grounded in human psychology'
        ],
        howToSteps: [
            { title: 'Input Palette', desc: 'Paste your brand colors or import a design token file.' },
            { title: 'Select Target', desc: 'Choose the target emotion, demographic, or conversion goal.' },
            { title: 'Analyze', desc: 'Review the simulated physiological response metrics and adjust accordingly.' }
        ],
        faqs: [
            { question: 'How accurate is the biometric simulation?', answer: 'Our engine uses models trained on thousands of eye-tracking and heart-rate studies related to color psychology.' },
            { question: 'Can I export the metrics?', answer: 'Yes, you can export the full psychological profile as a PDF report.' }
        ]
    },
    'collab-lab': {
        componentName: 'CollabLabGuide',
        title: 'Real-time Color Lab',
        description: 'Multiplayer color palette editing and design system building. Work synchronously with your entire design team.',
        benefits: [
            'Eliminate version control issues with real-time syncing',
            'Instant feedback loops with integrated cursor tracking',
            'Conflict-free semantic token management',
            'Streamline client reviews and handoffs'
        ],
        howToSteps: [
            { title: 'Create Room', desc: 'Start a new session and generate a secure invite link.' },
            { title: 'Invite Team', desc: 'Share the link with designers, developers, and stakeholders.' },
            { title: 'Design Together', desc: 'See cursors fly as you build, name, and test colors synchronously.' }
        ],
        faqs: [
            { question: 'Is there a limit to concurrent users?', answer: 'The Collab Lab supports up to 50 simultaneous users per session with zero latency.' }
        ]
    },
    'contrast-grid': {
        componentName: 'ContrastGridGuide',
        title: 'Advanced Contrast Grid',
        description: 'Test WCAG 2.1 compliance across a matrix of foregrounds and backgrounds in a single glance.',
        benefits: [
            'Catch accessibility violations before they hit production',
            'Visualize all possible text/background combinations instantly',
            'Ensure AAA compliance for critical UI elements',
            'Automatically filter out failing combinations'
        ],
        howToSteps: [
            { title: 'Add Colors', desc: 'Input your core brand palette.' },
            { title: 'Scan Grid', desc: 'Review the matrix for AAA, AA, or failing contrast ratios.' },
            { title: 'Export Audit', desc: 'Download a spreadsheet of all accessible pairs.' }
        ],
        faqs: [
            { question: 'Does this test for APCA?', answer: 'Yes, you can toggle between standard WCAG 2.1 and the newer APCA perceptual contrast algorithm.' }
        ]
    },
    'duotone': {
        componentName: 'DuotoneGuide',
        title: 'Duotone Image Generator',
        description: 'Upload images and apply striking Spotify-like duotone filters in seconds. Export in ultra high-resolution.',
        benefits: [
            'Create cohesive brand imagery instantly',
            'No Photoshop or complex masking required',
            'Preserve high-resolution image quality',
            'Save and reuse custom duotone presets'
        ],
        howToSteps: [
            { title: 'Upload Media', desc: 'Drag and drop any JPG, PNG, or WebP image.' },
            { title: 'Pick Colors', desc: 'Select your highlight and shadow colors.' },
            { title: 'Adjust & Export', desc: 'Tweak contrast intensity and download the final masterpiece.' }
        ],
        faqs: [
            { question: 'What is the maximum file size?', answer: 'You can process images up to 4K resolution directly in your browser without data leaving your device.' }
        ]
    },
    'dynamic-contrast': {
        componentName: 'DynamicContrastGuide',
        title: 'Dynamic Contrast Checker',
        description: 'Beyond basic WCAG. Test legibility against different font weights, dynamic textures, and environmental screen glare.',
        benefits: [
            'Test typography legibility in real-world scenarios',
            'Simulate low-brightness mobile displays',
            'Evaluate text over complex gradient backgrounds',
            'Ensure your typography scales safely'
        ],
        howToSteps: [
            { title: 'Set Background', desc: 'Apply a solid color, gradient, or image map.' },
            { title: 'Configure Typography', desc: 'Adjust font size, weight, and anti-aliasing.' },
            { title: 'Simulate Environment', desc: 'Test how sunlight or low screen brightness affects reading.' }
        ],
        faqs: [
            { question: 'Why is this different than the standard contrast checker?', answer: 'Standard checkers only analyze solid colors. Dynamic Contrast analyzes variables like font weight and background noise.' }
        ]
    },
    'eco-impact': {
        componentName: 'EcoImpactGuide',
        title: 'Eco-Friendly Color Calculator',
        description: 'Measure the estimated OLED screen energy consumption based on the lumens and pixel brightness of your color palette.',
        benefits: [
            'Design sustainable, low-energy digital products',
            'Calculate carbon footprint reductions for dark mode',
            'Build ESG-compliant design systems',
            'Optimize UI for mobile battery life'
        ],
        howToSteps: [
            { title: 'Input Palette', desc: 'Add the colors used in your application.' },
            { title: 'Set Usage Areas', desc: 'Define what percentage of the screen each color occupies.' },
            { title: 'Calculate Energy', desc: 'View the milli-watt (mW) usage and carbon output estimates.' }
        ],
        faqs: [
            { question: 'How does color impact battery life?', answer: 'On modern OLED screens, darker colors physically turn off pixels, saving massive amounts of battery and reducing energy draw.' }
        ]
    },
    'fluid': {
        componentName: 'FluidGuide',
        title: 'Fluid Gradients',
        description: 'Create organic, beautifully moving gradient meshes that feel alive. Export directly as CSS or animated SVG.',
        benefits: [
            'Design state-of-the-art WebGL-like backgrounds',
            'Zero external dependencies required for the CSS export',
            'Highly performant animations optimized for the GPU',
            'Complete control over chaotic liquid physics'
        ],
        howToSteps: [
            { title: 'Add Colors', desc: 'Select 3 to 6 colors for the gradient mixture.' },
            { title: 'Tweak Physics', desc: 'Adjust flow speed, blur radius, and complexity.' },
            { title: 'Copy Code', desc: 'Grab the single-div pure CSS or SVG output for your project.' }
        ],
        faqs: [
            { question: 'Do fluid gradients hurt website performance?', answer: 'Our CSS output utilizes hardware-accelerated transforms, ensuring a smooth 60fps without CPU spiking.' }
        ]
    },
    'gesture-mix': {
        componentName: 'GestureMixGuide',
        title: 'Gesture-Based Color Mixer',
        description: 'Use your webcam and bare hands to mix virtual colors in the air, translating physical motion into digital palettes.',
        benefits: [
            'A wildly creative, tactile way to discover palettes',
            'Break out of algorithmic color boredom',
            'Great for interactive installations and exhibitions',
            'Completely private; video never leaves your browser'
        ],
        howToSteps: [
            { title: 'Enable Camera', desc: 'Allow browser access to track your hand movements.' },
            { title: 'Pinch & Mix', desc: 'Use pinch gestures to grab virtual paint and throw it on the canvas.' },
            { title: 'Capture Palette', desc: 'Hold up a peace sign to snap and save the resulting chaos.' }
        ],
        faqs: [
            { question: 'Is my video data sent to a server?', answer: 'No. The AI vision model runs entirely client-side using WebGL. Your privacy is 100% guaranteed.' }
        ]
    },
    'glass': {
        componentName: 'GlassGuide',
        title: 'Glassmorphism CSS Generator',
        description: 'Create premium frosted glass UI elements with customizable blur, transparency, noise, and specular highlights.',
        benefits: [
            'Master the modern Glassmorphism visual trend',
            'Instantly generate complex backdrop-filter CSS',
            'Preview glass layers over vibrant backgrounds',
            'Access custom lighting and noise textures'
        ],
        howToSteps: [
            { title: 'Adjust Backdrop', desc: 'Set the backdrop blur intensity.' },
            { title: 'Refine Transparency', desc: 'Tweak the white/black alpha channel for the glass material.' },
            { title: 'Add Details', desc: 'Include a 1px bright border and minimal drop shadow for depth.' }
        ],
        faqs: [
            { question: 'Is glassmorphism supported in all browsers?', answer: 'Yes, modern browsers fully support the backdrop-filter property required for true frosted glass.' }
        ]
    },
    'linter': {
        componentName: 'LinterGuide',
        title: 'Color Accessibility Linter',
        description: 'Paste your raw CSS, SCSS, or Tailwind code to automatically find and fix color contrast and accessibility violations.',
        benefits: [
            'Audit bulk codebases in seconds',
            'Automatically receive mathematically corrected fallback colors',
            'Ensure strict adherence to WCAG standards',
            'Integrate directly into your copy/paste workflow'
        ],
        howToSteps: [
            { title: 'Paste Code', desc: 'Dump your massive CSS file or component code into the engine.' },
            { title: 'Run Audit', desc: 'The linter will parse AST and abstract out all color combinations.' },
            { title: 'Apply Fixes', desc: 'Accept the AIs suggested AAA-compliant replacements.' }
        ],
        faqs: [
            { question: 'Can it read CSS variables?', answer: 'Yes, the parser tracks var() chains to determine the final computed contrast ratios.' }
        ]
    },
    'mesh': {
        componentName: 'MeshGuide',
        title: 'Mesh Gradient Maker',
        description: 'Visually drag and drop control nodes to create ultra-smooth organic multi-color gradients.',
        benefits: [
            'Absolute granular control over color positioning',
            'Export production-ready CSS radial-gradient strings',
            'Create stunning abstract backgrounds for hero sections',
            'Save custom mesh presets'
        ],
        howToSteps: [
            { title: 'Plot Nodes', desc: 'Click to add color anchors onto the canvas.' },
            { title: 'Assign Colors', desc: 'Change the hue of each anchor point.' },
            { title: 'Manipulate Space', desc: 'Drag the nodes to warp and bend the color fields.' }
        ],
        faqs: [
            { question: 'How is the mesh exported?', answer: 'We intelligently map your 2D nodes into a complex layered CSS radial-gradient background for maximum compatibility.' }
        ]
    },
    'micro-interactions': {
        componentName: 'MicroInteractionsGuide',
        title: 'Color Micro-Interactions Preview',
        description: 'Visualize and fine-tune how your colors behave during hover, active, and focus states on actual UI components.',
        benefits: [
            'Ensure interactive elements have noticeable feedback',
            'Perfect the timing of color transitions',
            'Test focus-ring contrast for keyboard navigation',
            'Export the exact CSS transition properties needed'
        ],
        howToSteps: [
            { title: 'Select Component', desc: 'Choose a Button, Input, or Card to test.' },
            { title: 'Define Timeline', desc: 'Set the base, hover, and active color tokens.' },
            { title: 'Interact', desc: 'Play with the element to feel the tactical feedback.' }
        ],
        faqs: [
            { question: 'Why test micro-interactions?', answer: 'A button changing color on press provides critical psychological confirmation to the user that action was taken.' }
        ]
    },
    'mixer': {
        componentName: 'MixerGuide',
        title: 'Pro Color Studio Mixer',
        description: 'Simulate real-world pigment mixing (Subtractive) vs screen light (Additive) to find accurate mid-point blends.',
        benefits: [
            'Bridge the gap between print and digital color mixing',
            'Extract perfect mathematically intermediate shades',
            'Simulate physical paint mixing using Kubelka-Munk theory',
            'Build harmonious stepping gradients'
        ],
        howToSteps: [
            { title: 'Load Colors', desc: 'Input your two anchor colors.' },
            { title: 'Choose Physics', desc: 'Toggle between RGB light mixing or realistic RYB pigment.' },
            { title: 'Extract Midpoints', desc: 'Pull the exact blended hex codes from the resulting mix.' }
        ],
        faqs: [
            { question: 'Why does yellow and blue make gray on screens?', answer: 'Screens use Additive (RGB) light. Mixing them physically requires Subtractive modes which simulate pigment absorption.' }
        ]
    },
    'scraper': {
        componentName: 'ScraperGuide',
        title: 'Website Color Scraper',
        description: 'Enter any URL to extract the complete brand color palette, typograhy usage, and DOM color distribution metrics.',
        benefits: [
            'Reverse engineer competitor palettes instantly',
            'Audit your own live website for stray hex codes',
            'Visualize actual frontend color distribution',
            'Automatically group raw hexes into semantic palettes'
        ],
        howToSteps: [
            { title: 'Enter URL', desc: 'Paste the target website address.' },
            { title: 'Scrape Engine', desc: 'Our headless crawler parses computed CSS from the live DOM.' },
            { title: 'Analyze Report', desc: 'Review the sorted list of primary, secondary, and tertiary colors.' }
        ],
        faqs: [
            { question: 'Will this find colors hidden in images?', answer: 'No, this tool specifically extracts computed CSS styles (backgrounds, text, borders) from the DOM.' }
        ]
    },
    'tokens': {
        componentName: 'TokensGuide',
        title: 'Design Token Exporter',
        description: 'The ultimate source of truth. Manage semantic tokens, aliases, and export your systems to JSON, tailwind.config, or iOS Swift.',
        benefits: [
            'Establish a single source of truth for all projects',
            'Eliminate hardcoded values in your codebase',
            'Seamlessly export to multiple language environments',
            'Visually map aliases like `brand-primary` to raw `blue-500`'
        ],
        howToSteps: [
            { title: 'Define Base', desc: 'Create your raw scale primitives (e.g., slate-50 to slate-900).' },
            { title: 'Build Semantics', desc: 'Map abstract usage names like `surface-default` to primitive scales.' },
            { title: 'Export', desc: 'Download the compiled Style Dictionary or Tailwind configuration.' }
        ],
        faqs: [
            { question: 'Does this output W3C standard tokens?', answer: 'Yes, our JSON exporter complies with the latest W3C Design Tokens Community Group format.' }
        ]
    },
    'voice-color': {
        componentName: 'VoiceColorGuide',
        title: 'Voice to Color Generator',
        description: 'Speak your mood, context, or project brief into the microphone and watch our NLP artificial intelligence generate the perfect palette.',
        benefits: [
            'The fastest way to brainstorm without touching a keyboard',
            'Translates vague emotional words into concrete hex codes',
            'Great for rapid ideation in client meetings',
            'Visually impressive generative workflow'
        ],
        howToSteps: [
            { title: 'Allow Mic', desc: 'Grant microphone permissions to the browser.' },
            { title: 'Describe Vision', desc: 'Say something like "I want a dark cyberpunk aesthetic feeling nervous but energetic."' },
            { title: 'Witness Magic', desc: 'The AI will parse your intent and produce 5 exact colors mapping to those emotions.' }
        ],
        faqs: [
            { question: 'Is the audio recorded?', answer: 'Audio is processed purely for transcription. The resulting text is what is sent to the color engine. We do not store voice data.' }
        ]
    }
};

const guidesDir = path.join(process.cwd(), 'src/components/content/generated_guides');
if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
}

for (const [toolSlug, data] of Object.entries(contentData)) {
    // 1. Generate Guide Component
    const componentCode = `import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const ${data.componentName} = () => {
    return (
        <DocumentationHub
            title="${data.title}"
            description="${data.description}"
            benefits={[
${data.benefits.map(b => `                "${b}"`).join(',\n')}
            ]}
            howToSteps={[
${data.howToSteps.map(step => `                { title: "${step.title}", desc: "${step.desc}" }`).join(',\n')}
            ]}
            faqs={[
${data.faqs.map(faq => `                { question: "${faq.question}", answer: "${faq.answer}" }`).join(',\n')}
            ]}
        />
    );
};
`;
    const compPath = path.join(guidesDir, `${data.componentName}.tsx`);
    fs.writeFileSync(compPath, componentCode);

    // 2. Patch page.tsx
    const pagePath = path.join(process.cwd(), 'src/app/tools', toolSlug, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');

        // Remove old guide prop if it exists
        content = content.replace(/guide=\{<.*?\/>\}/g, '');

        // Replace title
        content = content.replace(/title=\{"[^"]*"\}|title="[^"]*"|title=\{`[^`]*`\}/, `title="${data.title}"`);
        // Replace description
        content = content.replace(/description=\{"[^"]*"\}|description="[^"]*"|description=\{`[^`]*`\}/, `description="${data.description}"`);

        // Inject Guide Prop
        if (content.includes('<PremiumToolLayout')) {
            content = content.replace(/<PremiumToolLayout/, `<PremiumToolLayout\n            guide={<${data.componentName} />}`);
        }

        // Add Import
        if (!content.includes(`import { ${data.componentName} }`)) {
            content = `import { ${data.componentName} } from '@/components/content/generated_guides/${data.componentName}';\n` + content;
        }

        fs.writeFileSync(pagePath, content);
        console.log(`Patched ${toolSlug} successfully.`);
    }
}

console.log('Script completed fully.');
