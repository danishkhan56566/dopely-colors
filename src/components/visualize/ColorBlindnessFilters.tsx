export const ColorBlindnessFilters = () => (
    <svg style={{ display: 'none' }}>
        <defs>
            {/* Protanopia (Red-Blind) */}
            <filter id="protanopia">
                <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="0.567, 0.433, 0, 0, 0
                            0.558, 0.442, 0, 0, 0
                            0, 0.242, 0.758, 0, 0
                            0, 0, 0, 1, 0"
                />
            </filter>

            {/* Deuteranopia (Green-Blind) */}
            <filter id="deuteranopia">
                <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="0.625, 0.375, 0, 0, 0
                            0.7, 0.3, 0, 0, 0
                            0, 0.3, 0.7, 0, 0
                            0, 0, 0, 1, 0"
                />
            </filter>

            {/* Tritanopia (Blue-Blind) */}
            <filter id="tritanopia">
                <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="0.95, 0.05, 0, 0, 0
                            0, 0.433, 0.567, 0, 0
                            0, 0.475, 0.525, 0, 0
                            0, 0, 0, 1, 0"
                />
            </filter>

            {/* Achromatopsia (Monochromacy) */}
            <filter id="achromatopsia">
                <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="0.299, 0.587, 0.114, 0, 0
                            0.299, 0.587, 0.114, 0, 0
                            0.299, 0.587, 0.114, 0, 0
                            0, 0, 0, 1, 0"
                />
            </filter>
        </defs>
    </svg>
);

export type VisionSimulation = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export const visionSimulationOptions: { id: VisionSimulation; label: string }[] = [
    { id: 'normal', label: 'Normal Vision' },
    { id: 'protanopia', label: 'Protanopia (Red Blind)' },
    { id: 'deuteranopia', label: 'Deuteranopia (Green Blind)' },
    { id: 'tritanopia', label: 'Tritanopia (Blue Blind)' },
    { id: 'achromatopsia', label: 'Achromatopsia (Mono)' },
];
