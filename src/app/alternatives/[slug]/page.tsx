import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAlternativeBySlug, getAllAlternatives, getSoftwareById, getAllSoftware, fetchSoftwareFromDb } from '@/lib/data';
import { POPULAR_ALTERNATIVES_LIST } from '@/data/alternatives';
import { AlternativeDetailClient } from './AlternativeDetailClient';
import { SoftwareItem } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const alternatives = getAllAlternatives();
  const summarySlugs = POPULAR_ALTERNATIVES_LIST.map((p) => ({ slug: p.slug }));
  const altSlugs = alternatives.map((a) => ({ slug: a.slug }));
  const all = [...altSlugs, ...summarySlugs];
  return Array.from(new Set(all.map((x) => x.slug))).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const alt = getAlternativeBySlug(slug);
  const summaryItem = POPULAR_ALTERNATIVES_LIST.find((p) => p.slug === slug);

  if (!alt && !summaryItem) return { title: 'Alternatives Guide Not Found' };

  const brandName = summaryItem?.name || (alt ? alt.title.replace(/^Top (?:Verified|Secure) Alternatives to /i, '').replace(/ in \d{4}$/i, '') : slug);
  const count = summaryItem?.count || 15;
  const title = `${count} Products Like ${brandName} | SecureTools.live`;
  const description = alt
    ? alt.summary
    : `Explore verified, zero-knowledge, and enterprise privacy alternatives to ${brandName} on SecureTools.live.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://securetools.live/alternatives/${slug}`,
    },
  };
}

export default async function AlternativeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let alt = getAlternativeBySlug(slug);
  const summaryItem = POPULAR_ALTERNATIVES_LIST.find((p) => p.slug === slug);

  const dbSoftware = await fetchSoftwareFromDb();

  const brandName = summaryItem?.name || (alt ? alt.title.replace(/^Top (?:Verified|Secure) Alternatives to /i, '').replace(/ in \d{4}$/i, '') : slug);

  if (!alt && summaryItem) {
    const allSoftware = dbSoftware.filter((s) => s.published);
    alt = {
      id: `alt-${slug}`,
      slug,
      toolId: `tool-${slug}`,
      title: `Top Verified Alternatives to ${summaryItem.name} in 2026`,
      summary: `Evaluate privacy-respecting, zero-knowledge, and enterprise alternatives to ${summaryItem.name} for secure file management, document protection, and compliance.`,
      whyUsersSeekAlternatives: [
        `Seeking default zero-knowledge encryption and client-side cryptographic key ownership.`,
        `Data sovereignty requirements under independent European, Swiss, or decentralized jurisdictions.`,
        `Transparent licensing, predictable seat costs, and avoiding closed ecosystem lock-in.`,
        `Desire for self-hosted sovereignty or verifiable open-source codebases.`
      ],
      commonLimitations: [
        `Closed-source server architectures that cannot be independently audited.`,
        `Metadata tracking and automated third-party AI content scanning concerns.`,
        `Escalating enterprise tier pricing and rigid user seat minimums.`
      ],
      alternativeToolIds: allSoftware.slice(0, 4).map((s) => s.id),
      tradeOffAnalysis: allSoftware.slice(0, 4).map((s) => ({
        toolId: s.id,
        keyAdvantageOverOriginal: `Verified ${s.security.zeroKnowledgeArchitecture ? 'zero-knowledge encryption' : 'enterprise data protection'} with transparent ${s.pricingModel} pricing.`,
        potentialDrawback: s.pricingModel === 'Paid' ? 'Requires paid subscription for complete enterprise audit logs.' : 'Requires in-house administrative oversight for multi-user policies.',
        bestFor: s.bestFitUseCases[0] || 'Security-conscious organizations and privacy-first teams.'
      })),
      lastUpdated: '2026-10-15'
    };
  }

  if (!alt && !summaryItem) {
    notFound();
  }

  // Get curated alternative tools
  const directTools: SoftwareItem[] = (alt?.alternativeToolIds || [])
    .map((id) => dbSoftware.find(s => s.id === id) || getSoftwareById(id))
    .filter((t): t is SoftwareItem => !!t && t.slug !== slug);

  // Get other verified software to ensure a rich list of alternatives
  const otherTools = dbSoftware.filter(
    (s) => s.published && s.slug !== slug && !directTools.some((dt) => dt.id === s.id)
  );

  const alternativeTools = [...directTools, ...otherTools];
  const displayCount = summaryItem?.count || alternativeTools.length;

  // Ask AI prompt query
  const aiQuery = `What are the best alternatives to ${brandName}?`;

  // Map of all software for trade-off matrix
  const allSoftwareMap: Record<string, SoftwareItem> = {};
  dbSoftware.forEach((s) => {
    allSoftwareMap[s.id] = s;
  });

  return (
    <AlternativeDetailClient
      brandName={brandName}
      displayCount={displayCount}
      aiQuery={aiQuery}
      alternativeTools={alternativeTools}
      alt={alt}
      allSoftwareMap={allSoftwareMap}
    />
  );
}
