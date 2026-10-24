import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email?.toLowerCase().endsWith('@sendnow.live')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { action, userId, targetId } = body;
    const admin = getAdminClient();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    if (action === 'PURGE_CACHE') {
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/tools');
        revalidatePath('/extensions');
        revalidatePath('/open-source');
        revalidatePath('/plugins');
      } catch {}
      await admin.from('audit_logs').insert({
        actor_email: user.email,
        action: 'PURGE_CACHE',
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || '',
      } as any);
      return NextResponse.json({ success: true, message: 'Cache successfully purged & sitemap revalidated.' });
    }

    if (action === 'BAN_USER' && userId) {
      await (admin.from('profiles') as any).update({ role: 'banned', updated_at: new Date().toISOString() }).eq('id', userId);
      await admin.from('audit_logs').insert({
        actor_email: user.email,
        action: 'BAN_USER',
        target_id: userId,
        target_type: 'user',
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || '',
      } as any);
      return NextResponse.json({ success: true, message: `User ${userId} has been suspended.` });
    }

    if (action === 'UNBAN_USER' && userId) {
      await (admin.from('profiles') as any).update({ role: 'user', updated_at: new Date().toISOString() }).eq('id', userId);
      await admin.from('audit_logs').insert({
        actor_email: user.email,
        action: 'UNBAN_USER',
        target_id: userId,
        target_type: 'user',
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || '',
      } as any);
      return NextResponse.json({ success: true, message: `User ${userId} has been restored.` });
    }

    if (action === 'UPDATE_USER_PLAN' && userId && body.plan) {
      const plan = String(body.plan).toLowerCase();
      await (admin.from('profiles') as any).update({ plan, updated_at: new Date().toISOString() }).eq('id', userId);
      await admin.from('audit_logs').insert({
        actor_email: user.email,
        action: 'UPDATE_USER_PLAN',
        target_id: userId,
        target_type: 'user',
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || '',
        metadata: { new_plan: plan },
      } as any);
      return NextResponse.json({ success: true, message: `User plan updated to ${plan}.` });
    }

    return NextResponse.json({ error: 'Unrecognized action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
