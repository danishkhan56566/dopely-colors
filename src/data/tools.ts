import {
    Palette, Wand2, Search, Type, Droplet,
    Layers, Grid, RefreshCw, Blend, Printer,
    Eye, Monitor, Cpu, Code2, BookOpen,
    Zap, Shuffle, Pointer, Move3D,
    Settings2, Layout, FileJson, Accessibility,
    ArrowRight, RotateCw, Moon, BarChart3, Waves,
    Ruler, Sparkles, Globe, Spline, Aperture, Figma,
    Sun, Leaf, LineChart, Combine, Clock, Users, ArrowLeftRight,
    Smartphone, Mic, Hand, MousePointerClick, Watch, Fingerprint,
    Box, Gamepad2, EyeOff, Globe2, Calendar, Heart,
    FlaskConical, ArrowRightLeft, Image, Briefcase, LayoutGrid
} from 'lucide-react';

export const ALL_TOOLS = [
    {
        category: 'Generative & AI',
        items: [
            { name: 'AI Color Prompt Lab', icon: Wand2, desc: 'Generate structured prompts for AI art', href: '/tools/ai-prompt', badge: 'New' },
            { name: 'Generative Art Extractor', icon: Image, desc: 'Extract mood & remix palette', href: '/tools/art-extractor', badge: 'New' },
            { name: 'Brand Palette Maker', icon: Wand2, desc: 'AI brand color system generator', href: '/tools/brand', badge: 'New' },
            { name: 'Gradient Generator', icon: Layers, desc: 'Create CSS gradients', href: '/gradients' },
            { name: 'Radial Gradient Maker', icon: Droplet, desc: 'Create radial gradients', href: '/gradients?type=radial' },
            { name: 'Conic Gradient Maker', icon: RotateCw, desc: 'Create sweep gradients', href: '/gradients?type=conic', badge: 'New' },
            { name: 'Fluid Gradient Maker', icon: Waves, desc: 'Organic moving gradients', href: '/tools/fluid' },
            { name: 'Mesh Gradient Studio', icon: Grid, desc: 'Draggable color mesh', href: '/tools/mesh', badge: 'New' },
            { name: 'Mesh Gradient Maker', icon: Grid, desc: 'Create mesh gradients', href: '/tools/fluid' },
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
            { name: 'Contrast Grid', icon: LayoutGrid, desc: 'Check all palette combinations', href: '/tools/contrast-grid' },
            { name: 'Color Blindness Simulator', icon: Accessibility, desc: 'Test accessibility', href: '/tools/blindness' },
            { name: 'Color Analyzer', icon: Monitor, desc: 'Analyze color properties', href: '/colors' },
        ]
    },
    {
        category: 'Converters & Editors',
        items: [
            { name: 'Color Converter', icon: RefreshCw, desc: 'Convert color formats', href: '/tools/converter' },
            { name: 'Color Mixer', icon: Blend, desc: 'Mix colors with ratios', href: '/tools/mixer' },
            { name: 'Color Blender', icon: Droplet, desc: 'Blend color transitions', href: '/tools/mixer?view=steps' },
            { name: 'Color Toner', icon: Printer, desc: 'Generate tints & shades', href: '/tools/toner' },
            { name: 'Color Harmony Wheel', icon: RefreshCw, desc: 'Explore color relationships', href: '/tools/wheel' },
        ]
    },
    {
        category: 'Library & Search',
        items: [
            { name: 'Color Names', icon: BookOpen, desc: 'Explore vast library of colors', href: '/colors' },
            { name: 'Color Name Finder', icon: Search, desc: 'Find names for any color', href: '/colors' },
            { name: 'Color Name Generator', icon: Type, desc: 'Generate creative names', href: '/colors' },
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


        ]
    },
    {
        category: 'AI Innovations (2026)',
        items: [
            { name: 'AI Color Trend Predictor', icon: BarChart3, desc: 'Predict upcoming trends', href: '/tools/trend-predictor', badge: 'AI' },


        ]
    },
    {
        category: 'Advanced Accessibility',
        items: [
            { name: 'Dynamic Contrast Adjuster', icon: Eye, desc: 'Real-time contrast fix', href: '/tools/dynamic-contrast' },
            { name: 'Cognitive Load Analyzer', icon: Cpu, desc: 'Measure info processing', href: '/tools/cognitive-load', badge: 'New' },

        ]
    },
    {
        category: 'Immersive & 3D Design',
        items: [


            { name: 'Lighting Simulator', icon: Sun, desc: 'Test OLED/E-ink/Projection', href: '/tools/lighting-sim' },
        ]
    },
    {
        category: 'Sustainability Focus',
        items: [
            { name: 'Sustainability & OLED Suite', icon: Leaf, desc: 'Energy efficiency & dark mode lab', href: '/tools/eco-palette', badge: '2.0' },
            { name: 'Print-to-Digital Analyzer', icon: Printer, desc: 'Environmental impact check', href: '/tools/eco-impact' },
        ]
    },
    {
        category: 'Data Visualization 2.0',
        items: [

            { name: 'Multi-Variable Encoder', icon: Combine, desc: 'Complex dataset systems', href: '/tools/multi-variable' },
            { name: 'Temporal Color Scales', icon: Clock, desc: 'Time-based variations', href: '/tools/temporal' },
        ]
    },
    {
        category: 'Developer Tools',
        items: [
            { name: 'Design Token Generator', icon: Code2, desc: 'Export palette to CSS/Swift/XML', href: '/tools/design-tokens', badge: 'New' },

            { name: 'Design System Migrator', icon: ArrowRightLeft, desc: 'Transfer colors between systems', href: '/tools/migrator' },
            { name: 'Cross-Platform Checker', icon: Smartphone, desc: 'iOS vs Android consistency', href: '/tools/cross-platform' },
        ]
    },
    {
        category: 'Collaborative Workflow',
        items: [
            { name: 'Real-Time Palette Lab', icon: Users, desc: 'Multi-user editing', href: '/tools/collab-lab', badge: 'Beta' },
        ]
    },
    {
        category: 'Generative & Interactive',
        items: [
            { name: 'Voice Color Control', icon: Mic, desc: '"Make it warmer"', href: '/tools/voice-color', badge: 'Exp' },
            { name: 'Gesture Color Mixer', icon: Hand, desc: 'Webcam gesture control', href: '/tools/gesture-mix' },
            { name: 'Generative Art Extractor', icon: Palette, desc: 'Colors from AI art', href: '/image' },
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
