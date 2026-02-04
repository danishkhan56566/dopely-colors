import {
    Palette, Wand2, Search, Type, Droplet,
    Layers, Grid, RefreshCw, Blend, Printer,
    Eye, Monitor, Cpu, Code2, BookOpen,
    Image, Zap, Shuffle, Pointer,
    Settings2, Layout, FileJson, Accessibility,
    ArrowRight, RotateCw, Moon, BarChart3, Waves,
    Ruler, Sparkles, Globe, Spline, Aperture, Figma,
    Sun, Leaf, LineChart, Combine, Clock, Users, ArrowLeftRight,
    Smartphone, Mic, Hand, MousePointerClick, Watch, Fingerprint,
    Box, Gamepad2, EyeOff, Globe2, Calendar
} from 'lucide-react';

export const ALL_TOOLS = [
    {
        category: 'Generators',
        items: [
            { name: 'AI Color Prompt Lab', icon: Wand2, desc: 'Text-to-Palette with AI', href: '/tools/ai-prompt', badge: 'New' },
            { name: 'Website Color Scraper', icon: Globe, desc: 'Extract colors from URL', href: '/tools/scraper', badge: 'New' },
            { name: 'Brand Palette Maker', icon: Wand2, desc: 'AI brand color system generator', href: '/ai', badge: 'AI' },
            { name: 'Gradient Generator', icon: Layers, desc: 'Create CSS gradients', href: '/gradients' },
            { name: 'Radial Gradient Maker', icon: Droplet, desc: 'Create radial gradients', href: '/gradients?type=radial' },
            { name: 'Conic Gradient Maker', icon: RotateCw, desc: 'Create sweep gradients', href: '/gradients?type=conic', badge: 'New' },
            { name: 'Fluid Gradient Maker', icon: Waves, desc: 'Animated mesh backgrounds', href: '/tools/fluid' },
            { name: 'Mesh Gradient Maker', icon: Grid, desc: 'Create mesh gradients', href: '/gradients?type=mesh' },
            { name: 'Random Color Generator', icon: Shuffle, desc: 'Generate random colors', href: '/explore?sort=random' },
            { name: 'Quick Palette Generator', icon: Zap, desc: 'Instant palette creation', href: '/generate' },
            { name: 'Advanced Harmony Generator', icon: Palette, desc: 'Complex harmonies', href: '/generate?mode=advanced' },
        ]
    },
    {
        category: 'Color Analysis',
        items: [
            { name: 'Image Color Picker', icon: Image, desc: 'Extract colors from images', href: '/image' },
            { name: 'Contrast Checker', icon: Eye, desc: 'Check accessibility', href: '/contrast' },
            { name: 'Contrast Grid', icon: Grid, desc: 'Check all palette combinations', href: '/tools/contrast-grid' },
            { name: 'Color Blindness Simulator', icon: Accessibility, desc: 'Test accessibility', href: '/tools/blindness' },
            { name: 'Color Analyzer', icon: Monitor, desc: 'Analyze color properties', href: '/tools/converter' },
        ]
    },
    {
        category: 'Converters & Editors',
        items: [
            { name: 'Color Converter', icon: RefreshCw, desc: 'Convert color formats', href: '/tools/converter' },
            { name: 'Color Mixer', icon: Blend, desc: 'Mix colors with ratios', href: '/tools/mixer' },
            { name: 'Color Blender', icon: Droplet, desc: 'Blend color transitions', href: '/tools/mixer' },
            { name: 'Color Toner', icon: Printer, desc: 'Generate tints & shades', href: '/tools/toner' },
            { name: 'Color Harmony Wheel', icon: RefreshCw, desc: 'Explore color relationships', href: '/tools/wheel' },
        ]
    },
    {
        category: 'Library & Search',
        items: [
            { name: 'Color Names', icon: BookOpen, desc: 'Explore vast library of colors', href: '/colors' },
            { name: 'Color Name Finder', icon: Search, desc: 'Find names for any color', href: '/colors' },
            { name: 'Color Name Generator', icon: Type, desc: 'Generate creative names', href: '/ai' },
            { name: 'Contrast Grid', icon: Grid, desc: 'Check all palette combinations', href: '/tools/contrast-grid' },
            { name: 'Zombie Color Linter', icon: Search, desc: 'Find duplicate/similar colors', href: '/tools/linter', badge: 'Dev' },
            { name: 'Color Distance (Delta E)', icon: Ruler, desc: 'Calculate color difference', href: '/tools/delta' },
            { name: 'Advanced Accessibility Suit', icon: Settings2, desc: 'Comprehensive testing', href: '/tools/accessibility' },
        ]
    },
    {
        category: 'Design Systems',
        items: [
            { name: 'Design Token Generator', icon: Code2, desc: 'Generate design tokens', href: '/tools/tokens' },
            { name: 'State Shade Generator', icon: Pointer, desc: 'Hover/Active/Focus states', href: '/tools/shade-generator' },
            { name: 'Responsive Theme Generator', icon: Layout, desc: 'Create responsive themes', href: '/tools/themes' },
            { name: 'Glassmorphism Optimizer', icon: Sparkles, desc: 'Generate frosted glass CSS', href: '/tools/glass' },
            { name: 'Dark Mode Generator', icon: Moon, desc: 'Auto-convert to dark theme', href: '/tools/dark-mode', badge: 'New' },
            { name: 'Data Visualization Palette', icon: BarChart3, desc: 'Perceptually uniform scales', href: '/tools/data-viz' },
        ]
    },
    {
        category: 'AI Innovations (2026)',
        items: [
            { name: 'AI Color Trend Predictor', icon: BarChart3, desc: 'Predict upcoming trends', href: '/tools/trend-predictor', badge: 'AI' },
            { name: 'Semantic Color Generator', icon: Sparkles, desc: 'Generate by emotion/brand', href: '/tools/semantic-gen', badge: 'AI' },
            { name: 'Context-Aware Optimizer', icon: Settings2, desc: 'Industry-specific tuning', href: '/tools/context-optimizer', badge: 'AI' },
        ]
    },
    {
        category: 'Advanced Accessibility',
        items: [
            { name: 'Dynamic Contrast Adjuster', icon: Eye, desc: 'Real-time contrast fix', href: '/tools/dynamic-contrast' },
            { name: 'Cognitive Load Analyzer', icon: Cpu, desc: 'Measure info processing', href: '/tools/cognitive-load', badge: 'New' },
            { name: 'Neurodiversity Optimizer', icon: Accessibility, desc: 'For ADHD/Autism friendly UI', href: '/tools/neurodiversity' },
        ]
    },
    {
        category: 'Immersive & 3D Design',
        items: [
            { name: '3D Space Color System', icon: Globe, desc: 'VR/AR depth perception', href: '/tools/3d-space', badge: '3D' },
            { name: 'Holographic Generator', icon: Sparkles, desc: 'Iridescent & metallic effects', href: '/tools/holographic' },
            { name: 'Lighting Simulator', icon: Sun, desc: 'Test OLED/E-ink/Projection', href: '/tools/lighting-sim' },
        ]
    },
    {
        category: 'Sustainability Focus',
        items: [
            { name: 'Energy-Efficient Palette', icon: Leaf, desc: 'Reduce screen energy usage', href: '/tools/eco-palette', badge: 'Eco' },
            { name: 'Print-to-Digital Analyzer', icon: Printer, desc: 'Environmental impact check', href: '/tools/eco-impact' },
        ]
    },
    {
        category: 'Data Visualization 2.0',
        items: [
            { name: 'Animated Data Story', icon: LineChart, desc: 'For scrolling narratives', href: '/tools/data-story' },
            { name: 'Multi-Variable Encoder', icon: Combine, desc: 'Complex dataset systems', href: '/tools/multi-variable' },
            { name: 'Temporal Color Scales', icon: Clock, desc: 'Time-based variations', href: '/tools/temporal' },
        ]
    },
    {
        category: 'Collaborative Workflow',
        items: [
            { name: 'Real-Time Palette Lab', icon: Users, desc: 'Multi-user editing', href: '/tools/collab-lab', badge: 'Beta' },
            { name: 'Design System Migrator', icon: ArrowLeftRight, desc: 'Material to Apple HIG', href: '/tools/migrator' },
            { name: 'Cross-Platform Checker', icon: Smartphone, desc: 'iOS vs Android consistency', href: '/tools/cross-platform' },
        ]
    },
    {
        category: 'Generative & Interactive',
        items: [
            { name: 'Voice Color Control', icon: Mic, desc: '"Make it warmer"', href: '/tools/voice-color', badge: 'Exp' },
            { name: 'Gesture Color Mixer', icon: Hand, desc: 'Webcam gesture control', href: '/tools/gesture-mix' },
            { name: 'Generative Art Extractor', icon: Palette, desc: 'Colors from AI art', href: '/tools/gen-art' },
        ]
    },
    {
        category: 'Developer Power Tools',
        items: [
            { name: 'Performance Optimized', icon: Zap, desc: 'Minimize GPU rendering cost', href: '/tools/perf-palette', badge: 'Dev' },
            { name: 'Variable Font Pairing', icon: Type, desc: 'Auto-match variable fonts', href: '/tools/variable-fonts' },
            { name: 'Micro-Interaction Sets', icon: MousePointerClick, desc: 'Animation color states', href: '/tools/micro-interactions' },
            { name: 'Color Scale Master', icon: Spline, desc: 'Bezier-interpolated scales', href: '/tools/interpolator' },
            { name: 'Smooth Shadow Generator', icon: Layers, desc: 'Layered CSS shadows', href: '/tools/shadows' },
            { name: 'Duotone & SVG Lab', icon: Aperture, desc: 'Generate SVG filters', href: '/tools/duotone' },
        ]
    },
    {
        category: 'Emerging Tech',
        items: [
            { name: 'Wearable Display Opt.', icon: Watch, desc: 'Smartwatch/AR glasses', href: '/tools/wearable' },
            { name: 'Biometric Analyzer', icon: Fingerprint, desc: 'Physiological response', href: '/tools/biometric', badge: 'R&D' },
            { name: 'Spatial Computing', icon: Box, desc: 'Mixed reality interfaces', href: '/tools/spatial' },
        ]
    },
    {
        category: 'Niche Specialized',
        items: [
            { name: 'Gamified Learning', icon: Gamepad2, desc: 'Educational app colors', href: '/tools/gamified' },
            { name: 'Accessible Data Viz', icon: EyeOff, desc: 'Color blind strategies', href: '/tools/blind-viz' },
            { name: 'Cultural Advisor', icon: Globe2, desc: 'Global color meanings', href: '/tools/cultural' },
            { name: 'Seasonal Generator', icon: Calendar, desc: 'Time-based variations', href: '/tools/seasonal' },
        ]
    }
];
