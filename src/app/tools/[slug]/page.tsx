import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ShieldCheck,
  ExternalLink,
  Check,
  CheckCircle2,
  X,
  XCircle,
  Calendar,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import {
  getSoftwareBySlug,
  fetchSoftwareBySlugFromDb,
  fetchSoftwareFromDb,
  fetchCategoriesFromDb,
  fetchSoftwareByCategoryFromDb,
  getCategoryBySlug,
} from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ToolScreenshotGallery } from '@/components/tools/ToolScreenshotGallery';
import { BrandTag } from '@/components/tools/BrandTag';
import { ToolReviewsSection } from '@/components/tools/ToolReviewsSection';
import { ToolAnalyticsTracker } from '@/components/tools/ToolAnalyticsTracker';
import { withUtm } from '@/lib/logo-utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const software = await fetchSoftwareFromDb();
  return software
    .filter((s) => !s.itemType || s.itemType === 'software')
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = (await fetchSoftwareBySlugFromDb(slug)) || getSoftwareBySlug(slug);
  if (!tool) return { title: 'Software Not Found' };

  return {
    title: `${tool.name} Review, Specs & Pricing (2026)`,
    description: tool.shortDescription,
    alternates: {
      canonical: `https://securetools.live/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} Review & Architecture | SecureTools.live`,
      description: tool.shortDescription,
      url: `https://securetools.live/tools/${tool.slug}`,
    },
  };
}

function getDomain(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
  }
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

export default async function SoftwareProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const tool = (await fetchSoftwareBySlugFromDb(slug)) || getSoftwareBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Redirect to dedicated sections as per user architecture requirements
  if (tool.itemType === 'open-source' || tool.pricingModel === 'Open Source') {
    redirect(`/open-source/${tool.slug}`);
  }
  if (tool.itemType === 'extension') {
    redirect(`/extensions/${tool.slug}`);
  }
  if (tool.itemType === 'plugin') {
    redirect(`/plugins/${tool.slug}`);
  }

  const categories = await fetchCategoriesFromDb();
  const category =
    categories.find((c) => c.slug === tool.primaryCategory) ||
    getCategoryBySlug(tool.primaryCategory);

  // Fetch related tools in the same category (constrained to exactly 3 cards)
  const categoryTools = await fetchSoftwareByCategoryFromDb(tool.primaryCategory);
  const relatedTools = categoryTools.filter((t) => t.id !== tool.id).slice(0, 3);
  const allSoftware = await fetchSoftwareFromDb();
  const displayRelated =
    relatedTools.length > 0
      ? relatedTools
      : allSoftware.filter((t) => t.id !== tool.id).slice(0, 3);

  const domain = getDomain(tool.websiteUrl);
  const resolvedLogo =
    tool.logoUrl ||
    (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null);

  const initials = tool.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const youtubeEmbed = getYouTubeEmbedUrl(tool.youtubeVideoUrl);

  // JSON-LD Schema for SoftwareApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: tool.platforms.join(', '),
    applicationCategory: category?.name || 'SecuritySoftware',
    offers: {
      '@type': 'Offer',
      price: tool.startingPrice ? tool.startingPrice.replace(/[^0-9.]/g, '') || '0' : '0',
      priceCurrency: 'USD',
      description: tool.startingPrice || tool.pricingModel,
    },
    description: tool.shortDescription,
    url: tool.websiteUrl,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-geist">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolAnalyticsTracker toolSlug={tool.slug} listingId={tool.id} />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Directory', href: '/tools' },
          ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
          { label: tool.name },
        ]}
      />

      {/* ── TOP HEADER CARD (Matching Reference Image) ── */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-6 shadow-2xs font-geist">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Authentic Logo / Favicon */}
            <div className="w-14 h-14 rounded-full border border-[#e4e4e7] p-2 bg-white flex items-center justify-center shrink-0 shadow-2xs">
              {resolvedLogo ? (
                <img
                  src={resolvedLogo}
                  alt={tool.name}
                  className="w-10 h-10 object-contain rounded-full"
                />
              ) : (
                <span className="font-bold text-base text-[#09090b] font-mono">{initials}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#09090b] tracking-tight flex items-center gap-1.5 font-geist">
                  <span>{tool.name}</span>
                  {tool.verificationStatus === 'Verified' && (
                    <svg
                      className="w-5 h-5 text-[#2563eb] inline-block shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-label="Verified by SecureTools"
                    >
                      <title>Verified by SecureTools</title>
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.49 4.49 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </h1>

                {/* Category Pill Badge (Matching Reference Image) */}
                {category && (
                  <Link
                    href={`/categories/${category.slug}`}
                    className="font-mono text-[11px] font-semibold text-[#71717a] hover:text-[#09090b] bg-[#f4f4f5] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#e4e4e7] transition-colors"
                  >
                    {category.name}
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#71717a] mt-1 font-geist">
                <span>Updated: {tool.verifiedDate}</span>
                <span>&bull;</span>
                <span>{tool.verifiedBy}</span>
              </div>
            </div>
          </div>

          {/* Action CTA: Black Button with White Text (Adapted to our site theme) */}
          <div className="shrink-0">
            <a
              href={withUtm(tool.websiteUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer border border-[#09090b] font-geist"
            >
              <span>Visit {domain || 'Official Site'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ── HEADLINE & NARRATIVE OVERVIEW (Matching Reference Image) ── */}
      <div className="space-y-3 pt-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#09090b] tracking-tight leading-tight">
          {tool.alternatives && tool.alternatives.length > 0
            ? `${tool.name} alternative to ${tool.alternatives[0]}: ${tool.tagline || tool.shortDescription}`
            : `${tool.name}: ${tool.tagline || tool.shortDescription}`}
        </h2>

        <div className="text-[15px] sm:text-base text-[#52525b] leading-relaxed whitespace-pre-line max-w-4xl">
          {tool.fullOverview || tool.shortDescription}
        </div>
      </div>

      {/* ── SCREENSHOT GALLERY & DEMO WORKSPACE (Directly under description) ── */}
      <section className="space-y-3 pt-1">
        <ToolScreenshotGallery
          toolName={tool.name}
          websiteUrl={tool.websiteUrl}
          slug={slug}
          screenshots={tool.screenshots}
        />
      </section>

      {/* ── EMBEDDED PRODUCT VIDEO (If available) ── */}
      {youtubeEmbed && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#09090b]">Product Walkthrough & Demo</h2>
            <span className="font-mono text-[10.5px] font-semibold text-[#dc2626] bg-[#fef2f2] px-2 py-0.5 rounded border border-[#fecaca]">
              Video
            </span>
          </div>
          <div className="relative aspect-video w-full rounded-2xl border border-[#e4e4e7] overflow-hidden bg-black shadow-2xs">
            <iframe
              src={youtubeEmbed}
              title={`${tool.name} video walkthrough`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* ── KEY FEATURES CHECKLIST (Clean checklist with green tickmarks) ── */}
      {tool.keyFeatures && tool.keyFeatures.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#09090b]">Key Features & Capabilities</h2>
            <span className="font-mono text-[11px] text-[#71717a] bg-[#f4f4f5] px-2.5 py-1 rounded-md border border-[#e4e4e7]">
              {tool.keyFeatures.length} Verified Features
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tool.keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-[#e4e4e7] bg-white shadow-2xs font-geist group hover:border-[#a1a1aa] transition-colors"
              >
                <CheckCircle2 className="w-[18px] h-[18px] text-[#09090b] shrink-0 mt-0.5 stroke-[2]" />
                <span className="text-[13px] font-medium text-[#18181b] leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── ALTERNATIVES & INTEGRATIONS (With authentic favicons & rounded card tags) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alternatives List */}
        {tool.alternatives && tool.alternatives.length > 0 && (
          <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#09090b]">Top Alternatives</h3>
              <span className="text-[11px] font-mono text-[#71717a] bg-[#f4f4f5] px-2 py-0.5 rounded border border-[#e4e4e7]">
                {tool.alternatives.length} listed
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.alternatives.map((alt, idx) => {
                const altSlug = alt
                  .toLowerCase()
                  .replace(/[\s_]+/g, '-')
                  .replace(/[^\w-]/g, '');
                return (
                  <BrandTag
                    key={idx}
                    name={alt}
                    href={`/tools/${altSlug}`}
                    isClickable={true}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Integrations List */}
        {tool.integrations && tool.integrations.length > 0 && (
          <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#09090b]">Supported Integrations</h3>
              <span className="text-[11px] font-mono text-[#71717a] bg-[#f4f4f5] px-2 py-0.5 rounded border border-[#e4e4e7]">
                {tool.integrations.length} platforms
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.integrations.map((item, idx) => (
                <BrandTag
                  key={idx}
                  name={item}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── PRICING PLANS & TIER COMPARISON (Audio 1 & Audio 3) ── */}
      <section className="space-y-3 font-geist">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#09090b] tracking-tight">
              Pricing Plans & Tier Comparison
            </h2>
            <p className="text-xs text-[#71717a] mt-0.5">
              Verified monthly & annual subscription plans, quotas, and feature allowances.
            </p>
          </div>

          {/* CTA: For Full Pricing (Audio 1 requirement) */}
          <div className="shrink-0">
            <a
              href={withUtm(tool.pricingUrl || (tool.websiteUrl ? `${tool.websiteUrl.replace(/\/+$/, '')}/pricing` : '#'))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer border border-[#09090b]"
            >
              <span>For Full Pricing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Detailed Plan Comparison Table */}
        {tool.pricingPlans && tool.pricingPlans.length > 0 ? (
          <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#e4e4e7] text-[11px] uppercase font-mono tracking-wider text-[#71717a]">
                    <th className="py-3 px-4 sm:px-6 font-semibold w-1/4">Plan Tier</th>
                    <th className="py-3 px-4 font-semibold w-1/6">Monthly</th>
                    <th className="py-3 px-4 font-semibold w-1/4">Annual Billing</th>
                    <th className="py-3 px-4 sm:px-6 font-semibold">Included Features & Quotas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f4f5]">
                  {tool.pricingPlans.map((plan, idx) => (
                    <tr key={idx} className="hover:bg-[#fafafa]/60 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-[#09090b] align-top">
                        <div className="flex items-center gap-2">
                          <span>{plan.name}</span>
                          {plan.isPopular && (
                            <span className="font-mono text-[10px] font-semibold bg-[#09090b] text-white px-2 py-0.5 rounded-full uppercase">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#09090b] align-top whitespace-nowrap">
                        {plan.monthlyPrice || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#71717a] align-top whitespace-nowrap">
                        {plan.yearlyPrice || '-'}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-[#52525b] text-[12.5px] leading-relaxed align-top">
                        {plan.description || (plan.features && plan.features.join(' • ')) || 'Standard entitlements'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-[13px] border-collapse">
              <tbody className="divide-y divide-[#f4f4f5]">
                <tr className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] w-1/3 bg-[#fafafa]/50">
                    Pricing Model
                  </td>
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#09090b]">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#f4f4f5] border border-[#e4e4e7] text-[#09090b]">
                      {tool.pricingModel}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] bg-[#fafafa]/50">
                    Starting Price
                  </td>
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#09090b]">
                    {tool.startingPrice || 'Free tier or custom quote'}
                  </td>
                </tr>
                <tr className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] bg-[#fafafa]/50">
                    Free Tier / Trial
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-[#18181b]">
                    {tool.freeTierAvailable
                      ? 'Free tier available'
                      : tool.freeTrialDays
                      ? `${tool.freeTrialDays} Days Free Trial`
                      : 'None / Contact sales'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── TECHNICAL ARCHITECTURE & SECURITY SPECIFICATIONS TABLE ── */}
      <section className="space-y-3 font-geist">
        <h2 className="text-lg font-bold text-[#09090b] tracking-tight">
          Technical Architecture & Security Specifications
        </h2>
        <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden shadow-2xs">
          <table className="w-full text-left text-[13px] border-collapse">
            <tbody className="divide-y divide-[#f4f4f5]">
              <tr className="hover:bg-[#fafafa] transition-colors">
                <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] w-1/3 bg-[#fafafa]/50">
                  Supported Platforms
                </td>
                <td className="py-3 px-4 sm:px-6 text-[#18181b]">{tool.platforms.join(', ')}</td>
              </tr>
              <tr className="hover:bg-[#fafafa] transition-colors">
                <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] bg-[#fafafa]/50">
                  Deployment Model
                </td>
                <td className="py-3 px-4 sm:px-6 text-[#18181b]">{tool.deployment.join(', ')}</td>
              </tr>
              <tr className="hover:bg-[#fafafa] transition-colors">
                <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] bg-[#fafafa]/50">
                  Encryption at Rest
                </td>
                <td className="py-3 px-4 sm:px-6 text-[#18181b]">
                  {tool.security.encryptionAtRest || 'AES-256'}
                </td>
              </tr>
              <tr className="hover:bg-[#fafafa] transition-colors">
                <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] bg-[#fafafa]/50">
                  Encryption in Transit
                </td>
                <td className="py-3 px-4 sm:px-6 text-[#18181b]">
                  {tool.security.encryptionInTransit || 'TLS 1.3'}
                </td>
              </tr>
              <tr className="hover:bg-[#fafafa] transition-colors">
                <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] bg-[#fafafa]/50">
                  Zero-Knowledge Architecture
                </td>
                <td className="py-3 px-4 sm:px-6 text-[#18181b]">
                  {tool.security.zeroKnowledgeArchitecture
                    ? 'Yes (Client-side keys)'
                    : 'Standard Provider-Managed'}
                </td>
              </tr>
              {tool.storageCapabilities?.storageIncluded && (
                <tr className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] bg-[#fafafa]/50">
                    Storage Allowance
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-[#18181b]">
                    {tool.storageCapabilities.storageIncluded}
                  </td>
                </tr>
              )}
              {tool.security.certifications.length > 0 && (
                <tr className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] bg-[#fafafa]/50">
                    Certifications & Compliance
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-[#18181b]">
                    <div className="flex flex-wrap gap-1.5">
                      {tool.security.certifications.map((c, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold bg-[#f4f4f5] text-[#09090b] px-2 py-0.5 rounded border border-[#e4e4e7]"
                        >
                          <Check className="w-3 h-3 text-[#09090b]" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── PROS & CONS (Clean Minimalist Cards - Monochrome Theme) ── */}
      {(tool.advantages.length > 0 || tool.limitations.length > 0) && (
        <section className="space-y-3 font-geist">
          <h2 className="text-lg font-bold text-[#09090b] tracking-tight">Pros & Cons Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.advantages.length > 0 && (
              <div className="p-4 rounded-2xl border border-[#e4e4e7] bg-white shadow-2xs space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-[#09090b] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#09090b] shrink-0 stroke-[2]" />
                  <span>Key Strengths</span>
                </h3>
                <ul className="space-y-2 text-[12.5px] text-[#52525b]">
                  {tool.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#09090b] font-bold">&bull;</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tool.limitations.length > 0 && (
              <div className="p-4 rounded-2xl border border-[#e4e4e7] bg-white shadow-2xs space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-[#71717a] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#71717a] shrink-0 stroke-[2]" />
                  <span>Considerations</span>
                </h3>
                <ul className="space-y-2 text-[12.5px] text-[#52525b]">
                  {tool.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#71717a] font-bold">&bull;</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FREQUENTLY ASKED QUESTIONS (if available) ── */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#09090b] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#71717a]" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="rounded-2xl border border-[#e4e4e7] bg-white divide-y divide-[#f4f4f5] shadow-2xs overflow-hidden">
            {tool.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-[#09090b] mb-1.5">{faq.question}</h3>
                <p className="text-xs sm:text-[13px] text-[#63636b] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── OFFICIAL SOURCES ── */}
      {tool.officialSources && tool.officialSources.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#71717a] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#71717a]" />
            <span>Official Documentation & Audited Sources</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {tool.officialSources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#fafafa] text-xs text-[#09090b] font-medium transition-colors"
              >
                <span>{src.title}</span>
                <ExternalLink className="w-3 h-3 text-[#71717a]" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── RATINGS & USER REVIEWS SECTION ── */}
      <ToolReviewsSection
        toolSlug={tool.slug}
        toolName={tool.name}
        listingId={tool.id}
      />

      {/* ── RELATED TOOLS SECTION (At End of Section - Exactly 3 Cards) ── */}
      {displayRelated.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[#e4e4e7]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#09090b]">
                Similar {category ? category.name : 'Security'} Tools
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">
                Explore alternatives and complementary solutions in this category
              </p>
            </div>
            {category && (
              <Link
                href={`/categories/${category.slug}`}
                className="text-xs font-semibold text-[#09090b] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {displayRelated.map((rel) => {
              const relDomain = getDomain(rel.websiteUrl);
              const relLogo =
                rel.logoUrl ||
                (relDomain ? `https://www.google.com/s2/favicons?domain=${relDomain}&sz=128` : null);

              return (
                <Link
                  key={rel.id}
                  href={`/tools/${rel.slug}`}
                  className="group p-4 rounded-2xl border border-[#e4e4e7] bg-white hover:border-[#09090b] hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      {relLogo ? (
                        <img
                          src={relLogo}
                          alt={rel.name}
                          className="w-8 h-8 rounded-lg object-contain bg-white border border-[#e4e4e7] p-1 shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center font-bold text-xs text-[#09090b] shrink-0 font-mono">
                          {rel.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#09090b] group-hover:text-[#09090b] transition-colors truncate">
                          {rel.name}
                        </h3>
                        <span className="font-mono text-[10px] text-[#71717a] block truncate">
                          {rel.pricingModel}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#71717a] line-clamp-2 leading-relaxed">
                      {rel.shortDescription || rel.tagline}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#f4f4f5] flex items-center justify-between text-xs font-semibold text-[#71717a] group-hover:text-[#09090b]">
                    <span>View specs</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
