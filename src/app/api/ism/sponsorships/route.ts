import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email?.toLowerCase().endsWith('@sendnow.live')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const admin = getAdminClient();
    const { data: sponsorships, error } = await admin
      .from('sponsorships')
      .select('*, sponsorship_analytics(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, sponsorships: sponsorships || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email?.toLowerCase().endsWith('@sendnow.live')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      ownerEmail,
      ownerId: explicitOwnerId,
      campaignName,
      targetUrl,
      displayDomain,
      iconUrl,
      description,
      ctaLabel = 'Visit',
      placement = 'rail',
      startDate,
      endDate,
      cardTint = 'none',
    } = body;

    if (!campaignName || !targetUrl) {
      return NextResponse.json({ error: 'Title and Advertiser URL are required.' }, { status: 400 });
    }

    const admin = getAdminClient();
    const normalizedEmail = (ownerEmail || '').trim().toLowerCase();

    // 1. Resolve owner_id from email or explicit ID
    let resolvedOwnerId = explicitOwnerId || null;
    if (!resolvedOwnerId && normalizedEmail) {
      const { data: profile } = await admin
        .from('profiles')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (profile) {
        resolvedOwnerId = (profile as any).id;
      }
    }

    // Fallback: If no matching profile exists yet, use admin user.id as foreign-key placeholder
    if (!resolvedOwnerId) {
      resolvedOwnerId = user.id;
    }

    // 2. Insert Sponsorship Slot
    const payload: any = {
      owner_id: resolvedOwnerId,
      owner_email: normalizedEmail || user.email,
      campaign_name: campaignName.trim(),
      campaign_status: 'active',
      placement: placement || 'rail',
      target_url: targetUrl.trim(),
      display_domain: displayDomain?.trim() || null,
      icon_url: iconUrl?.trim() || null,
      description: description?.trim() || null,
      cta_label: ctaLabel?.trim() || 'Visit',
      card_tint: cardTint || 'none',
      start_date: startDate || new Date().toISOString().slice(0, 10),
      end_date: endDate || null,
      utm_params: {
        utm_source: 'securetools',
        utm_medium: 'sponsorship',
        utm_campaign: campaignName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      },
    };

    const { data: inserted, error: insertError } = await (admin.from('sponsorships') as any)
      .insert(payload)
      .select('*, sponsorship_analytics(*)')
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 3. Create clean initial 0-count analytics record
    try {
      await (admin.from('sponsorship_analytics') as any).insert({
        sponsorship_id: inserted.id,
        total_impressions: 0,
        total_clicks: 0,
        is_demo: false,
        metrics_data: { topCountries: [] },
        recorded_date: new Date().toISOString().slice(0, 10),
      });
    } catch (e: any) {
      console.warn('Initial analytics insert notice:', e?.message);
    }

    // 4. Log Audit Trail
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    try {
      await admin.from('audit_logs').insert({
        actor_email: user.email,
        action: 'CREATE_SPONSORSHIP_SLOT',
        target_id: inserted.id,
        target_type: 'sponsorship',
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || '',
        metadata: {
          campaignName,
          targetUrl,
          ownerEmail: normalizedEmail || null,
          placement,
        },
      } as any);
    } catch {}

    // 5. Invalidate Next.js cache so dashboard and public pages update immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/dashboard');
      revalidatePath('/ism');
    } catch {}

    return NextResponse.json({ success: true, sponsorship: inserted });
  } catch (err: any) {
    console.error('Create sponsorship error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email?.toLowerCase().endsWith('@sendnow.live')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, status, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing sponsorship ID' }, { status: 400 });
    }

    const admin = getAdminClient();

    if (action === 'toggle_status') {
      const nextStatus = status === 'active' ? 'paused' : 'active';
      const { data: updated, error } = await (admin.from('sponsorships') as any)
        .update({ campaign_status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, sponsorship_analytics(*)')
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      try {
        revalidatePath('/dashboard');
        revalidatePath('/ism');
      } catch {}

      return NextResponse.json({ success: true, sponsorship: updated });
    }

    // Generic update
    const { data: updated, error } = await (admin.from('sponsorships') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, sponsorship_analytics(*)')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    try {
      revalidatePath('/dashboard');
      revalidatePath('/ism');
    } catch {}

    return NextResponse.json({ success: true, sponsorship: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email?.toLowerCase().endsWith('@sendnow.live')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing sponsorship ID' }, { status: 400 });
    }

    const admin = getAdminClient();
    const { error } = await admin.from('sponsorships').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      revalidatePath('/dashboard');
      revalidatePath('/ism');
    } catch {}

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
