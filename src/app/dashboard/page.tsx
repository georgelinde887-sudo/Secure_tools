import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { DashboardClient } from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard | SecureTools.live',
  description: 'Manage your software listings, view editorial review statuses, and track sponsorship campaigns.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login?next=/dashboard');
  }

  const admin = getAdminClient();

  // 1. Fetch User Profile
  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // 2. Fetch User Listings (Securely fetch by authenticated user.id)
  let { data: listings } = await admin
    .from('listings')
    .select('*')
    .eq('owner_id', user.id)
    .order('submitted_at', { ascending: false });

  // Resilient Reconciliation: If empty, check if user submitted tools matching their email
  if ((!listings || listings.length === 0) && user.email) {
    const { data: details } = await admin
      .from('listing_details')
      .select('listing_id, extra_metadata')
      .contains('extra_metadata', { userEmail: user.email });

    if (details && details.length > 0) {
      const listingIds = details.map((d: any) => d.listing_id).filter(Boolean);
      if (listingIds.length > 0) {
        await (admin.from('listings') as any)
          .update({ owner_id: user.id })
          .in('id', listingIds);

        const { data: reconciled } = await admin
          .from('listings')
          .select('*')
          .in('id', listingIds)
          .order('submitted_at', { ascending: false });

        if (reconciled && reconciled.length > 0) {
          listings = reconciled;
        }
      }
    }
  }

  // 3. Fetch User Sponsorships (by owner_id or owner_email)
  let { data: sponsorships } = await admin
    .from('sponsorships')
    .select('*, sponsorship_analytics(*)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if ((!sponsorships || sponsorships.length === 0) && user.email) {
    const { data: matchedByEmail } = await admin
      .from('sponsorships')
      .select('*, sponsorship_analytics(*)')
      .eq('owner_email', user.email.toLowerCase().trim())
      .order('created_at', { ascending: false });

    if (matchedByEmail && matchedByEmail.length > 0) {
      sponsorships = matchedByEmail;
      try {
        await (admin.from('sponsorships') as any)
          .update({ owner_id: user.id })
          .eq('owner_email', user.email.toLowerCase().trim());
      } catch {}
    }
  }

  const profileData = profile as any;

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email || '',
        full_name: profileData?.full_name || user.user_metadata?.full_name || '',
        avatar_url: profileData?.avatar_url || user.user_metadata?.avatar_url || '',
        role: profileData?.role || 'user',
      }}
      initialListings={(listings as any) || []}
      initialSponsorships={(sponsorships as any) || []}
    />
  );
}
