import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SecurityCheckIcon, ArrowRight01Icon, Clock01Icon, BookOpen01Icon } from 'hugeicons-react';
import { getAllArticles } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Cryptographic Research & Technical Whitepapers | SecureTools.live',
  description: 'Original research, encryption audits, and technical whitepapers analyzing digital file protection protocols and privacy models.',
  alternates: {
    canonical: 'https://securetools.live/research',
  }
};

export default function ResearchIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <Breadcrumbs items={[{ label: 'Research' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 mb-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <SecurityCheckIcon size={14} className="text-[#2563eb]" />
          <span>Technical Whitepapers & Analysis</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>{articles.length} Research Reports</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b]">
          Cryptographic Research & Whitepapers
        </h1>
        <p className="text-[13px] text-[#71717a] mt-1.5 max-w-2xl leading-relaxed">
          Empirical security research examining endpoint encryption algorithms, zero-knowledge threat models, memory-hard key derivation, and compliance audits across enterprise file systems.
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((art) => (
          <div
            key={art.id}
            className="bg-white p-5 sm:p-6 rounded-xl border border-[#e4e4e7] hover:border-[#122368] hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2 font-mono text-[10px]">
                <span className="font-semibold text-[#2563eb] bg-[#f4f4f5] px-2 py-0.5 rounded uppercase tracking-wider">
                  {art.type}
                </span>
                <span className="text-[#d4d4d8]">•</span>
                <span className="text-[#71717a]">{art.pillar}</span>
                <span className="text-[#d4d4d8]">•</span>
                <span className="text-[#71717a] flex items-center gap-1">
                  <Clock01Icon size={11} />
                  {art.readTimeMinutes} min read
                </span>
              </div>

              <h2 className="text-[16px] font-bold text-[#09090b] mb-1.5">
                <Link href={`/guides/${art.slug}`} className="hover:text-[#2563eb] transition-colors">
                  {art.title}
                </Link>
              </h2>
              <p className="text-[12px] text-[#71717a] leading-relaxed mb-3 line-clamp-2">
                {art.summary}
              </p>
              <div className="font-mono text-[10px] text-[#71717a]">
                Author: {art.author.name} ({art.author.role}) • Published {art.publishedAt}
              </div>
            </div>

            <Link
              href={`/guides/${art.slug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#122368] hover:bg-[#09090b] text-white text-[12px] font-semibold whitespace-nowrap transition-colors self-start sm:self-center shrink-0"
            >
              <span>Read Whitepaper</span>
              <ArrowRight01Icon size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
