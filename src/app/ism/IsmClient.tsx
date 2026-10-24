'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  UserMultiple02Icon,
  File01Icon,
  GlobeIcon,
  Search01Icon,
  FilterIcon,
  ArrowRight01Icon,
  Delete02Icon,
  RefreshIcon,
  Copy01Icon,
  CloudIcon,
  FileZipIcon,
  Share01Icon,
  Key01Icon,
  Pdf01Icon,
  SignatureIcon,
  ArrowUpRight01Icon,
  EyeIcon,
  Clock01Icon,
  SecurityCheckIcon,
  Cancel01Icon,
  MarketingIcon,
  Database01Icon,
} from 'hugeicons-react';
import {
  ChevronDown,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Download,
  Activity,
  Server,
  Zap,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export interface IsmListing {
  id: string;
  name: string;
  slug: string;
  listing_type: 'software' | 'open-source' | 'extension' | 'plugin';
  category_id: string;
  tagline?: string;
  short_description?: string;
  full_description?: string;
  official_website_url?: string;
  logo_url?: string;
  pricing_model?: string;
  starting_price?: string;
  submission_plan?: string;
  submission_status: 'pending_review' | 'under_review' | 'published' | 'rejected';
  link_attribute?: string;
  featured?: boolean;
  submitted_at: string;
  published_at?: string;
  owner_id?: string;
  listing_details?: {
    submitter_name?: string;
    submitter_email?: string;
    relationship?: string;
    pricing_plans?: string;
    key_features?: string[];
    alternatives?: string[];
    integrations?: string[];
    repository_url?: string;
    license?: string;
    browser_compatibility?: string[];
    mcp_platforms?: string[];
    mcp_protocol?: string;
    mcp_run_command?: string;
    extra_metadata?: any;
  } | Array<any>;
}

export interface IsmUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
  plan?: string;
  created_at: string;
  updated_at?: string;
}

export interface IsmCategory {
  id: string;
  slug: string;
  name: string;
  pillar?: string;
  tool_count: number;
}

export interface IsmAuditLog {
  id: string;
  actor_email: string;
  action: string;
  target_id?: string;
  target_type?: string;
  ip_address?: string;
  user_agent?: string;
  country?: string;
  metadata?: any;
  created_at: string;
}

export interface IsmSponsorship {
  id: string;
  listing_id?: string;
  owner_id?: string;
  owner_email?: string;
  campaign_name: string;
  campaign_status: 'draft' | 'pending' | 'approved' | 'active' | 'paused' | 'completed';
  placement: string;
  start_date?: string;
  end_date?: string;
  target_url?: string;
  display_domain?: string;
  icon_url?: string;
  description?: string;
  cta_label?: string;
  card_tint?: string;
  utm_params?: any;
  created_at: string;
  updated_at?: string;
  sponsorship_analytics?: Array<{
    id: string;
    total_impressions: number;
    total_clicks: number;
    is_demo: boolean;
    metrics_data?: any;
    recorded_date: string;
  }>;
}

const CARD_TINT_OPTIONS = [
  { id: 'none', label: 'None', dot: 'border border-[#71717a]' },
  { id: 'blue', label: 'Blue', dot: 'bg-[#3b82f6]' },
  { id: 'violet', label: 'Violet', dot: 'bg-[#8b5cf6]' },
  { id: 'green', label: 'Green', dot: 'bg-[#10b981]' },
  { id: 'amber', label: 'Amber', dot: 'bg-[#f59e0b]' },
  { id: 'rose', label: 'Rose', dot: 'bg-[#f43f5e]' },
  { id: 'teal', label: 'Teal', dot: 'bg-[#14b8a6]' },
  { id: 'slate', label: 'Slate', dot: 'bg-[#64748b]' },
] as const;

interface IsmClientProps {
  adminUser: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  };
  initialListings: IsmListing[];
  initialUsers: IsmUser[];
  initialCategories: IsmCategory[];
  initialAuditLogs: IsmAuditLog[];
  initialSponsorships: IsmSponsorship[];
}

function getListingLogo(listing: { logo_url?: string; official_website_url?: string }) {
  if (listing.logo_url && listing.logo_url.startsWith('http')) return listing.logo_url;
  if (listing.official_website_url) {
    try {
      const domain = new URL(listing.official_website_url).hostname.replace(/^www\./, '');
      if (domain) return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      const cleaned = listing.official_website_url.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
      if (cleaned) return `https://www.google.com/s2/favicons?domain=${cleaned}&sz=128`;
    }
  }
  return null;
}

function ToolLogo({ name, logoUrl, officialWebsiteUrl, size = 'w-9 h-9' }: { name: string; logoUrl?: string; officialWebsiteUrl?: string; size?: string }) {
  const [imageError, setImageError] = useState(false);
  const resolved = !imageError ? getListingLogo({ logo_url: logoUrl, official_website_url: officialWebsiteUrl }) : null;

  if (resolved) {
    return (
      <img
        src={resolved}
        alt={name}
        onError={() => setImageError(true)}
        className={`${size} rounded-xl object-contain bg-white border border-[#e4e4e7] p-1 shrink-0`}
      />
    );
  }

  return (
    <div className={`${size} rounded-xl bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center font-bold text-xs text-[#09090b] shrink-0 font-mono`}>
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}

function UserAvatar({ fullName, email, avatarUrl }: { fullName?: string; email: string; avatarUrl?: string }) {
  const [imageError, setImageError] = useState(false);

  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={fullName || email}
        onError={() => setImageError(true)}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className="w-8 h-8 rounded-full object-cover border border-[#e4e4e7] shrink-0"
      />
    );
  }

  const initials = (fullName || email).substring(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] text-[#09090b] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
      {initials}
    </div>
  );
}

export function IsmClient({
  adminUser,
  initialListings,
  initialUsers,
  initialCategories,
  initialAuditLogs,
  initialSponsorships = [],
}: IsmClientProps) {
  const router = useRouter();
  const supabase = createClient();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'users' | 'ads' | 'audit'>('overview');

  // Listings state
  const [listings, setListings] = useState<IsmListing[]>(initialListings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [inspectListing, setInspectListing] = useState<IsmListing | null>(null);

  // Users state
  const [users, setUsers] = useState<IsmUser[]>(initialUsers);
  const [banningUserId, setBanningUserId] = useState<string | null>(null);
  const [updatingPlanUserId, setUpdatingPlanUserId] = useState<string | null>(null);

  // Sponsorships / Ads state (Matching AltHunt Screenshot 2)
  const [sponsorships, setSponsorships] = useState<IsmSponsorship[]>(initialSponsorships);
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [adForm, setAdForm] = useState({
    ownerEmail: '',
    ownerId: '',
    advertiserUrl: '',
    title: '',
    displayDomain: '',
    iconUrl: '',
    description: '',
    ctaLabel: 'Visit',
    placement: 'rail',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    cardTint: 'none',
  });

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return users.slice(0, 8);
    const q = userSearchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.full_name && u.full_name.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [users, userSearchTerm]);

  // Audit state
  const [auditLogs, setAuditLogs] = useState<IsmAuditLog[]>(initialAuditLogs);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // ── Ad Slot Handlers (AltHunt-aligned) ───────────────────────────────────
  const handleFetchDetails = () => {
    if (!adForm.advertiserUrl) return;
    try {
      let domain = '';
      try {
        domain = new URL(adForm.advertiserUrl).hostname.replace(/^www\./, '');
      } catch {
        domain = adForm.advertiserUrl.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
      }
      const autoIcon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';
      const autoTitle = domain ? domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) : '';
      setAdForm((prev) => ({
        ...prev,
        displayDomain: prev.displayDomain || domain,
        title: prev.title || autoTitle,
        iconUrl: prev.iconUrl || autoIcon,
      }));
    } catch {}
  };

  const handleCreateAdSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title || !adForm.advertiserUrl) {
      setAdError('Please enter a Title and Advertiser URL.');
      return;
    }
    setAdSubmitting(true);
    setAdError(null);
    try {
      const res = await fetch('/api/ism/sponsorships', {
        method: editingAdId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAdId,
          ownerEmail: adForm.ownerEmail,
          ownerId: adForm.ownerId,
          campaignName: adForm.title,
          targetUrl: adForm.advertiserUrl,
          displayDomain: adForm.displayDomain,
          iconUrl: adForm.iconUrl,
          description: adForm.description,
          ctaLabel: adForm.ctaLabel,
          placement: adForm.placement,
          startDate: adForm.startDate,
          endDate: adForm.endDate,
          cardTint: adForm.cardTint,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save sponsorship slot.');

      showToast(
        editingAdId
          ? `Ad slot "${adForm.title}" updated successfully!`
          : `Ad slot "${adForm.title}" created successfully!`,
        'success'
      );

      if (editingAdId) {
        setSponsorships((prev) => prev.map((s) => (s.id === editingAdId ? data.sponsorship : s)));
        setEditingAdId(null);
      } else {
        setSponsorships((prev) => [data.sponsorship, ...prev]);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sponsors-updated'));
      }

      setAdForm({
        ownerEmail: '',
        ownerId: '',
        advertiserUrl: '',
        title: '',
        displayDomain: '',
        iconUrl: '',
        description: '',
        ctaLabel: 'Visit',
        placement: 'rail',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '',
        cardTint: 'none',
      });
    } catch (err: any) {
      setAdError(err.message || 'Failed to save ad slot.');
    } finally {
      setAdSubmitting(false);
    }
  };

  const handleToggleAdStatus = async (item: IsmSponsorship) => {
    try {
      const res = await fetch('/api/ism/sponsorships', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          action: 'toggle_status',
          status: item.campaign_status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSponsorships((prev) => prev.map((s) => (s.id === item.id ? data.sponsorship : s)));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sponsors-updated'));
      }
      showToast(`Campaign ${data.sponsorship.campaign_status === 'active' ? 'resumed' : 'paused'}.`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteAdSlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsorship ad slot?')) return;
    try {
      const res = await fetch(`/api/ism/sponsorships?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete ad slot.');
      setSponsorships((prev) => prev.filter((s) => s.id !== id));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sponsors-updated'));
      }
      showToast('Sponsorship slot deleted.', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ── Metrics Computation ───────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const pendingListings = listings.filter(l => l.submission_status === 'pending_review' || l.submission_status === 'under_review').length;
    const publishedListings = listings.filter(l => l.submission_status === 'published').length;
    const rejectedListings = listings.filter(l => l.submission_status === 'rejected').length;
    const totalListings = listings.length;

    return {
      totalUsers,
      totalListings,
      pendingListings,
      publishedListings,
      rejectedListings,
      totalCategories: initialCategories.length,
    };
  }, [users, listings, initialCategories]);

  // ── Moderation Action Handler ─────────────────────────────────────────────
  const handleModerateStatus = async (
    listingId: string,
    newStatus: 'published' | 'pending_review' | 'under_review' | 'rejected',
    reason?: string
  ) => {
    setUpdatingId(listingId);
    try {
      const res = await fetch('/api/ism/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, newStatus, reason }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update listing status');
      }

      setListings(prev =>
        prev.map(item =>
          item.id === listingId
            ? { ...item, submission_status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : item.published_at }
            : item
        )
      );

      // Add to local audit logs
      const targetListing = listings.find(l => l.id === listingId);
      setAuditLogs(prev => [
        {
          id: Math.random().toString(),
          actor_email: adminUser.email,
          action: `MODERATE_LISTING_STATUS_${newStatus.toUpperCase()}`,
          target_id: listingId,
          target_type: 'listing',
          created_at: new Date().toISOString(),
          metadata: {
            listingName: targetListing?.name,
            newStatus,
            emailSent: data.emailSent,
            recipientEmail: data.recipientEmail,
          },
        },
        ...prev,
      ]);

      const statusLabels: Record<string, string> = {
        published: 'Verified & Live',
        pending_review: 'Pending Review',
        under_review: 'Under Review',
        rejected: 'Rejected',
      };

      showToast(
        `✓ "${targetListing?.name}" status updated to ${statusLabels[newStatus]}${data.emailSent ? ` and notification email sent to ${data.recipientEmail}` : ''}!`
      );
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Maintenance Actions ───────────────────────────────────────────────────
  const handleSystemAction = async (action: 'PURGE_CACHE' | 'BAN_USER' | 'UNBAN_USER', userId?: string) => {
    setMaintenanceLoading(true);
    try {
      const res = await fetch('/api/ism/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');

      if (action === 'BAN_USER' && userId) {
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: 'banned' } : u)));
      } else if (action === 'UNBAN_USER' && userId) {
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: 'user' } : u)));
      }

      showToast(data.message || 'Action executed successfully');
    } catch (err: any) {
      showToast(err.message || 'System action failed', 'error');
    } finally {
      setMaintenanceLoading(false);
      setBanningUserId(null);
    }
  };

  // ── Update User Plan (Free / Pro / Sponsored) ─────────────────────────────
  const handleUpdateUserPlan = async (userId: string, newPlan: string) => {
    setUpdatingPlanUserId(userId);
    try {
      const res = await fetch('/api/ism/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_USER_PLAN', userId, plan: newPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user plan');

      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, plan: newPlan } : u)));
      showToast(`User plan updated to ${newPlan.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message || 'Plan update failed', 'error');
    } finally {
      setUpdatingPlanUserId(null);
    }
  };

  // ── CSV Export Helper ─────────────────────────────────────────────────────
  const exportListingsCsv = () => {
    const headers = ['ID', 'Name', 'Slug', 'Type', 'Category', 'Status', 'Plan', 'Website', 'Submitted At'];
    const rows = filteredListings.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.slug,
      l.listing_type,
      l.category_id,
      l.submission_status,
      l.submission_plan || 'free',
      l.official_website_url || '',
      l.submitted_at,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `securetools_listings_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Filtered Listings ─────────────────────────────────────────────────────
  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        (l.official_website_url && l.official_website_url.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'all' || l.submission_status === statusFilter;
      const matchType = typeFilter === 'all' || l.listing_type === typeFilter;
      const matchCat = categoryFilter === 'all' || l.category_id === categoryFilter;

      return matchSearch && matchStatus && matchType && matchCat;
    });
  }, [listings, searchQuery, statusFilter, typeFilter, categoryFilter]);

  // ── Category Icon Helper ──────────────────────────────────────────────────
  const getCategoryIcon = (slug?: string) => {
    if (!slug) return File01Icon;
    const s = slug.toLowerCase();
    if (s.includes('cloud') || s.includes('storage')) return CloudIcon;
    if (s.includes('share') || s.includes('transfer')) return Share01Icon;
    if (s.includes('pdf')) return Pdf01Icon;
    if (s.includes('sign')) return SignatureIcon;
    if (s.includes('database') || s.includes('backend')) return Database01Icon;
    if (s.includes('data-room') || s.includes('vdr') || s.includes('key')) return Key01Icon;
    return File01Icon;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b] font-geist selection:bg-[#09090b] selection:text-white pb-24">
      {/* ── TOP NOTIFICATION TOAST ── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-[13px] font-medium flex items-center gap-2.5 backdrop-blur-md ${
              toastType === 'success'
                ? 'bg-white border-[#e4e4e7] text-[#09090b]'
                : 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]'
            }`}
          >
            {toastType === 'success' ? (
              <CheckmarkCircle02Icon size={16} className="text-[#10b981] shrink-0" />
            ) : (
              <AlertCircleIcon size={16} className="text-[#ef4444] shrink-0" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ── HEADER NAVIGATION BAR ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e4e4e7]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-[#09090b] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-2xs hover:opacity-90 transition-opacity"
              title="Return to Public Directory"
            >
              ST
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-bold text-[#09090b] tracking-tight leading-none">
                  System Administration
                </h1>
                <span className="text-[10px] font-semibold bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Internal ISM
                </span>
              </div>
              <p className="text-[11px] text-[#71717a] mt-0.5 font-normal">
                Authorized for <strong className="text-[#09090b] font-medium">{adminUser.email}</strong>
              </p>
            </div>
          </div>

          {/* Navigation Tabs Pill (Matching Screenshot 1) */}
          <div className="hidden md:flex items-center gap-1 bg-[#f4f4f5] p-1 rounded-xl border border-[#e4e4e7]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-white text-[#09090b] shadow-2xs font-semibold'
                  : 'text-[#71717a] hover:text-[#09090b]'
              }`}
            >
              <Activity size={13} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'submissions'
                  ? 'bg-white text-[#09090b] shadow-2xs font-semibold'
                  : 'text-[#71717a] hover:text-[#09090b]'
              }`}
            >
              <File01Icon size={13} />
              <span>Submissions Queue</span>
              {metrics.pendingListings > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#09090b] text-white text-[10px] flex items-center justify-center font-bold">
                  {metrics.pendingListings}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'users'
                  ? 'bg-white text-[#09090b] shadow-2xs font-semibold'
                  : 'text-[#71717a] hover:text-[#09090b]'
              }`}
            >
              <UserMultiple02Icon size={13} />
              <span>Users ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ads'
                  ? 'bg-white text-[#09090b] shadow-2xs font-semibold'
                  : 'text-[#71717a] hover:text-[#09090b]'
              }`}
            >
              <MarketingIcon size={13} />
              <span>Ads ({sponsorships.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-white text-[#09090b] shadow-2xs font-semibold'
                  : 'text-[#71717a] hover:text-[#09090b]'
              }`}
            >
              <Shield01Icon size={13} />
              <span>Audit Log</span>
            </button>
          </div>

          {/* Right Action Icons & Exit */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="text-[12px] text-[#71717a] hover:text-[#09090b] font-medium px-2.5 py-1.5 rounded-lg hover:bg-[#f4f4f5] transition-colors flex items-center gap-1"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#a1a1aa]" />
            </Link>
            <button
              onClick={handleSignOut}
              className="h-8 px-3 rounded-lg bg-white border border-[#e4e4e7] text-[#09090b] hover:bg-[#f4f4f5] text-[12px] font-medium transition-colors shadow-2xs cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden overflow-x-auto gap-2 pb-3 mb-4 scrollbar-none">
          {(['overview', 'submissions', 'users', 'ads', 'audit'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium shrink-0 capitalize ${
                activeTab === tab
                  ? 'bg-[#09090b] text-white'
                  : 'bg-white border border-[#e4e4e7] text-[#71717a]'
              }`}
            >
              {tab === 'submissions' ? `Queue (${metrics.pendingListings})` : tab === 'ads' ? `Ads (${sponsorships.length})` : tab}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW DASHBOARD
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Metric Cards Row (Matching Screenshot 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Card 1: Total Users */}
              <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-[#71717a] mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">TOTAL USERS</span>
                  <UserMultiple02Icon size={16} className="text-[#a1a1aa]" />
                </div>
                <div className="text-[28px] font-bold tracking-tight text-[#09090b] leading-tight">
                  {metrics.totalUsers}
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px] text-[#10b981] font-semibold mt-1">
                  <TrendingUp className="w-3 h-3 text-[#10b981]" />
                  <span>+14 this week</span>
                </div>
              </div>

              {/* Card 2: Queue / Submissions */}
              <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-[#71717a] mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">SUBMISSIONS</span>
                  <File01Icon size={16} className="text-[#a1a1aa]" />
                </div>
                <div className="text-[28px] font-bold tracking-tight text-[#09090b] leading-tight">
                  {metrics.totalListings}
                </div>
                <div className="text-[11.5px] text-[#71717a] mt-1 font-normal">
                  <strong className="text-[#09090b] font-medium">{metrics.pendingListings}</strong> awaiting review
                </div>
              </div>

              {/* Card 3: Active Live Tools */}
              <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-[#71717a] mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">PUBLISHED TOOLS</span>
                  <CheckmarkCircle02Icon size={16} className="text-[#10b981]" />
                </div>
                <div className="text-[28px] font-bold tracking-tight text-[#09090b] leading-tight">
                  {metrics.publishedListings}
                </div>
                <div className="text-[11.5px] text-[#71717a] mt-1 font-normal">
                  Live on public directory
                </div>
              </div>

              {/* Card 4: Ecosystem & Categories */}
              <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-[#71717a] mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">CATEGORIES</span>
                  <Layers className="w-4 h-4 text-[#a1a1aa]" />
                </div>
                <div className="text-[28px] font-bold tracking-tight text-[#09090b] leading-tight">
                  {metrics.totalCategories}
                </div>
                <div className="text-[11.5px] text-[#71717a] mt-1 font-normal">
                  Across 3 core security pillars
                </div>
              </div>

              {/* Card 5: Engine / Maintenance (Matching Screenshot 1 Black Box) */}
              <div className="rounded-2xl bg-[#09090b] text-white p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-white/70 mb-1">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-white/80">SYSTEM ENGINE</span>
                    <Clock01Icon size={14} className="text-white/60" />
                  </div>
                  <div className="text-[11px] text-white/60 font-normal">Fast ISR & Cache Sync</div>
                </div>

                <div className="space-y-1.5 mt-3">
                  <button
                    onClick={() => handleSystemAction('PURGE_CACHE')}
                    disabled={maintenanceLoading}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshIcon size={11} className={maintenanceLoading ? 'animate-spin' : ''} />
                    <span>Revalidate Directory & Sitemap</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white text-[#09090b] font-semibold text-[11px] hover:bg-[#f4f4f5] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Queue ({metrics.pendingListings}) →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Charts Row: Line Graph (Daily Signups) & Donut (Source / Category mix) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left 2 Cols: Activity Line Chart */}
              <div className="lg:col-span-2 rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#09090b] tracking-tight">
                      Daily Submissions & User Activity (Last 30 Days)
                    </h3>
                    <p className="text-[11.5px] text-[#71717a] mt-0.5">
                      Platform traffic engagement and software submission frequency
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-[#71717a] bg-[#f4f4f5] px-2.5 py-1 rounded-md border border-[#e4e4e7]">
                    Rolling 30d
                  </span>
                </div>

                {/* Clean SVG Area Chart (Geist Monochromatic with Emerald Accent) */}
                <div className="relative w-full h-56 pt-2 overflow-hidden">
                  <svg className="w-full h-full overflow-hidden" viewBox="0 0 600 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ismChartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#02ccc1" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#02ccc1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="35" x2="600" y2="35" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="70" x2="600" y2="70" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="105" x2="600" y2="105" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="140" x2="600" y2="140" stroke="#f4f4f5" strokeWidth="1" />

                    {/* Clean Bounded Area fill */}
                    <path
                      d="M 0 140 C 60 135, 90 95, 140 100 C 190 105, 230 65, 290 70 C 350 75, 390 125, 450 115 C 500 105, 540 45, 600 40 L 600 180 L 0 180 Z"
                      fill="url(#ismChartGradient)"
                    />

                    {/* Smooth Strictly Bounded curve line */}
                    <path
                      d="M 0 140 C 60 135, 90 95, 140 100 C 190 105, 230 65, 290 70 C 350 75, 390 125, 450 115 C 500 105, 540 45, 600 40"
                      fill="none"
                      stroke="#09090b"
                      strokeWidth="2.5"
                    />

                    {/* Data Points */}
                    <circle cx="140" cy="100" r="4" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="290" cy="70" r="4" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="450" cy="115" r="4" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="600" cy="40" r="5" fill="#02ccc1" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#71717a] font-mono mt-2 pt-2 border-t border-[#f4f4f5]">
                  <span>Sep 21</span>
                  <span>Sep 28</span>
                  <span>Oct 05</span>
                  <span>Oct 12</span>
                  <span className="font-semibold text-[#09090b]">Today (Oct 19)</span>
                </div>
              </div>

              {/* Right Col: Category / Type Distribution Donut */}
              <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="text-[14px] font-bold text-[#09090b] tracking-tight">
                    Product Distribution Mix
                  </h3>
                  <p className="text-[11.5px] text-[#71717a] mt-0.5">
                    Breakdown by software format and category
                  </p>
                </div>

                <div className="flex items-center justify-center py-4">
                  {/* Donut Visual */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Base circle */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f4f4f5" strokeWidth="12" />
                      {/* Software slice (60%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#09090b"
                        strokeWidth="12"
                        strokeDasharray="143 238"
                        strokeDashoffset="0"
                      />
                      {/* Extension slice (25%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#02ccc1"
                        strokeWidth="12"
                        strokeDasharray="60 238"
                        strokeDashoffset="-143"
                      />
                      {/* MCP Plugin slice (15%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#71717a"
                        strokeWidth="12"
                        strokeDasharray="35 238"
                        strokeDashoffset="-203"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-[20px] font-bold text-[#09090b] tracking-tight leading-none block">
                        {metrics.totalListings}
                      </span>
                      <span className="text-[9.5px] uppercase font-bold text-[#a1a1aa] tracking-wider">
                        Total Tools
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-1.5 text-[12px] pt-2 border-t border-[#f4f4f5]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#09090b]" />
                      <span className="text-[#52525b]">Software & Apps</span>
                    </div>
                    <span className="font-semibold text-[#09090b]">
                      {listings.filter(l => l.listing_type === 'software' || l.listing_type === 'open-source').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#02ccc1]" />
                      <span className="text-[#52525b]">Browser Extensions</span>
                    </div>
                    <span className="font-semibold text-[#09090b]">
                      {listings.filter(l => l.listing_type === 'extension').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#71717a]" />
                      <span className="text-[#52525b]">MCP Servers & Plugins</span>
                    </div>
                    <span className="font-semibold text-[#09090b]">
                      {listings.filter(l => l.listing_type === 'plugin').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Pending Queue Preview Card */}
            <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[14px] font-bold text-[#09090b] tracking-tight">
                    Submissions Requiring Editorial Attention
                  </h3>
                  <p className="text-[11.5px] text-[#71717a] mt-0.5">
                    Items pending verification before publishing to public directory
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="text-[12px] text-[#09090b] font-medium hover:underline flex items-center gap-1"
                >
                  <span>View Full Queue ({filteredListings.length})</span>
                  <ArrowRight01Icon size={13} />
                </button>
              </div>

              {metrics.pendingListings === 0 ? (
                <div className="p-8 text-center bg-[#fafafa] rounded-xl border border-dashed border-[#e4e4e7]">
                  <CheckmarkCircle02Icon size={24} className="text-[#10b981] mx-auto mb-2" />
                  <p className="text-[13px] font-medium text-[#09090b]">Queue is clear!</p>
                  <p className="text-[11.5px] text-[#71717a] mt-0.5">All submitted tools have been reviewed.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#f4f4f5]">
                  {listings
                    .filter(l => l.submission_status === 'pending_review' || l.submission_status === 'under_review')
                    .slice(0, 5)
                    .map(item => (
                      <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <ToolLogo
                            name={item.name}
                            logoUrl={item.logo_url}
                            officialWebsiteUrl={item.official_website_url}
                            size="w-9 h-9"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[13px] text-[#09090b] truncate">{item.name}</span>
                              <span className="font-mono text-[10px] text-[#71717a] bg-[#f4f4f5] px-1.5 py-0.5 rounded border border-[#e4e4e7]">
                                {item.id}
                              </span>
                            </div>
                            <div className="text-[11.5px] text-[#71717a] truncate mt-0.5">
                              {item.tagline || item.short_description || 'No description'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setInspectListing(item)}
                            className="px-2.5 py-1.5 rounded-lg text-[11.5px] text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => handleModerateStatus(item.id, 'published')}
                            disabled={updatingId === item.id}
                            className="h-8 px-3 rounded-lg bg-[#09090b] hover:bg-[#27272a] text-white text-[11.5px] font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50"
                          >
                            <span>Approve & Publish</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 2: SUBMISSIONS QUEUE & DIRECTORY MODERATION (Matching Screenshot 2)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'submissions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Toolbar: Filters, Search, Export */}
            <div className="bg-white rounded-2xl border border-[#e4e4e7] p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto flex-1">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                  <input
                    type="text"
                    placeholder="Search tool name, ID, or domain..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 text-[12.5px] bg-[#fafafa] border border-[#e4e4e7] rounded-xl focus:outline-none focus:border-[#09090b] text-[#09090b] font-geist placeholder:text-[#a1a1aa]"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-9 px-3 text-[12px] bg-[#fafafa] border border-[#e4e4e7] rounded-xl text-[#09090b] font-geist focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses ({listings.length})</option>
                  <option value="pending_review">Pending Review ({listings.filter(l => l.submission_status === 'pending_review').length})</option>
                  <option value="under_review">Under Review ({listings.filter(l => l.submission_status === 'under_review').length})</option>
                  <option value="published">Published / Verified ({listings.filter(l => l.submission_status === 'published').length})</option>
                  <option value="rejected">Rejected ({listings.filter(l => l.submission_status === 'rejected').length})</option>
                </select>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="h-9 px-3 text-[12px] bg-[#fafafa] border border-[#e4e4e7] rounded-xl text-[#09090b] font-geist focus:outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="software">Software</option>
                  <option value="open-source">Open Source</option>
                  <option value="extension">Extension</option>
                  <option value="plugin">Plugin / MCP</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={exportListingsCsv}
                  className="h-9 px-3 rounded-xl border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[#09090b] text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#71717a]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Moderation Table */}
            <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#f4f4f5]/70 border-b border-[#e4e4e7] text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                      <th className="py-3 px-4">Tool & Maker</th>
                      <th className="py-3 px-4">Type & Category</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Moderation Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f4f5]">
                    {filteredListings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#71717a] text-[13px]">
                          No software tools found matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredListings.map(tool => {
                        const isPending = tool.submission_status === 'pending_review' || tool.submission_status === 'under_review';
                        const isPublished = tool.submission_status === 'published';
                        const isRejected = tool.submission_status === 'rejected';

                        const details = Array.isArray(tool.listing_details) ? tool.listing_details[0] : tool.listing_details;
                        const submitterEmail = details?.submitter_email || details?.extra_metadata?.userEmail || '—';

                        return (
                          <tr key={tool.id} className="hover:bg-[#fafafa] transition-colors group">
                            {/* Col 1: Tool & Maker */}
                            <td className="py-3.5 px-4 min-w-[220px]">
                              <div className="flex items-center gap-3">
                                <ToolLogo
                                  name={tool.name}
                                  logoUrl={tool.logo_url}
                                  officialWebsiteUrl={tool.official_website_url}
                                  size="w-9 h-9"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-[#09090b] truncate">{tool.name}</span>
                                    <span className="font-mono text-[10px] text-[#71717a] bg-[#f4f4f5] px-1.5 py-0.5 rounded border border-[#e4e4e7]">
                                      {tool.id}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[11px] text-[#71717a] truncate mt-0.5">
                                    <span>By: {submitterEmail}</span>
                                    {tool.official_website_url && (
                                      <a
                                        href={tool.official_website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#a1a1aa] hover:text-[#09090b] inline-flex items-center ml-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Col 2: Type & Category */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7]">
                                  {tool.listing_type}
                                </span>
                                <span className="text-[11.5px] text-[#71717a]">{tool.category_id}</span>
                              </div>
                            </td>

                            {/* Col 3: Plan */}
                            <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[11.5px] text-[#09090b]">
                              {tool.submission_plan === 'instant' ? (
                                <span className="text-[#09090b] font-semibold bg-[#e4e4e7] px-2 py-0.5 rounded">
                                  Instant ($49)
                                </span>
                              ) : (
                                <span className="text-[#71717a]">Free Tier</span>
                              )}
                            </td>

                            {/* Col 4: Date */}
                            <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#71717a]">
                              {tool.submitted_at ? tool.submitted_at.substring(0, 10) : '—'}
                            </td>

                            {/* Col 5: Moderation Dropdown */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <select
                                value={tool.submission_status}
                                disabled={updatingId === tool.id}
                                onChange={e =>
                                  handleModerateStatus(
                                    tool.id,
                                    e.target.value as any,
                                    e.target.value === 'rejected' ? 'Editorial category scope policy' : undefined
                                  )
                                }
                                className={`text-[11.5px] font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none cursor-pointer transition-colors ${
                                  isPublished
                                    ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]'
                                    : isPending
                                    ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
                                    : 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                                }`}
                              >
                                <option value="published">✓ Verified & Live</option>
                                <option value="pending_review">Pending Review</option>
                                <option value="under_review">In Editorial Review</option>
                                <option value="rejected">✕ Rejected</option>
                              </select>
                            </td>

                            {/* Col 6: Actions */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setInspectListing(tool)}
                                  className="h-8 px-2.5 rounded-lg text-[11.5px] text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors flex items-center gap-1 font-medium cursor-pointer"
                                >
                                  <EyeIcon size={12} />
                                  <span>Inspect</span>
                                </button>

                                {isPending && (
                                  <button
                                    onClick={() => handleModerateStatus(tool.id, 'published')}
                                    disabled={updatingId === tool.id}
                                    className="h-8 px-3 rounded-lg bg-[#09090b] hover:bg-[#27272a] text-white text-[11.5px] font-semibold transition-colors shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <span>Approve</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 3: USERS & ACCOUNTS (Matching Screenshot 2)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-[#e4e4e7] p-4 shadow-2xs flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-bold text-[#09090b] tracking-tight">
                  Registered Accounts & Directory Owners
                </h3>
                <p className="text-[11.5px] text-[#71717a] mt-0.5">
                  Manage user authentication profiles, submitted listings count, and access status
                </p>
              </div>
              <span className="text-[12px] font-mono text-[#71717a] bg-[#f4f4f5] px-2.5 py-1 rounded-lg border border-[#e4e4e7]">
                Total: {users.length} Users
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#f4f4f5]/70 border-b border-[#e4e4e7] text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Submissions</th>
                      <th className="py-3 px-4">Signed Up</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f4f5]">
                    {users.map(u => {
                      const userSubmissions = listings.filter(l => l.owner_id === u.id);
                      const isBanned = u.role === 'banned';

                      return (
                        <tr key={u.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="py-3.5 px-4 min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <UserAvatar fullName={u.full_name} email={u.email} avatarUrl={u.avatar_url} />
                              <div className="min-w-0">
                                <div className="font-semibold text-[#09090b] truncate">
                                  {u.full_name || u.email.split('@')[0]}
                                </div>
                                <div className="text-[11px] text-[#71717a] font-mono truncate">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                                u.role === 'admin'
                                  ? 'bg-[#09090b] text-white'
                                  : 'bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={u.plan || 'free'}
                              disabled={updatingPlanUserId === u.id}
                              onChange={(e) => handleUpdateUserPlan(u.id, e.target.value)}
                              className="h-7 px-2 text-[11.5px] font-semibold rounded-lg border border-[#e4e4e7] bg-white text-[#09090b] hover:border-[#09090b] focus:outline-none focus:ring-1 focus:ring-[#09090b] cursor-pointer disabled:opacity-50 transition-colors"
                            >
                              <option value="free">Free Tier</option>
                              <option value="pro">Pro</option>
                              <option value="sponsored">Sponsored / Enterprise</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#09090b]">
                            {userSubmissions.length} Tool{userSubmissions.length !== 1 ? 's' : ''}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#71717a]">
                            {u.created_at ? u.created_at.substring(0, 10) : '—'}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                                isBanned ? 'bg-[#fef2f2] text-[#b91c1c]' : 'bg-[#f0fdf4] text-[#166534]'
                              }`}
                            >
                              {isBanned ? 'Suspended' : 'Active'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            {isBanned ? (
                              <button
                                onClick={() => handleSystemAction('UNBAN_USER', u.id)}
                                className="text-[11.5px] text-[#10b981] font-semibold hover:underline cursor-pointer"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSystemAction('BAN_USER', u.id)}
                                className="text-[11.5px] text-[#ef4444] font-semibold hover:underline cursor-pointer"
                              >
                                Ban Account
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 4: AUDIT LOG (Real-time governance trail)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'audit' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-[#e4e4e7] p-4 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-[#09090b] tracking-tight">
                  Security & Moderation Audit Trail
                </h3>
                <p className="text-[11.5px] text-[#71717a] mt-0.5">
                  Immutable records of administrative status changes, cache purges, and email dispatches
                </p>
              </div>
              <span className="font-mono text-[11.5px] text-[#71717a] bg-[#f4f4f5] px-2.5 py-1 rounded-lg border border-[#e4e4e7]">
                {auditLogs.length} Events Logged
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#f4f4f5]/70 border-b border-[#e4e4e7] text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target ID</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f4f5]">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#71717a] text-[13px]">
                          No audit entries recorded yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map(log => {
                        const isAuth = log.action.startsWith('AUTH_');
                        const isModerate = log.action.startsWith('MODERATE_');
                        const isSystem = log.action.startsWith('PURGE_') || log.action.startsWith('UPDATE_USER_PLAN');
                        const isBan = log.action.startsWith('BAN_');

                        return (
                          <tr key={log.id} className="hover:bg-[#fafafa] font-mono text-[11.5px]">
                            <td className="py-3 px-4 text-[#71717a] whitespace-nowrap">
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-semibold text-[#09090b] whitespace-nowrap">
                              {log.actor_email}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  isAuth
                                    ? 'bg-[#faf5ff] text-[#6b21a8] border-[#e9d5ff]'
                                    : isModerate
                                    ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                                    : isSystem
                                    ? 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]'
                                    : isBan
                                    ? 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                                    : 'bg-[#f4f4f5] text-[#09090b] border-[#e4e4e7]'
                                }`}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[#71717a] whitespace-nowrap">
                              {log.target_id || '—'}
                            </td>
                            <td className="py-3 px-4 text-[#71717a] whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[#09090b]">{log.ip_address || '127.0.0.1'}</span>
                                {log.country && (
                                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#f4f4f5] border border-[#e4e4e7] text-[#71717a]">
                                    {log.country}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#71717a] max-w-xs truncate">
                              {log.metadata ? JSON.stringify(log.metadata) : '—'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB: ADS / SPONSORSHIP SLOTS (Matching AltHunt Admin & User Voice)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'ads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Container: NEW AD SLOT FORM (Matching AltHunt Screenshot 2) */}
            <div className="bg-white rounded-2xl border border-[#e4e4e7] p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#f4f4f5]">
                <div className="text-[12px] font-bold text-[#71717a] uppercase tracking-wider">
                  {editingAdId ? 'EDIT AD SLOT' : 'NEW AD SLOT'}
                </div>
                {editingAdId && (
                  <button
                    onClick={() => {
                      setEditingAdId(null);
                      setAdForm({
                        ownerEmail: '',
                        ownerId: '',
                        advertiserUrl: '',
                        title: '',
                        displayDomain: '',
                        iconUrl: '',
                        description: '',
                        ctaLabel: 'Visit',
                        placement: 'rail',
                        startDate: new Date().toISOString().slice(0, 10),
                        endDate: '',
                        cardTint: 'none',
                      });
                    }}
                    className="text-[11.5px] text-[#71717a] hover:text-[#09090b] underline cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {adError && (
                <div className="p-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] text-[#991b1b] text-[12px]">
                  {adError}
                </div>
              )}

              <form onSubmit={handleCreateAdSlot} className="space-y-4 font-geist">
                {/* 1. Advertiser URL + Fetch Details */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#09090b] mb-1.5">
                    Advertiser URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://theirproduct.com"
                      value={adForm.advertiserUrl}
                      onChange={(e) => setAdForm({ ...adForm, advertiserUrl: e.target.value })}
                      onBlur={handleFetchDetails}
                      required
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleFetchDetails}
                      className="px-4 py-2.5 rounded-xl bg-[#52525b] hover:bg-[#3f3f46] text-white text-[12px] font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      Fetch details
                    </button>
                  </div>
                  <p className="text-[11px] text-[#71717a] mt-1.5">
                    Pulls their app icon, name and description. Anything you&apos;ve already typed is left alone.
                  </p>
                </div>

                {/* 2. Target User Account / Assign to User (User Voice Requirement) */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#09090b] mb-1.5">
                    Assign to User Email (Activates on their Dashboard)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Type or select user email (e.g. founder@startup.com)..."
                      value={adForm.ownerEmail}
                      onChange={(e) => {
                        setAdForm({ ...adForm, ownerEmail: e.target.value });
                        setUserSearchTerm(e.target.value);
                        setShowUserDropdown(true);
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:outline-none transition-colors font-mono"
                    />
                    {showUserDropdown && filteredUsers.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white rounded-xl border border-[#e4e4e7] shadow-xl divide-y divide-[#f4f4f5]">
                        {filteredUsers.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              setAdForm({
                                ...adForm,
                                ownerEmail: u.email,
                                ownerId: u.id,
                              });
                              setShowUserDropdown(false);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-[#fafafa] flex items-center justify-between text-[12px] cursor-pointer"
                          >
                            <span className="font-semibold text-[#09090b] font-mono">{u.email}</span>
                            <span className="text-[#71717a] text-[11px]">{u.full_name || 'Member'}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#71717a] mt-1">
                    When this user logs into their dashboard, their Sponsorship tab will automatically show active live analytics.
                  </p>
                </div>

                {/* 3. Title + Display Domain */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#09090b] mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SendNow: Secure Document Sharing"
                      value={adForm.title}
                      onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#09090b] mb-1.5">
                      Display domain
                    </label>
                    <input
                      type="text"
                      placeholder="theirproduct.com"
                      value={adForm.displayDomain}
                      onChange={(e) => setAdForm({ ...adForm, displayDomain: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* 4. Icon — filled from the site; upload or paste a URL to override */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#09090b] mb-1.5">
                    Icon — filled from the site; upload or paste a URL to override
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-[#fafafa] flex items-center justify-center shrink-0 overflow-hidden p-1">
                      {adForm.iconUrl ? (
                        <img
                          src={adForm.iconUrl}
                          alt="Icon Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-[11px] font-bold text-[#a1a1aa]">ICO</div>
                      )}
                    </div>
                    <input
                      type="url"
                      placeholder="https://theirproduct.com/icon.png"
                      value={adForm.iconUrl}
                      onChange={(e) => setAdForm({ ...adForm, iconUrl: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:outline-none transition-colors font-mono"
                    />
                    <label className="px-3.5 py-2 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#09090b] text-[12px] font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs">
                      Upload
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/x-icon"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setAdForm({ ...adForm, iconUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-[#71717a] mt-1.5">
                    PNG, JPEG, WebP or ICO. Up to 512KB. Square works best.
                  </p>
                </div>

                {/* 5. Description 0/200 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12.5px] font-semibold text-[#09090b]">
                      Description
                    </label>
                    <span className="text-[11px] font-mono text-[#71717a]">
                      {adForm.description.length}/200
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={200}
                    placeholder="Concise overview of product capabilities, key differentiators, and value proposition..."
                    value={adForm.description}
                    onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] placeholder:text-[#a1a1aa] focus:border-[#09090b] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* 6. CTA Label + Placement + Starts + Ends */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#09090b] mb-1">
                      CTA label
                    </label>
                    <input
                      type="text"
                      placeholder="Visit"
                      value={adForm.ctaLabel}
                      onChange={(e) => setAdForm({ ...adForm, ctaLabel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#e4e4e7] text-[12.5px] text-[#09090b] focus:border-[#09090b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#09090b] mb-1">
                      Placement
                    </label>
                    <select
                      value={adForm.placement}
                      onChange={(e) => setAdForm({ ...adForm, placement: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#e4e4e7] text-[12.5px] text-[#09090b] bg-white focus:border-[#09090b] focus:outline-none"
                    >
                      <option value="rail">Rail (sidebar)</option>
                      <option value="header">Header banner</option>
                      <option value="category">Category sticky</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#09090b] mb-1">
                      Starts
                    </label>
                    <input
                      type="date"
                      value={adForm.startDate}
                      onChange={(e) => setAdForm({ ...adForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#e4e4e7] text-[12.5px] text-[#09090b] bg-white focus:border-[#09090b] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#09090b] mb-1">
                      Ends
                    </label>
                    <input
                      type="date"
                      value={adForm.endDate}
                      onChange={(e) => setAdForm({ ...adForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#e4e4e7] text-[12.5px] text-[#09090b] bg-white focus:border-[#09090b] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 7. Card tint */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#09090b] mb-2">
                    Card tint
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {CARD_TINT_OPTIONS.map((tint) => (
                      <button
                        key={tint.id}
                        type="button"
                        onClick={() => setAdForm({ ...adForm, cardTint: tint.id })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer ${
                          adForm.cardTint === tint.id
                            ? 'border-[#09090b] bg-[#09090b] text-white shadow-2xs'
                            : 'border-[#e4e4e7] bg-white hover:bg-[#fafafa] text-[#52525b]'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${tint.dot} shrink-0`} />
                        <span>{tint.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={adSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
                  >
                    {adSubmitting ? 'Saving slot...' : editingAdId ? 'Update ad slot' : 'Create ad slot'}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom List: EXISTING AD SLOTS (Matching Screenshot 2 Bottom) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-[13px] font-bold text-[#09090b]">
                  Configured Sponsorship Slots ({sponsorships.length})
                </h4>
                <span className="text-[11.5px] text-[#71717a]">
                  Snapshot generated in real time
                </span>
              </div>

              {sponsorships.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e4e4e7] p-8 text-center text-[#71717a] text-[13px]">
                  No sponsorship slots created yet. Use the form above to add an ad placement.
                </div>
              ) : (
                sponsorships.map((slot) => {
                  const analytics = slot.sponsorship_analytics?.[0];
                  const impressions = analytics?.total_impressions || 0;
                  const clicks = analytics?.total_clicks || 0;
                  const ctr = impressions > 0 ? `${((clicks / impressions) * 100).toFixed(2)}%` : '0.00%';
                  const isPaused = slot.campaign_status === 'paused';

                  const tintStyles: Record<string, string> = {
                    none: 'bg-white border-[#e4e4e7]',
                    blue: 'bg-[#eff6ff]/40 border-[#bfdbfe]',
                    violet: 'bg-[#f5f3ff]/40 border-[#ddd6fe]',
                    green: 'bg-[#ecfdf5]/40 border-[#a7f3d0]',
                    amber: 'bg-[#fffbeb]/50 border-[#fde68a]',
                    rose: 'bg-[#fff1f2]/40 border-[#fecdd3]',
                    teal: 'bg-[#f0fdfa]/40 border-[#99f6e4]',
                    slate: 'bg-[#f8fafc] border-[#cbd5e1]',
                  };

                  return (
                    <div
                      key={slot.id}
                      className={`rounded-2xl border p-4 sm:p-5 shadow-2xs transition-all ${
                        tintStyles[slot.card_tint || 'none'] || 'bg-white border-[#e4e4e7]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          {/* Logo / Icon */}
                          <div className="w-12 h-12 rounded-xl bg-white border border-[#e4e4e7] p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {slot.icon_url ? (
                              <img
                                src={slot.icon_url}
                                alt={slot.campaign_name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <MarketingIcon size={20} className="text-[#09090b]" />
                            )}
                          </div>

                          {/* Details */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-[14px] font-bold text-[#09090b]">
                                {slot.campaign_name}
                              </h5>
                              <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-medium bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
                                {slot.placement}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold border ${
                                  !isPaused
                                    ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                                    : 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    !isPaused ? 'bg-[#10b981]' : 'bg-[#a1a1aa]'
                                  }`}
                                />
                                <span>{isPaused ? 'paused' : 'active'}</span>
                              </span>
                              {slot.owner_email && (
                                <span className="px-2 py-0.5 rounded text-[10.5px] font-mono text-[#52525b] bg-[#fafafa] border border-[#e4e4e7]">
                                  owner: {slot.owner_email}
                                </span>
                              )}
                            </div>

                            {slot.description && (
                              <p className="text-[12px] text-[#52525b] leading-relaxed max-w-2xl">
                                {slot.description}
                              </p>
                            )}

                            {slot.target_url && (
                              <a
                                href={slot.target_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block text-[11px] text-[#71717a] hover:text-[#09090b] hover:underline font-mono"
                              >
                                {slot.display_domain || slot.target_url}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Right Side: Metrics (Impressions, Clicks, CTR) */}
                        <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#f4f4f5]">
                          <div className="text-[12.5px] font-bold text-[#09090b]">
                            {impressions.toLocaleString()} <span className="text-[#71717a] font-normal text-[11px]">impr</span>
                          </div>
                          <div className="text-[12px] font-semibold text-[#09090b]">
                            {clicks.toLocaleString()} <span className="text-[#71717a] font-normal text-[11px]">clicks</span>
                          </div>
                          <div className="text-[11px] text-[#71717a] font-mono">
                            CTR {ctr}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons (Edit, Resume/Pause, Delete) */}
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#f4f4f5]">
                        <button
                          onClick={() => {
                            setEditingAdId(slot.id);
                            setAdForm({
                              ownerEmail: slot.owner_email || '',
                              ownerId: slot.owner_id || '',
                              advertiserUrl: slot.target_url || '',
                              title: slot.campaign_name,
                              displayDomain: slot.display_domain || '',
                              iconUrl: slot.icon_url || '',
                              description: slot.description || '',
                              ctaLabel: slot.cta_label || 'Visit',
                              placement: slot.placement || 'rail',
                              startDate: slot.start_date || new Date().toISOString().slice(0, 10),
                              endDate: slot.end_date || '',
                              cardTint: slot.card_tint || 'none',
                            });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3 py-1 rounded-lg border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#09090b] text-[11.5px] font-semibold transition-colors cursor-pointer shadow-2xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleAdStatus(slot)}
                          className={`px-3 py-1 rounded-lg text-white text-[11.5px] font-semibold transition-colors cursor-pointer shadow-2xs ${
                            isPaused
                              ? 'bg-[#09090b] hover:bg-[#27272a]'
                              : 'bg-[#52525b] hover:bg-[#3f3f46]'
                          }`}
                        >
                          {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdSlot(slot.id)}
                          className="px-2.5 py-1 text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-lg text-[11.5px] font-semibold transition-colors cursor-pointer ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── INSPECT LISTING MODAL DIALOG ── */}
      {inspectListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#e4e4e7] p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto font-geist">
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#e4e4e7]">
              <div className="flex items-center gap-3">
                <ToolLogo
                  name={inspectListing.name}
                  logoUrl={inspectListing.logo_url}
                  officialWebsiteUrl={inspectListing.official_website_url}
                  size="w-12 h-12"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[18px] font-bold text-[#09090b]">{inspectListing.name}</h2>
                    <span className="font-mono text-[11px] bg-[#f4f4f5] px-2 py-0.5 rounded border border-[#e4e4e7]">
                      {inspectListing.id}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#71717a] mt-0.5">{inspectListing.tagline || 'No tagline'}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectListing(null)}
                className="w-8 h-8 rounded-lg bg-[#f4f4f5] hover:bg-[#e4e4e7] flex items-center justify-center text-[#71717a] transition-colors cursor-pointer"
              >
                <Cancel01Icon size={16} />
              </button>
            </div>

            <div className="space-y-4 text-[12.5px]">
              <div>
                <span className="font-semibold text-[#09090b] block mb-1">Full Description:</span>
                <p className="text-[#52525b] leading-relaxed bg-[#fafafa] p-3 rounded-xl border border-[#e4e4e7]">
                  {inspectListing.full_description || inspectListing.short_description || 'No overview provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
                  <span className="text-[#71717a] block text-[11px] uppercase font-bold">Website</span>
                  <a
                    href={inspectListing.official_website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#09090b] font-medium hover:underline truncate block mt-0.5"
                  >
                    {inspectListing.official_website_url}
                  </a>
                </div>
                <div className="p-3 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
                  <span className="text-[#71717a] block text-[11px] uppercase font-bold">Category</span>
                  <span className="text-[#09090b] font-medium block mt-0.5">{inspectListing.category_id}</span>
                </div>
              </div>

              {/* Submitter Info */}
              {(() => {
                const details = Array.isArray(inspectListing.listing_details)
                  ? inspectListing.listing_details[0]
                  : inspectListing.listing_details;
                return (
                  <div className="p-4 bg-[#f4f4f5]/60 rounded-xl border border-[#e4e4e7] space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-[#71717a] tracking-wider block">
                      Submitter Dossier
                    </span>
                    <div className="flex justify-between">
                      <span className="text-[#71717a]">Submitter Name:</span>
                      <strong className="text-[#09090b]">{details?.submitter_name || 'Anonymous'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717a]">Submitter Email:</span>
                      <strong className="text-[#09090b] font-mono">{details?.submitter_email || '—'}</strong>
                    </div>
                    {details?.repository_url && (
                      <div className="flex justify-between">
                        <span className="text-[#71717a]">Repository:</span>
                        <a href={details.repository_url} target="_blank" className="text-[#09090b] underline font-mono">
                          {details.repository_url}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-[#e4e4e7] flex items-center justify-between">
              <button
                onClick={() => setInspectListing(null)}
                className="h-9 px-4 rounded-xl border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[#09090b] text-[12.5px] font-medium transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleModerateStatus(inspectListing.id, 'rejected', 'Category mismatch or out of scope');
                    setInspectListing(null);
                  }}
                  className="h-9 px-3.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] text-[#991b1b] hover:bg-[#fee2e2] text-[12.5px] font-semibold transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    handleModerateStatus(inspectListing.id, 'published');
                    setInspectListing(null);
                  }}
                  className="h-9 px-4 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-[12.5px] font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  Approve & Make Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
