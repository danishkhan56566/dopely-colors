import React from 'react';
import { ToolGuide } from './ToolGuide';

export const DesignTokensGuide = () => (
    <ToolGuide
        title="Design Token Generator"
        description="Export your palette to CSS, SCSS, JSON, Swift, or Android XML. Bridge the gap between design and development."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Single Source of Truth</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Design tokens are the atomic units of a design system. Instead of hardcoding hex values like #3B82F6, you use semantic tokens like `primary-500`. This allows you to update your brand color in one place and have it propagate everywhere.
                </p>
            </div>
            <div className="bg-gray-900 text-gray-300 p-8 rounded-3xl font-mono text-xs">
                <div className="text-green-400 mb-2">// tokens.json</div>
                {`{
  "color": {
    "primary": { "value": "#6366f1" },
    "surface": { "value": "#ffffff" }
  }
}`}
            </div>
        </div>
    </ToolGuide>
);

export const DarkModeGuide = () => (
    <ToolGuide
        title="Dark Mode Generator"
        description="Instantly generate a dark theme counterpart for your light palette. Adjust contrast and saturation to prevent eye strain."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">More than just Inversion</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Simply inverting colors (White &rarr; Black) looks harsh. Good dark mode design involves softening pure blacks to dark grays (#121212) and desaturating accent colors to prevent vibration against dark backgrounds.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const LinterGuide = () => (
    <ToolGuide
        title="Zombie Color Linter"
        description="Audit your CSS/Codebase for dead or duplicate colors. Merge similar hex codes (e.g., #FAFAFA and #FAFAFB) to clean up your system."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fighting Color Bloat</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Over time, projects accumulate "zombie colors"—accidental variations of the same shade created by different designers. This tool finds them and suggests a single canonical value to use instead.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const DeltaGuide = () => (
    <ToolGuide
        title="Color Distance Calculator (Delta E)"
        description="Scientifically measure the visual difference between two colors. Used for quality control, accessibility, and matching manufacturing standards."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What is Delta E?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Delta E (dE) is a metric used to quantify how the human eye perceives color difference. A dE of &lt; 1.0 is generally considered imperceptible, while a dE of &gt; 5.0 is clearly two different colors.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const DataVizGuide = () => (
    <ToolGuide
        title="Data Visualization Palette Generator"
        description="Create perceptually uniform color scales for charts and graphs. Ensure your data is readable and accessible."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Categorical vs. Sequential</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Charts need specific types of palettes. <strong>Categorical</strong> (distinct hues) for different groups, and <strong>Sequential</strong> (light to dark) for measuring intensity. This tool generates both, tuned for distinctness.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const EcoGuide = () => (
    <ToolGuide
        title="Sustainability & OLED Optimizer"
        description="Calculate the energy impact of your color palette. Optimize for OLED screens to save battery life and reduce carbon footprint."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Green Design</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    On OLED screens, black pixels turn off completely, consuming zero energy. By using true blacks and darker colors, you can significantly reduce the power consumption of your app on mobile devices.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const CognitiveGuide = () => (
    <ToolGuide
        title="Cognitive Load Analyzer"
        description="Measure the visual complexity of your palette. Predic how much mental effort users need to process your color system."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Less is More</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Too many competing accent colors can overwhelm users, increasing bounce rates. This tool analyzes the relationship between your colors to estimate the "visual noise" level.
                </p>
            </div>
        </div>
    </ToolGuide>
);

export const NeuroGuide = () => (
    <ToolGuide
        title="Neurodiversity Optimizer"
        description="Design UI that is comfortable for users with ADHD, Autism, and Dyslexia. Control vibration and sensory overload."
    >
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sensory Friendly Design</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    High-contrast vibrating patterns or overly bright neon clusters can be painful or distracting for neurodivergent users. This tool checks for "sensory spikes" in your palette.
                </p>
            </div>
        </div>
    </ToolGuide>
);
