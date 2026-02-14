import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({
        status: 'error',
        message: 'This feature is currently disabled to optimize performance.',
        palettes: []
    });
}
