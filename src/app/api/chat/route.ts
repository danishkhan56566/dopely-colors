import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({
        type: 'refusal',
        message: 'AI features are currently disabled to optimize performance and reduce costs.',
        data: {}
    });
}
