import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { IsmClient } from './IsmClient';

export const metadata: Metadata = {
  title: 'System Administration | Internal Control Panel (ISM)',
  description: 'SecureTools internal moderation operations, analytics, user governance, and listing approvals.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function IsmPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // STRICT ACCESS SECURITY: Only verified work emails ending in @sendnow.live
  const isAllowed = user?.email && user.email.toLowerCase().endsWith('@sendnow.live');

  if (authError || !user || !isAllowed) {
    // Immediate, silent route to home page with zero information leakage
    redirect('/');
  }

  const admin = getAdminClient();

  // 1. Fetch all listings with complete details
  const { data: listings } = await admin
    .from('listings')
    .select(`
      id,
      name,
      slug,
      listing_type,
      category_id,
      tagline,
      short_description,
      full_description,
      official_website_url,
      logo_url,
      pricing_model,
      starting_price,
      submission_plan,
      submission_status,
      link_attribute,
      featured,
      submitted_at,
      reviewed_at,
      published_at,
      owner_id,
      listing_details (
        submitter_name,
        submitter_email,
        relationship,
        pricing_plans,
        key_features,
        alternatives,
        integrations,
        repository_url,
        license,
        browser_compatibility,
        mcp_platforms,
        mcp_protocol,
        mcp_run_command,
        extra_metadata
      )
    `)
    .order('submitted_at', { ascending: false });

  // 2. Fetch all user profiles
  const { data: profiles } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // 3. Fetch categories
  const { data: categories } = await admin
    .from('categories')
    .select('*')
    .order('tool_count', { ascending: false });

  // 4. Fetch recent audit logs
  const { data: auditLogs } = await admin
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(150);

  // 5. Fetch all sponsorships with analytics
  const { data: sponsorships } = await admin
    .from('sponsorships')
    .select('*, sponsorship_analytics(*)')
    .order('created_at', { ascending: false });

  return (
    <IsmClient
      adminUser={{
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
        avatarUrl: user.user_metadata?.avatar_url || '',
      }}
      initialListings={(listings as any) || []}
      initialUsers={(profiles as any) || []}
      initialCategories={(categories as any) || []}
      initialAuditLogs={(auditLogs as any) || []}
      initialSponsorships={(sponsorships as any) || []}
    />
  );
}
