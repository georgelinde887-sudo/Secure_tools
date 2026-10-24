import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Award01Icon, ArrowRight01Icon } from 'hugeicons-react';
import { getAllBestCollections } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Best Software Collections (2026) | SecureTools.live',
  description: 'Rigorous editorial collections identifying the top-performing software for secure file sharing, encrypted cloud storage, virtual data rooms, and digital signatures.',
  alternates: {
    canonical: 'https://securetools.live/best',
  }
};

export default function BestCollectionsIndexPage() {
  const collections = getAllBestCollections();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <Breadcrumbs items={[{ label: 'Best Collections' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 mb-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <Award01Icon size={14} className="text-[#2563eb]" />
          <span>Technical Benchmarks</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>{collections.length} Curated Rankings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b]">
          Best Software Guides
        </h1>
        <p className="text-[13px] text-[#71717a] mt-1.5 max-w-2xl leading-relaxed">
          Independent research collections evaluating software against technical benchmarks, cryptographic models, and real-world compliance audits. No paid rankings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/best/${col.slug}`}
            className="group bg-white p-5 rounded-xl border border-[#e4e4e7] hover:border-[#122368] hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-[#2563eb] bg-[#f4f4f5] px-2 py-0.5 rounded font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Award01Icon size={12} />
                  <span>Editorial Ranking</span>
                </span>
                <span className="font-mono text-[10px] text-[#71717a]">
                  Updated {col.lastUpdated}
                </span>
              </div>
              <h2 className="text-[15px] font-bold text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1.5">
                {col.title}
              </h2>
              <p className="text-[12px] text-[#71717a] leading-relaxed line-clamp-2 mb-4">
                {col.subtitle}
              </p>
            </div>

            <div className="pt-3 border-t border-[#f4f4f5] flex items-center justify-between text-[11px] text-[#71717a]">
              <span className="font-mono text-[10px] text-[#71717a]">
                {col.rankings.length} evaluated tools
              </span>
              <span className="text-[#2563eb] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[12px]">
                Read Evaluation <ArrowRight01Icon size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
