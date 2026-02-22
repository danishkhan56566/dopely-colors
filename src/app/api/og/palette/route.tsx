import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // e.g., ?colors=EF4444-3B82F6-10B981-F59E0B-8B5CF6
        const colorsParam = searchParams.get('colors');

        // Default palette if none provided
        const colorArray = colorsParam
            ? colorsParam.split('-').map(c => `#${c.replace('#', '')}`)
            : ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];

        // Maximum 10 colors to prevent layout breaking
        const safeColors = colorArray.slice(0, 10);

        // Calculate the width for each color block to fill perfectly
        const percentageWidth = 100 / safeColors.length;

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '1200px',
                        height: '630px',
                        backgroundColor: '#ffffff',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Brand Header */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '40px 60px',
                            backgroundColor: '#ffffff',
                            height: '140px',
                            borderBottom: '1px solid #e2e8f0'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {/* Logo Representation */}
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                                    display: 'flex',
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                                    Dopely Colors
                                </span>
                                <span style={{ fontSize: '20px', fontWeight: 600, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Color Palette Generator
                                </span>
                            </div>
                        </div>

                        {/* URL Watermark */}
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', backgroundColor: '#ecfdf5', padding: '12px 24px', borderRadius: '100px' }}>
                            dopelycolors.com
                        </div>
                    </div>

                    {/* Palette Area */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            flex: 1, // takes up the remaining 490px
                        }}
                    >
                        {safeColors.map((color, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: `${percentageWidth}%`,
                                    height: '100%',
                                    backgroundColor: color,
                                    position: 'relative',
                                }}
                            >
                                {/* Hex Code Overlay at Bottom */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '40px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        fontSize: '24px',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    {color}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
