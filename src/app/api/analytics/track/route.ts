import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { resolveCountryInfo, resolveCountryFromTimezone, resolveCountryFromLocale } from '@/lib/geo-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, toolSlug, eventType = 'view', referrer = '', sponsorshipId, userTimeZone, userLocale, userCountry } = body;

    if ((!toolSlug && !sponsorshipId) || !['view', 'click'].includes(eventType)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 1. Identify User / Compute Privacy-Preserving Visitor Footprint
    let userId: string | null = null;
    let visitorHash = '';

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        userId = user.id;
        visitorHash = `user_${user.id}`;
      }
    } catch {
      // Guest session
    }

    if (!visitorHash) {
      // Anonymous visitor footprint: SHA-256 of IP + User-Agent + Current Day
      const forwardedFor = request.headers.get('x-forwarded-for') || '';
      const clientIp = forwardedFor.split(',')[0].trim() || request.headers.get('cf-connecting-ip') || '127.0.0.1';
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 16) : 'st_analytics_salt';

      visitorHash = crypto
        .createHash('sha256')
        .update(`${clientIp}|${userAgent}|${today}|${salt}`)
        .digest('hex');
    }

    const admin = getAdminClient();
    const resolvedListingId = listingId || toolSlug;

    // 2. Deduplicate Views: 1 unique view per visitor per day
    if (eventType === 'view') {
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      try {
        const { data: existingView } = await admin
          .from('listing_analytics_events')
          .select('id')
          .eq('tool_slug', toolSlug)
          .eq('event_type', 'view')
          .eq('visitor_hash', visitorHash)
          .gte('created_at', todayStart.toISOString())
          .maybeSingle();

        if (existingView) {
          // Already counted this visitor today
          return NextResponse.json({ success: true, duplicate: true });
        }
      } catch (err: any) {
        // Table may not exist yet or query skipped
        console.warn('Analytics deduplication check skipped:', err?.message);
      }
    }

    // 3. Record Event
    try {
      await (admin.from('listing_analytics_events') as any).insert({
        listing_id: resolvedListingId,
        tool_slug: toolSlug,
        event_type: eventType,
        visitor_hash: visitorHash,
        user_id: userId,
        referrer: referrer ? String(referrer).slice(0, 500) : null,
      });

      // 4. Update Summary Table (Upsert)
      const { data: summary } = await admin
        .from('listing_analytics_summary')
        .select('*')
        .eq('listing_id', resolvedListingId)
        .maybeSingle();

      const summaryRow = summary as any;
      if (summaryRow) {
        await (admin.from('listing_analytics_summary') as any)
          .update({
            total_views: eventType === 'view' ? (summaryRow.total_views || 0) + 1 : summaryRow.total_views,
            unique_views: eventType === 'view' ? (summaryRow.unique_views || 0) + 1 : summaryRow.unique_views,
            total_clicks: eventType === 'click' ? (summaryRow.total_clicks || 0) + 1 : summaryRow.total_clicks,
            last_updated: new Date().toISOString(),
          })
          .eq('listing_id', resolvedListingId);
      } else {
        await (admin.from('listing_analytics_summary') as any).insert({
          listing_id: resolvedListingId,
          tool_slug: toolSlug,
          total_views: eventType === 'view' ? 1 : 0,
          unique_views: eventType === 'view' ? 1 : 0,
          total_clicks: eventType === 'click' ? 1 : 0,
          last_updated: new Date().toISOString(),
        });
      }

      // Update listings table directly for instant dynamic ranking
      try {
        if (eventType === 'view') {
          await (admin.rpc as any)('increment_listing_views', {
            target_id: resolvedListingId,
            target_slug: toolSlug,
          });
        } else if (eventType === 'click') {
          await (admin.rpc as any)('increment_listing_clicks', {
            target_id: resolvedListingId,
            target_slug: toolSlug,
          });
        }
      } catch (countErr: any) {
        console.warn('Listing counter update error:', countErr?.message);
      }
    } catch (dbErr: any) {
      console.warn('Analytics event record skipped:', dbErr?.message);
    }

    // 5. Update Sponsorship Analytics if sponsorshipId is provided
    if (sponsorshipId) {
      try {
        const headerCountry =
          request.headers.get('x-vercel-ip-country') ||
          request.headers.get('cf-ipcountry') ||
          request.headers.get('x-country-code') ||
          request.headers.get('cloudfront-viewer-country') ||
          '';

        const acceptLang = request.headers.get('accept-language')?.split(',')[0];

        const detectedCode =
          (userCountry ? String(userCountry).trim().toUpperCase() : null) ||
          (headerCountry ? headerCountry.trim().toUpperCase() : null) ||
          resolveCountryFromTimezone(userTimeZone) ||
          resolveCountryFromLocale(userLocale) ||
          resolveCountryFromLocale(acceptLang) ||
          'OTHER';

        const geo = resolveCountryInfo(detectedCode);

        const { data: analyticsRow } = await admin
          .from('sponsorship_analytics')
          .select('id, total_impressions, total_clicks, metrics_data')
          .eq('sponsorship_id', sponsorshipId)
          .maybeSingle();

        if (analyticsRow) {
          const row = analyticsRow as any;
          const currentMetrics = (row.metrics_data && typeof row.metrics_data === 'object') ? row.metrics_data : {};
          const countryCounts: Record<string, number> = { ...(currentMetrics.countryCounts || {}) };

          if (eventType === 'click') {
            countryCounts[geo.code] = (countryCounts[geo.code] || 0) + 1;
          }

          const totalGeoClicks = Object.values(countryCounts).reduce((acc: number, v: any) => acc + (Number(v) || 0), 0);
          const topCountries = Object.entries(countryCounts)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .map(([code, count]) => {
              const info = resolveCountryInfo(code);
              const cnt = Number(count) || 0;
              const share = totalGeoClicks > 0 ? `${Math.round((cnt / totalGeoClicks) * 100)}%` : '0%';
              return {
                country: info.name,
                code: info.code,
                flag: info.flag,
                clicks: cnt,
                share,
              };
            });

          await (admin.from('sponsorship_analytics') as any)
            .update({
              total_impressions: eventType === 'view' ? (row.total_impressions || 0) + 1 : row.total_impressions,
              total_clicks: eventType === 'click' ? (row.total_clicks || 0) + 1 : row.total_clicks,
              metrics_data: {
                ...currentMetrics,
                countryCounts,
                topCountries,
              },
            })
            .eq('id', row.id);
        } else {
          const countryCounts = eventType === 'click' ? { [geo.code]: 1 } : {};
          const topCountries = eventType === 'click' ? [{
            country: geo.name,
            code: geo.code,
            flag: geo.flag,
            clicks: 1,
            share: '100%',
          }] : [];

          await (admin.from('sponsorship_analytics') as any).insert({
            sponsorship_id: sponsorshipId,
            total_impressions: eventType === 'view' ? 1 : 0,
            total_clicks: eventType === 'click' ? 1 : 0,
            is_demo: false,
            metrics_data: {
              countryCounts,
              topCountries,
            },
            recorded_date: new Date().toISOString().slice(0, 10),
          });
        }
      } catch (spErr: any) {
        console.warn('Sponsorship analytics tracking error:', spErr?.message);
      }
    }

    return NextResponse.json({ success: true, eventType });
  } catch (err: any) {
    console.error('Track analytics error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
