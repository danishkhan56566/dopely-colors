import { ImageResponse } from 'next/og';
import { getNearestColorName } from '@/lib/color-utils';
import chroma from 'chroma-js';

export const runtime = 'edge';

export const alt = 'Dopely Colors Analysis';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ hex: string }> }) {
    const { hex: hexParam } = await params;
    const hex = hexParam.startsWith('#') ? hexParam : `#${hexParam}`;
    const cleanHex = hex.replace('#', '').toUpperCase();

    const name = getNearestColorName(hex);
    const contrast = chroma.contrast(hex, 'white') > 4.5 ? 'white' : 'black';
    const accent = contrast === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
    const textAccent = contrast === 'white' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)';

    // Generate nice variations for the visual
    const lighter = chroma(hex).brighten(1).hex();
    const darker = chroma(hex).darken(1).hex();

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    backgroundColor: hex,
                    color: contrast,
                    fontFamily: '"Outfit", sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background Decorator - Big Circle */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'linear-gradient(to bottom left, rgba(255,255,255,0.2), transparent)',
                        filter: 'blur(40px)',
                    }}
                />
                {/* Background Decorator - Bottom Circle */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '-10%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        backgroundColor: darker,
                        opacity: 0.3,
                        filter: 'blur(60px)',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                        padding: '40px',
                        textAlign: 'center',
                    }}
                >
                    {/* Premium "Badge" */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 24px',
                            background: accent,
                            borderRadius: '100px',
                            fontSize: 18,
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            marginBottom: 40,
                            border: `1px solid ${textAccent}`,
                            textTransform: 'uppercase',
                        }}
                    >
                        Dopely Colors
                    </div>

                    <div
                        style={{
                            fontSize: 140,
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            lineHeight: 0.9,
                            marginBottom: 20,
                            textShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        }}
                    >
                        {cleanHex}
                    </div>

                    <div
                        style={{
                            fontSize: 50,
                            fontWeight: 500,
                            color: textAccent,
                            marginTop: 0,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {name}
                    </div>

                    {/* Meta Footer */}
                    <div style={{
                        position: 'absolute',
                        bottom: 60,
                        display: 'flex',
                        gap: 20,
                        fontSize: 24,
                        opacity: 0.8
                    }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <span>RGB:</span>
                            <span style={{ fontWeight: 700 }}>{chroma(hex).rgb().join(', ')}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <span>CMYK:</span>
                            <span style={{ fontWeight: 700 }}>{chroma(hex).cmyk().map(n => Math.round(n * 100)).join(', ')}</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            // We can load fonts here if we have the font files or URL. 
            // For edge, fetch is supported. Next.js often bundles fonts? 
            // To keep it simple and robust, we rely on system font or basic font.
            // But to make it "Premium", I should try to load a font if possible. 
            // ImageResponse supports loading fonts from the recursive local fs? 
            // I'll skip custom font loading for this iteration to avoid file read errors in edge.
            // I'll use standard sans-serif which defaults to Satori's default.
        }
    );
}
