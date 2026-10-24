'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Folder01Icon,
  PlusSignIcon,
  Logout01Icon,
  MarketingIcon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  ArrowUpRight01Icon,
  GlobeIcon,
  ChartLineData02Icon,
  EyeIcon,
  Cursor02Icon,
  PencilEdit01Icon,
  Delete01Icon,
  StarIcon,
  Cancel01Icon,
  ArrowRight01Icon,
  CloudIcon,
  Share01Icon,
  File01Icon,
  Shield01Icon,
  Pdf01Icon,
  SignatureIcon,
  Key01Icon,
  FileZipIcon,
  Database01Icon,
} from 'hugeicons-react';
import { ChevronDown } from 'lucide-react';
import { HeroBanner } from '@/components/HeroBanner';
import { resolveCountryInfo, resolveCountryFromTimezone, resolveCountryFromLocale } from '@/lib/geo-utils';

interface ListingItem {
  id: string;
  name: string;
  slug: string;
  listing_type: string;
  category_id: string;
  tagline?: string;
  short_description?: string;
  logo_url?: string;
  official_website_url?: string;
  pricing_model?: string;
  submission_plan: string;
  submission_status: string;
  link_attribute: string;
  submitted_at: string;
  published_at?: string;
}

interface SponsorshipAnalyticsItem {
  id?: string;
  total_impressions: number;
  total_clicks: number;
  is_demo?: boolean;
  metrics_data?: any;
  recorded_date?: string;
}

interface SponsorshipItem {
  id: string;
  campaign_name: string;
  campaign_status: string;
  placement: string;
  start_date?: string;
  end_date?: string;
  target_url?: string;
  display_domain?: string;
  icon_url?: string;
  description?: string;
  cta_label?: string;
  card_tint?: string;
  owner_email?: string;
  utm_params?: any;
  sponsorship_analytics?: SponsorshipAnalyticsItem[];
}

interface ListingAnalyticsData {
  views: number;
  clicks: number;
  ctr: string;
  viewsWeeklyChange?: string;
  clicksWeeklyChange?: string;
  reviews: Array<{ author: string; stars: number; text: string; date: string }>;
}

interface DashboardClientProps {
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
  initialListings: ListingItem[];
  initialSponsorships: SponsorshipItem[];
}

export function DashboardClient({
  user,
  initialListings,
  initialSponsorships,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'listings' | 'sponsorship'>('listings');
  const [loggingOut, setLoggingOut] = useState(false);
  const [listings, setListings] = useState<ListingItem[]>(initialListings);
  const [avatarError, setAvatarError] = useState(false);
  const [selectedSponsorshipId, setSelectedSponsorshipId] = useState<string>('all');

  // Edit modal state
  const [editingListing, setEditingListing] = useState<ListingItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<ListingItem>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Analytics modal state
  const [analyticsListing, setAnalyticsListing] = useState<ListingItem | null>(null);
  const [activeAnalytics, setActiveAnalytics] = useState<ListingAnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const handleOpenAnalytics = async (listing: ListingItem) => {
    setAnalyticsListing(listing);
    setActiveAnalytics(null);
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/analytics/listing?id=${encodeURIComponent(listing.id)}&slug=${encodeURIComponent(listing.slug)}`);
      const data = await res.json();
      if (data.success && data.analytics) {
        setActiveAnalytics(data.analytics);
      } else {
        setActiveAnalytics({
          views: 0,
          clicks: 0,
          ctr: '0.0%',
          viewsWeeklyChange: '0% this week',
          clicksWeeklyChange: '0% this week',
          reviews: [],
        });
      }
    } catch {
      setActiveAnalytics({
        views: 0,
        clicks: 0,
        ctr: '0.0%',
        viewsWeeklyChange: '0% this week',
        clicksWeeklyChange: '0% this week',
        reviews: [],
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Delete modal state
  const [deletingListing, setDeletingListing] = useState<ListingItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // Expandable row state
  const [expandedListingIds, setExpandedListingIds] = useState<string[]>([]);
  const toggleExpand = (id: string) => {
    setExpandedListingIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // ── Category Icon Helper (Matching SoftwareCard) ──────────────────────────
  const getCategoryIcon = (slug?: string) => {
    if (!slug) return File01Icon;
    const s = slug.toLowerCase();
    if (s.includes('compression') || s.includes('archive') || s.includes('zip')) return FileZipIcon;
    if (s.includes('cloud') || s.includes('storage') || s.includes('backup')) return CloudIcon;
    if (s.includes('share') || s.includes('transfer')) return Share01Icon;
    if (s.includes('pdf')) return Pdf01Icon;
    if (s.includes('sign')) return SignatureIcon;
    if (s.includes('database') || s.includes('backend')) return Database01Icon;
    if (s.includes('security') || s.includes('encrypt')) return Shield01Icon;
    if (s.includes('data-room') || s.includes('vdr') || s.includes('key')) return Key01Icon;
    if (s.includes('large-file') || s.includes('fast-transfer')) return ArrowUpRight01Icon;
    return File01Icon;
  };

  const formatCategoryName = (slug?: string) => {
    if (!slug) return 'Software';
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const getDomain = (url?: string) => {
    if (!url) return '';
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const getLogo = (listing: ListingItem) => {
    if (listing.logo_url) return listing.logo_url;
    const domain = getDomain(listing.official_website_url);
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    return null;
  };

  // ── Status badge ──────────────────────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]/80 w-fit">
            <CheckmarkCircle02Icon size={12} strokeWidth={2} className="text-[#059669]" />
            <span>Published</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] w-fit">
            <Clock01Icon size={12} strokeWidth={2} className="text-[#2563eb]" />
            <span>Under Review</span>
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#fffbeb] text-[#b45309] border border-[#fde68a] w-fit">
            <AlertCircleIcon size={12} strokeWidth={2} className="text-[#d97706]" />
            <span>Changes Needed</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] w-fit">
            <Cancel01Icon size={12} strokeWidth={2} className="text-[#dc2626]" />
            <span>Rejected</span>
          </span>
        );
      case 'pending_review':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#f4f4f5] text-[#3f3f46] border border-[#e4e4e7] w-fit">
            <Clock01Icon size={12} strokeWidth={2} className="text-[#71717a]" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const openEdit = (listing: ListingItem) => {
    setEditingListing(listing);
    setEditForm({ ...listing });
    setEditError(null);
  };

  const closeEdit = () => {
    setEditingListing(null);
    setEditForm({});
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!editingListing) return;
    setEditSaving(true);
    setEditError(null);
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          name: editForm.name,
          tagline: editForm.tagline,
          short_description: editForm.short_description,
          official_website_url: editForm.official_website_url,
          pricing_model: editForm.pricing_model,
        } as any)
        .eq('id', editingListing.id);

      if (error) throw new Error(error.message);

      setListings((prev) =>
        prev.map((l) => (l.id === editingListing.id ? { ...l, ...editForm } : l))
      );
      closeEdit();
    } catch (err: any) {
      setEditError(err.message || 'Failed to save changes.');
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete handler (Calls server endpoint to wipe from PostgreSQL) ────────
  const executeDelete = async () => {
    if (!deletingListing) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/submit?id=${encodeURIComponent(deletingListing.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete listing.');
      }
      setListings((prev) => prev.filter((l) => l.id !== deletingListing.id));
      setDeletingListing(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete listing.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Selected Campaign (or null for all) ───────────────────────────────────
  const selectedCampaign = useMemo(() => {
    if (selectedSponsorshipId === 'all') return null;
    return initialSponsorships.find((s) => s.id === selectedSponsorshipId) || null;
  }, [initialSponsorships, selectedSponsorshipId]);

  // ── Real Dynamic Sponsorship Metrics ─────────────────────────────────────
  const displayedSponsorMetrics = useMemo(() => {
    if (!initialSponsorships || initialSponsorships.length === 0) return null;

    const targetCampaigns = selectedSponsorshipId === 'all'
      ? initialSponsorships
      : initialSponsorships.filter((s) => s.id === selectedSponsorshipId);

    if (targetCampaigns.length === 0) return null;

    let totalClicks = 0;
    let totalImpressions = 0;
    let daysRemaining = 0;
    const countryCountsMap: Record<string, number> = {};

    for (const s of targetCampaigns) {
      if (s.sponsorship_analytics && s.sponsorship_analytics.length > 0) {
        for (const a of s.sponsorship_analytics) {
          const clicks = Number(a.total_clicks) || 0;
          const impressions = Number(a.total_impressions) || 0;
          totalClicks += clicks;
          totalImpressions += impressions;

          // Parse country data from metrics_data
          const md = a.metrics_data;
          if (md?.countryCounts && typeof md.countryCounts === 'object') {
            for (const [code, count] of Object.entries(md.countryCounts)) {
              countryCountsMap[code] = (countryCountsMap[code] || 0) + (Number(count) || 0);
            }
          } else if (Array.isArray(md?.topCountries) && md.topCountries.length > 0) {
            for (const item of md.topCountries) {
              const code = item.code || item.country || 'US';
              const count = Number(item.clicks) || (item.share ? Math.max(1, Math.round((parseInt(item.share, 10) / 100) * clicks)) : 1);
              countryCountsMap[code] = (countryCountsMap[code] || 0) + count;
            }
          }
        }
      }

      if (s.end_date) {
        const end = new Date(s.end_date).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
        daysRemaining = Math.max(daysRemaining, diff);
      }
    }

    const ctr = totalImpressions > 0
      ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%`
      : '0.00%';

    let topCountriesList: Array<{
      country: string;
      code: string;
      flag: string;
      clicks: number;
      share: string;
      percent: number;
    }> = [];

    const totalGeoClicks = Object.values(countryCountsMap).reduce((sum, v) => sum + v, 0);

    if (totalGeoClicks > 0) {
      topCountriesList = Object.entries(countryCountsMap)
        .sort((a, b) => b[1] - a[1])
        .map(([code, count]) => {
          const info = resolveCountryInfo(code);
          const percent = Math.min(100, Math.max(1, Math.round((count / totalGeoClicks) * 100)));
          return {
            country: info.name,
            code: info.code,
            flag: info.flag,
            clicks: count,
            share: `${percent}%`,
            percent,
          };
        });
    } else if (totalClicks > 0) {
      const clientTz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
      const clientLocale = typeof navigator !== 'undefined' ? navigator.language : null;
      const detectedCode = resolveCountryFromTimezone(clientTz) || resolveCountryFromLocale(clientLocale) || 'OTHER';
      const info = resolveCountryInfo(detectedCode);
      topCountriesList = [
        {
          country: info.name,
          code: info.code,
          flag: info.flag,
          clicks: totalClicks,
          share: '100%',
          percent: 100,
        },
      ];
    }

    return {
      totalClicks,
      totalImpressions,
      ctr,
      daysRemaining,
      topCountries: topCountriesList,
    };
  }, [initialSponsorships, selectedSponsorshipId]);

  const aggregatedSponsorMetrics = displayedSponsorMetrics;

  const initials = (() => {
    if (user.full_name?.trim()) {
      const parts = user.full_name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'ST';
  })();

  return (
    <>
      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#f4f4f5]">
              <div>
                <h2 className="text-[15px] font-bold text-[#09090b]">Edit Listing</h2>
                <p className="text-[11.5px] text-[#71717a] mt-0.5">Update your submitted tool details</p>
              </div>
              <button onClick={closeEdit} className="p-1.5 rounded-lg hover:bg-[#f4f4f5] text-[#71717a] cursor-pointer transition-colors">
                <Cancel01Icon size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {editError && (
                <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[12px] text-[#991b1b]">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-[#09090b] mb-1.5">Tool Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] focus:outline-none focus:border-[#09090b] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#09090b] mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={editForm.tagline || ''}
                  onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                  placeholder="One-line value proposition"
                  className="w-full h-9 px-3 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] focus:outline-none focus:border-[#09090b] transition-colors placeholder:text-[#a1a1aa]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#09090b] mb-1.5">Short Description</label>
                <textarea
                  value={editForm.short_description || ''}
                  onChange={(e) => setEditForm({ ...editForm, short_description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] resize-none focus:outline-none focus:border-[#09090b] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#09090b] mb-1.5">Website URL</label>
                <input
                  type="url"
                  value={editForm.official_website_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, official_website_url: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] focus:outline-none focus:border-[#09090b] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#09090b] mb-1.5">Pricing Model</label>
                <select
                  value={editForm.pricing_model || ''}
                  onChange={(e) => setEditForm({ ...editForm, pricing_model: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] focus:outline-none focus:border-[#09090b] transition-colors bg-white"
                >
                  <option value="">Select pricing</option>
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                  <option value="open-source">Open Source</option>
                  <option value="contact-for-pricing">Contact for Pricing</option>
                </select>
              </div>

              <div className="pt-1 text-[11.5px] text-[#71717a] bg-[#fafafa] rounded-xl p-3 border border-[#f4f4f5]">
                <strong className="text-[#09090b]">Note:</strong> Category and listing type can only be changed by our editorial team. <Link href="/contact" className="underline underline-offset-2">Contact us</Link> if needed.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 p-5 border-t border-[#f4f4f5]">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-xl border border-[#e4e4e7] text-[12.5px] font-semibold text-[#71717a] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={editSaving}
                className="px-4 py-2 rounded-xl bg-[#09090b] text-white text-[12.5px] font-semibold hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-60"
              >
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Analytics Modal ───────────────────────────────────────────────── */}
      {analyticsListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#f4f4f5]">
              <div>
                <h2 className="text-[15px] font-bold text-[#09090b]">Analytics — {analyticsListing.name}</h2>
                <p className="text-[11.5px] text-[#71717a] mt-0.5">Views, clicks, and reviews</p>
              </div>
              <button
                onClick={() => {
                  setAnalyticsListing(null);
                  setActiveAnalytics(null);
                }}
                className="p-1.5 rounded-lg hover:bg-[#f4f4f5] text-[#71717a] cursor-pointer transition-colors"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                  <div className="flex items-center gap-1.5 text-[#71717a] text-[11px] mb-1">
                    <EyeIcon size={12} />
                    <span>Views</span>
                  </div>
                  {analyticsLoading ? (
                    <div className="h-7 w-16 bg-[#e4e4e7] animate-pulse rounded-md my-1" />
                  ) : (
                    <div className="text-xl font-extrabold text-[#09090b]">
                      {(activeAnalytics?.views ?? 0).toLocaleString()}
                    </div>
                  )}
                  <span className="text-[10.5px] text-[#059669] font-medium">
                    {activeAnalytics?.viewsWeeklyChange || 'Live tracking'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                  <div className="flex items-center gap-1.5 text-[#71717a] text-[11px] mb-1">
                    <Cursor02Icon size={12} />
                    <span>Clicks</span>
                  </div>
                  {analyticsLoading ? (
                    <div className="h-7 w-14 bg-[#e4e4e7] animate-pulse rounded-md my-1" />
                  ) : (
                    <div className="text-xl font-extrabold text-[#09090b]">
                      {(activeAnalytics?.clicks ?? 0).toLocaleString()}
                    </div>
                  )}
                  <span className="text-[10.5px] text-[#059669] font-medium">
                    {activeAnalytics?.clicksWeeklyChange || 'Direct visits'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                  <div className="flex items-center gap-1.5 text-[#71717a] text-[11px] mb-1">
                    <ChartLineData02Icon size={12} />
                    <span>CTR</span>
                  </div>
                  {analyticsLoading ? (
                    <div className="h-7 w-12 bg-[#e4e4e7] animate-pulse rounded-md my-1" />
                  ) : (
                    <div className="text-xl font-extrabold text-[#09090b]">
                      {activeAnalytics?.ctr ?? '0.0%'}
                    </div>
                  )}
                  <span className="text-[10.5px] text-[#71717a]">Avg click-through</span>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="text-[13px] font-bold text-[#09090b] mb-3 flex items-center gap-2">
                  <StarIcon size={14} />
                  <span>User Reviews</span>
                </h3>
                <div className="space-y-3">
                  {analyticsLoading && (
                    <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa] text-center text-[12px] text-[#71717a]">
                      Loading verified user reviews...
                    </div>
                  )}
                  {!analyticsLoading && activeAnalytics?.reviews && activeAnalytics.reviews.length > 0 && (
                    activeAnalytics.reviews.map((r, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[12.5px] font-semibold text-[#09090b]">{r.author}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: r.stars }).map((_, si) => (
                              <StarIcon key={si} size={11} className="text-[#f59e0b]" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[12px] text-[#52525b]">{r.text}</p>
                        <p className="text-[10.5px] text-[#a1a1aa] mt-1">{r.date}</p>
                      </div>
                    ))
                  )}
                  {!analyticsLoading && (!activeAnalytics?.reviews || activeAnalytics.reviews.length === 0) && (
                    <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa] text-center">
                      <p className="text-[12.5px] text-[#71717a]">No user reviews submitted yet.</p>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5">Reviews will appear here after readers rate your tool.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-[#a1a1aa] text-center pt-1">
                Analytics data refreshes daily. Full live tracking available after listing is published.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Custom Delete Confirmation Modal ─────────────────────────────────── */}
      {deletingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-geist">
          <div className="bg-white rounded-2xl border border-[#e4e4e7] p-5 sm:p-5.5 shadow-2xl max-w-[420px] w-full font-geist relative">
            <button
              onClick={() => {
                if (!deleteLoading) {
                  setDeletingListing(null);
                  setDeleteError(null);
                }
              }}
              disabled={deleteLoading}
              className="absolute top-4.5 right-4.5 p-1 rounded-lg text-[#a1a1aa] hover:bg-[#f4f4f5] hover:text-[#09090b] transition-colors cursor-pointer disabled:opacity-40"
              title="Close"
            >
              <Cancel01Icon size={16} />
            </button>

            {/* Icon + Title in One Straight Row */}
            <div className="flex items-center gap-3 pr-7">
              <div className="w-9 h-9 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] flex items-center justify-center shrink-0 shadow-2xs">
                <Delete01Icon size={18} strokeWidth={2} />
              </div>
              <h3 className="text-[16px] font-bold text-[#09090b] tracking-tight truncate">
                Delete &ldquo;{deletingListing.name}&rdquo;?
              </h3>
            </div>

            {/* Shortened Description */}
            <p className="text-[12.5px] text-[#71717a] leading-relaxed mt-2.5 font-normal">
              This will permanently remove the listing, cancel active reviews, and erase all analytics. This action cannot be undone.
            </p>

            {/* Listing Summary Preview Box (Compact) */}
            <div className="mt-3.5 p-2.5 rounded-xl border border-[#e4e4e7] bg-[#fafafa] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg border border-[#e4e4e7] bg-white flex items-center justify-center shrink-0 p-1 overflow-hidden">
                {getLogo(deletingListing) ? (
                  <img
                    src={getLogo(deletingListing)!}
                    alt={deletingListing.name}
                    width={22}
                    height={22}
                    className="w-5.5 h-5.5 object-contain"
                  />
                ) : (
                  <span className="font-bold text-[11px] font-mono text-[#09090b]">
                    {deletingListing.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[#09090b] truncate">
                  {deletingListing.name}
                </div>
                <div className="text-[11px] text-[#71717a] truncate">
                  Ref: <span className="font-mono">{deletingListing.id}</span> · {formatCategoryName(deletingListing.category_id)}
                </div>
              </div>
            </div>

            {deleteError && (
              <div className="mt-3 p-2.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[12px] text-[#991b1b]">
                {deleteError}
              </div>
            )}

            {/* Action Buttons: Corner to Corner (grid-cols-2) */}
            <div className="mt-4.5 pt-3.5 border-t border-[#f4f4f5] grid grid-cols-2 gap-2.5 w-full">
              <button
                type="button"
                onClick={() => {
                  setDeletingListing(null);
                  setDeleteError(null);
                }}
                disabled={deleteLoading}
                className="w-full h-10 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#3f3f46] text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={deleteLoading}
                className="w-full h-10 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-xs disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                <Delete01Icon size={14} />
                <span>{deleteLoading ? 'Deleting...' : 'Delete Listing'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Dashboard Layout ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 font-geist">

        {/* ── Hero Banner (shown when no listings) ── */}
        {listings.length === 0 && (
          <div className="mb-8">
            <HeroBanner />
          </div>
        )}

        {/* ── Top Bar ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#e4e4e7] bg-gradient-to-tr from-[#18181b] to-[#27272a] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 shadow-xs">
              {user.avatar_url && !avatarError ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'User avatar'}
                  width={36}
                  height={36}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="select-none tracking-tight">{initials}</span>
              )}
            </div>
            <div>
              <p className="text-[12px] text-[#71717a]">Signed in as</p>
              <p className="text-[13px] font-semibold text-[#09090b]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#09090b] text-white text-[12.5px] font-semibold hover:bg-black/85 transition-colors shadow-sm cursor-pointer"
            >
              <PlusSignIcon size={13} strokeWidth={2} />
              <span>Submit Tool</span>
            </Link>
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#71717a] hover:text-[#09090b] text-[12.5px] font-medium transition-colors cursor-pointer"
            >
              <Logout01Icon size={13} strokeWidth={1.8} />
              <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 mb-6 border-b border-[#e4e4e7]">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-all cursor-pointer ${
              activeTab === 'listings'
                ? 'border-[#09090b] text-[#09090b]'
                : 'border-transparent text-[#71717a] hover:text-[#09090b]'
            }`}
          >
            <Folder01Icon size={14} />
            <span>My Tools ({listings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sponsorship')}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-all cursor-pointer ${
              activeTab === 'sponsorship'
                ? 'border-[#09090b] text-[#09090b]'
                : 'border-transparent text-[#71717a] hover:text-[#09090b]'
            }`}
          >
            <MarketingIcon size={14} />
            <span>Sponsorship</span>
          </button>
        </div>

        {/* ── Tab: My Tools ─────────────────────────────────────────────────── */}
        {activeTab === 'listings' && (
          <section>
            {listings.length === 0 ? (
              <div className="rounded-2xl border border-[#e4e4e7] bg-white p-10 text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#f4f4f5] text-[#71717a] flex items-center justify-center mx-auto mb-3">
                  <Folder01Icon size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-[15px] font-bold text-[#09090b] mb-1">No tools submitted yet</h3>
                <p className="text-[12.5px] text-[#71717a] max-w-sm mx-auto mb-5 leading-relaxed">
                  Submit your SaaS, browser extension, open-source project, or MCP server to get listed.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#09090b] text-white text-[13px] font-semibold hover:bg-black/85 transition-colors"
                >
                  <PlusSignIcon size={14} strokeWidth={2} />
                  <span>Submit Your First Tool</span>
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden shadow-xs">
                {/* Responsive Table Container */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[760px]">
                    <thead>
                      <tr className="border-b border-[#f4f4f5] bg-[#fafafa]">
                        <th className="py-3.5 pl-6 pr-4 text-[11px] font-bold uppercase tracking-wider text-[#71717a] w-[42%]">
                          Tool & Category
                        </th>
                        <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-[#71717a] w-[22%]">
                          Status / Review
                        </th>
                        <th className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-[#71717a] w-[16%]">
                          Plan
                        </th>
                        <th className="py-3.5 pl-4 pr-6 text-[11px] font-bold uppercase tracking-wider text-[#71717a] text-right w-[20%]">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#f4f4f5]">
                      {listings.map((listing) => {
                        const CategoryIcon = getCategoryIcon(listing.category_id);
                        const categoryTitle = formatCategoryName(listing.category_id);
                        const logoUrl = getLogo(listing);
                        const domain = getDomain(listing.official_website_url);
                        const toolInitials = listing.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase() || 'ST';
                        const isExpanded = expandedListingIds.includes(listing.id);

                        return (
                          <React.Fragment key={listing.id}>
                            <tr className={`hover:bg-[#fafafa]/80 transition-colors ${isExpanded ? 'bg-[#fafafa]/60' : ''}`}>
                              {/* Column 1: Tool & Category (Single Straight Row - Clean Vercel Geist) */}
                              <td className="py-3.5 pl-6 pr-4 align-middle">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-white flex items-center justify-center shrink-0 p-1.5 shadow-2xs relative overflow-hidden">
                                    {logoUrl ? (
                                      <img
                                        src={logoUrl}
                                        alt={`${listing.name} logo`}
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 object-contain rounded-md"
                                        loading="lazy"
                                        onError={(e) => {
                                          const target = e.currentTarget as HTMLElement;
                                          target.style.display = 'none';
                                          const fallback = target.parentElement?.querySelector('.tool-fallback') as HTMLElement;
                                          if (fallback) fallback.style.display = 'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div
                                      className={`tool-fallback ${
                                        logoUrl ? 'hidden' : 'flex'
                                      } w-full h-full items-center justify-center font-bold text-xs text-[#09090b] font-mono bg-[#f4f4f5] rounded-lg`}
                                    >
                                      {toolInitials}
                                    </div>
                                  </div>

                                  <div className="min-w-0 flex items-center gap-2 flex-wrap">
                                    {listing.submission_status === 'published' ? (
                                      <Link
                                        href={`/tools/${listing.slug}`}
                                        className="text-[13.5px] font-bold text-[#09090b] hover:text-[#02ccc1] transition-colors truncate"
                                      >
                                        {listing.name}
                                      </Link>
                                    ) : (
                                      <span className="text-[13.5px] font-bold text-[#09090b] truncate">
                                        {listing.name}
                                      </span>
                                    )}
                                    {listing.submission_status === 'published' && (
                                      <svg
                                        className="w-3.5 h-3.5 text-[#1d9bf0] fill-[#1d9bf0] shrink-0"
                                        viewBox="0 0 24 24"
                                      >
                                        <title>Verified Listing</title>
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.41-1.41 2.09 2.09 5.69-5.69 1.41 1.41-7.1 7.1z" />
                                      </svg>
                                    )}

                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#f4f4f5] text-[#52525b] uppercase tracking-wide border border-[#e4e4e7] shrink-0">
                                      {listing.listing_type?.replace('-', ' ') || 'SOFTWARE'}
                                    </span>
                                    <div className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#71717a] shrink-0">
                                      <CategoryIcon size={12} strokeWidth={1.8} className="text-[#71717a] shrink-0" />
                                      <span>{categoryTitle}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Column 2: Status / Review (Single clean status badge, no stacked text) */}
                              <td className="py-3.5 px-4 align-middle">
                                <div className="flex items-center">
                                  {getStatusBadge(listing.submission_status)}
                                </div>
                              </td>

                              {/* Column 3: Plan (Neutral Vercel Geist badge - NO green background) */}
                              <td className="py-3.5 px-4 align-middle">
                                <div className="flex items-center">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold border capitalize ${
                                      listing.submission_plan === 'pro' || listing.submission_plan === 'featured'
                                        ? 'bg-[#09090b] text-white border-[#09090b]'
                                        : 'bg-[#f4f4f5] text-[#18181b] border-[#e4e4e7]'
                                    }`}
                                  >
                                    {listing.submission_plan || 'Free'} Plan
                                  </span>
                                </div>
                              </td>

                              {/* Column 4: Actions (Icon-only buttons with tooltips + Dropdown Toggle) */}
                              <td className="py-3.5 pl-4 pr-6 align-middle text-right">
                                <div className="inline-flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenAnalytics(listing)}
                                    title="View Analytics"
                                    className="p-2 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#71717a] hover:text-[#09090b] transition-colors cursor-pointer shadow-2xs"
                                    aria-label="View Analytics"
                                  >
                                    <ChartLineData02Icon size={14} />
                                  </button>
                                  <button
                                    onClick={() => openEdit(listing)}
                                    title="Edit Listing"
                                    className="p-2 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#71717a] hover:text-[#09090b] transition-colors cursor-pointer shadow-2xs"
                                    aria-label="Edit Listing"
                                  >
                                    <PencilEdit01Icon size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeletingListing(listing);
                                      setDeleteError(null);
                                    }}
                                    title="Delete Listing"
                                    className="p-2 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#fca5a5] hover:bg-[#fef2f2] text-[#71717a] hover:text-[#ef4444] transition-colors cursor-pointer shadow-2xs"
                                    aria-label="Delete Listing"
                                  >
                                    <Delete01Icon size={14} />
                                  </button>
                                  <button
                                    onClick={() => toggleExpand(listing.id)}
                                    title={isExpanded ? "Collapse Details" : "View Details (Ref, Launch Date)"}
                                    className="p-2 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#71717a] hover:text-[#09090b] transition-colors cursor-pointer shadow-2xs"
                                    aria-expanded={isExpanded}
                                    aria-label={isExpanded ? "Collapse Details" : "View Details"}
                                  >
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Dropdown Expanded Details Row */}
                            {isExpanded && (
                              <tr className="bg-[#fbfbfa] border-b border-[#f4f4f5]">
                                <td colSpan={4} className="py-3 px-6 font-geist">
                                  <div className="p-3.5 bg-white rounded-xl border border-[#e4e4e7] shadow-2xs">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-[12px]">
                                      <div>
                                        <span className="text-[10.5px] font-medium text-[#71717a] block">Reference ID</span>
                                        <span className="font-mono text-[11.5px] font-semibold text-[#09090b] mt-0.5 block truncate">{listing.id}</span>
                                      </div>
                                      <div>
                                        <span className="text-[10.5px] font-medium text-[#71717a] block">Submission Date</span>
                                        <span className="text-[11.5px] font-semibold text-[#09090b] mt-0.5 block">
                                          {new Date(listing.submitted_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                          })}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[10.5px] font-medium text-[#71717a] block">Review Window</span>
                                        <span className="text-[11.5px] font-semibold text-[#09090b] mt-0.5 block">
                                          {listing.submission_status === 'published' ? 'Published Live' : 'Est. 2–3 business days'}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[10.5px] font-medium text-[#71717a] block">Website URL</span>
                                        {listing.official_website_url ? (
                                          <a
                                            href={listing.official_website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11.5px] font-medium text-[#09090b] hover:text-[#02ccc1] hover:underline mt-0.5 inline-flex items-center gap-1 truncate max-w-full"
                                          >
                                            <span className="truncate">{getDomain(listing.official_website_url) || 'Visit Site'}</span>
                                            <ArrowUpRight01Icon size={11} />
                                          </a>
                                        ) : (
                                          <span className="text-[#a1a1aa] text-[11.5px] mt-0.5 block">—</span>
                                        )}
                                      </div>
                                    </div>
                                    {listing.tagline && (
                                      <div className="mt-2.5 pt-2.5 border-t border-[#f4f4f5]">
                                        <span className="text-[10.5px] font-medium text-[#71717a] block">Description</span>
                                        <p className="text-[11.5px] text-[#3f3f46] mt-0.5 leading-relaxed">{listing.tagline}</p>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table footer */}
                <div className="px-6 py-3.5 border-t border-[#f4f4f5] bg-[#fafafa] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#02ccc1]"></span>
                    <span className="text-[12px] font-medium text-[#52525b]">
                      {listings.length} Active {listings.length === 1 ? 'Listing' : 'Listings'} · Free Plan
                    </span>
                  </div>
                  <Link
                    href="/submit"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#09090b] hover:text-[#02ccc1] transition-colors"
                  >
                    <PlusSignIcon size={13} strokeWidth={2.5} />
                    <span>Submit Another Tool</span>
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Tab: Sponsorship ──────────────────────────────────────────────── */}
        {activeTab === 'sponsorship' && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#09090b]">Sponsorship Placement</h2>
                <p className="text-[12px] text-[#71717a] mt-0.5">Sidebar placements · UTM tracking · Campaign analytics</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#09090b] text-[12px] font-semibold transition-colors shadow-sm"
              >
                Book Placement
                <ArrowRight01Icon size={12} strokeWidth={2} />
              </Link>
            </div>

            {initialSponsorships.length > 0 && (
              <>
                <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#f4f4f5]">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#09090b]">Active Campaigns</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#f4f4f5] text-[#52525b]">
                        {initialSponsorships.length}
                      </span>
                    </div>
                    {initialSponsorships.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSponsorshipId('all')}
                        className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          selectedSponsorshipId === 'all'
                            ? 'bg-[#09090b] text-white'
                            : 'text-[#71717a] hover:text-[#09090b] bg-[#f4f4f5] hover:bg-[#e4e4e7]'
                        }`}
                      >
                        View All Combined
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {initialSponsorships.map((camp) => {
                      const isSelected = selectedSponsorshipId === camp.id;
                      return (
                        <div
                          key={camp.id}
                          onClick={() => setSelectedSponsorshipId(isSelected ? 'all' : camp.id)}
                          className={`p-3.5 rounded-xl transition-all cursor-pointer border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#fafafa] border-[#09090b] shadow-2xs ring-1 ring-[#09090b]'
                              : 'bg-white border-[#e4e4e7] hover:border-[#a1a1aa] hover:bg-[#fafafa]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {camp.icon_url ? (
                              <div className="w-10 h-10 rounded-xl bg-white border border-[#e4e4e7] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                <img src={camp.icon_url} alt={camp.campaign_name} className="w-full h-full object-contain" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-center shrink-0 text-[#09090b]">
                                <MarketingIcon size={18} />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-[14px] font-bold text-[#09090b]">{camp.campaign_name}</h3>
                                <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-medium bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
                                  {camp.placement}
                                </span>
                              </div>
                              {camp.description && (
                                <p className="text-[12px] text-[#52525b] mt-0.5 max-w-xl">{camp.description}</p>
                              )}
                              {camp.target_url && (
                                <a
                                  href={camp.target_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[11px] text-[#71717a] hover:text-[#09090b] hover:underline font-mono inline-block mt-0.5"
                                >
                                  {camp.display_domain || camp.target_url}
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                            <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                              camp.campaign_status === 'active'
                                ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]'
                                : 'bg-[#fafafa] text-[#71717a] border-[#e4e4e7]'
                            }`}>
                              {camp.campaign_status === 'active' ? 'Active' : camp.campaign_status}
                            </span>
                            {isSelected ? (
                              <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#09090b] text-white flex items-center gap-1 shadow-2xs">
                                <CheckmarkCircle02Icon size={12} strokeWidth={2.5} />
                                Viewing
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSponsorshipId(camp.id);
                                }}
                                className="px-2.5 py-1 rounded text-[11px] font-semibold border border-[#e4e4e7] bg-white text-[#71717a] hover:text-[#09090b] hover:border-[#a1a1aa] transition-colors cursor-pointer"
                              >
                                View Metrics
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real Analytics Grid for active campaigns */}
                {displayedSponsorMetrics && (
                  <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-xs space-y-5">
                    {/* Header + Campaign Selector Tabs */}
                    <div className="flex flex-col gap-3.5 pb-4 border-b border-[#f4f4f5]">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[14px] font-bold text-[#09090b]">Campaign Performance Metrics</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                              Live Campaign
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#71717a] mt-0.5">
                            {selectedCampaign
                              ? `Viewing metrics for ${selectedCampaign.campaign_name} · ${selectedCampaign.display_domain || selectedCampaign.target_url}`
                              : `Aggregated across all ${initialSponsorships.length} campaigns`}
                          </p>
                        </div>
                      </div>

                      {/* Pill Selector for Switching between products */}
                      {initialSponsorships.length > 1 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                          <button
                            type="button"
                            onClick={() => setSelectedSponsorshipId('all')}
                            className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                              selectedSponsorshipId === 'all'
                                ? 'bg-[#09090b] text-white shadow-2xs'
                                : 'bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#09090b]'
                            }`}
                          >
                            All Campaigns ({initialSponsorships.length})
                          </button>
                          {initialSponsorships.map((camp) => {
                            const isSelected = selectedSponsorshipId === camp.id;
                            return (
                              <button
                                key={camp.id}
                                type="button"
                                onClick={() => setSelectedSponsorshipId(camp.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#09090b] text-white shadow-2xs'
                                    : 'bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#09090b]'
                                }`}
                              >
                                {camp.icon_url && (
                                  <img src={camp.icon_url} alt="" className="w-3.5 h-3.5 rounded object-contain shrink-0" />
                                )}
                                <span>{camp.campaign_name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 4 Metrics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Total Clicks', value: displayedSponsorMetrics.totalClicks.toLocaleString(), sub: 'Verified outbound clicks', icon: <Cursor02Icon size={13} />, subColor: 'text-[#059669]' },
                        { label: 'Impressions', value: displayedSponsorMetrics.totalImpressions.toLocaleString(), sub: 'Across security categories', icon: <EyeIcon size={13} />, subColor: 'text-[#71717a]' },
                        { label: 'Avg. CTR', value: displayedSponsorMetrics.ctr, sub: 'Click-through rate', icon: <ChartLineData02Icon size={13} />, subColor: 'text-[#059669]' },
                        { label: 'Days Remaining', value: `${displayedSponsorMetrics.daysRemaining}d`, sub: 'Campaign active', icon: <Clock01Icon size={13} />, subColor: 'text-[#71717a]' },
                      ].map((m) => (
                        <div key={m.label} className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                          <div className="flex items-center gap-1.5 text-[#71717a] text-[11px] mb-1">
                            {m.icon}
                            <span>{m.label}</span>
                          </div>
                          <div className="text-2xl font-extrabold text-[#09090b]">{m.value}</div>
                          <span className={`text-[10.5px] font-medium ${m.subColor}`}>{m.sub}</span>
                        </div>
                      ))}
                    </div>

                    {/* Geographic Traffic Section with Flags & Locations */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[13px] font-bold text-[#09090b] flex items-center gap-2">
                          <GlobeIcon size={15} />
                          <span>Geographic Traffic</span>
                        </h4>
                        <span className="text-[11px] text-[#71717a] font-mono">
                          {displayedSponsorMetrics.totalClicks} verified {displayedSponsorMetrics.totalClicks === 1 ? 'click' : 'clicks'}
                        </span>
                      </div>

                      {displayedSponsorMetrics.topCountries && displayedSponsorMetrics.topCountries.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-[#e4e4e7] bg-white shadow-2xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-[#e4e4e7] bg-[#fafafa] text-[11px] font-mono uppercase tracking-wider text-[#71717a]">
                                <th scope="col" className="py-3 px-4 font-semibold">Location / Country</th>
                                <th scope="col" className="py-3 px-4 font-semibold text-center w-20">Code</th>
                                <th scope="col" className="py-3 px-4 font-semibold text-right w-28">Clicks</th>
                                <th scope="col" className="py-3 px-4 font-semibold text-right w-52 sm:w-72">Traffic Share</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f4f4f5] text-[13px]">
                              {displayedSponsorMetrics.topCountries.map((c) => (
                                <tr key={c.code || c.country} className="hover:bg-[#fafafa] transition-colors">
                                  {/* Country with flag */}
                                  <td className="py-3.5 px-4 font-medium text-[#09090b]">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-xl leading-none select-none shrink-0" role="img" aria-label={c.country}>
                                        {c.flag || '🌐'}
                                      </span>
                                      <span className="font-semibold text-[13px] text-[#09090b]">
                                        {c.country}
                                      </span>
                                    </div>
                                  </td>

                                  {/* ISO Code Badge */}
                                  <td className="py-3.5 px-4 text-center">
                                    <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded bg-[#f4f4f5] border border-[#e4e4e7] text-[#52525b]">
                                      {c.code}
                                    </span>
                                  </td>

                                  {/* Clicks */}
                                  <td className="py-3.5 px-4 text-right font-medium text-[#09090b]">
                                    <span className="font-mono font-bold text-[13px]">{c.clicks}</span>
                                    <span className="text-[11px] text-[#71717a] ml-1">{c.clicks === 1 ? 'click' : 'clicks'}</span>
                                  </td>

                                  {/* Progress bar + percentage share */}
                                  <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                      <div className="w-24 sm:w-36 h-2 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] overflow-hidden shrink-0">
                                        <div
                                          className="h-full rounded-full bg-[#09090b] transition-all duration-500"
                                          style={{ width: `${Math.max(5, c.percent)}%` }}
                                        />
                                      </div>
                                      <span className="text-[12px] font-mono font-bold text-[#09090b] w-12 text-right">
                                        {c.share}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl border border-dashed border-[#d4d4d8] bg-[#fafafa] flex flex-col items-center justify-center text-center">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center text-[#71717a] mb-2 shadow-2xs">
                            <GlobeIcon size={18} />
                          </div>
                          <p className="text-[13px] font-bold text-[#09090b]">
                            {selectedCampaign
                              ? `No geographic clicks recorded yet for ${selectedCampaign.campaign_name}`
                              : 'No geographic clicks recorded yet'}
                          </p>
                          <p className="text-[11.5px] text-[#71717a] max-w-sm mt-1 leading-relaxed">
                            Live Geolocation Tracking is enabled. As visitors click through your placement, country origins, location flags, and traffic shares will appear here in real time.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {initialSponsorships.length === 0 && (
              <div className="rounded-2xl border border-[#e4e4e7] bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-center shrink-0 text-[#09090b]">
                    <MarketingIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#09090b]">Promote Your Product Across 25 Security Categories</h3>
                    <p className="text-[12.5px] text-[#71717a] mt-1 leading-relaxed max-w-2xl">
                      SecureTools.live connects your software with verified cybersecurity teams, IT buyers, and decision-makers looking for active solutions.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#09090b] mb-2.5">
                      <EyeIcon size={14} />
                    </div>
                    <div className="text-[13px] font-bold text-[#09090b]">Sticky Sidebar Placement</div>
                    <p className="text-[11.5px] text-[#71717a] mt-1 leading-normal">
                      Fixed, above-the-fold visibility across category directories and comparison pages.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#09090b] mb-2.5">
                      <Cursor02Icon size={14} />
                    </div>
                    <div className="text-[13px] font-bold text-[#09090b]">Verified UTM Attribution</div>
                    <p className="text-[11.5px] text-[#71717a] mt-1 leading-normal">
                      Direct, unmasked referral links with custom UTM parameters linked to your Google Analytics.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[#09090b] mb-2.5">
                      <Shield01Icon size={14} />
                    </div>
                    <div className="text-[13px] font-bold text-[#09090b]">Editorial Fast-Track</div>
                    <p className="text-[11.5px] text-[#71717a] mt-1 leading-normal">
                      Expedited verification, custom architecture badge, and featured category tags.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[12px] text-[#52525b]">
                    <span className="font-semibold text-[#09090b]">How activation works:</span> Contact our editorial team with your listing details &rarr; Campaign approved & configured with UTM tags &rarr; Live analytics dashboard activated.
                  </div>
                  <Link
                    href="/contact"
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-[12px] font-semibold transition-colors shadow-2xs"
                  >
                    <span>Request Placement</span>
                    <ArrowRight01Icon size={13} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
