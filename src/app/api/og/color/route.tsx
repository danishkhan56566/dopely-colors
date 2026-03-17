import { ImageResponse } from 'next/og';
import { getNearestColorName } from '@/lib/color-utils';
import chroma from 'chroma-js';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rawHex = searchParams.get('hex');
    const hex = '#' + (rawHex || 'FFFFFF').toUpperCase();

    if (!chroma.valid(hex)) {
        return new ImageResponse(<div>Invalid Color</div>);
    }

    const name = getNearestColorName(hex);
    const fontPrimary = await fetch(new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf')).then((res) => res.arrayBuffer());

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hex,
                    padding: '80px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '60px 80px',
                        borderRadius: '40px',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                    }}
                >
                    <div style={{ fontSize: '48px', fontWeight: 900, color: '#111', marginBottom: '10px', textTransform: 'uppercase' }}>{hex}</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#666', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '4px' }}>{name}</div>
                    <div style={{ height: '4px', width: '80px', backgroundColor: hex, borderRadius: '2px' }} />
                    <div style={{ marginTop: '40px', fontSize: '24px', fontWeight: 600, color: '#999' }}>dopelycolors.com</div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Inter',
                    data: fontPrimary,
                    style: 'normal',
                    weight: 700,
                },
            ],
        }
    );
}
