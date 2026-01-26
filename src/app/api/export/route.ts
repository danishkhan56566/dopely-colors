
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const filename = formData.get('filename') as string;
        let content = formData.get('content') as string;
        const isBase64 = formData.get('isBase64') === 'true';
        const contentType = formData.get('contentType') as string;

        if (!filename || !content) {
            return NextResponse.json({ error: 'Missing filename or content' }, { status: 400 });
        }

        // Decode Base64 if needed
        if (isBase64) {
            content = Buffer.from(content, 'base64').toString('utf-8');
        }

        // Add BOM if it's text/json/css to ensure UTF-8 recognition
        const hasBOM = typeof content === 'string' && content.startsWith('\uFEFF');
        const finalContent = (typeof content === 'string' && !hasBOM) ? '\uFEFF' + content : content;

        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        headers.set('Content-Type', contentType || 'text/plain; charset=utf-8');
        headers.set('Content-Length', Buffer.byteLength(finalContent).toString());

        return new NextResponse(finalContent, {
            status: 200,
            headers,
        });
    } catch (err: any) {
        console.error('Export error:', err);
        return NextResponse.json({ error: `Export failed: ${err.message}` }, { status: 500 });
    }
}
