import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const admin = getAdminClient();
    const today = new Date().toISOString().slice(0, 10);

    // Query active sponsorships from Supabase
    const { data: sponsorships, error } = await admin
      .from('sponsorships')
      .select('id, campaign_name, target_url, display_domain, icon_url, description, cta_label, card_tint, placement, start_date, end_date')
      .eq('campaign_status', 'active')
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) {
      console.error('Fetch active sponsors error:', error.message);
      return NextResponse.json({ success: false, sponsors: [], spotsLeft: 4, maxSpots: 4 });
    }

    // Filter by active date window if dates are defined
    const active = (sponsorships || []).filter((s: any) => {
      if (s.start_date && s.start_date > today) return false;
      if (s.end_date && s.end_date < today) return false;
      return true;
    });

    const formatted = active.slice(0, 4).map((s: any) => {
      let domain = s.display_domain;
      if (!domain && s.target_url) {
        try {
          domain = new URL(s.target_url).hostname.replace(/^www\./, '');
        } catch {
          domain = s.target_url.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
        }
      }

      const icon = s.icon_url || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '');
      const fallback = domain ? domain.slice(0, 2).toUpperCase() : (s.campaign_name || 'AD').slice(0, 2).toUpperCase();

      return {
        id: s.id,
        name: domain || s.campaign_name,
        title: s.campaign_name,
        description: s.description || '',
        websiteUrl: s.target_url,
        logoUrl: icon,
        fallbackText: fallback,
        ctaLabel: s.cta_label || 'Visit',
        promotedLabel: s.card_tint && s.card_tint !== 'none' ? 'Featured' : 'Promoted',
        cardTint: s.card_tint || 'none',
      };
    });

    return NextResponse.json(
      {
        success: true,
        sponsors: formatted,
        spotsLeft: Math.max(0, 4 - formatted.length),
        maxSpots: 4,
      },
      {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('Get sponsors API error:', err);
    return NextResponse.json({ success: false, sponsors: [], spotsLeft: 4, maxSpots: 4 });
  }
}
