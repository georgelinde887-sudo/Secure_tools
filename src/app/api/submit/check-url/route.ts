import { NextRequest, NextResponse } from 'next/server';
import { findDuplicateMatch } from '@/lib/duplicate-check';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url || !url.trim() || url.trim().length < 4) {
      return NextResponse.json({ isDuplicate: false });
    }

    const match = await findDuplicateMatch([url.trim()]);

    if (match) {
      return NextResponse.json({
        isDuplicate: true,
        name: match.name,
        slug: match.slug,
        itemType: match.itemType,
        matchedUrl: match.matchedUrl,
        matchedField: match.matchedField,
        listingPath: match.listingPath,
        source: match.source,
        message: `This product or URL is already listed in SecureTools.live under "${match.name}". Duplicate listings are strictly prohibited.`,
      });
    }

    return NextResponse.json({ isDuplicate: false });
  } catch (err: any) {
    console.error('Error in /api/submit/check-url:', err);
    return NextResponse.json({ isDuplicate: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const urls: string[] = [];

    if (Array.isArray(body.urls)) {
      urls.push(...body.urls);
    }
    if (body.url) {
      urls.push(body.url);
    }
    if (body.websiteUrl) urls.push(body.websiteUrl);
    if (body.repositoryUrl) urls.push(body.repositoryUrl);
    if (body.extensionStoreUrl) urls.push(body.extensionStoreUrl);
    if (body.packageUrl) urls.push(body.packageUrl);

    const match = await findDuplicateMatch(urls);

    if (match) {
      return NextResponse.json({
        isDuplicate: true,
        name: match.name,
        slug: match.slug,
        itemType: match.itemType,
        matchedUrl: match.matchedUrl,
        matchedField: match.matchedField,
        listingPath: match.listingPath,
        source: match.source,
        message: `This product or URL is already listed in SecureTools.live under "${match.name}". Duplicate listings are strictly prohibited.`,
      });
    }

    return NextResponse.json({ isDuplicate: false });
  } catch (err: any) {
    console.error('Error in POST /api/submit/check-url:', err);
    return NextResponse.json({ isDuplicate: false, error: err.message }, { status: 500 });
  }
}
