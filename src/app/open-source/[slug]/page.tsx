import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ExternalLink,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code,
  Lock,
} from 'lucide-react';
import {
  fetchOpenSourceFromDb,
  fetchSoftwareBySlugFromDb,
  getSoftwareBySlug,
  fetchSoftwareFromDb,
} from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ToolReviewsSection } from '@/components/tools/ToolReviewsSection';
import { ToolAnalyticsTracker } from '@/components/tools/ToolAnalyticsTracker';
import { withUtm } from '@/lib/logo-utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const openSource = await fetchOpenSourceFromDb();
  return openSource.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = (await fetchSoftwareBySlugFromDb(slug)) || getSoftwareBySlug(slug);
  if (!tool) return { title: 'Open Source Software Not Found' };

  return {
    title: `${tool.name} - Open Source Security Software & Architecture`,
    description: tool.shortDescription,
    alternates: {
      canonical: `https://securetools.live/open-source/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} | Verified Open Source Tool | SecureTools.live`,
      description: tool.shortDescription,
      url: `https://securetools.live/open-source/${tool.slug}`,
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

export default async function OpenSourceProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const tool = (await fetchSoftwareBySlugFromDb(slug)) || getSoftwareBySlug(slug);

  if (!tool) {
    notFound();
  }

  const allOpenSource = await fetchOpenSourceFromDb();
  const similarTools = allOpenSource.filter((t) => t.id !== tool.id).slice(0, 3);
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

  const repoDomain = tool.repositoryUrl ? getDomain(tool.repositoryUrl) : null;
  const youtubeEmbed = getYouTubeEmbedUrl(tool.youtubeVideoUrl);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-geist">
      <ToolAnalyticsTracker toolSlug={tool.slug} listingId={tool.id} />

      {/* Breadcrumb Navigation - Strictly dynamic for Open Source */}
      <Breadcrumbs
        items={[
          { label: 'Directory', href: '/tools' },
          { label: 'Open Source', href: '/open-source' },
          { label: tool.name },
        ]}
      />

      {/* ── HEADER CARD ── */}
      <div className="p-6 sm:p-7 rounded-2xl border border-[#e4e4e7] bg-white shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {resolvedLogo ? (
              <img
                src={resolvedLogo}
                alt={tool.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-contain bg-white border border-[#e4e4e7] p-2 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#09090b] text-white flex items-center justify-center font-bold text-lg font-mono shadow-2xs shrink-0">
                {initials}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#09090b] tracking-tight">
                  {tool.name}
                </h1>
                {/* Verified Badge */}
                <span title="Verified Open Source Codebase">
                  <svg className="w-5 h-5 text-[#1d9bf0] fill-[#1d9bf0]" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.41-1.41 2.09 2.09 5.69-5.69 1.41 1.41-7.1 7.1z" />
                  </svg>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#09090b] bg-[#f4f4f5] px-2 py-0.5 rounded border border-[#e4e4e7]">
                  <Code className="w-3 h-3 text-[#09090b]" />
                  Open Source
                </span>

                {tool.license && (
                  <span className="font-mono text-[11px] font-semibold text-[#52525b] bg-[#fafafa] px-2 py-0.5 rounded border border-[#e4e4e7]">
                    {tool.license}
                  </span>
                )}

                {tool.deployment && tool.deployment.length > 0 && (
                  <span className="font-mono text-[11px] text-[#71717a] bg-[#fafafa] px-2 py-0.5 rounded border border-[#e4e4e7]">
                    {tool.deployment.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {tool.repositoryUrl && (
              <a
                href={withUtm(tool.repositoryUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#fafafa] text-xs font-semibold text-[#09090b] transition-colors shadow-2xs"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#09090b]" />
                <span>View Source Code</span>
                <ExternalLink className="w-3 h-3 text-[#71717a]" />
              </a>
            )}

            {tool.websiteUrl && (
              <a
                href={withUtm(tool.websiteUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-xs font-semibold text-white transition-colors shadow-2xs"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm sm:text-[14px] text-[#52525b] leading-relaxed pt-2 border-t border-[#f4f4f5]">
          {tool.fullOverview || tool.shortDescription || tool.tagline}
        </p>
      </div>

      {/* ── TECHNICAL SPECIFICATIONS & OPEN SOURCE AUDIT ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#09090b] tracking-tight">
          Open Source & Security Architecture
        </h2>
        <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs sm:text-[13px]">
            <tbody className="divide-y divide-[#f4f4f5]">
              {tool.license && (
                <tr className="hover:bg-[#fafafa]/50 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a] w-1/3">License</td>
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-[#09090b]">
                    {tool.license}
                  </td>
                </tr>
              )}

              {tool.repositoryUrl && (
                <tr className="hover:bg-[#fafafa]/50 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a]">Source Repository</td>
                  <td className="py-3 px-4 sm:px-6 font-mono text-[#09090b]">
                    <a
                      href={withUtm(tool.repositoryUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#09090b] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{tool.repositoryUrl.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3 text-[#71717a]" />
                    </a>
                  </td>
                </tr>
              )}

              {tool.deployment && tool.deployment.length > 0 && (
                <tr className="hover:bg-[#fafafa]/50 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a]">Deployment Model</td>
                  <td className="py-3 px-4 sm:px-6 text-[#18181b]">{tool.deployment.join(', ')}</td>
                </tr>
              )}

              {tool.platforms && tool.platforms.length > 0 && (
                <tr className="hover:bg-[#fafafa]/50 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a]">Supported Platforms</td>
                  <td className="py-3 px-4 sm:px-6 text-[#18181b]">
                    <div className="flex flex-wrap gap-1">
                      {tool.platforms.map((p, i) => (
                        <span
                          key={i}
                          className="font-mono text-[11px] bg-[#f4f4f5] text-[#09090b] px-2 py-0.5 rounded border border-[#e4e4e7]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )}

              {tool.security?.encryptionAtRest && (
                <tr className="hover:bg-[#fafafa]/50 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a]">Encryption at Rest</td>
                  <td className="py-3 px-4 sm:px-6 font-mono text-[#09090b]">
                    {tool.security.encryptionAtRest}
                  </td>
                </tr>
              )}

              {tool.security?.encryptionInTransit && (
                <tr className="hover:bg-[#fafafa]/50 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a]">Encryption in Transit</td>
                  <td className="py-3 px-4 sm:px-6 font-mono text-[#09090b]">
                    {tool.security.encryptionInTransit}
                  </td>
                </tr>
              )}

              <tr className="hover:bg-[#fafafa]/50 transition-colors">
                <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a]">Zero-Knowledge Architecture</td>
                <td className="py-3 px-4 sm:px-6 font-mono text-[#09090b]">
                  {tool.security?.zeroKnowledgeArchitecture ? 'Yes (Client-side keys)' : 'Client-managed'}
                </td>
              </tr>

              <tr className="hover:bg-[#fafafa]/50 transition-colors">
                <td className="py-3 px-4 sm:px-6 font-semibold text-[#71717a]">Code Audit & Integrity</td>
                <td className="py-3 px-4 sm:px-6 text-[#18181b]">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold bg-[#f4f4f5] text-[#09090b] px-2.5 py-1 rounded border border-[#e4e4e7]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#09090b]" />
                    Open Source Code Audited
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── KEY FEATURES & CAPABILITIES (Clean vector checklist, no solid black box) ── */}
      {tool.keyFeatures && tool.keyFeatures.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#09090b]">Verified Capabilities</h2>
            <span className="font-mono text-[11px] text-[#71717a] bg-[#f4f4f5] px-2.5 py-1 rounded-md border border-[#e4e4e7]">
              {tool.keyFeatures.length} Key Features
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

      {/* ── RATINGS & USER REVIEWS SECTION ── */}
      <ToolReviewsSection
        toolSlug={tool.slug}
        toolName={tool.name}
        listingId={tool.id}
      />

      {/* ── SIMILAR OPEN SOURCE TOOLS (Exactly 3 Cards) ── */}
      {similarTools.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[#e4e4e7]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#09090b]">
                Similar Open Source Security Tools
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">
                Explore community-audited, privacy-first software with zero vendor lock-in
              </p>
            </div>
            <Link
              href="/open-source"
              className="text-xs font-semibold text-[#09090b] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {similarTools.map((rel) => {
              const relDomain = getDomain(rel.websiteUrl);
              const relLogo =
                rel.logoUrl ||
                (relDomain ? `https://www.google.com/s2/favicons?domain=${relDomain}&sz=128` : null);

              return (
                <Link
                  key={rel.id}
                  href={`/open-source/${rel.slug}`}
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
                          {rel.license || 'Open Source'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#71717a] line-clamp-2 leading-relaxed">
                      {rel.shortDescription || rel.tagline}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#f4f4f5] flex items-center justify-between text-xs font-semibold text-[#71717a] group-hover:text-[#09090b]">
                    <span>View architecture</span>
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
