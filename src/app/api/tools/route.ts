import { NextRequest, NextResponse } from 'next/server';
import { fetchSoftwareFromDb, sortSoftwareByEnterpriseRank } from '@/lib/db-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const pricing = searchParams.get('pricing');
    const search = searchParams.get('search')?.toLowerCase().trim();
    
    // Pagination params
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 100;

    let tools = await fetchSoftwareFromDb();

    if (slug) {
      const match = tools.find(t => t.slug === slug);
      if (!match) {
        return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: match });
    }

    if (category) {
      tools = tools.filter(t => t.primaryCategory === category || t.secondaryCategories?.includes(category));
    }

    if (type) {
      if (type === 'software') {
        tools = tools.filter(t => !t.itemType || t.itemType === 'software');
      } else if (type === 'open-source') {
        tools = tools.filter(t => (t.itemType === 'open-source' || t.pricingModel === 'Open Source') && t.itemType !== 'extension' && t.itemType !== 'plugin');
      } else {
        tools = tools.filter(t => t.itemType === type);
      }
    }

    if (pricing && pricing !== 'All') {
      const lower = pricing.toLowerCase();
      if (lower === 'free') {
        tools = tools.filter(t => t.pricingModel === 'Free' || t.pricingModel === 'Open Source');
      } else if (lower === 'freemium') {
        tools = tools.filter(t => t.pricingModel === 'Freemium' || (t.freeTierAvailable && t.startingPrice));
      } else if (lower === 'paid') {
        tools = tools.filter(t => t.pricingModel === 'Paid');
      }
    }

    if (search) {
      tools = tools.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.tagline.toLowerCase().includes(search) ||
        t.shortDescription.toLowerCase().includes(search)
      );
    }

    const sorted = sortSoftwareByEnterpriseRank(tools);
    const total = sorted.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = sorted.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      success: true,
      total,
      count: paginated.length,
      page,
      limit,
      totalPages,
      hasMore,
      data: paginated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
