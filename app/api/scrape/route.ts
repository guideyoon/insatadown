import { NextResponse } from 'next/server';
import { instagramGetUrl } from 'instagram-url-direct';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic validation for Instagram URL
    if (!url.includes('instagram.com')) {
      return NextResponse.json({ error: 'Invalid Instagram URL' }, { status: 400 });
    }

    const data = await instagramGetUrl(url);

    // The library returns an object with url_list (array of strings)
    // We want to return a consistent structure
    return NextResponse.json({
      media: data.url_list || [],
      // The library might not return caption directly in all versions, 
      // but let's check if it does or if we need to parse it.
      // For now, we return what we get.
      raw: data
    });

  } catch (error: any) {
    console.error('Scrape error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to scrape post. Make sure the post is public.'
    }, { status: 500 });
  }
}
