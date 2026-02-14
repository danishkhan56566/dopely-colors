import React from 'react';
import { ToolGuide } from './ToolGuide';

export const ThreeDSpaceGuide = () => (
    <DocumentationHub
        title="3D Color Space Visualizer"
        description="Escape flatland. Visualize your color palette in a fully interactive, three-dimensional holographic environment to catch issues invisible in 2D."
        benefits={[
            "Reveals 'Gamut Clipping' where colors exceed the sRGB/P3 volume.",
            "Visualizes the 'Shape' of your palette (e.g., linear vs clustered distribution).",
            "Identifies perceptual uniformity gaps using the OKLCH model."
        ]}
        howToSteps={[
            {
                title: "Select Model",
                desc: "Switch between RGB (Cube), HSL (Cylinder), and OKLCH (Perceptual Field) to see how your colors map mathematically."
            },
            {
                title: "Inspect Nodes",
                desc: "Click on any color node to see its coordinates and nearest neighbors in 3D space."
            },
            {
                title: "Check Gamut",
                desc: "Enable the 'Wireframe' overlay to see if your colors fall outside the standard web sRGB volume."
            }
        ]}
        faqs={[
            {
                question: "Why use 3D?",
                answer: "Color is multi-dimensional. 2D pickers flatten this data, hiding the true distance (Delta-E) between colors. 3D reveals these relationships."
            },
            {
                question: "What is OKLCH?",
                answer: "A modern color space that corrects for human vision irregularities. In our 3D view, you'll see it has a distorted shape compared to the perfect RGB cube—this shape matches how we actually see."
            }
        ]}
    />
);

import { DocumentationHub } from './DocumentationHub';

export const LightingSimGuide = () => (
    <DocumentationHub
        title="Virtual Lighting Simulator"
        description="Calibrate your designs for the real world. Simulate how colors render across different hardware panel technologies and lighting environments."
        benefits={[
            "Prevents 'Metamerism Failure' where colors match in studio but clash in retail lighting.",
            "Visualizes contrast loss on non-optimal displays (e.g., projectors, old monitors).",
            "Ensures accessibility compliance across varying ambient light conditions."
        ]}
        howToSteps={[
            {
                title: "Select Hardware Profile",
                desc: "Choose a display technology (OLED, E-Ink, LCD) to simulate its specific gamut and contrast ratio capability."
            },
            {
                title: "Calibrate Environment",
                desc: "Use the 'Ambient Light' slider to test legibility in direct sunlight (5000+ nits) vs pitch darkness."
            },
            {
                title: "Check Compliance",
                desc: "Watch the 'WCAG Status' indicator. It updates in real-time based on the perceived contrast of your simulation."
            }
        ]}
        faqs={[
            {
                question: "What is Metamerism?",
                answer: "Metamerism occurs when two colors appear to match under one light source but look different under another. This tool simulates spectral power distributions to catch this early."
            },
            {
                question: "How accurate is the E-Ink simulation?",
                answer: "We use a physics-based reflectance model that simulates the electrophoretic particles' refresh rate and ghosting artifacts for high fidelity."
            },
            {
                question: "Does this affect my actual monitor settings?",
                answer: "No. This is a software-level post-processing effect overlay limited to the viewport of the simulator."
            }
        ]}
    />
);

export const TrendGuide = () => (
    <DocumentationHub
        title="AI Color Trend Predictor"
        description="Harness the power of predictive analytics. Our AI scans millions of data points to forecast the next dominant color movements."
        benefits={[
            "Identifies micro-trends 6-12 months before they hit mainstream adoption.",
            "Quantifies 'Sentiment' to help match color palettes to brand positioning (e.g., Optimistic vs Grounded).",
            "Provides evidence-backed data to justify design decisions to stakeholders."
        ]}
        howToSteps={[
            {
                title: "Analyze Signals",
                desc: "Watch the 'Signals Feed' to see real-time inputs from fashion, tech, and social media data sources."
            },
            {
                title: "Interpret the Radar",
                desc: "Use the 'Sentiment Analysis' chart to understand the emotional weight of a trend (e.g., High Energy + Natural)."
            },
            {
                title: "Download Data",
                desc: "Export the full trend report as a JSON file or copy the palette directly to your clipboard."
            }
        ]}
        faqs={[
            {
                question: "Where does the data come from?",
                answer: "We aggregate public APIs from social platforms (Pinterest, Instagram), fashion runway reports, and digital art portfolios (Behance)."
            },
            {
                question: "How often is the model retrained?",
                answer: "The 'Antigravity' model updates weekly to capture fast-moving 'Internet Micro-Trends' alongside slower macro movements."
            },
            {
                question: "What is 'Virality Score'?",
                answer: "A composite metric measuring the velocity of a color's adoption across varied industries over the last 30 days."
            }
        ]}
    />
);

export const ContextGuide = () => (
    <DocumentationHub
        title="Environment Simulator"
        description="Reality-check your design. Preview how your color system performs under harsh sunlight, dim offices, and night modes."
        benefits={[
            "Simulates 'Direct Sunlight' (10,000 lux) which washes out low-saturation colors.",
            "Tests 'Night Mode' adaptation to ensure you aren't blinding users with pure white (#FFFFFF) in the dark.",
            "Visualizes the UI through diverse Personas (e.g. 'Rushed Commuter', 'Focused Analyst')."
        ]}
        howToSteps={[
            {
                title: "Choose Environment",
                desc: "Switch between 'Office', 'Outdoors', and 'Night' to see how environmental light affects perception."
            },
            {
                title: "Select Persona",
                desc: "View the UI through the eyes of different user types to build empathy for distraction levels."
            },
            {
                title: "Audit Glare",
                desc: "Check if your nuanced grays disappear under high-contrast lighting conditions."
            }
        ]}
        faqs={[
            {
                question: "Why do colors look different outside?",
                answer: "Sunlight is incredibly bright and 'cool' (blue-tinted). It overpowers screen backlights, reducing perceived contrast and saturation."
            },
            {
                question: "Should I design for outdoors?",
                answer: "If you have a mobile app, yes. Maps, Tickets, and Messaging apps are frequently used in direct sunlight."
            }
        ]}
    />
);

export const DynamicContrastGuide = () => (
    <DocumentationHub
        title="Legibility Quantum"
        description="Scientific typography assurance. Verify contrast not just by color, but by font weight, size, and texture interference."
        benefits={[
            "Check 'Perceptual Readability' based on font weight (Thin vs. Black) and size.",
            "Simulates 'Texture Interference' to ensure text survives on noisy or patterned backgrounds.",
            "Uses APCA (Advanced Perceptual Contrast Algorithm) for future-proof accessibility scoring."
        ]}
        howToSteps={[
            {
                title: "Input Typography",
                desc: "Select your font size and weight. Thin fonts need higher contrast ratios to be legible."
            },
            {
                title: "Check Interference",
                desc: "Toggle 'Texture Mode' to see if your text survives against a noisy background."
            },
            {
                title: "Auto-Fix",
                desc: "Click 'Auto-Fix' to mathematically tune the lightness until it hits compliance (AA/AAA)."
            }
        ]}
        faqs={[
            {
                question: "Why does font weight matter?",
                answer: "Thin fonts have less surface area, reflecting less light. They require higher contrast against the background to be readable compared to bold fonts."
            },
            {
                question: "What is APCA?",
                answer: "It's a new contrast method (WCAG 3.0 candidate) that better models how the human brain perceives lightness difference."
            }
        ]}
    />
);

export const ShadowsGuide = () => (
    <DocumentationHub
        title="Atmosphere Lab"
        description="Engineer hyper-realistic depth. Move beyond simple 'drop-shadows' to physically simulated ambient occlusion and colored light dispersion."
        benefits={[
            "Creates 'colored shadows' that respect the object's hue, avoiding the muddy gray look.",
            "Simulates a virtual 'Light Source' (Sun) to cast directionally accurate shadows based on elevation.",
            "Generates a 'Multi-Layer' CSS array (up to 6 layers) for buttery smooth falloff."
        ]}
        howToSteps={[
            {
                title: "Set Elevation",
                desc: "Choose a preset (Float, Lift, Raise) to determine how far the object is from the surface."
            },
            {
                title: "Position Light",
                desc: "Rotate the 'Sun Dial' to change the angle of the light source. Watch the shadows lengthen."
            },
            {
                title: "Export CSS",
                desc: "Copy the optimized box-shadow stack directly to your clipboard."
            }
        ]}
        faqs={[
            {
                question: "Why multiple layers?",
                answer: "Real-world shadows have an 'Umbra' (dark center) and 'Penumbra' (soft edge). Layering approximates this physics."
            },
            {
                question: "Is this heavy for the browser?",
                answer: "Modern browsers are very efficient at rendering box-shadows. 6 layers is trivial for performance."
            }
        ]}
    />
);

export const WearableGuide = () => (
    <DocumentationHub
        title="Wearable Display Optimizer"
        description="Design for the wrist. Optimize your color palette for the unique constraints of smartwatches and fitness trackers."
        benefits={[
            "Maximizes battery life on OLED displays by calculating 'On-Pixel Percentage' (OPP).",
            "Ensures legibility in high-glare environments (direct sunlight) via high-contrast mode.",
            "Simulates 'Always-On Display' (AOD) states to check visibility in low-power modes."
        ]}
        howToSteps={[
            {
                title: "Check AOD",
                desc: "Toggle 'AOD Mode' to dim the display to 15% brightness. Ensure your complications remain visible."
            },
            {
                title: "Test Sunlight",
                desc: "Switch environment to 'Direct Sun' (10,000+ lux). Verify that your accent colors don't wash out."
            },
            {
                title: "Texture Match",
                desc: "Use the 'Band Studio' to swipe through different strap materials (Leather, Silicone) and check color harmony."
            }
        ]}
        faqs={[
            {
                question: "Why use pure black (#000000)?",
                answer: "On OLED screens, black pixels turn off completely, saving significant battery. Avoid dark grays if battery life is a priority."
            },
            {
                question: "What is the Glancibility Score?",
                answer: "A heuristic metric estimating how many milliseconds it takes to recognize the key data points on the screen. Lower is better."
            }
        ]}
    />
);

export const AIPromptGuide = () => (
    <DocumentationHub
        title="AI Prompt Engineering Studio"
        description="Speak the language of color. Use natural language commands to generate, refine, and lock specific color harmonies."
        benefits={[
            "Translates abstract concepts (e.g., 'Cyberpunk Sunset') into mathematically sound palettes.",
            "Allows iterative refinement: 'Make it pop more', 'Add a neon accent', 'Darken the background'.",
            "Provides semantic usage tags (Primary, Surface, Text) automatically."
        ]}
        howToSteps={[
            {
                title: "Enter a Mood",
                desc: "Type a descriptive phrase like 'Minimalist Scandinavian Kitchen' or 'Retro 80s Arcade'."
            },
            {
                title: "Use Magic Tags",
                desc: "Click tags like '+ Neon' or '+ Matte' to append style modifiers to your prompt."
            },
            {
                title: "Lock & Refine",
                desc: "Click the lock icon on perfect colors, then re-generate to fill in the gaps."
            }
        ]}
        faqs={[
            {
                question: "Can I use brand names?",
                answer: "Yes, our model understands cultural references like 'Wes Anderson style' or 'Coca-Cola Red'."
            },
            {
                question: "How do I get better results?",
                answer: "Be specific about lighting and texture. Instead of 'Blue', try 'Electric Blue glowing in the dark'."
            }
        ]}
    />
);

export const BlindVizGuide = () => (
    <DocumentationHub
        title="Vision Simulator & Triage"
        description="See potential pitfalls before you ship. Real-time lens filters to check compliance with WCAG/ADA standards for color blindness."
        benefits={[
            "Instantly spot 'chromatic vibration' (e.g., Red/Green clashes) that become invisible to 8% of the male population.",
            "Validates that your data visualization relies on value (lightness), not just hue.",
            "Ensures legal compliance for public sector and enterprise software."
        ]}
        howToSteps={[
            {
                title: "Select Filter",
                desc: "Switch between Protanopia (No Red), Deuteranopia (No Green), and Tritanopia (No Blue) to see how your palette shifts."
            },
            {
                title: "Check Safety",
                desc: "Look for the 'WCAG Badge'. If it fails, use the 'Auto-Fix' button to nudge colors into a safe range."
            },
            {
                title: "Daltonize",
                desc: "This algorithm shifts confusing hues towards the visible spectrum of the selected condition."
            }
        ]}
        faqs={[
            {
                question: "Do I need to design for all 3 types?",
                answer: "Focus on Red-Green differentiation (Deuteranopia/Protanopia) as it covers 99% of color blindness cases."
            },
            {
                question: "What is the difference between 'Safe' and 'Compliant'?",
                answer: "'Safe' means distinguishable. 'Compliant' refers to specific contrast ratios (4.5:1) mandated by WCAG."
            }
        ]}
    />
);

export const CognitiveLoadGuide = () => (
    <DocumentationHub
        title="Cognitive Load & Focus Engine"
        description="Quantify the mental cost of your design. Identify 'Visual Noise' and optimize hierarchy to guide user attention effortlessly."
        benefits={[
            "Predicts user fatigue by measuring 'Visual Entropy' (disorder).",
            "Highlights 'Conflict Zones' where two high-saturation colors compete for attention.",
            "Generates an 'Attention Heatmap' to show you exactly where the eye will land first."
        ]}
        howToSteps={[
            {
                title: "Input Palette",
                desc: "Add your UI colors. The system assigns a 'Weight' to each based on Saturation + Lightness."
            },
            {
                title: "Check Heatmap",
                desc: "The 'Attention Map' orders colors by dominance. Ensure your 'Call to Action' color is #1."
            },
            {
                title: "Reduce Load",
                desc: "If your 'Brain CPU' score is high, try reducing the saturation of background elements or removing a color."
            }
        ]}
        faqs={[
            {
                question: "What is a good score?",
                answer: "Aim for a load under 30 for productivity apps. Marketing sites can push to 50-60 for impact."
            },
            {
                question: "Does this account for text?",
                answer: "It analyzes color intrinsic weight. Text legibility is better handled by the 'Dynamic Contrast' tool."
            }
        ]}
    />
);

export const NeurodiversityGuide = () => (
    <DocumentationHub
        title="Neuro-Inclusive Design Guard"
        description="Design for every brain. Simulate sensory environments for Autism, ADHD, and Dyslexia to create calm, inclusive interfaces."
        benefits={[
            "Reduces 'Sensory Overload' triggers for Autistic users by identifying vibration.",
            "Increases 'Focus Retention' for ADHD users by minimizing peripheral distraction.",
            "Improves readability for Dyslexic users through high-contrast, warm-background modes."
        ]}
        howToSteps={[
            {
                title: "Select Persona",
                desc: "Choose a profile (e.g., 'Alex - ADHD') to see the interface simulation adapt."
            },
            {
                title: "Adjust Stimulation",
                desc: "Use the 'Sensory Slider' to see how reducing saturation impacts the 'Calm Score'."
            },
            {
                title: "Export Theme",
                desc: "Download the 'Safe Mode' palette JSON to implement a 'Reduced Motion/Color' toggle in your app."
            }
        ]}
        faqs={[
            {
                question: "Is this medically accurate?",
                answer: "It uses design heuristics based on research (e.g., The British Dyslexia Association style guide), not medical diagnosis."
            },
            {
                question: "Should I default to these colors?",
                answer: "No. These are typically offered as user-selectable themes or 'Accessibility' settings."
            }
        ]}
    />
);

export const BiometricGuide = () => (
    <DocumentationHub
        title="Biometric & Health Data Viz"
        description="Design for the body. Simulate how your interface adapts to physiological signals like heart rate zones, stress levels, and oxygen saturation."
        benefits={[
            "Prototyping for HealthTech and Wearable apps without needing physical sensors.",
            "Validates 'Bio-Feedback Loops' (e.g., does a red alert calm the user or stress them more?).",
            "Ensures data visualization scales correctly across semantic zones (Rest -> Peak)."
        ]}
        howToSteps={[
            {
                title: "Set Vitals",
                desc: "Use the 'Simulated User' controls to adjust Heart Rate (BPM) and Stress Levels."
            },
            {
                title: "Observe Adaptation",
                desc: "Watch how the 'Adaptive UI' shifts its color palette (e.g., lowering saturation during high stress) to reduce cognitive load."
            },
            {
                title: "Test Alerts",
                desc: "Trigger a 'Critical' state to see how the system prioritizes information hierarchy."
            }
        ]}
        faqs={[
            {
                question: "Is this based on real medical data?",
                answer: "The visualization principles follow standard medical triage colors (e.g., ISO 3864). The Bio-Adaptive logic is based on 'Calm Technology' design patterns."
            },
            {
                question: "Can I connect a real device?",
                answer: "Not yet. This is a simulation environment for prototyping the *response* of your design system."
            }
        ]}
    />
);

export const SpatialGuide = () => (
    <ToolGuide
        title="Spatial Computing Palette"
        description="Colors for the spatial era. Design palettes optimized for AR/VR headsets, passthrough video, and volumetric interfaces."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Designing for Immersion</h3>
                <p className="text-gray-600 leading-relaxed">
                    In Augmented Reality (AR), colors must compete with the real world. In Virtual Reality (VR), they define the entire atmosphere.
                    This tool helps you balance <strong>additive color mixing</strong> (light) to prevent eye strain and ensure holographic elements stand out against unpredictable backgrounds.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const ArtExtractorGuide = () => (
    <DocumentationHub
        title="Gallery Lens"
        description="Extract the emotional DNA of any image. Turn masterpieces into mathematically usable palettes."
        benefits={[
            "Extracts 'Dominant Pigments' based on perceptual area, not just pixel count.",
            "Visualizes 'Mood DNA' (Temperature, Vibrancy, Contrast) in a radar chart.",
            "Generates 'AI Remixes' that keep the mood but shift the hue."
        ]}
        howToSteps={[
            {
                title: "Upload Masterpiece",
                desc: "Drop any image (JPG, PNG, WebP) onto the canvas. The AI instantly scans for color clusters."
            },
            {
                title: "Analyze DNA",
                desc: "Review the 'Emotional DNA' chart to see if the image is Warm/Cool or High/Low contrast."
            },
            {
                title: "Export Palette",
                desc: "Click any color node to copy its Hex code, or export the entire report."
            }
        ]}
        faqs={[
            {
                question: "How is this different from other pickers?",
                answer: "Standard pickers just average pixels. Gallery Lens uses k-means clustering on the LAB color space to find distinct human-perceivable colors."
            },
            {
                question: "Can I use this for non-art images?",
                answer: "Yes! It works great for UI screenshots, nature photography, and product moods."
            }
        ]}
    />
);

export const EcoPaletteGuide = () => (
    <ToolGuide
        title="Eco-Friendly Palette Generator"
        description="Design for the planet. Optimize your color palette for energy efficiency on OLED screens and reduced ink usage in print."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sustainable Design</h3>
                <p className="text-gray-600 leading-relaxed">
                    Darker colors consume less energy on OLED displays. This tool helps you find the sweet spot between aesthetics and energy consumption.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const DataVizGuide = () => (
    <ToolGuide
        title="Data Visualizaton Guide"
        description="Colors for data. Ensure your charts and graphs are accessible and distinct."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Distinct Data Colors</h3>
                <p className="text-gray-600 leading-relaxed">
                    Data visualization requires colors that are distinct from one another. This tool generates equidistant colors in perceptual color space.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const BrandGuide = () => (
    <ToolGuide
        title="Brand Identity Guide"
        description="Build a cohesive brand. Learn how to create a scalable color system for your brand identity."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Core Identity</h3>
                <p className="text-gray-600 leading-relaxed">
                    Your primary color defines your brand. Use it sparingly for key actions and focal points to maintain impact.
                </p>
            </div>
        </div>
    </ToolGuide>
);
