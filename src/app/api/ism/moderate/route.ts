import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { sendEmail, getStatusEmailHtml } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // 1. Strict Security Guard: @sendnow.live domain emails only
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email?.toLowerCase().endsWith('@sendnow.live')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { listingId, newStatus, reason } = body;

    if (!listingId || !newStatus) {
      return NextResponse.json({ error: 'Missing listingId or newStatus' }, { status: 400 });
    }

    const validStatuses = ['published', 'pending_review', 'under_review', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const admin = getAdminClient();

    // 2. Fetch current listing & submitter information
    const { data: listing, error: findError } = await admin
      .from('listings')
      .select('id, name, slug, owner_id, submission_status')
      .eq('id', listingId)
      .maybeSingle();

    if (findError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const listingItem = listing as any;

    // 3. Update status in database
    const updatePayload: any = {
      submission_status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (newStatus === 'published') {
      updatePayload.published_at = new Date().toISOString();
    }

    const { error: updateError } = await (admin.from('listings') as any)
      .update(updatePayload)
      .eq('id', listingId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update listing: ' + updateError.message }, { status: 500 });
    }

    // 4. Resolve Submitter Email to send automatic notification
    const { data: details } = await admin
      .from('listing_details')
      .select('submitter_email, extra_metadata')
      .eq('listing_id', listingId)
      .maybeSingle();

    let recipientEmail = (details as any)?.submitter_email || (details as any)?.extra_metadata?.userEmail;

    if (!recipientEmail && listingItem.owner_id) {
      const { data: ownerProfile } = await admin
        .from('profiles')
        .select('email')
        .eq('id', listingItem.owner_id)
        .maybeSingle();
      recipientEmail = (ownerProfile as any)?.email;
    }

    let emailSent = false;
    if (recipientEmail && recipientEmail.includes('@')) {
      const emailHtml = getStatusEmailHtml({
        toolName: listingItem.name,
        status: newStatus as any,
        reason,
        referenceId: listingItem.id,
      });

      const emailSubject = newStatus === 'published'
        ? `🎉 "${listingItem.name}" is approved & live on SecureTools.live!`
        : newStatus === 'rejected'
        ? `Status update regarding your submission: "${listingItem.name}"`
        : `Review started for your listing: "${listingItem.name}"`;

      const emailResult = await sendEmail({
        to: recipientEmail,
        subject: emailSubject,
        html: emailHtml,
      });
      emailSent = emailResult.success;
    }

    // 5. Record in Audit Log
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    await admin.from('audit_logs').insert({
      actor_email: user.email,
      action: `MODERATE_LISTING_STATUS_${newStatus.toUpperCase()}`,
      target_id: listingId,
      target_type: 'listing',
      ip_address: ip,
      user_agent: userAgent,
      metadata: {
        listingName: listingItem.name,
        previousStatus: listingItem.submission_status,
        newStatus,
        reason: reason || null,
        recipientEmail: recipientEmail || null,
        emailSent,
      },
    } as any);

    // 6. Invalidate Next.js cache so the public UI and user dashboard update immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/dashboard');
      revalidatePath('/ism');
      revalidatePath('/tools');
      revalidatePath('/extensions');
      revalidatePath('/open-source');
      revalidatePath('/plugins');
    } catch (e) {
      console.warn('revalidatePath error:', e);
    }

    return NextResponse.json({
      success: true,
      listingId,
      newStatus,
      emailSent,
      recipientEmail: recipientEmail || null,
    });
  } catch (err: any) {
    console.error('Moderation API error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
