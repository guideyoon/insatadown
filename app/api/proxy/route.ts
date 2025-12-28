import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });

        const contentType = response.headers['content-type'] || 'image/jpeg';
        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        // Try to guess extension from content-type
        const ext = contentType.split('/')[1] || 'jpg';
        headers.set('Content-Disposition', `attachment; filename="instagram-image.${ext}"`);

        return new NextResponse(response.data, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}
