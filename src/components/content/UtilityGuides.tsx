import React from 'react';
import { ToolGuide } from './ToolGuide';

export const ShadeGuide = () => (
    <ToolGuide
        title="State & Shade Generator"
        description="Automatically generate hover, active, and disabled states for your design system. Consistent interaction feedback across all components."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Algorithmic State Generation</h3>
                <p className="text-gray-600 leading-relaxed">
                    Don't pick hover colors manually. Our system uses consistent lightness and saturation shifts to generate
                    predictable interactive states (Hover, Pressed, Focus, Disabled) for any base color, ensuring your entire UI feels uniform.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const ThemeGuide = () => (
    <ToolGuide
        title="Responsive Theme Generator"
        description="Create themes that adapt to device and environment. Manage Light, Dark, and High Contrast modes in a single workflow."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Semantic Theming</h3>
                <p className="text-gray-600 leading-relaxed">
                    Define colors by their purpose (e.g., "Surface", "On-Surface", "Primary-Container") rather than their hue.
                    This allows you to swap entire color schemes instantly without breaking accessibility or visual hierarchy.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const MigratorGuide = () => (
    <ToolGuide
        title="Design System Migrator"
        description="Upgrade your legacy palette. Map old hex codes to a new semantic system and generate migration scripts."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Automated Refactoring</h3>
                <p className="text-gray-600 leading-relaxed">
                    Moving from hardcoded Hex values to CSS Variables or Design Tokens? Paste your old stylesheet or JSON,
                    and our tool will cluster similar colors, suggest consolidations, and generate the mapping logic for a smooth transition.
                </p>
            </div>
        </div>
    </ToolGuide>
);

import { DocumentationHub } from './DocumentationHub';

export const ShadowGuide = () => (
    <DocumentationHub
        title="Smooth Shadow Generator"
        description="Engineer hyper-realistic, layered shadows that give your interface true depth. Designed for high-performance rendering."
        benefits={[
            "Simulates authentic ambient occlusion using non-linear operational stacking.",
            "Optimized CSS generation ensures 60fps scrolling performance on all devices.",
            "Seamlessly adapts to both light and dark modes without manual recalibration."
        ]}
        howToSteps={[
            {
                title: "Configure Light Source",
                desc: "Adjust the 'Vertical Distance' and 'Spread' to simulate the angle and intensity of your virtual light source."
            },
            {
                title: "Tune Atmospherics",
                desc: "Use 'Blur Radius' to control the softness. Higher values simulate a more diffuse, ambient light environment."
            },
            {
                title: "Export Grav-Data",
                desc: "Click the copy icon to extract the optimized CSS 'box-shadow' array for immediate deployment."
            }
        ]}
        faqs={[
            {
                question: "Why use layered shadows instead of a single drop-shadow?",
                answer: "Real-world shadows are not uniform. They disperse and soften as they travel further from the object. Layering multiple shadows (umbrae and penumbrae) mathematically approximates this physics for a '10x' better visual."
            },
            {
                question: "Does this impact rendering performance?",
                answer: "Minimally. While we generate up to 6 layers, modern GPU compositing handles box-shadow stacking efficiently. We optimize the spread values to prevent layout thrashing."
            },
            {
                question: "Can I use this for Neumorphism?",
                answer: "Yes. By adjusting the 'Reverse' parameters and using light/dark pairs, you can achieve 'Soft UI' or Neumorphic effects."
            },
            {
                question: "Is the generated code cross-browser compatible?",
                answer: "Absolutely. We output standard CSS3 'box-shadow' properties supported by all evergreen browsers (Chrome, Firefox, Safari, Edge)."
            }
        ]}
    />
);

export const FontGuide = () => (
    <ToolGuide
        title="Variable Font Pairing"
        description="Match typography to your colors. Explore how font weight and color contrast interact to affect readability."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Optical Weight Balancing</h3>
                <p className="text-gray-600 leading-relaxed">
                    A light text color on a dark background often looks thinner than the reverse ("irradiation illusion").
                    This tool suggests Variable Font weight adjustments to compensate for these optical illusions, ensuring your type looks optically consistent across all themes.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const CulturalGuide = () => (
    <ToolGuide
        title="Cultural Color Advisor"
        description="Design for a global audience. Understand the cultural meaning of colors across different regions and traditions."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Avoid Cultural Missteps</h3>
                <p className="text-gray-600 leading-relaxed">
                    White is for weddings in the West but funerals in parts of Asia. Red implies good fortune in China but danger or debt in Western finance.
                    Check your palette against our cultural database to ensure your message lands the way you intend.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const SeasonalGuide = () => (
    <ToolGuide
        title="Seasonal Palette Generator"
        description="Capture the mood of the moment. Generate palettes inspired by the four seasons, holidays, and annual events."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nature's Cycle</h3>
                <p className="text-gray-600 leading-relaxed">
                    From the fresh pastels of Spring to the deep, warm tones of Autumn. Seasonal palettes evoke specific memories and feelings.
                    Perfect for marketing campaigns, event branding, or keeping your product fresh year-round.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const GamifiedGuide = () => (
    <ToolGuide
        title="Gamified Learning"
        description="Learn color theory by playing. Interactive challenges to train your eye for hue, saturation, and contrast."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Train Your Color Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                    Can you spot the difference between #FF0000 and #FF0505? Arrange gradients in perfect order?
                    Our games help designers and artists refine their perceptual accuracy and understand color relationships intuitively.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const BlindVizGuide = () => (
    <ToolGuide
        title="Accessible Data Visualization"
        description="Charts for everyone. Ensure your graphs and data stories are readable by users with color vision deficiencies."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Beyond Red and Green</h3>
                <p className="text-gray-600 leading-relaxed">
                    Standard "Red/Green" status indicators are often indistinguishable to color blind users.
                    This tool suggests alternative palettes (like Blue/Orange) and patterns/textures to ensure data is communicated clearly to 100% of your audience.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const InterpolatorGuide = () => (
    <ToolGuide
        title="Color Scale Interpolator"
        description="Master the gradient. Create perfectly smooth, perceptually uniform color ramps for maps, heatmaps, and UI scales."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Linear vs. Perceptual Interpolation</h3>
                <p className="text-gray-600 leading-relaxed">
                    Standard RGB interpolation often results in "gray dead zones" in the middle of gradients.
                    We use <strong>Oklab</strong> and <strong>Lch</strong> spaces to interpolate colors, resulting in vibrant, harmonically rich transitions that maintain brightness.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const CrossPlatformGuide = () => (
    <ToolGuide
        title="Cross-Platform Checker"
        description="One palette, every device. Preview how your colors render on iOS, Android, macOS, and Windows."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">System Color Mapping</h3>
                <p className="text-gray-600 leading-relaxed">
                    Each OS has its own system colors (e.g., dynamic systemBlue on iOS vs Material You on Android).
                    Check how your brand colors interact with these native system elements to ensure native-feeling consistency.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const MicroInteractionGuide = () => (
    <ToolGuide
        title="Micro-Interaction Sets"
        description="Colors in motion. Design the fleeting color changes that occur during clicks, taps, and swipes."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">The Details Matter</h3>
                <p className="text-gray-600 leading-relaxed">
                    A button press isn't just a state change; it's a visual feedback loop. Design the 'flash' color of a ripple effect,
                    the glow of a loading skeleton, or the fade-out of a deleted item.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const DataStoryGuide = () => (
    <ToolGuide
        title="Animated Data Narrative"
        description="Tell stories with color. Use temporal color shifts to highlight changes in data over time."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Guiding Attention</h3>
                <p className="text-gray-600 leading-relaxed">
                    In a complex dashboard, use color animation to guide the user's eye to the most important metric that just updated.
                    Create "color choreographies" that explain cause-and-effect relationships in your data.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const MultiVariableGuide = () => (
    <ToolGuide
        title="Multi-Variable Encoder"
        description="Encode more data. Use Hue, Saturation, and Lightness to represent three different data dimensions simultaneously."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bivariate & Trivariate Maps</h3>
                <p className="text-gray-600 leading-relaxed">
                    Visualize complex relationships (e.g., Population Density vs. Income) by mixing two color scales.
                    This tool helps you balance the scales so the resulting mixed colors are still decipherable and meaningful.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const TemporalGuide = () => (
    <ToolGuide
        title="Temporal Color Scales"
        description="Visualizing time. Color scales specifically designed to represent chronological data and duration."
    >
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cyclical vs. Diverging</h3>
                <p className="text-gray-600 leading-relaxed">
                    Time is often cyclical (hours of the day, seasons). Use cyclical color maps (where the end connects to the beginning)
                    to represent these patterns naturally, or diverging scales to show past vs. future relative to "now".
                </p>
            </div>
        </div>
    </ToolGuide>
);
